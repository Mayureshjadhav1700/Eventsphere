package com.eventsphere.eventspere.dto.dashboard;
import com.eventsphere.eventspere.dto.registration.RegistrationResponse;

import java.util.List;

public class ParticipantDashboardResponse {

    private long totalRegistrations;
    private long confirmedRegistrations;
    private long cancelledRegistrations;

    private List<RegistrationResponse> upcomingEvents;

    public ParticipantDashboardResponse(
            long totalRegistrations,
            long confirmedRegistrations,
            long cancelledRegistrations,
            List<RegistrationResponse> upcomingEvents) {

        this.totalRegistrations = totalRegistrations;
        this.confirmedRegistrations = confirmedRegistrations;
        this.cancelledRegistrations = cancelledRegistrations;
        this.upcomingEvents = upcomingEvents;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }

    public long getConfirmedRegistrations() {
        return confirmedRegistrations;
    }

    public long getCancelledRegistrations() {
        return cancelledRegistrations;
    }

    public List<RegistrationResponse> getUpcomingEvents() {
        return upcomingEvents;
    }
}

