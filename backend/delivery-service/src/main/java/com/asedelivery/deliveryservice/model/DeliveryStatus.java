package com.asedelivery.deliveryservice.model;

public enum DeliveryStatus {
    CREATED, //When the delivery is created by the DISPATCHER, START STATE
    EN_ROUTE, //When the delivery has been picked up by the DELIVERER from the central depot by scanning the QR-Code
    DELIVERED, //When the delivery is deposited at the target box by the DELIVERER
    COMPLETED, //When the customer opens the box and collects the delivery from the box, FINAL STATE

}
