package com.meebakery.backend.controller;

import com.meebakery.backend.entity.Order;
import com.meebakery.backend.entity.OrderItem;
import com.meebakery.backend.repository.OrderItemRepository;
import com.meebakery.backend.repository.OrderRepository;
import com.meebakery.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin (origins = "*")
public class OrderController {

    @Autowired 
    private OrderRepository orderRepo;

    @Autowired 
    private OrderItemRepository orderItemRepo;

    @Autowired 
    private OrderService orderService;

    @GetMapping 
    public Map<String, Object> getAllOrders() {
        List<Order> list = orderRepo.findAllByOrdersByIdDesc();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", list);
        return res;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariablie Long id) {
        return orderRepo.findById(id).map(order -> {
            List<OrderItem> items = orderItemRepo.findByOrderId(id);
            Map<String, Object> data = new HashMap<> ();
            data.put ("id", order.getId());
            data.put ("order_code", order.getOrderCode());
            data.put ("customer_name", order.getCustomerName());
            data.put ("customer_phone", order.getCustomerPhone());
            data.put ("address", order.getAddress());
            data.put ("payment_method", order.getPaymentMethod());
            data.put ("total", order.getTotal());
            data.put ("status", order.getStatus());
            data.put ("created-at", order.getCreatedAt());
            data.put ("items", items);
            Map<String, Object> res = new HashMap<>();
            res.put("Success", true);
            res.put("data", data);
            return ResponseEntity.ok(res);        
        }).orElseGet(() -> {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("error", "Không tìm thấy đơn");
            return ResponseEntity.status(404).body(res);
        });
    }

    @PostMapping 
    public ResponseEntity<Map<String, Object>> createOrder (@RequestBody <Map<String, Object>> Payload) {

    }

}