package com.url.shortener.dtos;

import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String token;
    private String email;
    private String name;
    private String imageUrl;
} 