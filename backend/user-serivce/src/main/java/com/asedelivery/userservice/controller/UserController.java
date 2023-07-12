package com.asedelivery.userservice.controller;

import com.asedelivery.userservice.dto.users.DeleteUserResponseDto;
import com.asedelivery.userservice.dto.users.GetCurrentUserDtoResponse;
import com.asedelivery.userservice.dto.users.RegisterUserRequestDto;
import com.asedelivery.userservice.model.AseUser;
import com.asedelivery.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @GetMapping("/current")
    public ResponseEntity<GetCurrentUserDtoResponse> getCurrentUser() {

        Optional<AseUser> aseUserOptional = userService.findCurrentUser();
        if (aseUserOptional.isPresent()) {
            AseUser aseUser = aseUserOptional.get();
            GetCurrentUserDtoResponse response = GetCurrentUserDtoResponse
                    .builder()
                    .id(aseUser.getId())
                    .email(aseUser.getEmail())
                    .role(aseUser.getRole()).build();
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<AseUser> registerUser(@RequestBody RegisterUserRequestDto newUser) {

        // catch duplicate key errors
        if (userService.findUserByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        AseUser newAseUser = AseUser.builder()
                .role(newUser.getRole()).email(newUser.getEmail()).password((bCryptPasswordEncoder.encode(newUser.getPassword()))).build();

        return ResponseEntity.ok(userService.createUser(newAseUser));
    }

    @GetMapping
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<List<GetCurrentUserDtoResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers().stream().map(user -> GetCurrentUserDtoResponse.builder().email(user.getEmail()).id(user.getId()).role(user.getRole()).build()).collect(Collectors.toList()));
    }

    @GetMapping("{email}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<GetCurrentUserDtoResponse> getUserByEmail(@PathVariable("email") String email) {
        return ResponseEntity.ok(userService.findUserByEmail(email).stream().map((user -> GetCurrentUserDtoResponse.builder().email(user.getEmail()).id(user.getId()).role(user.getRole()).build())).findFirst().get());
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<AseUser> updateUser(@PathVariable("id") String id, @RequestBody AseUser user) {
        if (id == null || user == null || user.getId() == null || !id.equals(user.getId())) {
            return ResponseEntity.badRequest().body(null);
        }

        //Encrypt the password which could have changed
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        //Update user
        Optional<AseUser> updatedUser = userService.updateUser(user);
        return updatedUser.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.badRequest().body(null));
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<DeleteUserResponseDto> deleteUser(@PathVariable("id") String id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Optional<String> deletedUserOptional = userService.deleteUser(id);
        if (deletedUserOptional.isPresent()) {
            return ResponseEntity.ok(new DeleteUserResponseDto(deletedUserOptional));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new DeleteUserResponseDto(Optional.empty()));
    }
}
