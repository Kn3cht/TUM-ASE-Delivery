package com.asedelivery.userservice.dto.users;

import com.asedelivery.userservice.dto.users.GetCurrentUserDtoResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegisterUserResponseDto {
    GetCurrentUserDtoResponse currentUserDtoResponse;
}
