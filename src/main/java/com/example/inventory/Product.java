package com.example.inventory;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double price;
    private Integer stockQuantity;
    private String description;
    
    // Dates
    private LocalDate warrantyDate;
    private LocalDate lastPurchaseDate;
    private LocalDate lastSaleDate; 

    // Supplier Info
    private String supplierName;
    private String supplierContact;
    
    // 👇 FIXED: Changed from Integer to String to fix the "JSON Parse Error"
    private String deliveryDays; 

    // Other features
    private String billImageUrl;    
    private Integer soldCount = 0; 
    
    // 👇 Multi-User Support
    private String shopName;

    // --- CONSTRUCTORS ---
    public Product() {}

    // --- GETTERS AND SETTERS (Standard Java - Always works) ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getWarrantyDate() { return warrantyDate; }
    public void setWarrantyDate(LocalDate warrantyDate) { this.warrantyDate = warrantyDate; }

    public LocalDate getLastPurchaseDate() { return lastPurchaseDate; }
    public void setLastPurchaseDate(LocalDate lastPurchaseDate) { this.lastPurchaseDate = lastPurchaseDate; }

    public LocalDate getLastSaleDate() { return lastSaleDate; }
    public void setLastSaleDate(LocalDate lastSaleDate) { this.lastSaleDate = lastSaleDate; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getSupplierContact() { return supplierContact; }
    public void setSupplierContact(String supplierContact) { this.supplierContact = supplierContact; }

    // 👇 UPDATED TO STRING
    public String getDeliveryDays() { return deliveryDays; }
    public void setDeliveryDays(String deliveryDays) { this.deliveryDays = deliveryDays; }

    public String getBillImageUrl() { return billImageUrl; }
    public void setBillImageUrl(String billImageUrl) { this.billImageUrl = billImageUrl; }

    public Integer getSoldCount() { return soldCount; }
    public void setSoldCount(Integer soldCount) { this.soldCount = soldCount; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
}