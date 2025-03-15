package com.url.shortener.controller;

import com.url.shortener.dtos.ClickEventDTO;
import com.url.shortener.dtos.UrlMappingDTO;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import com.url.shortener.repository.UrlMappingRepository;
import com.url.shortener.service.UrlMappingService;
import com.url.shortener.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlMappingController {
    private UrlMappingService urlMappingService;
    private UserService userService;
    private UrlMappingRepository urlMappingRepository;

    // {"originalUrl":"https://example.com"}
//    https://abc.com/QN7XOa0a --> https://example.com

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> createShortUrl(@RequestBody Map<String, String> request,
                                                        Principal principal){
        String originalUrl = request.get("originalUrl");
        String name = request.get("name");
        User user = userService.findByUsername(principal.getName());
        UrlMappingDTO urlMappingDTO = urlMappingService.createShortUrl(originalUrl, name, user);
        return ResponseEntity.ok(urlMappingDTO);
    }


    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>> getUserUrls(Principal principal){
        User user = userService.findByUsername(principal.getName());
        List<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user);
        return ResponseEntity.ok(urls);
    }


    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDTO>> getUrlAnalytics(@PathVariable String shortUrl,
                                                               @RequestParam("startDate") String startDate,
                                                               @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);
        List<ClickEventDTO> clickEventDTOS = urlMappingService.getClickEventsByDate(shortUrl, start, end);
        return ResponseEntity.ok(clickEventDTOS);
    }


    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClicksByDate(Principal principal,
                                                                     @RequestParam("startDate") String startDate,
                                                                     @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        User user = userService.findByUsername(principal.getName());
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);
        Map<LocalDate, Long> totalClicks = urlMappingService.getTotalClicksByUserAndDate(user, start, end);
        return ResponseEntity.ok(totalClicks);
    }

    /**
     * Deletes a URL mapping by its ID
     *
     * @param id The ID of the URL to delete
     * @param principal The authenticated user
     * @return ResponseEntity with success/error message
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteUrl(@PathVariable Long id, Principal principal) {
        Map<String, String> response = new HashMap<>();

        // Log the request details
        System.out.println("Delete URL request received for ID: " + id);
        System.out.println("Authenticated user: " + principal.getName());

        try {
            User user = userService.findByUsername(principal.getName());
            System.out.println("User found: " + user.getUsername() + ", User ID: " + user.getId());

            // Use the service layer to delete the URL
            boolean deleted = urlMappingService.deleteUrl(id, user);

            if (deleted) {
                response.put("message", "URL deleted successfully");
                System.out.println("URL with ID " + id + " deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                throw new RuntimeException("Failed to delete URL");
            }
        } catch (NoSuchElementException e) {
            System.out.println("Error: URL not found - " + e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (SecurityException e) {
            System.out.println("Error: Permission denied - " + e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        } catch (Exception e) {
            System.out.println("Error: Unexpected exception - " + e.getMessage());
            e.printStackTrace();
            response.put("error", "Failed to delete URL: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Debug endpoint to check user authentication and roles
     */
    @GetMapping("/debug/auth")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> debugAuth(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.findByUsername(principal.getName());
            response.put("username", user.getUsername());
            response.put("userId", user.getId());
            response.put("roles", List.of(user.getRole()));
            response.put("authenticated", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            response.put("authenticated", false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Debug endpoint to list all URLs in the database
     */
    @GetMapping("/debug/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> debugAllUrls() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<UrlMapping> allUrls = urlMappingRepository.findAll();
            List<Map<String, Object>> urlInfoList = allUrls.stream()
                    .map(url -> {
                        Map<String, Object> urlInfo = new HashMap<>();
                        urlInfo.put("id", url.getId());
                        urlInfo.put("shortUrl", url.getShortUrl());
                        urlInfo.put("originalUrl", url.getOriginalUrl());
                        urlInfo.put("userId", url.getUser().getId());
                        urlInfo.put("username", url.getUser().getUsername());
                        return urlInfo;
                    })
                    .collect(Collectors.toList());

            response.put("urls", urlInfoList);
            response.put("count", urlInfoList.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Debug endpoint to check if a specific URL exists
     */
    @GetMapping("/debug/exists/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> debugUrlExists(@PathVariable Long id, Principal principal) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.findByUsername(principal.getName());
            boolean exists = urlMappingRepository.existsById(id);
            boolean belongsToUser = false;

            if (exists) {
                belongsToUser = urlMappingRepository.existsByIdAndUserId(id, user.getId());
            }

            response.put("id", id);
            response.put("exists", exists);
            response.put("belongsToUser", belongsToUser);
            response.put("userId", user.getId());
            response.put("username", user.getUsername());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
