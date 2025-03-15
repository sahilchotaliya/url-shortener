package com.url.shortener.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String username;
    private String password;
    private String role = "ROLE_USER";
    
    // Add these fields for Google authentication
    private String googleId;
    private String imageUrl;
    private boolean googleUser = false;
}
