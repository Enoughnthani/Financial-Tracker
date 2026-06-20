package com.app.financial_tracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.financial_tracker.service.ReportsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

        private final ReportsService reportsService;

        @GetMapping("/summary")
        public ResponseEntity<ReportsService.ReportSummary> getReportSummary(Authentication authentication) {
                return ResponseEntity.ok(reportsService.getReportSummary(authentication));
        }
}