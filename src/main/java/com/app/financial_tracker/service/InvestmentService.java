package com.app.financial_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.Investment;
import com.app.financial_tracker.repository.InvestmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;


    public Investment save(Investment investment) {
        return investmentRepository.save(investment);
    }


    public List<Investment> findAll() {
        return investmentRepository.findAll();
    }


    public Investment findById(Long id) {
        return investmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investment not found"));
    }


    public void delete(Long id) {
        investmentRepository.deleteById(id);
    }

}