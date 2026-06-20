package com.app.financial_tracker.service;

import java.math.BigDecimal;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.User;
import com.app.financial_tracker.repository.AccountRepository;
import com.app.financial_tracker.repository.FinancialTransactionRepository;
import com.app.financial_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportsService {

    private final FinancialTransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public ReportSummary getReportSummary(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        ReportSummary summary = new ReportSummary();

        /*summary.totalIncome = transactionRepository.findByAccount_UserId(user.getId()).stream()
                .filter(t -> "INCOME".equals(t.getTransactionType()))
                .map(t -> t.getAmount())
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        summary.totalExpenses = transactionRepository.findByAccount_UserId(user.getId()).stream()
                .filter(t -> "EXPENSE".equals(t.getTransactionType()))
                .map(t -> t.getAmount())
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);*/

        summary.totalBalance = accountRepository.findByUserId(user.getId()).stream()
                .map(a -> a.getBalance())
                .filter(balance -> balance != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        summary.transactionCount = transactionRepository.findByAccount_UserId(user.getId()).size();

        return summary;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof OAuth2User)) {
            throw new RuntimeException("Not an OAuth2 user");
        }

        OAuth2User oauthUser = (OAuth2User) principal;
        String email = extractEmail(oauthUser);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
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

    public static class ReportSummary {
        public BigDecimal totalIncome;
        public BigDecimal totalExpenses;
        public BigDecimal totalBalance;
        public int transactionCount;
    }
}