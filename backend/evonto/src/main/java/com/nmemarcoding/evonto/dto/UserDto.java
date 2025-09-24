package com.nmemarcoding.evonto.dto;

import java.time.LocalDateTime;

import com.nmemarcoding.evonto.model.User;





public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    
    // Default constructor
    public UserDto() {}
    
    // Constructor from User entity
    public UserDto(User user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
    }
    
    // Getters and setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Convert to User entity (for operations that need to go from DTO to Entity)
    public User toUser() {
        User user = new User();
        user.setUserId(this.userId);
        user.setUsername(this.username);
        user.setEmail(this.email);
        user.setCreatedAt(this.createdAt);
        return user;
    }
}
