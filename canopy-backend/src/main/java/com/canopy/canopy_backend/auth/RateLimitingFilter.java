package com.canopy.canopy_backend.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * A lightweight, thread-safe memory-based rate limiter to protect authentication 
 * and tenant provisioning endpoints from brute force and resource exhaustion attacks.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final ConcurrentHashMap<String, IpRequestTracker> limiters = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 20;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Apply rate limits to key auth and registration endpoints
        boolean isAuthEndpoint = path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register");
        boolean isTenantCreation = path.startsWith("/api/tenants") && "POST".equalsIgnoreCase(method);

        if (isAuthEndpoint || isTenantCreation) {
            String clientIp = getClientIp(request);
            IpRequestTracker tracker = limiters.computeIfAbsent(clientIp, k -> new IpRequestTracker());
            
            if (!tracker.tryAcquire()) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Too many requests. Please try again in a minute.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private static class IpRequestTracker {
        private long windowStart = System.currentTimeMillis();
        private final AtomicInteger count = new AtomicInteger(0);

        public synchronized boolean tryAcquire() {
            long now = System.currentTimeMillis();
            if (now - windowStart > 60000) {
                windowStart = now;
                count.set(0);
            }
            return count.incrementAndGet() <= MAX_REQUESTS_PER_MINUTE;
        }
    }
}
