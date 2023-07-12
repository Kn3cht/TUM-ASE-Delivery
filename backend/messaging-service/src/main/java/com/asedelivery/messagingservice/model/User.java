package com.asedelivery.messagingservice.model;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class User
{
	private String firstName;

	private String lastName;

	@NonNull
	private String emailAddress;
}
