package com.asedelivery.messagingservice.controller;

import com.asedelivery.messagingservice.dto.SendEmailRequestDto;
import com.asedelivery.messagingservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import java.io.IOException;

@RestController
@RequestMapping("/email")
public class EmailController
{
	@Autowired
	private EmailService emailService;

	@RequestMapping(value = "/delivery-collected", method = RequestMethod.POST)
	public void sendDeliveryCollectedEmail(@RequestBody SendEmailRequestDto emailRequestDto) throws IOException, MessagingException
	{
		emailService.sendDeliveryCollectedEmail(emailRequestDto.getRecipient(), emailRequestDto.getDelivery(), emailRequestDto.getBox());
	}

	@RequestMapping(value = "/delivery-created", method = RequestMethod.POST)
	public void sendDeliveryCreatedEmail(@RequestBody SendEmailRequestDto emailRequestDto) throws IOException, MessagingException
	{
		emailService.sendDeliveryCreatedEmail(emailRequestDto.getRecipient(), emailRequestDto.getDelivery(), emailRequestDto.getBox());
	}

	@RequestMapping(value = "/delivery-delivered", method = RequestMethod.POST)
	public void sendDeliveryDeliveredEmail(@RequestBody SendEmailRequestDto emailRequestDto) throws IOException, MessagingException
	{
		emailService.sendDeliveryDeliveredEmail(emailRequestDto.getRecipient(), emailRequestDto.getDelivery(), emailRequestDto.getBox());
	}
}
