package com.app.financial_tracker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.app.financial_tracker.dto.PreferencesRequest;
import com.app.financial_tracker.dto.UserResponse;
import com.app.financial_tracker.dto.UserUpdateRequest;
import com.app.financial_tracker.entity.User;
import com.app.financial_tracker.entity.UserPreference;
import com.app.financial_tracker.repository.UserRepository;
import com.app.financial_tracker.repository.UserPreferenceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository preferenceRepository;

    public List<UserResponse> findAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse findUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    public UserResponse findUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof OAuth2User)) {
            throw new RuntimeException("Not an OAuth2 user");
        }

        OAuth2User oauthUser = (OAuth2User) principal;
        String email = extractEmail(oauthUser);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toResponse(user);
    }

    public UserResponse updateCurrentUser(UserUpdateRequest request, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof OAuth2User)) {
            throw new RuntimeException("Not an OAuth2 user");
        }

        OAuth2User oauthUser = (OAuth2User) principal;
        String email = extractEmail(oauthUser);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        User updated = userRepository.save(user);
        return toResponse(updated);
    }

    public PreferencesRequest savePreferences(PreferencesRequest request, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof OAuth2User)) {
            throw new RuntimeException("Not an OAuth2 user");
        }

        OAuth2User oauthUser = (OAuth2User) principal;
        String email = extractEmail(oauthUser);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserPreference preference = user.getUserPreference();
        if (preference == null) {
            preference = new UserPreference();
            preference.setUser(user);
        }

        if (request.getTheme() != null) {
            preference.setTheme(request.getTheme());
        }
   

        preferenceRepository.save(preference);
        PreferencesRequest response = new PreferencesRequest();
        response.setTheme(preference.getTheme());

        return response;
    }

    public UserResponse createUser(UserUpdateRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        User updated = userRepository.save(user);
        return toResponse(updated);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
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
            throw new RuntimeException("No email found");
        }
        return email;
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setProfilePicture(user.getProfilePicture());
        return response;
    }
}