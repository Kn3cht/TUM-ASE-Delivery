package com.asedelivery.messagingservice.model;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class Box
{
	private String id;

	private String raspberryPiId;

	@NonNull
	private Address address;

	@NonNull
	private String name;

	private Date createdAt;
	private Date updatedAt;
}
