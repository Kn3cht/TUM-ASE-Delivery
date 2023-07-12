package com.asedelivery.userservice.service;

import com.asedelivery.userservice.jwt.JwtUtil;
import com.asedelivery.userservice.model.AseUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<String> authenticateUser(String email) {
        Optional<AseUser> aseUser = userService.findUserByEmail(email);
        if (aseUser.isPresent()) {
            final String jwt = jwtUtil.generateToken(aseUser.get());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        } else {
            return ResponseEntity.badRequest().body(null);
        }

    }
}
