package com.app.financial_tracker.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    @GetMapping("/principal")
    public ResponseEntity<Map<String, Object>> debugPrincipal(Principal principal, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();

        result.put("principalName", principal != null ? principal.getName() : "null");
        result.put("principalClass", principal != null ? principal.getClass().getName() : "null");

        if (authentication != null) {
            result.put("authName", authentication.getName());
            result.put("authPrincipalClass", authentication.getPrincipal().getClass().getName());
            result.put("authenticated", authentication.isAuthenticated());

            if (authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
                result.put("oauthEmail", oauthUser.getAttribute("email"));
                result.put("oauthName", oauthUser.getAttribute("name"));
                result.put("oauthAttributes", oauthUser.getAttributes().keySet());
            }
        }

        return ResponseEntity.ok(result);
    }

}