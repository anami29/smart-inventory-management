package com.example.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*") // Allow React to access this
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    // Get all suppliers
    @GetMapping
    public List<Supplier> getAllSuppliers(@RequestParam String shopName) { // 👈 Added parameter here
        return supplierRepository.findByShopName(shopName);
    }

    // Add a new supplier
    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // Delete a supplier
    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        supplierRepository.deleteById(id);
    }

    // 👇 NEW: Edit existing supplier
    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id, @RequestBody Supplier details) {
        return supplierRepository.findById(id).map(supplier -> {
            supplier.setName(details.getName());
            supplier.setContact(details.getContact());
            supplier.setCategory(details.getCategory());
            supplier.setDeliveryDays(details.getDeliveryDays());
            
            // 👇 Add this line
            supplier.setAddress(details.getAddress()); 
            
            supplier.setNotes(details.getNotes());
            return supplierRepository.save(supplier);
        }).orElse(null);
    }
}