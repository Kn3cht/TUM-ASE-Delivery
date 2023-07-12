package com.asedelivery.userservice.dto.users;

import com.asedelivery.userservice.model.Role;
import com.mongodb.lang.Nullable;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

@Builder
@Getter
public class RegisterUserRequestDto {

    @NonNull
    private String email;

    @NonNull
    private String password;

    @NonNull
    private Role role;
}
