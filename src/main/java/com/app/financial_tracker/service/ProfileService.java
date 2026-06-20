package com.app.financial_tracker.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.app.financial_tracker.dto.PreferencesRequest;
import com.app.financial_tracker.dto.UserResponse;
import com.app.financial_tracker.dto.UserUpdateRequest;
import com.app.financial_tracker.entity.Currency;
import com.app.financial_tracker.entity.User;
import com.app.financial_tracker.entity.UserPreference;
import com.app.financial_tracker.repository.CurrencyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserService userService;
    private final UserPreferenceService preferenceService;
    private final CurrencyRepository currencyRepository;

    public UserResponse getProfile(Authentication authentication) {
        String email = extractEmail(authentication);
        User user = userService.findByEmail(email);
        return toResponse(user);
    }

    public UserResponse updateProfile(UserUpdateRequest request, Authentication authentication) {
        String email = extractEmail(authentication);
        User existing = userService.findByEmail(email);

        if (request.getFullName() != null) {
            existing.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            existing.setEmail(request.getEmail());
        }

        User updated = userService.save(existing);
        return toResponse(updated);
    }

    public PreferencesRequest updatePreferences(PreferencesRequest request, Authentication authentication) {
        String email = extractEmail(authentication);
        User user = userService.findByEmail(email);
        PreferencesRequest response = new PreferencesRequest();

        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }

        UserPreference pref = user.getUserPreference();
        if (pref == null) {
            pref = new UserPreference();
            pref.setUser(user);
        }

        if (request.getTheme() != null) {
            pref.setTheme(request.getTheme());
        }
        if (request.getNotifications() != null) {
            pref.setNotificationsEnabled(request.getNotifications());
        }
        if (request.getCurrencyCode() != null) {

            Currency currency = pref.getCurrency();

            if (pref.getCurrency() == null) {
                currency = new Currency(request.getCurrencyCode());
            }else{
                currency.setCurrencyCode(request.getCurrencyCode());
            }

            currencyRepository.save(currency);
            pref.setCurrency(currency);
        }

        preferenceService.save(pref);

        response.setTheme(pref.getTheme());
        response.setNotifications(pref.getNotificationsEnabled());
        if (pref.getCurrency() != null) {
            response.setCurrencyCode(pref.getCurrency().getCurrencyCode());
        }

        return response;
    }

    private String extractEmail(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof OAuth2User)) {
            throw new RuntimeException("Not an OAuth2 user");
        }

        OAuth2User oauthUser = (OAuth2User) principal;
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

    private UserResponse toResponse(User user) {
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setProfilePicture(user.getProfilePicture());

        if (user.getUserPreference() != null) {
            response.setTheme(user.getUserPreference().getTheme());
            response.setNotificationsEnabled(user.getUserPreference().getNotificationsEnabled());
            if (user.getUserPreference().getCurrency() != null) {
                response.setCurrencyCode(user.getUserPreference().getCurrency().getCurrencyCode());
            }
        }

        return response;
    }
}