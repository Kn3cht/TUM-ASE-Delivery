package com.asedelivery.messagingservice.model;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Delivery
{
	@NonNull
	private String id;
	private DeliveryStatus status;
	private String courierEmail;
	private String customerEmail;
	private String boxId;
}
