package com.util.kafka;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserCreatedPayload implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;

    private String userName;

    private String userEmail;
}
