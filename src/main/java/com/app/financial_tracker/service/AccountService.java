package com.app.financial_tracker.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.financial_tracker.dto.AccountRequest;
import com.app.financial_tracker.dto.AccountResponse;
import com.app.financial_tracker.entity.Account;
import com.app.financial_tracker.entity.AccountType;
import com.app.financial_tracker.entity.User;
import com.app.financial_tracker.repository.AccountRepository;
import com.app.financial_tracker.repository.AccountTypeRepository;
import com.app.financial_tracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final UserRepository userRepository;

    @Transactional
    public AccountResponse createAccount(AccountRequest request, Authentication authentication) {
        validateAccount(request);
        User user = getAuthenticatedUser(authentication);

        AccountType accountType = new AccountType();
        accountType.setType(request.getAccountType().getName());
        accountTypeRepository.save(accountType);

        Account account = new Account();
        account.setAccountName(request.getAccountName().trim());
        account.setBalance(request.getBalance());
        account.setAccountType(accountType);
        account.setCreatedAt(LocalDateTime.now());
        account.setUser(user);

        Account saved = accountRepository.save(account);
        return toResponse(saved);
    }

    @Transactional
    public AccountResponse updateAccount(Long id, AccountRequest request) {
        Account existing = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));

        if (request.getAccountName() != null && !request.getAccountName().trim().isEmpty()) {
            existing.setAccountName(request.getAccountName().trim());
        }

        if (request.getBalance() != null && request.getBalance().compareTo(BigDecimal.ZERO) >= 0) {
            existing.setBalance(request.getBalance());
        }

        if (request.getAccountType() != null) {
            AccountType accountType = new AccountType();
            accountType.setType(request.getAccountType().getName());
            accountTypeRepository.save(accountType);
            existing.setAccountType(accountType);
        }

        Account updated = accountRepository.save(existing);
        return toResponse(updated);
    }

    @Transactional
    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
        accountRepository.delete(account);
    }

    public AccountResponse findAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
        return toResponse(account);
    }

    public List<AccountResponse> findAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AccountResponse> findAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
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

    private void validateAccount(AccountRequest request) {
        if (request.getAccountName() == null || request.getAccountName().trim().isEmpty()) {
            throw new IllegalArgumentException("Account name is required");
        }
        if (request.getBalance() == null) {
            throw new IllegalArgumentException("Balance is required");
        }
        if (request.getBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Balance cannot be negative");
        }
        if (request.getAccountType() == null || request.getAccountType().getName() == null) {
            throw new IllegalArgumentException("Account type is required");
        }
    }

    private AccountResponse toResponse(Account account) {
        AccountResponse response = new AccountResponse();
        response.setId(account.getId());
        response.setAccountName(account.getAccountName());
        response.setBalance(account.getBalance());
        response.setCreatedAt(account.getCreatedAt());

        if (account.getUser() != null) {
            response.setUserId(account.getUser().getId());
        }

        if (account.getAccountType() != null) {
            AccountResponse.AccountTypeDTO typeDTO = new AccountResponse.AccountTypeDTO();
            typeDTO.setId(account.getAccountType().getId());
            typeDTO.setName(account.getAccountType().getType());
            response.setAccountType(typeDTO);
        }

        return response;
    }
}