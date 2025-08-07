package com.nmemarcoding.evonto.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitation_id")
    private Long invitationId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", referencedColumnName = "eventId")
    private Event event;

    @Column(name = "guest_name", nullable = false)
    private String guestName;

    @Column(name = "guest_email")
    private String guestEmail;

    @Column(name = "guest_phone")
    private String guestPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "rsvp_status", nullable = false)
    private RSVPStatus rsvpStatus = RSVPStatus.NO_RESPONSE;

    @Column(name = "invitation_sent_at", nullable = false)
    private LocalDateTime invitationSentAt = LocalDateTime.now();

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    // Constructors
    public Invitation() {}

    public Invitation(Event event, String guestName, String guestEmail, String guestPhone) {
        this.event = event;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.guestPhone = guestPhone;
        this.rsvpStatus = RSVPStatus.NO_RESPONSE;
        this.invitationSentAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getInvitationId() {
        return invitationId;
    }

    public void setInvitationId(Long invitationId) {
        this.invitationId = invitationId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
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

    // Embedded Enum for RSVP status
    public enum RSVPStatus {
        YES,
        NO,
        MAYBE,
        NO_RESPONSE
    }
}
