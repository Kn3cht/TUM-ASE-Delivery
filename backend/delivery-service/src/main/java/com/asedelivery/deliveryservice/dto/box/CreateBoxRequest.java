package com.asedelivery.deliveryservice.dto.box;

import com.asedelivery.deliveryservice.model.Address;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

@Getter
@Builder
public class CreateBoxRequest {

    @NonNull
    private String raspberryPiId;

    @NonNull
    private Address address;

    @NonNull
    private String name;
}
