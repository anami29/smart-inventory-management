package com.example.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository repository;

    @GetMapping
    public List<Product> getAllProducts(@RequestParam String shopName) {
        return repository.findByShopName(shopName);
    }

    // 👇 UPDATED: Save product with the shop name
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        // Ensure shopName is saved
        return repository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        repository.deleteById(id);
    }
}