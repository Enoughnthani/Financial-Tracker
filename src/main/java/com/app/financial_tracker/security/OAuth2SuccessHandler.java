package com.app.financial_tracker.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.time.LocalDateTime;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.app.financial_tracker.entity.User;
import com.app.financial_tracker.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = null;
        String name = null;
        String picture = null;

        if (oauthUser.getAttribute("email") != null) {
            email = oauthUser.getAttribute("email");
            name = oauthUser.getAttribute("name");
            picture = oauthUser.getAttribute("picture");
        }

        if (email == null && oauthUser.getAttribute("login") != null) {
            String login = oauthUser.getAttribute("login");
            email = login + "@github.com";
            name = oauthUser.getAttribute("name") != null ? oauthUser.getAttribute("name") : login;
            picture = oauthUser.getAttribute("avatar_url");
        }

        if (email == null) {
            email = oauthUser.getAttribute("userPrincipalName");
        }
        if (email == null) {
            email = oauthUser.getAttribute("mail");
        }
        if (name == null) {
            name = oauthUser.getAttribute("displayName");
        }

        if (email == null) {
            response.sendRedirect("/login.html?error=true");
            return;
        }

        User user = userService.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFullName(name != null ? name : email);
            user.setProfilePicture(picture);
            user.setCreatedAt(LocalDateTime.now());
        } else {
            if (name != null && !name.isEmpty()) {
                user.setFullName(name);
            }
            if (picture != null && !picture.isEmpty()) {
                user.setProfilePicture(picture);
            }
        }

        user.setLastLogin(LocalDateTime.now());
        User savedUser = userService.save(user);

        String redirectUrl = "/dashboard.html?userId=" + savedUser.getId() 
                + "&fullName=" + URLEncoder.encode(savedUser.getFullName(), "UTF-8")
                + "&email=" + URLEncoder.encode(savedUser.getEmail(), "UTF-8")
                + "&picture=" + (picture != null ? URLEncoder.encode(picture, "UTF-8") : "");

        response.sendRedirect(redirectUrl);
    }
}