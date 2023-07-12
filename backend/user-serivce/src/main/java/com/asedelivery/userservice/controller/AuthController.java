package com.asedelivery.userservice.controller;

import com.asedelivery.userservice.dto.auth.UserAuthenticationResponse;
import com.asedelivery.userservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/csrf")
    public ResponseEntity<Boolean> getCSRFToken() {
        return ResponseEntity.ok(true);
    }

    @PostMapping("/login")
    public ResponseEntity<UserAuthenticationResponse> authenticateUser(Authentication authentication, HttpServletResponse response) throws Exception {
        String email;
        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else {
            email = authentication.getPrincipal().toString();
        }

        //Get the jwt token from the authorization service
        ResponseEntity<String> responseEntity = authService.authenticateUser(email);
        String jwt = responseEntity.getBody();

        //Create a cookie which contains the jwt token
        Cookie jwtCookie = new Cookie("jwt", jwt);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(5 * 60 * 60); //Expiration 5h, same as for jwt token, measured here in seconds

        //Add the cookie to the response object
        response.addCookie(jwtCookie);

        UserAuthenticationResponse authResponse = new UserAuthenticationResponse(Optional.of(jwt));

        return ResponseEntity.ok(authResponse);
    }
}
