package com.meebakery.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.meebakery.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrdersByIdDesc();
}
