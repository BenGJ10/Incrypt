package com.bengregory.notes.config;

import com.bengregory.notes.model.AppRole;
import com.bengregory.notes.model.Role;
import com.bengregory.notes.model.User;
import com.bengregory.notes.repository.RoleRepository;
import com.bengregory.notes.security.jwt.JWTUtils;
import com.bengregory.notes.security.services.UserDetailsImplementation;
import com.bengregory.notes.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor // Use Lombok to generate constructor for final fields
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Autowired
    private final UserService userService;

    @Autowired
    private final JWTUtils jwtUtils;

    @Autowired
    private RoleRepository roleRepository;

    @Value(("${frontend.url}"))
    private String frontendUrl;

    String username;
    String idAttributeKey;

    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        if("github".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()) || "google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
            // Get the user
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
            // Get all the attributes from the user
            Map<String, Object> attributes = principal.getAttributes();
            // Extract email and name from the attributes
            String email = attributes.getOrDefault("email", "").toString();
            String name = attributes.getOrDefault("name", "").toString();

            // Determine username and id attribute key based on the provider
            if ("github".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
                username = attributes.getOrDefault("login", "").toString();
                idAttributeKey = "id";
            } else if ("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
                username = email.split("@")[0];
                idAttributeKey = "sub";
            } else {
                username = "";
                idAttributeKey = "id";
            }

            System.out.println("Hello OAuth from: " + email + " : " + name + " : " + username);

            userService.findByEmail(email).ifPresentOrElse(user -> {
                // User already exists, just log them in
                DefaultOAuth2User oauthUser = new DefaultOAuth2User(
                        List.of(new SimpleGrantedAuthority(user.getRole().getRoleName().name())), attributes, idAttributeKey);

                // Create a new authentication token with the user's authorities and set it in the security context
                Authentication securityAuth = new OAuth2AuthenticationToken(oauthUser,
                        List.of(new SimpleGrantedAuthority(user.getRole().getRoleName().name())),
                        oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());

                // Set the authentication in the security context to log the user in
                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            }, () -> {

                // User doesn't exist, create a new user and log them in
                User newUser = new User();
                Optional<Role> userRole = roleRepository.findByRoleName(AppRole.ROLE_USER); // Fetch existing role

                if (userRole.isPresent()) {
                    newUser.setRole(userRole.get()); // Set existing role
                } else {
                    // Handle the case where the role is not found
                    throw new RuntimeException("Default role not found");
                }
                newUser.setEmail(email);
                newUser.setUserName(username);
                newUser.setSignUpMethod(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                userService.registerUser(newUser);

                DefaultOAuth2User oauthUser = new DefaultOAuth2User(
                        List.of(new SimpleGrantedAuthority(newUser.getRole().getRoleName().name())), attributes, idAttributeKey);

                Authentication securityAuth = new OAuth2AuthenticationToken(
                        oauthUser,
                        List.of(new SimpleGrantedAuthority(newUser.getRole().getRoleName().name())),
                        oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
                );

                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            });
        }
        this.setAlwaysUseDefaultTargetUrl(true);

        // JWT Token Logic
        DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();

        // Extract necessary attributes
        String email = (String) attributes.get("email");
        System.out.println("OAuth2LoginSuccessHandler: " + username + " : " + email);

        Set<SimpleGrantedAuthority> authorities = new HashSet<>(oauth2User.getAuthorities().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                .collect(Collectors.toList()));
        User user = userService.findByEmail(email).orElseThrow(
                ()-> new RuntimeException("User not found"));

        authorities.add(new SimpleGrantedAuthority(user.getRole().getRoleName().name()));

        // Create UserDetails instance
        UserDetailsImplementation userDetails = new UserDetailsImplementation(
                null, username, email, null, false,
                authorities
        );

        // Generate JWT token
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        // Redirect to the frontend with the JWT token
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/redirect")
                .queryParam("token", jwtToken)
                .build().toUriString();
        this.setDefaultTargetUrl(targetUrl);
        super.onAuthenticationSuccess(request, response, authentication);
    }
}
