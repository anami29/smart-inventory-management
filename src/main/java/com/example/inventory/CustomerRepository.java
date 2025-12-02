package com.example.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    // 👇 1. Find all customers belonging to a specific shop
    List<Customer> findByShopName(String shopName);

    // 👇 2. Find a specific customer by Mobile, BUT only within that shop
    // (Prevents updating the wrong shop's customer if they have the same number)
    Optional<Customer> findByMobileAndShopName(String mobile, String shopName);
}