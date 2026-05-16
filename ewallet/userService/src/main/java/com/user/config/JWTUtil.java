package com.user.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {
    private static final String SECRET = "nexaroPaySuperSecureJwtSecretKey123456789";

    private final SecretKey key = Keys.hmacShaKeyFor( SECRET.getBytes(StandardCharsets.UTF_8) );

    public String generateToken(Long userId, String email) {

        return Jwts.builder().subject(email)
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact();
    }

    public Claims validateToken(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long extractUserId(String token) {

        Claims claims = validateToken(token);
        Object value = claims.get("userId");

        if (value instanceof Integer) {
            return ((Integer) value).longValue();
        }

        return (Long) value;
    }

    public String extractEmail(String token) {

        return validateToken(token).getSubject();
    }
}
