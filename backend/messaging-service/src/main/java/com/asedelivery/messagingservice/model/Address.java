package com.asedelivery.messagingservice.model;

import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
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

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(this.street).append(" ");
        if (this.addition != null) {
            stringBuilder.append(this.houseNumber).append(this.addition);
        } else {
            stringBuilder.append(this.houseNumber);
        }
        stringBuilder.append(", ");
        stringBuilder.append(this.zipCode).append(" ");
        stringBuilder.append(this.city);
        return stringBuilder.toString();
    }
}
