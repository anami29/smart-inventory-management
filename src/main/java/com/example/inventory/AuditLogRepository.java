package com.example.inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // 👇 Custom query to filter by shop
    List<AuditLog> findByShopName(String shopName);
}