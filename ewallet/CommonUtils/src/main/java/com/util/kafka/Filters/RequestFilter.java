package com.util.kafka.Filters;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class RequestFilter extends HttpFilter {

    @Value("${jwt.secret}")
    private String SECRET;

    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }
    @Override
    public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {

        MDC.put("requestId", request.getHeader("requestId"));

        String path = request.getRequestURI();

        if (!path.contains("/login") && !path.contains("/user") && !path.contains("/actuator")) {

            String auth = request.getHeader("Authorization");

            if (auth == null || !auth.startsWith("Bearer ")) {
                response.sendError(401, "Missing token");
                return;
            }

            try
            {

                String token = auth.substring(7);

                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                request.setAttribute("userId", claims.get("userId"));

            } catch (Exception e) {

                response.sendError(401, "Invalid token");
                return;
            }
        }

        chain.doFilter(request, response);

        MDC.clear();
    }
}