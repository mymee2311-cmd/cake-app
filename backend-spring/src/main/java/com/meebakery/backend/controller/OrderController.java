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
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public Map<String, Object> getAllOrders() {
        List<Order> list = orderRepo.findAllByOrderByIdDesc();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("data", list);
        return res;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable Long id) {
        return orderRepo.findById(id).map(order -> {
            List<OrderItem> items = orderItemRepo.findByOrderId(id);
            Map<String, Object> data = new HashMap<>();
            data.put("id", order.getId());
            data.put("order_code", order.getOrderCode());
            data.put("customer_name", order.getCustomerName());
            data.put("customer_phone", order.getCustomerPhone());
            data.put("address", order.getAddress());
            data.put("payment_method", order.getPaymentMethod());
            data.put("total", order.getTotal());
            data.put("status", order.getStatus());
            data.put("created_at", order.getCreatedAt());
            data.put("items", items);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
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
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            Order saved = orderService.createOrder(payload);
            Map<String, Object> data = new HashMap<>();
            data.put("order_id", saved.getId());
            data.put("order_code", saved.getOrderCode());
            data.put("status", saved.getStatus());
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Đặt hàng thành công");
            res.put("data", data);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("error", e.getMessage());
            return ResponseEntity.status(400).body(res);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        try {
            String status = body.get("status");
            List<String> allowed = List.of(
                "pending", "pending_payment", "confirmed",
                "delivering", "completed", "cancelled"
            );
            if (!allowed.contains(status)) {
                Map<String, Object> res = new HashMap<>();
                res.put("success", false);
                res.put("error", "Trạng thái không hợp lệ");
                return ResponseEntity.badRequest().body(res);
            }
            orderService.updateStatus(id, status);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Đã cập nhật trạng thái");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("error", e.getMessage());
            return ResponseEntity.status(400).body(res);
        }
    }

    @PutMapping("/{id}/confirm-payment")
    public ResponseEntity<Map<String, Object>> confirmPayment(@PathVariable Long id) {
        return orderRepo.findById(id).map(order -> {
            if (!"pending_payment".equals(order.getStatus())) {
                Map<String, Object> res = new HashMap<>();
                res.put("success", false);
                res.put("error", "Đơn không ở trạng thái chờ nhận tiền");
                return ResponseEntity.status(404).body(res);
            }
            order.setStatus("pending");
            orderRepo.save(order);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Đã xác nhận nhận tiền");
            return ResponseEntity.ok(res);
        }).orElseGet(() -> {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("error", "Không tìm thấy đơn");
            return ResponseEntity.status(404).body(res);
        });
    }
}