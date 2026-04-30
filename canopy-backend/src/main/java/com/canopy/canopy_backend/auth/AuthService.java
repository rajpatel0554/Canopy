package com.canopy.canopy_backend.auth;

import com.canopy.canopy_backend.model.Tenant;
import com.canopy.canopy_backend.model.User;
import com.canopy.canopy_backend.tenant.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    @Lazy
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ── SPRING SECURITY — Load user by email ─────────────────────

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "No user found with email: " + email
                ));
    }

    // ── REGISTER ─────────────────────────────────────────────────

    public AuthResponse register(RegisterRequest request) {

        // 1. Check if email is already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }

        // 2. Find the tenant by slug
        Tenant tenant = tenantRepository.findBySlug(request.getTenantSlug())
                .orElseThrow(() -> new RuntimeException(
                        "No tenant found with slug: " + request.getTenantSlug()
                ));

        // 3. Build and save the new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .tenantId(tenant.getTenantId())
                .role("ADMIN")
                .build();

        userRepository.save(user);

        // 4. Generate JWT token and return response
        //String token = jwtUtil.generateToken(user.getEmail());
        String token = jwtUtil.generateToken(user.getUsername(), request.getTenantSlug());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .tenantId(user.getTenantId())
                .build();
    }

    // ── LOGIN ────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(
                        "Invalid email or password."
                ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        Tenant tenant = tenantRepository.findById(user.getTenantId())  // ← fetch tenant
                .orElseThrow(() -> new RuntimeException(
                        "Tenant not found."
                ));

        String token = jwtUtil.generateToken(user.getEmail(), tenant.getSlug()); // ← pass slug

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .tenantId(user.getTenantId())
                .build();
    }
}