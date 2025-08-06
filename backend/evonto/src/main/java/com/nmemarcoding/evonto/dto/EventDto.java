package com.nmemarcoding.evonto.dto;

import java.time.LocalDateTime;

import com.nmemarcoding.evonto.model.Event;

public class EventDto {

    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String location;
    private String createdByUsername;
    private LocalDateTime createdAt;

    // Default constructor
    public EventDto() {}

    // Constructor from Event entity
    public EventDto(Event event) {
        this.eventId = event.getEventId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.startDateTime = event.getStartDateTime();
        this.endDateTime = event.getEndDateTime();
        this.location = event.getLocation();
        this.createdByUsername = event.getCreatedBy().getUsername();
        this.createdAt = event.getCreatedAt();
    }

    // Getters and setters
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCreatedByUsername() {
        return createdByUsername;
    }

    public void setCreatedByUsername(String createdByUsername) {
        this.createdByUsername = createdByUsername;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
