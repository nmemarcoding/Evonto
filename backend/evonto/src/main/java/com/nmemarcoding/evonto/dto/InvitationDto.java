package com.nmemarcoding.evonto.dto;

import java.time.LocalDateTime;

import com.nmemarcoding.evonto.model.Invitation;
import com.nmemarcoding.evonto.model.Invitation.RSVPStatus;

public class InvitationDto {

    private Long invitationId;
    private Long eventId;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private RSVPStatus rsvpStatus;
    private LocalDateTime invitationSentAt;
    private LocalDateTime respondedAt;

    // Default constructor
    public InvitationDto() {}

    // Constructor from entity
    public InvitationDto(Invitation invitation) {
        this.invitationId = invitation.getInvitationId();
        this.eventId = invitation.getEvent().getEventId();
        this.guestName = invitation.getGuestName();
        this.guestEmail = invitation.getGuestEmail();
        this.guestPhone = invitation.getGuestPhone();
        this.rsvpStatus = invitation.getRsvpStatus();
        this.invitationSentAt = invitation.getInvitationSentAt();
        this.respondedAt = invitation.getRespondedAt();
    }

    // Getters and setters
    public Long getInvitationId() {
        return invitationId;
    }

    public void setInvitationId(Long invitationId) {
        this.invitationId = invitationId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getGuestEmail() {
        return guestEmail;
    }

    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    public String getGuestPhone() {
        return guestPhone;
    }

    public void setGuestPhone(String guestPhone) {
        this.guestPhone = guestPhone;
    }

    public RSVPStatus getRsvpStatus() {
        return rsvpStatus;
    }

    public void setRsvpStatus(RSVPStatus rsvpStatus) {
        this.rsvpStatus = rsvpStatus;
    }

    public LocalDateTime getInvitationSentAt() {
        return invitationSentAt;
    }

    public void setInvitationSentAt(LocalDateTime invitationSentAt) {
        this.invitationSentAt = invitationSentAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
}
