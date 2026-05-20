package com.util.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Service
public class JwtTokenService {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String email) {
        return Jwts.builder()
                .subject(email)
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

    public Authentication getAuthentication(String token) {
        Claims claims = validateToken(token);
        AuthenticatedUser user = new AuthenticatedUser(extractUserId(claims), claims.getSubject());
        return new UsernamePasswordAuthenticationToken(
                user,
                token,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    public Long extractUserId(String token) {
        return extractUserId(validateToken(token));
    }

    public String extractEmail(String token) {
        return validateToken(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return validateToken(token).getExpiration();
    }

    public long getRemainingValidity(String token) {
        return extractExpiration(token).getTime() - System.currentTimeMillis();
    }

    private Long extractUserId(Claims claims) {
        Object value = claims.get("userId");
        if (value instanceof Number number) {
            return number.longValue();
        }
        return Long.valueOf(value.toString());
    }
}
