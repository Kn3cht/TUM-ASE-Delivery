package com.asedelivery.deliveryservice.controller;

import com.asedelivery.deliveryservice.dto.UserSignUpRequestDto;
import com.asedelivery.deliveryservice.dto.UserSignUpResponseDto;
import com.asedelivery.deliveryservice.model.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="user-service", path="/users")
public interface UserService
{
	@PostMapping
	ResponseEntity<UserSignUpResponseDto> signUp(@RequestBody UserSignUpRequestDto user);

	@GetMapping ("/{id}")
	ResponseEntity<User> getUser(@PathVariable ("id") String id);
}
