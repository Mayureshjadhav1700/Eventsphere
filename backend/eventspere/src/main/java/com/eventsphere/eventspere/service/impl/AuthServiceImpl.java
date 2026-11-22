
package com.eventsphere.eventspere.service.impl;

import com.eventsphere.eventspere.dto.auth.AuthResponse;
import com.eventsphere.eventspere.dto.auth.LoginRequest;
import com.eventsphere.eventspere.dto.auth.LoginResponse;
import com.eventsphere.eventspere.dto.auth.RegisterRequest;
import com.eventsphere.eventspere.entity.User;
import com.eventsphere.eventspere.enums.Role;
import com.eventsphere.eventspere.repository.UserRepository;
import com.eventsphere.eventspere.service.AuthService;
import com.eventsphere.eventspere.service.JwtService;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Constructor injection
    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // USER REGISTRATION
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {

        // 1. Check whether email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        // 2. Create new user
        User user = new User();

        user.setFullname(request.getFullName());
        user.setEmail(request.getEmail());

        // Encode password before saving
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // 3. Assign default role
        user.setRole(Role.PARTICIPANT);

        // 4. Save user
        User savedUser = userRepository.save(user);

        // 5. Return registration response
        return new AuthResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getFullname(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    // USER LOGIN
    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        // 1. Find user using email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid email or password"
                        )
                );

        // 2. Verify entered password against BCrypt hash
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        // 3. Generate JWT token
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        // 4. Return token and user details
        return new LoginResponse(
                "Login successful",
                token,
                "Bearer",
                user.getId(),
                user.getFullname(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
