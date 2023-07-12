package com.asedelivery.userservice.dto.users;

import lombok.*;

import java.util.Optional;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
public class DeleteUserResponseDto {

    @NonNull
    private Optional<String> userId;
}
