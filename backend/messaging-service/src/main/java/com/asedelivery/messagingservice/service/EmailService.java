package com.asedelivery.messagingservice.service;

import com.asedelivery.messagingservice.model.Box;
import com.asedelivery.messagingservice.model.Delivery;
import com.asedelivery.messagingservice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;

@Service
public class EmailService
{
	@Autowired
	private MailFormatService mailFormatter;

	@Autowired
	private JavaMailSender emailSender;

	private void createAndSendEmail(User recipient, String subject, String body) throws MessagingException
	{
		MimeMessage mimeMessage = emailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
		helper.setFrom("delivery.ase04@gmail.com");
		helper.setTo(recipient.getEmailAddress());
		helper.setSubject(subject);
		helper.setText(body, true);
		emailSender.send(mimeMessage);
	}

	/**
	 * Send an email to notify the recipient that his delivery has been collected
	 *
	 * @param recipient The user who received the delivery
	 * @param delivery  The delivery that was collected
	 * @param box The box of the delivery
	 * @throws IOException In case a required parameter for formatting is missing
	 */
	@Async
	public void sendDeliveryCollectedEmail(User recipient, Delivery delivery, Box box) throws IOException, MessagingException
	{
		String emailSubject = "Your delivery has been collected!";
		String emailBody = mailFormatter.createDeliveryCollectedMail(delivery, box);
		createAndSendEmail(recipient, emailSubject, emailBody);
	}

	/**
	 * Send an email to notify the recipient that a new delivery has been created for him
	 *
	 * @param recipient The user who will receive the delivery
	 * @param delivery  The delivery that was created
	 * @param box The box of the delivery
	 * @throws IOException In case a required parameter for formatting is missing
	 */
	@Async
	public void sendDeliveryCreatedEmail(User recipient, Delivery delivery, Box box) throws IOException, MessagingException
	{
		String emailSubject = "A new delivery has been created for you!";
		String emailBody = mailFormatter.createDeliveryCreatedMail(delivery, box);
		createAndSendEmail(recipient, emailSubject, emailBody);
	}

	/**
	 * Send an email to notify the recipient that his delivery has been delivered
	 *
	 * @param recipient The user who received the delivery
	 * @param delivery  The delivery that was delivered
	 * @param box The box of the delivery
	 * @throws IOException In case a required parameter for formatting is missing
	 */
	@Async
	public void sendDeliveryDeliveredEmail(User recipient, Delivery delivery, Box box) throws IOException, MessagingException
	{
		String emailSubject = "Your order has been delivered!";
		String emailBody = mailFormatter.createOrderDeliveredMail(delivery, box);
		createAndSendEmail(recipient, emailSubject, emailBody);
	}
}
