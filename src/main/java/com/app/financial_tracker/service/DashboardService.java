package com.app.financial_tracker.service;

import java.math.BigDecimal;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.app.financial_tracker.entity.User;
import com.app.financial_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;

    public DashboardSummary getDashboardSummary(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        DashboardSummary summary = new DashboardSummary();

        summary.accountsCount = user.getAccounts().size();
        summary.transactionsCount = user.getAccounts().stream()
                .flatMap(a -> a.getTransactions().stream())
                .count();
        summary.goalsCount = user.getGoals().size();
        summary.activeGoalsCount = user.getGoals().stream()
                .filter(g -> "ACTIVE".equals(g.getStatus()))
                .count();

        summary.totalBalance = user.getAccounts().stream()
                .map(a -> a.getBalance() != null ? a.getBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        summary.totalIncome = user.getAccounts().stream()
                .flatMap(a -> a.getTransactions().stream())
                .filter(t -> "INCOME".equals(t.getTransactionType().getName()))
                .map(t -> t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        summary.totalExpenses = user.getAccounts().stream()
                .flatMap(a -> a.getTransactions().stream())
                .filter(t -> "EXPENSE".equals(t.getTransactionType().getName()))
                .map(t -> t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

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

        return userRepository.findByEmail(email).orElse(null);
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

    public static class DashboardSummary {
        public long accountsCount;
        public long transactionsCount;
        public long goalsCount;
        public long activeGoalsCount;
        public BigDecimal totalBalance;
        public BigDecimal totalIncome;
        public BigDecimal totalExpenses;
    }
}