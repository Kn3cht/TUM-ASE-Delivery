package com.asedelivery.deliveryservice.controller;

import com.asedelivery.deliveryservice.dto.SendEmailRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient (name="messaging-service", path="/email")
public interface MessagingService {
	@PostMapping ("/delivery-collected")
	void sendDeliveryCollectedEmail(@RequestBody SendEmailRequestDto emailRequestDto);
	@PostMapping ("/delivery-created")
	void sendDeliveryCreatedEmail(@RequestBody SendEmailRequestDto emailRequestDto);
	@PostMapping ("/delivery-delivered")
	void sendDeliveryDeliveredEmail(@RequestBody SendEmailRequestDto emailRequestDto);
}
