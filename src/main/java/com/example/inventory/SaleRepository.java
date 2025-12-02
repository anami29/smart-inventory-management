package com.example.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    // Automation magic happens here
    List<Sale> findByShopName(String shopName); // 👈 ADD THIS
}
