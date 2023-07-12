package com.asedelivery.deliveryservice.dto;

import com.asedelivery.deliveryservice.model.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

@Getter
@Builder
public class UserSignUpResponseDto {

    @NonNull
    private User user;

    @NonNull
    private String token;
}
