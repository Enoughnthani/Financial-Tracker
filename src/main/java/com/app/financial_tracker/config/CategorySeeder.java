package com.app.financial_tracker.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.app.financial_tracker.entity.TransactionCategory;
import com.app.financial_tracker.repository.TransactionCategoryRepository;

@Component
public class CategorySeeder implements CommandLineRunner {

    private final TransactionCategoryRepository repository;

    public CategorySeeder(TransactionCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {

        if (repository.count() == 0) {

            repository.save(new TransactionCategory("Food"));
            repository.save(new TransactionCategory("Transport"));
            repository.save(new TransactionCategory("Rent"));
            repository.save(new TransactionCategory("Salary"));
            repository.save(new TransactionCategory("Other"));
        }
    }
}