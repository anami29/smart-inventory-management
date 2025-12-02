package com.example.inventory;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
public class User {
    @Id
    private String username;
    private String password;
    private String role;
    private String shopName;
    
    // 👇 NEW FIELD
    private String mobile;

    // Getters & Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    
    // 👇 NEW GETTER/SETTER
    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
}