package com.meebakery.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.meebakery.backend.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByOrderByIdAsc();
}