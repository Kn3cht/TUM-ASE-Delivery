package com.asedelivery.deliveryservice.model;

import lombok.*;

@RequiredArgsConstructor
@Getter
@Setter
public class Address {

    @NonNull
    private String street;

    private int houseNumber;

    private int zipCode;

    @NonNull
    private String city;

    @NonNull
    private Country country;

    private String addition;

}
