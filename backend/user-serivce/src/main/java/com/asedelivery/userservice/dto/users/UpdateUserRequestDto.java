package com.asedelivery.userservice.dto.users;

import com.asedelivery.userservice.model.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

@Builder
@Getter
public class UpdateUserRequestDto {

    @NonNull
    private String id;

    @NonNull
    private String password;

    @NonNull
    private Role role;
}
