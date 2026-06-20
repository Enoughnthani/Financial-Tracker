package com.app.financial_tracker.controller;


import java.time.LocalDateTime;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.app.financial_tracker.entity.AIInsight;
import com.app.financial_tracker.service.AIInsightService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/insights")
@RequiredArgsConstructor
public class InsightsController {

    private final AIInsightService insightService;

    @GetMapping
    public String insights(Model model) {
        if (insightService.findAll().isEmpty()) {
            createSampleInsights();
        }
        model.addAttribute("insights", insightService.findAll());
        return "ai-insights";
    }

    private void createSampleInsights() {
        AIInsight insight1 = new AIInsight();
        insight1.setTitle("💰 Smart Savings Tip");
        insight1.setMessage("You could save an extra $100/month by reducing dining out. Consider meal prepping on weekends!");
        insight1.setType("TIP");
        insight1.setPriority("HIGH");
        insight1.setIsRead(false);
        insight1.setGeneratedAt(LocalDateTime.now());
        insightService.save(insight1);

        AIInsight insight2 = new AIInsight();
        insight2.setTitle("📈 Investment Opportunity");
        insight2.setMessage("Based on your savings pattern, you're ready to start investing. Consider index funds for long-term growth.");
        insight2.setType("OPPORTUNITY");
        insight2.setPriority("MEDIUM");
        insight2.setIsRead(false);
        insight2.setGeneratedAt(LocalDateTime.now().minusDays(2));
        insightService.save(insight2);

        AIInsight insight3 = new AIInsight();
        insight3.setTitle("⚠️ Budget Warning");
        insight3.setMessage("Your 'Entertainment' budget is 90% used with 12 days remaining. Consider reducing entertainment spending.");
        insight3.setType("WARNING");
        insight3.setPriority("HIGH");
        insight3.setIsRead(false);
        insight3.setGeneratedAt(LocalDateTime.now().minusDays(5));
        insightService.save(insight3);
    }

    @GetMapping("/mark-read/{id}")
    public String markRead(@PathVariable Long id) {
        AIInsight insight = insightService.findById(id);
        insight.setIsRead(true);
        insightService.save(insight);
        return "redirect:/insights";
    }
}