package com.asedelivery.deliveryservice.dto.delivery;

import lombok.*;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
public class UpdateDeliveryDto {

    @NonNull
    private String id;

    @NonNull
    private String courierEmail;

    @NonNull
    private String customerEmail;

    @NonNull
    private String boxId;
}
