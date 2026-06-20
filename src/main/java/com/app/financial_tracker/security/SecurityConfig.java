package com.app.financial_tracker.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2SuccessHandler successHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        log.info("🔒 Configuring Security...");

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/login.html",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/webjars/**",
                    "/oauth2/**",
                    "/login/**"
                ).permitAll()
                .anyRequest().authenticated()
            )

            .oauth2Login(oauth -> {
                oauth.loginPage("/login.html");
                oauth.successHandler(successHandler);
                oauth.failureUrl("/login.html?error=true");
                log.info("✅ OAuth2 Login configured with custom success handler");
            })

            .logout(logout -> {
                logout.logoutSuccessUrl("/index.html");
                logout.invalidateHttpSession(true);
                logout.deleteCookies("JSESSIONID");
                log.info("✅ Logout configured");
            });

        log.info("✅ Security configuration complete");
        return http.build();
    }
}