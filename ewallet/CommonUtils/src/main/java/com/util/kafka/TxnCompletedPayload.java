package com.util.kafka;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TxnCompletedPayload {
    private String txnId;
    private Boolean success;
    private String reason;
    private String requestId;
}
