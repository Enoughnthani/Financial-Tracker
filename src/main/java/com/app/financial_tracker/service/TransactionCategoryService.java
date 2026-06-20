package com.app.financial_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.financial_tracker.dto.TransactionCategoryResponse;
import com.app.financial_tracker.entity.TransactionCategory;
import com.app.financial_tracker.repository.TransactionCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionCategoryService { 

    private final TransactionCategoryRepository transactionCategoryRepository;

    public TransactionCategory save(TransactionCategory category) {
        return transactionCategoryRepository.save(category);
    }

    public List<TransactionCategoryResponse> findAll() {
        return transactionCategoryRepository.findAll().stream()
        .map(c->new TransactionCategoryResponse(c.getId(),c.getName())).toList();
    }

    public TransactionCategory findById(Long id) {
        return transactionCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public List<TransactionCategory> findByCategory(String category) {
        return transactionCategoryRepository.findAllByName(category);
    }

    public void delete(Long id) {
        transactionCategoryRepository.deleteById(id);
    }
}