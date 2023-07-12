package com.asedelivery.deliveryservice.dto.delivery;

import lombok.*;

import java.util.Optional;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
public class DeleteDeliveryResponseDto {

    @NonNull
    private Optional<String> deletedDeliveryId;
}
