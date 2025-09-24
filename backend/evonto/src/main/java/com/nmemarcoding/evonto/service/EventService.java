package com.nmemarcoding.evonto.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nmemarcoding.evonto.model.Event;
import com.nmemarcoding.evonto.model.User;
import com.nmemarcoding.evonto.repository.EventRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Create a new event
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    // Get event by ID
    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    // Get all events by a specific user
    public List<Event> getEventsByCreator(User user) {
        return eventRepository.findByCreatedBy(user);
    }

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Optional: delete event
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }
}
