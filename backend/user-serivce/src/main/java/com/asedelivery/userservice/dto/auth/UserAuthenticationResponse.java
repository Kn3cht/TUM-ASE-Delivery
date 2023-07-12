package com.asedelivery.userservice.dto.auth;

import lombok.*;

import java.util.Optional;


@Getter
@Setter
@Builder
@RequiredArgsConstructor
public class UserAuthenticationResponse {
    @NonNull
    private Optional<String> token;
}
