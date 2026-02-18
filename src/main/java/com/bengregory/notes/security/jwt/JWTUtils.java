package com.bengregory.notes.security.jwt;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.beans.factory.annotation.Value;
import java.security.Key;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

import javax.crypto.SecretKey;
import java.util.Date;


@Component
// Utility class for handling JWT operations such as generating, validating, and extracting information from JWT tokens
public class JWTUtils {
    
    // Logger for debugging
    private static final Logger logger = LoggerFactory.getLogger(JWTUtils.class);

    // Injecting JWT secret and expiration time from application properties
    @Value("${spring.app.jwtSecret}")
    private String jwtSecret; // JWT secret

    @Value("${spring.app.jwtExpirationMs}")
    private long jwtExpirationMs; // Expiration time of JWT token

    // Method to extract JWT token from the Authorization header
    public String getJWTFromHeader(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        logger.debug("Authorization Header: {}", bearerToken);
        
        if(bearerToken != null && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7); // Remove the Bearer prefix
        }
        return null;
    }

    // Method to generate JWT token from user details
    public String generateTokenFromUsername(UserDetails userDetails){
        String username = userDetails.getUsername();
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }

    // Method to extract username from JWT token
    public String getUsernameFromToken(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(token)
                .getPayload().getSubject();

    }

    // Method to get the signing key for JWT
    private Key key() {
        // Decode the secret key from Base64 and create a SecretKey instance
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret)); 
    }

    // Validate the JWT token and handle exceptions
    public boolean validateJwtToken(String authToken) {
        try{
            System.out.println("Validate");
            Jwts.parser().verifyWith((SecretKey) key()) // Verify the token with the signing key
                        .build().parseSignedClaims(authToken); // Parse the token to validate its structure and signature
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
