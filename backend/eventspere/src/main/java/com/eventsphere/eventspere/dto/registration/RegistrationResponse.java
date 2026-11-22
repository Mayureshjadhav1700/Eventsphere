
package com.eventsphere.eventspere.dto.registration;

import java.time.LocalDateTime;

public class RegistrationResponse {

    private Long registrationId;
    private Long eventId;
    private String eventTitle;
    private String venue;
    private LocalDateTime startTime;
    private String status;
    private LocalDateTime registeredAt;

    public RegistrationResponse(
            Long registrationId,
            Long eventId,
            String eventTitle,
            String venue,
            LocalDateTime startTime,
            String status,
            LocalDateTime registeredAt) {

        this.registrationId = registrationId;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.venue = venue;
        this.startTime = startTime;
        this.status = status;
        this.registeredAt = registeredAt;
    }

    public Long getRegistrationId() {
        return registrationId;
    }

    public Long getEventId() {
        return eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public String getVenue() {
        return venue;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }
}
