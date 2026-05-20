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
public class MonthlyWalletAnalysisDTO {
    private boolean hasTransactions;
    private Double totalSpentThisMonth;
    private Double totalReceivedThisMonth;
    private OffsetDateTime periodStart;
    private OffsetDateTime periodEnd;
}
