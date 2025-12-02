package com.example.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

    @Autowired
    private SaleRepository repository;

    @Autowired
    private ProductRepository productRepository; // 👈 NOW USED!

    @Autowired
    private FileStorageService storageService;

    @GetMapping
    public List<Sale> getAllSales(@RequestParam String shopName) {
        return repository.findByShopName(shopName);
    }

    @PostMapping
    public Sale createSale(
            @RequestParam("productName") String productName,
            @RequestParam("category") String category,
            @RequestParam("soldPrice") Double soldPrice,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("shopName") String shopName,
            @RequestParam(value = "customerMobile", required = false) String customerMobile,
            @RequestParam(value = "billImage", required = false) MultipartFile billImage
    ) {
        Sale sale = new Sale();
        sale.setProductName(productName);
        sale.setCategory(category);
        sale.setSoldPrice(soldPrice);
        sale.setQuantity(quantity);
        sale.setShopName(shopName);
sale.setCustomerMobile(customerMobile);

if(customerMobile != null) {
            sale.setCustomerMobile(customerMobile.trim());
        }
        if (billImage != null && !billImage.isEmpty()) {
            String filename = storageService.save(billImage);
            sale.setBillImageUrl(filename);
        }
        

        // 👇 CRITICAL FIX: DEDUCT STOCK FROM PRODUCT
        List<Product> products = productRepository.findByShopName(shopName);
        Product product = products.stream()
                .filter(p -> p.getName().equalsIgnoreCase(productName))
                .findFirst()
                .orElse(null);

        if (product != null) {
            int newStock = product.getStockQuantity() - quantity;
            product.setStockQuantity(Math.max(0, newStock)); // Prevent negative
            product.setLastSaleDate(LocalDate.now()); // Update last active date
            productRepository.save(product);
        }
        // 👆 END FIX

        return repository.save(sale);
    }
}