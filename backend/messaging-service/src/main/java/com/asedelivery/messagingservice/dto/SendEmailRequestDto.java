package com.asedelivery.messagingservice.dto;

import com.asedelivery.messagingservice.model.Box;
import com.asedelivery.messagingservice.model.Delivery;
import com.asedelivery.messagingservice.model.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SendEmailRequestDto
{
	@NonNull
	private User recipient;
	@NonNull
	private Delivery delivery;
	@NonNull
	private Box box;
}
