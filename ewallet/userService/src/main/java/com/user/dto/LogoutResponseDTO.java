package com.user.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class LogoutResponseDTO {
    private boolean success;
    private String message;
}
