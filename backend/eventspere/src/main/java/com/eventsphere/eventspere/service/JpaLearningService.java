package com.eventsphere.eventspere.service;

import com.eventsphere.eventspere.entity.Category;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JpaLearningService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void demonstratePersistenceContext() {

        Category category = new Category();

        category.setName("Technology");
        category.setDescription("Technology-related events");

        entityManager.persist(category);

        Category managedCategory =
                entityManager.find(Category.class, category.getId());

        managedCategory.setDescription(
                "Technology conferences and workshops"
        );

        entityManager.flush();
    }
}