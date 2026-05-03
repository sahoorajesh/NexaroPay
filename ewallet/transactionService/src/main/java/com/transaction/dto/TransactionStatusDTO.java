package com.transaction.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TransactionStatusDTO {
    private String status;
    private String reason;
}
