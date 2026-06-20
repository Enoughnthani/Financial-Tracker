package com.app.financial_tracker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.financial_tracker.dto.TransactionRequest;
import com.app.financial_tracker.dto.TransactionResponse;
import com.app.financial_tracker.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions(Authentication authentication) {
        return ResponseEntity.ok(transactionService.findAllTransactions(authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(transactionService.findTransactionById(id, authentication));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByAccount(@PathVariable Long accountId,
            Authentication authentication) {
        return ResponseEntity.ok(transactionService.findTransactionsByAccountId(accountId, authentication));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody TransactionRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(transactionService.createTransaction(request, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(@PathVariable Long id,
            @RequestBody TransactionRequest request, Authentication authentication) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        transactionService.deleteTransaction(id, authentication);
        return ResponseEntity.ok().build();
    }
}