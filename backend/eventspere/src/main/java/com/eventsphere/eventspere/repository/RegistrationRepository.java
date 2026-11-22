package com.eventsphere.eventspere.repository;

import com.eventsphere.eventspere.entity.Registration;
import com.eventsphere.eventspere.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUserId(Long userId);

    List<Registration> findByEventId(Long eventId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    long countByUserIdAndStatus(Long userId, RegistrationStatus status);

    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);

    // Count all registrations of a participant
    long countByUserId(Long userId);

    // Get confirmed registrations for upcoming events
    @Query("""
    SELECT r FROM Registration r
    WHERE r.user.id = :userId
    AND r.status = :status
    AND r.event.startTime > :currentTime
    ORDER BY r.event.startTime ASC
""")
    List<Registration> findUpcomingRegistrations(
            @Param("userId") Long userId,
            @Param("status") RegistrationStatus status,
            @Param("currentTime") LocalDateTime currentTime
    );
}
