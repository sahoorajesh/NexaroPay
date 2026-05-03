package com.util.kafka;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TxnInitPayload {
    private String transactionId;
    private Long fromUserId;
    private Long toUserId;
    private Double amount;

}
