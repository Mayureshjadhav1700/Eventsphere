
package com.eventsphere.eventspere.repository;

import com.eventsphere.eventspere.entity.Event;
import com.eventsphere.eventspere.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("""
        SELECT e FROM Event e
        WHERE e.status = :status
        ORDER BY e.startTime ASC
    """)
    List<Event> findEventsByStatus(
            @Param("status") EventStatus status
    );

    @Query("""
        SELECT e FROM Event e
        WHERE e.status = :status
        AND (:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:categoryId IS NULL OR e.category.id = :categoryId)
        AND (:venue IS NULL OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :venue, '%')))
        AND (:eventDate IS NULL OR CAST(e.startTime AS date) = :eventDate)
        ORDER BY e.startTime ASC
    """)
    List<Event> searchEvents(
            @Param("status") EventStatus status,
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("venue") String venue,
            @Param("eventDate") LocalDate eventDate
    );
    List<Event> findByOrganizerId(Long organizerId);
}
