package com.canopy.canopy_backend.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AuthService authService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // ── Step 1: Get the Authorization header ─────────────────
        final String authHeader = request.getHeader("Authorization");

        // ── Step 2: If no token → skip, pass request along ───────
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ── Step 3: Extract the raw token ─────────────────────────
        final String token = authHeader.substring(7); // strips "Bearer "

        // ── Step 4: Extract email from token ──────────────────────
        final String email = jwtUtil.extractEmail(token);

        // ── Step 5: If email found and user not yet authenticated ──
        if (email != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // ── Step 6: Load full user from database ───────────────
            UserDetails userDetails = authService.loadUserByUsername(email);

            // ── Step 7: Validate the token ─────────────────────────
            if (jwtUtil.isTokenValid(token, userDetails)) {

                // ── Step 8: Build authentication object ───────────
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // ── Step 9: Pin identity to the noticeboard ────────
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        // ── Step 10: Always pass request to next filter/controller ─
        filterChain.doFilter(request, response);
    }
}