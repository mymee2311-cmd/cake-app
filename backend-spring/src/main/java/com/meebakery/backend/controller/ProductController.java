package com.meebakery.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meebakery.backend.entity.Product;
import com.meebakery.backend.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    @GetMapping
    public Map<String, Object> getAllProducts() {
        List<Product> list = productRepo.findByActiveTrueOrderByIdAsc();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", list);
        return res;
    }

    @GetMapping("/featured")
    public Map<String, Object> getFeaturedProducts() {
        List<Product> list = productRepo.findByFeaturedTrueAndActiveTrueOrderByIdAsc();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", list);
        return res;
    }
}