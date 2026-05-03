package com.transaction.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TransactionRequestDTO {

    private Long toUserId;
    private Long fromUserId;

    private Double amount;
    private String comment;
}
