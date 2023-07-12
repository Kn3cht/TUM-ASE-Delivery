package com.asedelivery.deliveryservice.dto;

import com.asedelivery.deliveryservice.model.Box;
import com.asedelivery.deliveryservice.model.Delivery;
import com.asedelivery.deliveryservice.model.User;
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
