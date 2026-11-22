package com.eventsphere.eventspere.service;

import com.eventsphere.eventspere.dto.dashboard.OrganizerDashboardResponse;
import com.eventsphere.eventspere.dto.events.EventRequest;
import com.eventsphere.eventspere.dto.events.EventResponse;

import java.time.LocalDate;
import java.util.List;

public interface EventService {

    EventResponse createEvent(EventRequest request);

    List<EventResponse> getAllPublishedEvents();

    EventResponse getEventById(Long id);

    EventResponse updateEvent(Long id, EventRequest request);

    void deleteEvent(Long id);

    EventResponse publishEvent(Long id);

    List<EventResponse> searchEvents(
            String keyword,
            Long categoryId,
            String venue,
            LocalDate eventDate
    );

    OrganizerDashboardResponse getOrganizerDashboard();
}
