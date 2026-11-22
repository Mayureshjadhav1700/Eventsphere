
package com.eventsphere.eventspere.service;

import com.eventsphere.eventspere.dto.dashboard.ParticipantDashboardResponse;
import com.eventsphere.eventspere.dto.registration.RegistrationRequest;
import com.eventsphere.eventspere.dto.registration.RegistrationResponse;

import java.util.List;

public interface RegistrationService {

    RegistrationResponse registerForEvent(RegistrationRequest request);

    List<RegistrationResponse> getMyRegistrations();

    void cancelRegistration(Long registrationId);

    ParticipantDashboardResponse getParticipantDashboard();
}
