package com.example.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository repository;

    // Temporary OTP Storage (Mobile -> OTP)
    private Map<String, String> otpStorage = new ConcurrentHashMap<>();

    // 1. SEND OTP
    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String mobile) {
        // Generate 4-digit random OTP
        String otp = String.format("%04d", new Random().nextInt(10000));
        
        // Store it temporarily
        otpStorage.put(mobile, otp);
        
        // 🖨️ SIMULATE SMS SENDING (Check your Java Console!)
        System.out.println("------------------------------------------------");
        System.out.println("📲 SMS TO " + mobile + ": Your OTP is " + otp);
        System.out.println("------------------------------------------------");
        
        return "OTP Sent";
    }

    // 2. VERIFY OTP
    @PostMapping("/verify-otp")
    public boolean verifyOtp(@RequestBody Map<String, String> data) {
        String mobile = data.get("mobile");
        String otp = data.get("otp");
        
        if (otpStorage.containsKey(mobile) && otpStorage.get(mobile).equals(otp)) {
            otpStorage.remove(mobile); // Clear after use
            return true;
        }
        return false;
    }

    @PostMapping("/login")
    public User login(@RequestBody User loginData) {
        User user = repository.findById(loginData.getUsername()).orElse(null);
        if (user != null && user.getPassword().equals(loginData.getPassword())) {
            return user;
        }
        return null; 
    }

    @PostMapping("/register")
    public User register(@RequestBody User newUser) {
        if(repository.existsById(newUser.getUsername())) return null; 
        newUser.setRole("admin"); 
        return repository.save(newUser);
    }

    @PostMapping("/add")
    public User addStaff(@RequestBody User staff) {
        if(repository.existsById(staff.getUsername())) return null;
        return repository.save(staff);
    }

    @GetMapping
    public List<User> getAllUsers() { return repository.findAll(); }

    @DeleteMapping("/{username}")
    public void deleteUser(@PathVariable String username) { repository.deleteById(username); }

    // 👇 1. SECURITY CHECK: Verify Admin Password
    @PostMapping("/verify-password")
    public boolean verifyPassword(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");
        User user = repository.findById(username).orElse(null);
        return user != null && user.getPassword().equals(password);
    }

    // 👇 2. UPDATE PASSWORD: Save new password to DB
    @PutMapping("/update-password/{username}")
    public void updatePassword(@PathVariable String username, @RequestBody String newPassword) {
        repository.findById(username).ifPresent(user -> {
            user.setPassword(newPassword);
            repository.save(user);
        });
    }
}