package com.mycompany.app.controller;

import com.mycompany.app.model.User;
import com.mycompany.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User loginRequest) {
        Map<String, String> response = new HashMap<>();

        User user = userRepository.findByUsername(loginRequest.getUsername());
        if (user == null) {
            response.put("message", "User not found!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        if (user.getPassword().equals(loginRequest.getPassword())) {
            response.put("message", "Login successful!");
            response.put("role", user.getRole());
            response.put("username", user.getUsername());
            response.put("userId", String.valueOf(user.getUser_id()));
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Incorrect password!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

}
