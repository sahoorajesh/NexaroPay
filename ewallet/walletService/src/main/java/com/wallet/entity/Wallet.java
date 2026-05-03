package com.wallet.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long walletId;

    @Column(nullable = false, unique = true)
    private long userId;

    private String userEmail;
    private Double balance;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdDate;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedDate;
}
