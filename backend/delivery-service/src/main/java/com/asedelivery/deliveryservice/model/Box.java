package com.asedelivery.deliveryservice.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@RequiredArgsConstructor
@Document(collection = "boxes")
public class Box {

    @Id
    private String id;

    @NonNull
    private String raspberryPiId;

    @NonNull
    private Address address;

    @NonNull
    @Indexed(unique = true)
    private String name;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;
}
