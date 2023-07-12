package com.asedelivery.userservice.dto.users;

import com.asedelivery.userservice.model.Role;
import com.mongodb.lang.Nullable;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

@Getter
@Builder
public class GetCurrentUserDtoResponse {

    @NonNull
    private String id;

    @NonNull
    private String email;

    @NonNull
    private Role role;
}
