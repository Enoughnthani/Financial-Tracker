package com.app.financial_tracker.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transaction_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
 
    @OneToMany(mappedBy = "category")
    private List<FinancialTransaction> transactions; 

    public TransactionCategory(String name) {
        this.name=name;
    }
}