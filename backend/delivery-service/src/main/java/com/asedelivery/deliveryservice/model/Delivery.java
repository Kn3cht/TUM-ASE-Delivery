package com.asedelivery.deliveryservice.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@Builder
@Document(collection = "deliveries")
public class Delivery {

    @Id
    private String id;

    @NonNull
    private DeliveryStatus status;

    @NonNull
    private String courierEmail;

    @NonNull
    private String customerEmail;

    @NonNull
    private String boxId;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

}
