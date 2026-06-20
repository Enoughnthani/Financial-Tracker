package com.app.financial_tracker.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.financial_tracker.dto.TransactionRequest;
import com.app.financial_tracker.dto.TransactionResponse;
import com.app.financial_tracker.entity.Account;
import com.app.financial_tracker.entity.FinancialTransaction;
import com.app.financial_tracker.entity.TransactionCategory;
import com.app.financial_tracker.entity.TransactionType;
import com.app.financial_tracker.repository.AccountRepository;
import com.app.financial_tracker.repository.FinancialTransactionRepository;
import com.app.financial_tracker.repository.TransactionCategoryRepository;
import com.app.financial_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final FinancialTransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final TransactionCategoryRepository transactionCategoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, Authentication authentication) {
        validateTransaction(request);

        OAuth2User oauthUser = getOAuth2User(authentication);
        String email = extractEmail(oauthUser);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + request.getAccountId()));

        if (!account.getUser().getId().equals(userId)) {
            throw new RuntimeException("You do not own this account");
        }

        TransactionCategory category = null;

        if (request.getCategoryId() != null) {
            category = transactionCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + request.getCategoryId()));
        } else if (request.getCategory() != null && !request.getCategory().trim().isEmpty()) {
            category = transactionCategoryRepository.findByName(request.getCategory())
                    .orElseGet(() -> {
                        TransactionCategory newCategory = new TransactionCategory(request.getCategory());
                        return transactionCategoryRepository.save(newCategory);
                    });
        }

        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType(new TransactionType(request.getTransactionType(), transaction));
        transaction.setTransactionDate(
                request.getTransactionDate() != null ? request.getTransactionDate() : LocalDate.now());
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setAccount(account);
        transaction.setCategory(category);

        FinancialTransaction saved = transactionRepository.save(transaction);
        return toResponse(saved);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request, Authentication authentication) {
        OAuth2User oauthUser = getOAuth2User(authentication);
        String email = extractEmail(oauthUser);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        FinancialTransaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        if (!existing.getAccount().getUser().getId().equals(userId)) {
            throw new RuntimeException("You do not own this transaction");
        }

        if (request.getDescription() != null && !request.getDescription().trim().isEmpty()) {
            existing.setDescription(request.getDescription().trim());
        }

        if (request.getAmount() != null) {
            existing.setAmount(request.getAmount());
        }

        if (request.getTransactionType() != null) {
            existing.setTransactionType(new TransactionType(request.getTransactionType(), existing));
        }

        if (request.getAccountId() != null) {
            Account account = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + request.getAccountId()));
            
            if (!account.getUser().getId().equals(userId)) {
                throw new RuntimeException("You do not own this account");
            }
            existing.setAccount(account);
        }

        if (request.getTransactionDate() != null) {
            existing.setTransactionDate(request.getTransactionDate());
        }

        FinancialTransaction updated = transactionRepository.save(existing);
        return toResponse(updated);
    }

    @Transactional
    public void deleteTransaction(Long id, Authentication authentication) {
        OAuth2User oauthUser = getOAuth2User(authentication);
        String email = extractEmail(oauthUser);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        FinancialTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        if (!transaction.getAccount().getUser().getId().equals(userId)) {
            throw new RuntimeException("You do not own this transaction");
        }

        transactionRepository.delete(transaction);
    }

    public TransactionResponse findTransactionById(Long id, Authentication authentication) {
        OAuth2User oauthUser = getOAuth2User(authentication);
        String email = extractEmail(oauthUser);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        FinancialTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        if (!transaction.getAccount().getUser().getId().equals(userId)) {
            throw new RuntimeException("You do not own this transaction");
        }

        return toResponse(transaction);
    }

    public List<TransactionResponse> findAllTransactions(Authentication authentication) {
        OAuth2User oauthUser = getOAuth2User(authentication);
        String email = extractEmail(oauthUser);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return transactionRepository.findAll().stream()
                .filter(t -> t.getAccount().getUser().getId().equals(userId))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> findTransactionsByAccountId(Long accountId, Authentication authentication) {
        OAuth2User oauthUser = getOAuth2User(authentication);
        String email = extractEmail(oauthUser);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return transactionRepository.findByAccountId(accountId).stream()
                .filter(t -> t.getAccount().getUser().getId().equals(userId))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private OAuth2User getOAuth2User(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof OAuth2User)) {
            throw new RuntimeException("Not an OAuth2 user");
        }

        return (OAuth2User) principal;
    }

    private String extractEmail(OAuth2User oauthUser) {
        String email = oauthUser.getAttribute("email");

        if (email == null) {
            email = oauthUser.getAttribute("userPrincipalName");
        }
        if (email == null) {
            email = oauthUser.getAttribute("mail");
        }
        if (email == null) {
            throw new RuntimeException("No email found in OAuth2 user attributes");
        }

        return email;
    }

    private void validateTransaction(TransactionRequest request) {
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Description is required");
        }
        if (request.getAmount() == null) {
            throw new IllegalArgumentException("Amount is required");
        }
        if (request.getAmount().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        if (request.getAccountId() == null) {
            throw new IllegalArgumentException("Account ID is required");
        }
    }

    private TransactionResponse toResponse(FinancialTransaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setDescription(transaction.getDescription());
        response.setAmount(transaction.getAmount());
        if (transaction.getTransactionType() != null) {
            response.setTransactionType(transaction.getTransactionType().getName());
        }
        response.setTransactionDate(transaction.getTransactionDate());
        response.setCreatedAt(transaction.getCreatedAt());

        if (transaction.getCategory() != null) {
            response.setCategory(transaction.getCategory().getName());
        }

        if (transaction.getAccount() != null) {
            response.setAccountId(transaction.getAccount().getId());
            response.setAccountName(transaction.getAccount().getAccountName());
        }

        return response;
    }
}