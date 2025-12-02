package com.example.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerRepository repository;

    @GetMapping
    public List<Customer> getAllCustomers(@RequestParam String shopName) {
        return repository.findByShopName(shopName);
    }

    @PostMapping
    public Customer updateCustomer(@RequestBody Customer data) {
        Optional<Customer> existing = repository.findByMobileAndShopName(data.getMobile(), data.getShopName());
        
        if (existing.isPresent()) {
            Customer c = existing.get();
            c.setName(data.getName());
            c.setEmail(data.getEmail());
            c.setAddress(data.getAddress());
            c.setLastPurchase(LocalDateTime.now());
            
            // 👇 DEBUG PRINT
            System.out.println("Updating Customer: " + c.getName());
            System.out.println("Old Orders: " + c.getTotalOrders());
            
            // 👇 FORCE INCREMENT
            c.setTotalOrders(c.getTotalOrders() + 1);
            c.setTotalSpent(c.getTotalSpent() + data.getTotalSpent());
            
            System.out.println("New Orders: " + c.getTotalOrders());
            
            return repository.save(c);
        } else {
            System.out.println("Creating New Customer: " + data.getName());
            data.setLastPurchase(LocalDateTime.now());
            data.setTotalOrders(1); // Start at 1
            return repository.save(data);
        }
    }
}