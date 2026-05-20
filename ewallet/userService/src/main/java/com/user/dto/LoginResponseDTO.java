package com.user.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class LoginResponseDTO {
    private boolean success;
    private String message;
    private Long userId;
    private UserDTO user;
    private String token;
    private String refreshToken;
}

