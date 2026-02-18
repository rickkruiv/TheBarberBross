package com.barberbross.BarberBross.repository;

import com.barberbross.BarberBross.model.SocialMedia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialMediaRepository extends JpaRepository<SocialMedia, Long> {
    boolean existsByUrl(String url);
}
