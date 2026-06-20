package com.app.financial_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.AIInsight;
import com.app.financial_tracker.repository.AIInsightRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIInsightService {

    private final AIInsightRepository aiInsightRepository;


    public AIInsight save(AIInsight insight) {
        return aiInsightRepository.save(insight);
    }


    public List<AIInsight> findAll() {
        return aiInsightRepository.findAll();
    }


    public AIInsight findById(Long id) {
        return aiInsightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insight not found"));
    }


    public void delete(Long id) {
        aiInsightRepository.deleteById(id);
    }

}