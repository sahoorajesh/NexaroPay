package com.util.kafka;

import lombok.*;
import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WalletUpdatedPayload implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;

    private Long walletId;

    private String userEmail;

    private Double newBalance;

    private String requestId;

}
