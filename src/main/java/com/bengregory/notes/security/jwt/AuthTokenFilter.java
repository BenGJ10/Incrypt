package com.bengregory.notes.security.jwt;
import com.bengregory.notes.security.services.UserDetailsServiceImplementation;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
// Filter that intercepts incoming HTTP requests to validate JWT tokens and set the authentication context for the request
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired 
    private JWTUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImplementation userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override // Override the doFilterInternal method to implement the JWT validation logic for each incoming request
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.debug("AuthTokenFilter called for URI: {}", request.getRequestURI());
        try {
            String jwt = parseJWT(request); // Extract the JWT token from the request header
            if(jwt != null && jwtUtils.validateJwtToken(jwt)){ // Validate the JWT token
                String username = jwtUtils.getUsernameFromToken(jwt); // Extract the username from the token
                logger.debug("JWT is valid. Username extracted: {}", username);
                
                // Load user details using the username
                UserDetails userDetails = userDetailsService.loadUserByUsername(username); 
                // Create an authentication token with the user details and authorities
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                logger.debug("Authentication token created for user: {}", username);
                logger.debug("Authorities: {}", userDetails.getAuthorities());
                
                // Set the authentication in the security context to indicate that the user is authenticated for this request
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); 

                // Set the authentication in the security context
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("Authentication set in SecurityContext for user: {}", username);
        }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        // Continue the filter chain to allow the request to proceed to the next filter or the target resource
        filterChain.doFilter(request, response);
    }

    private String parseJWT(HttpServletRequest request) {
        String jwt = jwtUtils.getJWTFromHeader(request);
        logger.debug("AuthTokenFilter.java: {}", jwt);
        return jwt;
    }
}
