package com.meebakery.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.meebakery.backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrueOrderByIdAsc();

    List<Product> findByFeaturedTrueAndActiveTrueOrderByIdAsc();
}