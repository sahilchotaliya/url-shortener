package com.url.shortener.service;

import com.url.shortener.dtos.GoogleAuthRequest;
import com.url.shortener.dtos.LoginRequest;
import com.url.shortener.models.User;
import com.url.shortener.repository.UserRepository;
import com.url.shortener.security.jwt.JwtAuthenticationResponse;
import com.url.shortener.security.jwt.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {
    private PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;

    public User registerUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                        loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);
        return new JwtAuthenticationResponse(jwt);
    }

    public User findByUsername(String name) {
        return userRepository.findByUsername(name).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + name)
        );
    }
    
    public JwtAuthenticationResponse authenticateGoogleUser(GoogleAuthRequest googleAuthRequest) {
        try {
            System.out.println("Google auth request received: " + googleAuthRequest.getEmail());
            
            // Check if user exists by email
            Optional<User> existingUser = userRepository.findByEmail(googleAuthRequest.getEmail());
            
            User user;
            if (existingUser.isPresent()) {
                // User exists, update their information if needed
                user = existingUser.get();
                System.out.println("Existing user found: " + user.getUsername());
                
                // Update profile picture if provided
                if (googleAuthRequest.getImageUrl() != null && !googleAuthRequest.getImageUrl().isEmpty()) {
                    user.setImageUrl(googleAuthRequest.getImageUrl());
                }
                user.setGoogleUser(true);
                user = userRepository.save(user);
            } else {
                // Create a new user
                user = new User();
                user.setEmail(googleAuthRequest.getEmail());
                
                // Generate a username based on email or use the name from Google
                String username = googleAuthRequest.getName().replaceAll("\\s+", "").toLowerCase();
                
                // Check if username exists, if so, add a random suffix
                if (userRepository.existsByUsername(username)) {
                    username = username + UUID.randomUUID().toString().substring(0, 5);
                }
                
                user.setUsername(username);
                System.out.println("Creating new user with username: " + username);
                
                // Set profile picture if provided
                if (googleAuthRequest.getImageUrl() != null && !googleAuthRequest.getImageUrl().isEmpty()) {
                    user.setImageUrl(googleAuthRequest.getImageUrl());
                }
                
                // Set a random password that the user won't use (they'll login via Google)
                String randomPassword = UUID.randomUUID().toString();
                user.setPassword(passwordEncoder.encode(randomPassword));
                user.setRole("ROLE_USER");
                user.setGoogleUser(true);
                user = userRepository.save(user);
            }
            
            // Create authentication token
            UserDetailsImpl userDetails = UserDetailsImpl.build(user);
            String jwt = jwtUtils.generateToken(userDetails);
            System.out.println("JWT token generated for Google user");
            
            return new JwtAuthenticationResponse(jwt);
        } catch (Exception e) {
            System.err.println("Error in Google authentication: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
