package com.wallet.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class WalletInfoDTO {
    private long walletId;

    private long userId;
    private Double balance;
}
