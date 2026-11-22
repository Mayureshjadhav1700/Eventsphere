
package com.eventsphere.eventspere.service.impl;

import com.eventsphere.eventspere.dto.dashboard.OrganizerDashboardResponse;
import com.eventsphere.eventspere.dto.events.EventRequest;
import com.eventsphere.eventspere.dto.events.EventResponse;
import com.eventsphere.eventspere.entity.Category;
import com.eventsphere.eventspere.entity.Event;
import com.eventsphere.eventspere.entity.User;
import com.eventsphere.eventspere.enums.EventStatus;
import com.eventsphere.eventspere.enums.RegistrationStatus;
import com.eventsphere.eventspere.enums.Role;
import com.eventsphere.eventspere.exception.BadRequestException;
import com.eventsphere.eventspere.exception.ResourceNotFoundException;
import com.eventsphere.eventspere.repository.CategoryRepository;
import com.eventsphere.eventspere.repository.EventRepository;
import com.eventsphere.eventspere.repository.RegistrationRepository;
import com.eventsphere.eventspere.repository.UserRepository;
import com.eventsphere.eventspere.service.EventService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class EventServiceImpl implements EventService {

    private static final Logger log =
            LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    public EventServiceImpl(
            EventRepository eventRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            RegistrationRepository registrationRepository) {

        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
    }

    // CREATE EVENT
    @Override
    public EventResponse createEvent(EventRequest request) {

        validateEventDates(request);
        validateCapacity(request.getCapacity());

        User currentUser = getCurrentUser();

        User organizer;

        if (currentUser.getRole() == Role.ADMIN) {

            // Admin can create an event on behalf of an organizer.

            if (request.getOrganizerId() == null) {
                throw new BadRequestException(
                        "Organizer ID is required when an admin creates an event");
            }

            organizer = userRepository.findById(request.getOrganizerId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Organizer not found"));

            // The selected user must have the ORGANIZER role.
            if (organizer.getRole() != Role.ORGANIZER) {
                throw new BadRequestException(
                        "Selected user must have the ORGANIZER role");
            }

        } else {

            // Only organizers can create events for themselves.
            if (currentUser.getRole() != Role.ORGANIZER) {
                throw new AccessDeniedException(
                        "Only organizers and admins can create events");
            }

            organizer = currentUser;
        }

        Category category = categoryRepository.findById(
                        request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"));

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setRegistrationDeadline(
                request.getRegistrationDeadline());
        event.setCapacity(request.getCapacity());
        event.setStatus(EventStatus.DRAFT);
        event.setOrganizer(organizer);
        event.setCategory(category);

        Event savedEvent = eventRepository.save(event);

        log.info(
                "Event created successfully. Event ID: {}",
                savedEvent.getId());

        return mapToResponse(savedEvent);
    }

    // GET ALL PUBLISHED EVENTS
    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllPublishedEvents() {

        return eventRepository
                .findEventsByStatus(EventStatus.PUBLISHED)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // GET ORGANIZER DASHBOARD
    @Override
    @Transactional(readOnly = true)
    public OrganizerDashboardResponse getOrganizerDashboard() {

        User currentUser = getCurrentUser();

        // Only organizers can access this dashboard.
        if (currentUser.getRole() != Role.ORGANIZER) {
            throw new AccessDeniedException(
                    "Only organizers can access this dashboard");
        }

        Long organizerId = currentUser.getId();

        // Retrieve all events belonging to this organizer.
        List<Event> events =
                eventRepository.findByOrganizerId(organizerId);

        long totalEvents = events.size();

        long publishedEvents = events.stream()
                .filter(event ->
                        event.getStatus() == EventStatus.PUBLISHED)
                .count();

        long draftEvents = events.stream()
                .filter(event ->
                        event.getStatus() == EventStatus.DRAFT)
                .count();

        // Calculate confirmed registrations across all events.
        long totalConfirmedRegistrations = events.stream()
                .mapToLong(event ->
                        registrationRepository.countByEventIdAndStatus(
                                event.getId(),
                                RegistrationStatus.CONFIRMED
                        ))
                .sum();

        // Convert event entities into response DTOs.
        List<EventResponse> eventResponses = events.stream()
                .map(this::mapToResponse)
                .toList();

        return new OrganizerDashboardResponse(
                totalEvents,
                publishedEvents,
                draftEvents,
                totalConfirmedRegistrations,
                eventResponses
        );
    }


    // SEARCH AND FILTER PUBLISHED EVENTS
    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> searchEvents(
            String keyword,
            Long categoryId,
            String venue,
            LocalDate eventDate) {

        // Treat empty or whitespace-only filters as absent.
        if (keyword != null && keyword.isBlank()) {
            keyword = null;
        }

        if (venue != null && venue.isBlank()) {
            venue = null;
        }

        return eventRepository.searchEvents(
                        EventStatus.PUBLISHED,
                        keyword,
                        categoryId,
                        venue,
                        eventDate
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // GET EVENT BY ID
    @Override
    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {

        Event event = findEvent(id);

        return mapToResponse(event);
    }

    // UPDATE EVENT
    @Override
    public EventResponse updateEvent(
            Long id,
            EventRequest request) {

        validateEventDates(request);
        validateCapacity(request.getCapacity());

        Event event = findEvent(id);

        verifyEventOwnership(event);

        if (event.getStatus() != EventStatus.DRAFT) {
            throw new BadRequestException(
                    "Only draft events can be updated through this endpoint");
        }

        Category category = categoryRepository.findById(
                        request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setRegistrationDeadline(
                request.getRegistrationDeadline());
        event.setCapacity(request.getCapacity());
        event.setCategory(category);

        // Organizer is deliberately not changed during update.

        Event updatedEvent = eventRepository.save(event);

        log.info("Event updated. Event ID: {}", id);

        return mapToResponse(updatedEvent);
    }

    // DELETE EVENT
    @Override
    public void deleteEvent(Long id) {

        Event event = findEvent(id);

        verifyEventOwnership(event);

        if (event.getStatus() != EventStatus.DRAFT) {
            throw new BadRequestException(
                    "Only draft events can be deleted");
        }

        eventRepository.delete(event);

        log.info("Draft event deleted. Event ID: {}", id);
    }

    // PUBLISH EVENT
    @Override
    public EventResponse publishEvent(Long id) {

        Event event = findEvent(id);

        verifyEventOwnership(event);

        if (event.getStatus() != EventStatus.DRAFT) {
            throw new BadRequestException(
                    "Only draft events can be published");
        }

        validateEventDates(event);

        LocalDateTime now = LocalDateTime.now();

        if (!event.getStartTime().isAfter(now)) {
            throw new BadRequestException(
                    "Event start time must be in the future");
        }

        if (!event.getRegistrationDeadline().isAfter(now)) {
            throw new BadRequestException(
                    "Registration deadline must be in the future");
        }

        event.setStatus(EventStatus.PUBLISHED);

        Event publishedEvent = eventRepository.save(event);

        log.info("Event published. Event ID: {}", id);

        return mapToResponse(publishedEvent);
    }

    // FIND EVENT
    private Event findEvent(Long id) {

        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found with ID: " + id));
    }

    // VALIDATE EVENT REQUEST DATES
    private void validateEventDates(EventRequest request) {

        if (request.getStartTime() == null ||
                request.getEndTime() == null ||
                request.getRegistrationDeadline() == null) {

            throw new BadRequestException(
                    "Start time, end time and registration deadline must not be null");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new BadRequestException(
                    "End time must be after start time");
        }

        if (!request.getRegistrationDeadline()
                .isBefore(request.getStartTime())) {

            throw new BadRequestException(
                    "Registration deadline must be before event start time");
        }
    }

    // VALIDATE EVENT ENTITY DATES
    private void validateEventDates(Event event) {

        if (event.getStartTime() == null ||
                event.getEndTime() == null ||
                event.getRegistrationDeadline() == null) {

            throw new BadRequestException(
                    "Event dates must not be null");
        }

        if (!event.getEndTime().isAfter(event.getStartTime())) {
            throw new BadRequestException(
                    "End time must be after start time");
        }

        if (!event.getRegistrationDeadline()
                .isBefore(event.getStartTime())) {

            throw new BadRequestException(
                    "Registration deadline must be before event start time");
        }
    }

    // VALIDATE EVENT CAPACITY
    private void validateCapacity(int capacity) {

        if (capacity <= 0) {
            throw new BadRequestException(
                    "Event capacity must be greater than zero");
        }
    }

    // GET CURRENT AUTHENTICATED USER
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {

            throw new AccessDeniedException(
                    "User is not authenticated");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"));
    }

    // VERIFY EVENT OWNERSHIP
    private void verifyEventOwnership(Event event) {

        User currentUser = getCurrentUser();

        // Admin can manage any event.
        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        // Non-admin users must have the ORGANIZER role.
        if (currentUser.getRole() != Role.ORGANIZER) {
            throw new AccessDeniedException(
                    "Only organizers and admins can manage events");
        }

        // Organizers can manage only their own events.
        if (!event.getOrganizer().getId()
                .equals(currentUser.getId())) {

            throw new AccessDeniedException(
                    "You are not authorized to manage this event");
        }
    }

    // MAP EVENT ENTITY TO RESPONSE DTO
    private EventResponse mapToResponse(Event event) {

        EventResponse response = new EventResponse();

        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setVenue(event.getVenue());
        response.setStartTime(event.getStartTime());
        response.setEndTime(event.getEndTime());
        response.setRegistrationDeadline(
                event.getRegistrationDeadline());
        response.setCapacity(event.getCapacity());
        response.setStatus(event.getStatus());

        response.setOrganizerId(event.getOrganizer().getId());
        response.setOrganizerName(
                event.getOrganizer().getFullname());

        response.setCategoryId(event.getCategory().getId());
        response.setCategoryName(
                event.getCategory().getName());

        return response;
    }
}
