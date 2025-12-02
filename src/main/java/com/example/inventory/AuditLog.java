package com.example.inventory;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userRole;
    private String action;
    private String details;
    private LocalDateTime timestamp;

    @Version
    private Integer version; 

    // 👇 NEW FIELD: To separate logs by shop
    private String shopName;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    // 👇 Add Getter/Setter for shopName
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
}