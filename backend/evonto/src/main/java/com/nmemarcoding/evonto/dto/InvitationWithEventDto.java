package com.nmemarcoding.evonto.dto;

public class InvitationWithEventDto {

    private EventDto event;
    private InvitationDto invitation;

    public InvitationWithEventDto() {}

    public InvitationWithEventDto(EventDto event, InvitationDto invitation) {
        this.event = event;
        this.invitation = invitation;
    }

    public EventDto getEvent() {
        return event;
    }

    public void setEvent(EventDto event) {
        this.event = event;
    }

    public InvitationDto getInvitation() {
        return invitation;
    }

    public void setInvitation(InvitationDto invitation) {
        this.invitation = invitation;
    }
}
