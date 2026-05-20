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

    private static final long ACCESS_TOKEN_VALIDITY_MS = 15 * 60 * 1000;
    private static final long REFRESH_TOKEN_VALIDITY_MS = 7 * 24 * 60 * 60 * 1000L;
    private static final String TOKEN_TYPE = "type";
    private static final String ACCESS = "access";
    private static final String REFRESH = "refresh";

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String email) {
        return generateAccessToken(userId, email);
    }

    public String generateAccessToken(Long userId, String email) {
        return generateToken(userId, email, ACCESS, ACCESS_TOKEN_VALIDITY_MS);
    }

    public String generateRefreshToken(Long userId, String email) {
        return generateToken(userId, email, REFRESH, REFRESH_TOKEN_VALIDITY_MS);
    }

    private String generateToken(Long userId, String email, String type, long validityMs) {
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim(TOKEN_TYPE, type)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + validityMs))
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
        Claims claims = validateAccessToken(token);
        AuthenticatedUser user = new AuthenticatedUser(extractUserId(claims), claims.getSubject());
        return new UsernamePasswordAuthenticationToken(
                user,
                token,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    public Claims validateAccessToken(String token) {
        Claims claims = validateToken(token);
        validateTokenType(claims, ACCESS);
        return claims;
    }

    public Claims validateRefreshToken(String token) {
        Claims claims = validateToken(token);
        validateTokenType(claims, REFRESH);
        return claims;
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

    private void validateTokenType(Claims claims, String expectedType) {
        String type = claims.get(TOKEN_TYPE, String.class);
        if (!expectedType.equals(type)) {
            throw new IllegalArgumentException("Invalid token type");
        }
    }
}
