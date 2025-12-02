package com.example.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditLogController {

    @Autowired
    private AuditLogRepository repository;

    // 👇 UPDATED: Filter logs by Shop Name
    @GetMapping
    public List<AuditLog> getLogs(@RequestParam String shopName) {
        return repository.findByShopName(shopName);
    }

    // 👇 UPDATED: Save the shopName
    @PostMapping
    public AuditLog createLog(@RequestBody AuditLog log) {
        log.setId(null); 
        log.setTimestamp(LocalDateTime.now());
        // shopName is passed in the RequestBody from React
        return repository.save(log);
    }
}