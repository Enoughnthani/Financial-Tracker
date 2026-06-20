package com.app.financial_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.Debt;
import com.app.financial_tracker.repository.DebtRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DebtService {

    private final DebtRepository debtRepository;


    public Debt save(Debt debt) {
        return debtRepository.save(debt);
    }


    public List<Debt> findAll() {
        return debtRepository.findAll();
    }


    public Debt findById(Long id) {
        return debtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Debt not found"));
    }


    public void delete(Long id) {
        debtRepository.deleteById(id);
    }

}