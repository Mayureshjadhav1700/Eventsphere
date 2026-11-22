
package com.eventsphere.eventspere.dto.dashboard;

import com.eventsphere.eventspere.dto.events.EventResponse;

import java.util.List;

public class OrganizerDashboardResponse {

    private long totalEvents;
    private long publishedEvents;
    private long draftEvents;
    private long totalConfirmedRegistrations;

    private List<EventResponse> events;

    public OrganizerDashboardResponse(
            long totalEvents,
            long publishedEvents,
            long draftEvents,
            long totalConfirmedRegistrations,
            List<EventResponse> events) {

        this.totalEvents = totalEvents;
        this.publishedEvents = publishedEvents;
        this.draftEvents = draftEvents;
        this.totalConfirmedRegistrations = totalConfirmedRegistrations;
        this.events = events;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public long getPublishedEvents() {
        return publishedEvents;
    }

    public long getDraftEvents() {
        return draftEvents;
    }

    public long getTotalConfirmedRegistrations() {
        return totalConfirmedRegistrations;
    }

    public List<EventResponse> getEvents() {
        return events;
    }
}
