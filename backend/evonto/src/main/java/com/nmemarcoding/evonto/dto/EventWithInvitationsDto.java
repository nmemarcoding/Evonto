package com.nmemarcoding.evonto.dto;

import java.util.List;

public class EventWithInvitationsDto {
    private EventDto event;
    private List<InvitationDto> invitations;

    public EventWithInvitationsDto(EventDto event, List<InvitationDto> invitations) {
        this.event = event;
        this.invitations = invitations;
    }

    public EventDto getEvent() {
        return event;
    }

    public void setEvent(EventDto event) {
        this.event = event;
    }

    public List<InvitationDto> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<InvitationDto> invitations) {
        this.invitations = invitations;
    }
}
