package com.meebakery.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.meebakery.backend.entity.Order;
import com.meebakery.backend.entity.OrderItem;
import com.meebakery.backend.entity.Product;
import com.meebakery.backend.repository.OrderItemRepository;
import com.meebakery.backend.repository.OrderRepository;
import com.meebakery.backend.repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private ProductRepository productRepo;

    @Transactional
    @SuppressWarnings("unchecked")
    public Order createOrder(Map<String, Object> payload) {
        List<Map<String, Object>> items =
            (List<Map<String, Object>>) payload.get("items");

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("Đơn hàng không có sản phẩm");
        }

        for (Map<String, Object> item : items) {
            Long productId = Long.valueOf(item.get("id").toString());
            Integer quantity = Integer.valueOf(item.get("quantity").toString());

            Product p = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            if (p.getStock() < quantity) {
                throw new RuntimeException("Sản phẩm " + p.getName()
                    + " chỉ còn " + p.getStock() + " trong kho");
            }
        }

        String paymentMethod = String.valueOf(payload.get("payment_method"));
        String status = "cash".equals(paymentMethod) ? "pending" : "pending_payment";

        Order order = new Order();
        order.setOrderCode(String.valueOf(payload.get("order_code")));
        order.setCustomerName(String.valueOf(payload.get("customer_name")));
        order.setCustomerPhone(String.valueOf(payload.get("customer_phone")));
        order.setAddress(String.valueOf(payload.get("address")));
        order.setPaymentMethod(paymentMethod);
        order.setTotal(Double.valueOf(payload.get("total").toString()));
        order.setStatus(status);

        Order savedOrder = orderRepo.save(order);

        for (Map<String, Object> item : items) {
            Long productId = Long.valueOf(item.get("id").toString());
            Integer quantity = Integer.valueOf(item.get("quantity").toString());

            OrderItem oi = new OrderItem();
            oi.setOrderId(savedOrder.getId());
            oi.setProductId(productId);
            oi.setProductName(String.valueOf(item.get("name")));
            oi.setPrice(Double.valueOf(item.get("price").toString()));
            oi.setQuantity(quantity);
            orderItemRepo.save(oi);

            Product p = productRepo.findById(productId).orElseThrow();
            p.setStock(p.getStock() - quantity);
            productRepo.save(p);
        }

        return savedOrder;
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if ("completed".equals(order.getStatus())) {
            throw new RuntimeException("Không thể hủy đơn đã hoàn thành");
        }

        if ("cancelled".equals(order.getStatus())) return;

        List<OrderItem> items = orderItemRepo.findByOrderId(orderId);
        for (OrderItem item : items) {
            if (item.getProductId() != null) {
                productRepo.findById(item.getProductId()).ifPresent(p -> {
                    p.setStock(p.getStock() + item.getQuantity());
                    productRepo.save(p);
                });
            }
        }

        order.setStatus("cancelled");
        orderRepo.save(order);
    }

    @Transactional
    public void updateStatus(Long orderId, String newStatus) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if ("cancelled".equals(newStatus)) {
            cancelOrder(orderId);
            return;
        }

        order.setStatus(newStatus);
        orderRepo.save(order);
    }
}