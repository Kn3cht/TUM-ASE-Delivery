package com.asedelivery.deliveryservice.dto.box;

import lombok.*;

import java.util.Optional;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
public class DeleteBoxResponseDto {

    @NonNull
    private Optional<String> deletedBoxId;
}
