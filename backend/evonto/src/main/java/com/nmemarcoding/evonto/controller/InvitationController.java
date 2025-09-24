package com.nmemarcoding.evonto.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nmemarcoding.evonto.dto.EventDto;
import com.nmemarcoding.evonto.dto.InvitationDto;
import com.nmemarcoding.evonto.dto.InvitationWithEventDto;
import com.nmemarcoding.evonto.model.Event;
import com.nmemarcoding.evonto.model.Invitation;
import com.nmemarcoding.evonto.model.Invitation.RSVPStatus;
import com.nmemarcoding.evonto.model.User;
import com.nmemarcoding.evonto.service.EventService;
import com.nmemarcoding.evonto.service.InvitationService;
import com.nmemarcoding.evonto.service.UserService;
import com.nmemarcoding.evonto.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    private final InvitationService invitationService;
    private final UserService userService;
    private final EventService eventService;
    private final JwtUtil jwtUtil;

    public InvitationController(InvitationService invitationService, UserService userService, EventService eventService, JwtUtil jwtUtil) {
        this.invitationService = invitationService;
        this.userService = userService;
        this.eventService = eventService;
        this.jwtUtil = jwtUtil;
    }

    // 1. Create invitation (only by event owner)
    @PostMapping("/send")
    public ResponseEntity<?> sendInvitation(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        try {
            jwtUtil.requireValidToken(request);
            String username = jwtUtil.extractUsernameFromRequest(request);
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Long eventId = Long.parseLong(payload.get("eventId"));
            String guestName = payload.get("guestName");
            String guestEmail = payload.get("guestEmail");
            String guestPhone = payload.get("guestPhone");

            Event event = eventService.getEventById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            if (!event.getCreatedBy().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(403).body("You can only send invitations for your own events");
            }

            Optional<Invitation> result = invitationService.sendInvitation(event, guestName, guestEmail, guestPhone);
            if (result.isPresent()) {
                return ResponseEntity.ok(new InvitationDto(result.get()));
            } else {
                return ResponseEntity.badRequest().body("Guest already invited");
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending invitation: " + e.getMessage());
        }
    }

    // 2. Guest views their invitation info by guest name + optional email, and gets event info too
    @PostMapping("/info")
    public ResponseEntity<?> getInvitationInfo(@RequestBody Map<String, String> payload) {
        try {
            String guestEmail = payload.get("guestEmail");
            String guestName = payload.get("guestName");
            Long eventId = Long.parseLong(payload.get("eventId"));

            Event event = eventService.getEventById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            List<Invitation> invitations = invitationService.getInvitationsByEvent(event);
            Optional<Invitation> found = invitations.stream()
                    .filter(invite -> invite.getGuestName().equalsIgnoreCase(guestName) &&
                            (guestEmail == null || (invite.getGuestEmail() != null &&
                            invite.getGuestEmail().equalsIgnoreCase(guestEmail))))
                    .findFirst();

            if (found.isPresent()) {
                InvitationDto invitationDto = new InvitationDto(found.get());
                EventDto eventDto = new EventDto(event);
                InvitationWithEventDto result = new InvitationWithEventDto(eventDto, invitationDto);
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(404).body("Invitation not found");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching invitation: " + e.getMessage());
        }
    }


    // 3. Guest responds to their invitation
    @PostMapping("/respond")
    public ResponseEntity<?> respondToInvitation(@RequestBody Map<String, String> payload) {
        try {
            Long invitationId = Long.parseLong(payload.get("invitationId"));
            RSVPStatus status = RSVPStatus.valueOf(payload.get("rsvpStatus").toUpperCase());

            Optional<Invitation> updated = invitationService.respondToInvitation(invitationId, status);

            if (updated.isPresent()) {
                return ResponseEntity.ok(new InvitationDto(updated.get()));
            } else {
                return ResponseEntity.status(404).body("Invitation not found");
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid RSVP status. Use: YES, NO, MAYBE, NO_RESPONSE");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error responding to invitation: " + e.getMessage());
        }
    }

    // 4. Authenticated user views invitations for their own event
    @PostMapping("/list")
    public ResponseEntity<?> listMyEventInvitations(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        try {
            jwtUtil.requireValidToken(request);
            String username = jwtUtil.extractUsernameFromRequest(request);
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Long eventId = Long.parseLong(payload.get("eventId"));

            Event event = eventService.getEventById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            if (!event.getCreatedBy().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(403).body("You do not own this event");
            }

            List<InvitationDto> result = invitationService.getInvitationsByEvent(event)
                    .stream()
                    .map(InvitationDto::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error listing invitations: " + e.getMessage());
        }
    }

    // 5. Delete invitation (only if user owns the event)
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteInvitation(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        try {
            jwtUtil.requireValidToken(request);
            String username = jwtUtil.extractUsernameFromRequest(request);
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Long invitationId = Long.parseLong(payload.get("invitationId"));

            Invitation invitation = invitationService.getInvitationById(invitationId)
                    .orElseThrow(() -> new RuntimeException("Invitation not found"));

            Event event = invitation.getEvent();

            if (!event.getCreatedBy().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(403).body("You can only delete invitations for your own events");
            }

            invitationService.getInvitationById(invitationId)
                    .ifPresent(inv -> invitationService.deleteInvitation(inv.getInvitationId()));

            return ResponseEntity.ok("Invitation deleted");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting invitation: " + e.getMessage());
        }
    }
}
