package com.asedelivery.messagingservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.mail.MessagingException;
import java.io.IOException;

@ControllerAdvice
public class EmailExceptionHandler
{
	private static final Logger log = LoggerFactory.getLogger(EmailExceptionHandler.class);

	@ExceptionHandler(IOException.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public String handleIOException(IOException ex)
	{
		String errorMessage = "Formatting of the email body failed.";
		log.error(errorMessage, ex);
		// Don't forward the exception as it can leak user data.
		return errorMessage;
	}

	@ExceptionHandler(MessagingException.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ResponseBody
	public String handleMailException(MessagingException ex)
	{
		String errorMessage = "Sending of the email failed";
		log.error(errorMessage, ex);
		// Don't forward the exception as it can leak user data.
		return errorMessage;
	}
}
