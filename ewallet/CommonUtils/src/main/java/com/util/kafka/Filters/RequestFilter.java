package com.util.kafka.Filters;

import com.util.security.AuthenticatedUser;
import com.util.security.JwtTokenService;
import com.util.security.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenService jwtTokenService;
    private final TokenBlacklistService tokenBlacklistService;

    public RequestFilter(JwtTokenService jwtTokenService, TokenBlacklistService tokenBlacklistService) {
        this.jwtTokenService = jwtTokenService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        try {
            MDC.put("requestId", request.getHeader("requestId"));
            String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

            if (authHeader != null && !authHeader.isBlank()) {
                if (!authHeader.startsWith(BEARER_PREFIX)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid authorization header");
                    return;
                }

                String token = authHeader.substring(BEARER_PREFIX.length());
                try {
                    if (tokenBlacklistService.isBlacklisted(token)) {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has been revoked");
                        return;
                    }

                    Authentication authentication = jwtTokenService.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    if (authentication.getPrincipal() instanceof AuthenticatedUser user) {
                        request.setAttribute("userId", user.userId());
                        request.setAttribute("email", user.email());
                    }
                } catch (Exception e) {
                    SecurityContextHolder.clearContext();
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            }

            chain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
