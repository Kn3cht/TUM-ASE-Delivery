package com.asedelivery.deliveryservice.dto.delivery;

import com.asedelivery.deliveryservice.model.Delivery;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class DeliveryDto {
	@NonNull
	private Delivery delivery;
	@NonNull
	private String trackUrl;
}
