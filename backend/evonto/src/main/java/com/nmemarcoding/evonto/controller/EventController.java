package com.nmemarcoding.evonto.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nmemarcoding.evonto.dto.EventDto;
import com.nmemarcoding.evonto.model.Event;
import com.nmemarcoding.evonto.model.User;
import com.nmemarcoding.evonto.service.EventService;
import com.nmemarcoding.evonto.service.UserService;
import com.nmemarcoding.evonto.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public EventController(EventService eventService, UserService userService, JwtUtil jwtUtil) {
        this.eventService = eventService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // Create a new event (token required)
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event, HttpServletRequest request) {
        try {
            jwtUtil.requireValidToken(request);
            String username = jwtUtil.extractUsernameFromRequest(request);

            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            event.setCreatedBy(user);
            Event saved = eventService.createEvent(event);
            return ResponseEntity.ok(new EventDto(saved));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating event: " + e.getMessage());
        }
    }

    // Get all public events
    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        List<EventDto> events = eventService.getAllEvents()
                .stream()
                .map(EventDto::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(events);
    }

    // Get events created by the logged-in user (token required)
    @GetMapping("/my")
    public ResponseEntity<?> getMyEvents(HttpServletRequest request) {
        try {
            jwtUtil.requireValidToken(request);
            String username = jwtUtil.extractUsernameFromRequest(request);

            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<EventDto> events = eventService.getEventsByCreator(user)
                    .stream()
                    .map(EventDto::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(events);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching user events: " + e.getMessage());
        }
    }

    // Get a single event by ID (public)
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            Optional<Event> eventOptional = eventService.getEventById(id);
            if (eventOptional.isPresent()) {
                EventDto eventDto = new EventDto(eventOptional.get());
                return ResponseEntity.ok(eventDto);
            } else {
                return ResponseEntity.status(404).body("Event not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving event: " + e.getMessage());
        }
    }
    
    // Delete event by ID (token required + ownership check)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, HttpServletRequest request) {
        try {
            jwtUtil.requireValidToken(request);
            String username = jwtUtil.extractUsernameFromRequest(request);

            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Event event = eventService.getEventById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            if (!event.getCreatedBy().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(403).body("You are not the owner of this event");
            }

            eventService.deleteEvent(id);
            return ResponseEntity.ok("Event deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting event: " + e.getMessage());
        }
    }
}
