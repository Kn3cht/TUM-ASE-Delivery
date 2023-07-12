package com.asedelivery.deliveryservice.dto.box;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class BoxRequestDto
{
	@NonNull
	private String boxId;
	@NonNull
	private String userId;
}
