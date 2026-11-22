package com.eventsphere.eventspere.controller;

import com.eventsphere.eventspere.dto.dashboard.OrganizerDashboardResponse;
import com.eventsphere.eventspere.dto.events.EventRequest;
import com.eventsphere.eventspere.dto.events.EventResponse;
import com.eventsphere.eventspere.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request) {

        EventResponse response = eventService.createEvent(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {

        return ResponseEntity.ok(
                eventService.getAllPublishedEvents());
    }


    // SEARCH AND FILTER EVENTS
    @GetMapping("/search")
    public ResponseEntity<List<EventResponse>> searchEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String venue,
            @RequestParam(required = false)
            LocalDate eventDate) {

        return ResponseEntity.ok(
                eventService.searchEvents(
                        keyword,
                        categoryId,
                        venue,
                        eventDate
                )
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                eventService.getEventById(id));
    }

    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {

        return ResponseEntity.ok(
                eventService.updateEvent(id, request));
    }

    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id) {

        eventService.deleteEvent(id);

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @PatchMapping("/{id}/publish")
    public ResponseEntity<EventResponse> publishEvent(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                eventService.publishEvent(id));
    }

    @GetMapping("/organizer/dashboard")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<OrganizerDashboardResponse> getOrganizerDashboard() {

        return ResponseEntity.ok(
                eventService.getOrganizerDashboard()
        );
    }
}
