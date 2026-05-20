package com.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransactionListItemDTO {
    private String txnId;
    private Long fromUserId;
    private Long toUserId;
    private Double amount;
    private String status;
    private String comment;
    private String reason;
    private OffsetDateTime txnCreatedDate;
    private OffsetDateTime txnLastUpdatedDate;
}
