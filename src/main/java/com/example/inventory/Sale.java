package com.example.inventory;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private String category;
    private Double soldPrice;
    private Integer quantity;
    private LocalDateTime saleDate;
    private String billImageUrl;
    private String shopName;

    // 👇 THIS IS CRITICAL - IT LINKS THE SALE TO THE CUSTOMER
    private String customerMobile; 

    public Sale() { this.saleDate = LocalDateTime.now(); }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getSoldPrice() { return soldPrice; }
    public void setSoldPrice(Double soldPrice) { this.soldPrice = soldPrice; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public LocalDateTime getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDateTime saleDate) { this.saleDate = saleDate; }
    public String getBillImageUrl() { return billImageUrl; }
    public void setBillImageUrl(String billImageUrl) { this.billImageUrl = billImageUrl; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    // 👇 Getter & Setter for Customer Mobile
    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }
}