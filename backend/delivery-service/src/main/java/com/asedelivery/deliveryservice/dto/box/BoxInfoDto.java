package com.asedelivery.deliveryservice.dto.box;

import com.asedelivery.deliveryservice.model.Address;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BoxInfoDto
{
	@NonNull
	private String boxId;
	@NonNull
	private String raspberryPiId;
	@NonNull
	private String name;
	@NonNull
	private Address address;
}
