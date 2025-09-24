package com.nmemarcoding.evonto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nmemarcoding.evonto.model.Event;
import com.nmemarcoding.evonto.model.User;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Fetch all events created by a specific user
    List<Event> findByCreatedBy(User user);

    // Optional: fetch by title if needed
    List<Event> findByTitleContainingIgnoreCase(String title);
}
