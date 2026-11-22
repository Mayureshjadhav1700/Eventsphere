package com.eventsphere.eventspere.service;

import com.eventsphere.eventspere.dto.auth.AuthResponse;
import com.eventsphere.eventspere.dto.auth.LoginRequest;
import com.eventsphere.eventspere.dto.auth.LoginResponse;
import com.eventsphere.eventspere.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
