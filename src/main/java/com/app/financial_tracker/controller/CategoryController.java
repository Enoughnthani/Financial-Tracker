package com.app.financial_tracker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.financial_tracker.dto.TransactionCategoryResponse;
import com.app.financial_tracker.service.TransactionCategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final TransactionCategoryService transactionCategoryService ;

    @GetMapping
    public ResponseEntity<List<TransactionCategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(transactionCategoryService.findAll());
    }
}