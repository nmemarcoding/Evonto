package com.nmemarcoding.evonto.service;

import org.springframework.stereotype.Service;

import com.nmemarcoding.evonto.model.Event;
import com.nmemarcoding.evonto.model.Invitation;
import com.nmemarcoding.evonto.model.Invitation.RSVPStatus;
import com.nmemarcoding.evonto.repository.InvitationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;

    public InvitationService(InvitationRepository invitationRepository) {
        this.invitationRepository = invitationRepository;
    }

    // Send a new invitation (if not already invited)
    public Optional<Invitation> sendInvitation(Event event, String guestName, String guestEmail, String guestPhone) {
        // Check for existing invitation
        if (guestEmail != null) {
            Optional<Invitation> existing = invitationRepository.findByEventAndGuestEmail(event, guestEmail);
            if (existing.isPresent()) {
                return Optional.empty(); // already invited
            }
        }

        Invitation invitation = new Invitation(event, guestName, guestEmail, guestPhone);
        Invitation saved = invitationRepository.save(invitation);
        return Optional.of(saved);
    }

    // Get all invitations for an event
    public List<Invitation> getInvitationsByEvent(Event event) {
        return invitationRepository.findByEvent(event);
    }

    // Get invitations for a guest by email
    public List<Invitation> getInvitationsByGuestEmail(String guestEmail) {
        return invitationRepository.findByGuestEmail(guestEmail);
    }

    // Respond to an invitation (RSVP)
    public Optional<Invitation> respondToInvitation(Long invitationId, RSVPStatus rsvpStatus) {
        Optional<Invitation> optionalInvitation = invitationRepository.findById(invitationId);

        if (optionalInvitation.isPresent()) {
            Invitation invitation = optionalInvitation.get();
            invitation.setRsvpStatus(rsvpStatus);
            invitation.setRespondedAt(LocalDateTime.now());
            return Optional.of(invitationRepository.save(invitation));
        }

        return Optional.empty();
    }

    // Get invitation by ID
    public Optional<Invitation> getInvitationById(Long id) {
        return invitationRepository.findById(id);
    }
    
    // Delete invitation by ID
    public void deleteInvitation(Long id) {
        invitationRepository.deleteById(id);
    }
}
