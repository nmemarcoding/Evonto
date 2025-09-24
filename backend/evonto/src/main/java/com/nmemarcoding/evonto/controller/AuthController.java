package com.nmemarcoding.evonto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nmemarcoding.evonto.dto.UserDto;
import com.nmemarcoding.evonto.model.User;
import com.nmemarcoding.evonto.service.UserService;
import com.nmemarcoding.evonto.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            System.out.println("Received user: " + user.getUsername() + " | Password: " + user.getPassword());
            
            if (user.getPassword() == null || user.getPassword().isBlank()) {
                throw new IllegalArgumentException("Password must not be null or empty");
            }
            
            // Check if email is provided, if not, use username as email for backward compatibility
            if (user.getEmail() == null || user.getEmail().isBlank()) {
                user.setEmail(user.getUsername() + "@example.com");
            }

            if (userService.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            } else if (userService.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            User savedUser = userService.register(user);
            // Convert to DTO before returning
            UserDto userDto = new UserDto(savedUser);
            
            return ResponseEntity.ok(userDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            return userService.findByEmail(user.getEmail())
                    .map(existingUser -> {
                        try {
                            if (userService.checkPassword(existingUser, user.getPassword())) {
                                String token = jwtUtil.generateToken(existingUser.getUsername());
                                UserDto userDto = new UserDto(existingUser);
                                
                                HttpHeaders headers = new HttpHeaders();
                                headers.set("Authorization", "Bearer " + token); // Set token in header

                                return ResponseEntity.ok()
                                        .headers(headers)
                                        .body(userDto); // Only send user info in body
                            } else {
                                return ResponseEntity.status(401).body("Invalid password");
                            }
                        } catch (Exception e) {
                            return ResponseEntity.internalServerError().body("Login error: " + e.getMessage());
                        }
                    })
                    .orElse(ResponseEntity.status(404).body("User not found"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Login error: " + e.getMessage());
        }
    }

    // endpoint to check usr token validity from header
    @PostMapping("/check-token")
    public ResponseEntity<?> checkToken(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").split(" ")[1]; // Extract token from header
            if (token == null || !jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }
            String username = jwtUtil.extractUsernameFromRequest(request);
            return ResponseEntity.ok("Token is valid for user: " + username);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error checking token: " + e.getMessage());
        }
    }

    // endpoint to check server is running
    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        try {
            return ResponseEntity.ok("Server is running");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error pinging server: " + e.getMessage());
        }       
    }
}
    
