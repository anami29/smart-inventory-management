package com.example.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // 👈 THIS WAS MISSING

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Spring Boot writes all the SQL for us here automatically!
    List<Product> findByShopName(String shopName);
}