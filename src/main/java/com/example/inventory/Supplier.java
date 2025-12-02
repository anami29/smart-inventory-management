package com.example.inventory;

import jakarta.persistence.*;

@Entity
public class Supplier {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String contact;
    
    // 👇 CHANGE THIS LINE (was Integer, now String)
    private String deliveryDays; 
    private String address;
    private String notes;
    private String shopName; // 👈 ADD THIS

    public Supplier() {}

    public Supplier(String name, String category, String contact, String deliveryDays, String notes) {
        this.name = name;
        this.category = category;
        this.contact = contact;
        this.deliveryDays = deliveryDays;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    // 👇 UPDATE GETTER return type to String
    public String getDeliveryDays() { return deliveryDays; }
    
    // 👇 UPDATE SETTER parameter type to String
    public void setDeliveryDays(String deliveryDays) { this.deliveryDays = deliveryDays; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // 👇 NEW GETTER & SETTER FOR ADDRESS
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    
}