package com.app.financial_tracker.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "currency")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Currency {

    public enum CurrencyCode {
        USD,
        EUR,
        GBP,
        ZAR,
        JPY
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private CurrencyCode currencyCode;

    @OneToMany(mappedBy = "currency")
    private List<UserPreference> userPreferences;

    public Currency(CurrencyCode currencyCode) {
        setCurrencyCode(currencyCode);
    }

}