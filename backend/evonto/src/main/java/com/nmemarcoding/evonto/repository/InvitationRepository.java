package com.nmemarcoding.evonto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nmemarcoding.evonto.model.Event;
import com.nmemarcoding.evonto.model.Invitation;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    // Find all invitations for an event
    List<Invitation> findByEvent(Event event);

    // Find by guest email (to allow public RSVP)
    List<Invitation> findByGuestEmail(String guestEmail);

    // Optional: prevent duplicates
    Optional<Invitation> findByEventAndGuestEmail(Event event, String guestEmail);
}
