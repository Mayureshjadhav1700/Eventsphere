
package com.eventsphere.eventspere.dto.registration;

import jakarta.validation.constraints.NotNull;

public class RegistrationRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
