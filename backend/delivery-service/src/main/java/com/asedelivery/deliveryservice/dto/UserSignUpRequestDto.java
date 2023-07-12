package com.asedelivery.deliveryservice.dto;

import com.asedelivery.deliveryservice.model.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserSignUpRequestDto {

    @NonNull
    private String email;

    @NonNull
    private Role role;
}

