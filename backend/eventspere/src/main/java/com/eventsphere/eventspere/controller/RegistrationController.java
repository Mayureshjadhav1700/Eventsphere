
package com.eventsphere.eventspere.controller;

import com.eventsphere.eventspere.dto.dashboard.ParticipantDashboardResponse;
import com.eventsphere.eventspere.dto.registration.RegistrationRequest;
import com.eventsphere.eventspere.dto.registration.RegistrationResponse;
import com.eventsphere.eventspere.service.RegistrationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(
            RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    // Register for an event
    @PostMapping
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<RegistrationResponse> registerForEvent(
            @Valid @RequestBody RegistrationRequest request) {

        RegistrationResponse response =
                registrationService.registerForEvent(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    // Get logged-in participant's registrations
    @GetMapping("/my")
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<List<RegistrationResponse>> getMyRegistrations() {

        return ResponseEntity.ok(
                registrationService.getMyRegistrations());
    }

    // Cancel a registration
    @PatchMapping("/{registrationId}/cancel")
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable Long registrationId) {

        registrationService.cancelRegistration(registrationId);

        return ResponseEntity.noContent().build();
    }

    // GET PARTICIPANT DASHBOARD
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<ParticipantDashboardResponse>
    getParticipantDashboard() {

        return ResponseEntity.ok(
                registrationService.getParticipantDashboard()
        );
    }

}
