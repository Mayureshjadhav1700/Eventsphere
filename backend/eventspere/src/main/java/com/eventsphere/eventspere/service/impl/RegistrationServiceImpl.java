
package com.eventsphere.eventspere.service.impl;

import com.eventsphere.eventspere.dto.dashboard.ParticipantDashboardResponse;
import com.eventsphere.eventspere.dto.registration.RegistrationRequest;
import com.eventsphere.eventspere.dto.registration.RegistrationResponse;
import com.eventsphere.eventspere.entity.Event;
import com.eventsphere.eventspere.entity.Registration;
import com.eventsphere.eventspere.entity.User;
import com.eventsphere.eventspere.enums.EventStatus;
import com.eventsphere.eventspere.enums.RegistrationStatus;
import com.eventsphere.eventspere.enums.Role;
import com.eventsphere.eventspere.exception.BadRequestException;
import com.eventsphere.eventspere.exception.ResourceNotFoundException;
import com.eventsphere.eventspere.repository.EventRepository;
import com.eventsphere.eventspere.repository.RegistrationRepository;
import com.eventsphere.eventspere.repository.UserRepository;
import com.eventsphere.eventspere.service.RegistrationService;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public RegistrationServiceImpl(
            RegistrationRepository registrationRepository,
            EventRepository eventRepository,
            UserRepository userRepository) {

        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentParticipant() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {

            throw new AccessDeniedException("User is not authenticated");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"));

        if (user.getRole() != Role.PARTICIPANT) {
            throw new AccessDeniedException(
                    "Only participants can perform this operation");
        }

        return user;
    }

    @Override
    @Transactional
    public RegistrationResponse registerForEvent(
            RegistrationRequest request) {

        User user = getCurrentParticipant();

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event not found"));

        if (event.getStatus() != EventStatus.PUBLISHED) {
            throw new BadRequestException(
                    "Only published events can accept registrations");
        }

        if (!LocalDateTime.now().isBefore(
                event.getRegistrationDeadline())) {

            throw new BadRequestException(
                    "Registration deadline has passed");
        }

        if (registrationRepository.existsByUserIdAndEventId(
                user.getId(), event.getId())) {

            throw new BadRequestException(
                    "You have already registered for this event");
        }

        long confirmedRegistrations =
                registrationRepository.countByEventIdAndStatus(
                        event.getId(), RegistrationStatus.CONFIRMED);

        if (confirmedRegistrations >= event.getCapacity()) {
            throw new BadRequestException(
                    "Event has reached its maximum capacity");
        }

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus(RegistrationStatus.CONFIRMED);

        Registration savedRegistration =
                registrationRepository.save(registration);

        return mapToResponse(savedRegistration);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationResponse> getMyRegistrations() {

        User user = getCurrentParticipant();

        return registrationRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // GET PARTICIPANT DASHBOARD
    @Override
    @Transactional(readOnly = true)
    public ParticipantDashboardResponse getParticipantDashboard() {

        User participant = getCurrentParticipant();

        Long userId = participant.getId();

        long totalRegistrations =
                registrationRepository.countByUserId(userId);

        long confirmedRegistrations =
                registrationRepository.countByUserIdAndStatus(
                        userId,
                        RegistrationStatus.CONFIRMED
                );

        long cancelledRegistrations =
                registrationRepository.countByUserIdAndStatus(
                        userId,
                        RegistrationStatus.CANCELLED
                );

        List<RegistrationResponse> upcomingEvents =
                registrationRepository.findUpcomingRegistrations(
                                userId,
                                RegistrationStatus.CONFIRMED,
                                LocalDateTime.now()
                        )
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return new ParticipantDashboardResponse(
                totalRegistrations,
                confirmedRegistrations,
                cancelledRegistrations,
                upcomingEvents
        );
    }


    @Override
    @Transactional
    public void cancelRegistration(Long registrationId) {

        User user = getCurrentParticipant();

        Registration registration =
                registrationRepository.findById(registrationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Registration not found"));

        if (!registration.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException(
                    "You cannot cancel another user's registration");
        }

        if (registration.getStatus()
                == RegistrationStatus.CANCELLED) {

            throw new BadRequestException(
                    "Registration is already cancelled");
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);
    }

    private RegistrationResponse mapToResponse(
            Registration registration) {

        Event event = registration.getEvent();

        return new RegistrationResponse(
                registration.getId(),
                event.getId(),
                event.getTitle(),
                event.getVenue(),
                event.getStartTime(),
                registration.getStatus().name(),
                registration.getRegisteredAt()
        );
    }
}
