package com.asedelivery.deliveryservice.controller;

import com.asedelivery.deliveryservice.dto.delivery.CreateDeliveryDto;
import com.asedelivery.deliveryservice.dto.SendEmailRequestDto;
import com.asedelivery.deliveryservice.dto.delivery.DeleteDeliveryResponseDto;
import com.asedelivery.deliveryservice.dto.delivery.DeliveryDto;
import com.asedelivery.deliveryservice.dto.delivery.UpdateDeliveryDto;
import com.asedelivery.deliveryservice.jwt.AseJwtAuthentication;
import com.asedelivery.deliveryservice.model.*;
import com.asedelivery.deliveryservice.service.BoxService;
import com.asedelivery.deliveryservice.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;
    @Autowired
    private BoxService boxService;

    @Autowired
    private MessagingService messagingService;

    @Autowired
    private String getQrUrl;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Success");
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<DeliveryDto> createDelivery(@RequestBody CreateDeliveryDto deliveryDto) {

        Delivery newDelivery = Delivery.builder()
                .courierEmail(deliveryDto.getCourierEmail())
                .customerEmail(deliveryDto.getCustomerEmail())
                .boxId(deliveryDto.getBoxId())
                .status(DeliveryStatus.CREATED)
                .build();

        if (!deliveryService.isBoxAvailable(deliveryDto.getBoxId(), deliveryDto.getCustomerEmail())) {
            return ResponseEntity.badRequest().body(null);
        }

        Optional<Delivery> createdDelivery = deliveryService.addDelivery(newDelivery);
        if (createdDelivery.isPresent()) {
            User recipient = User.builder().emailAddress(deliveryDto.getCustomerEmail()).build();
            Optional<Box> box = boxService.getBoxById(deliveryDto.getBoxId());
            SendEmailRequestDto messageDto = SendEmailRequestDto.builder()
                    .recipient(recipient)
                    .delivery(createdDelivery.get())
                    .box(box.get())
                    .build();
            messagingService.sendDeliveryCreatedEmail(messageDto);
            return ResponseEntity.ok(generateDeliveryDto(createdDelivery.get()));
        }
        return ResponseEntity.badRequest().body(null);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<DeliveryDto> updateDelivery(@PathVariable("id") String id, @RequestBody UpdateDeliveryDto delivery) {
        if (id == null || delivery == null || !id.equals(delivery.getId())) {
            return ResponseEntity.badRequest().body(null);
        }

        Delivery persistedDelivery = deliveryService.getDeliveryById(delivery.getId()).orElseThrow(() -> new RuntimeException("Invalid delivery id"));

        Delivery toUpdateDelivery = Delivery.builder()
                .id(delivery.getId())
                .status(persistedDelivery.getStatus())
                .createdAt(persistedDelivery.getCreatedAt())
                .customerEmail(delivery.getCustomerEmail())
                .courierEmail(delivery.getCourierEmail())
                .boxId(delivery.getBoxId()).build();

        Optional<Delivery> updatedDelivery = deliveryService.updateDelivery(toUpdateDelivery);
        return updatedDelivery.map(value -> ResponseEntity.ok(generateDeliveryDto(value))).orElseGet(() -> ResponseEntity.badRequest().body(null));
    }

    /**
     * Deletes a delivery and returns the id of the deleted delivery
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<DeleteDeliveryResponseDto> deleteDelivery(@PathVariable("id") String id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Optional<String> deletedDeliveryIdOptional = deliveryService.deleteDelivery(id);
        if (deletedDeliveryIdOptional.isPresent()) {
            return ResponseEntity.ok(new DeleteDeliveryResponseDto(deletedDeliveryIdOptional));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new DeleteDeliveryResponseDto(Optional.empty()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DISPATCHER', 'CUSTOMER', 'DELIVERER')")
    public ResponseEntity<DeliveryDto> getDeliveryById(@PathVariable("id") String id) {
        Optional<Delivery> deliveryOptional = deliveryService.getDeliveryById(id);

        if (deliveryOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Check if customer is authorized to access the box, else return unauthorized
        AseJwtAuthentication authentication = (AseJwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
        var principalEmail = authentication.getPrincipal();
        var role = authentication.getRole();

        Delivery delivery = deliveryOptional.get();
        if (role == Role.CUSTOMER && !delivery.getCustomerEmail().equals(principalEmail) ||
                role == Role.DELIVERER && !delivery.getCourierEmail().equals(principalEmail)) {
            return ResponseEntity.status(401).body(null);
        }

        return ResponseEntity.ok(generateDeliveryDto(delivery));
    }

    // return only deliveries where either customerEmail, delivererEmail is equal to principal email
    // Or if a dispatcher wants to list all deliveries
    @GetMapping
    @PreAuthorize("hasAnyRole('DISPATCHER', 'DELIVERER', 'CUSTOMER')")
    public ResponseEntity<List<DeliveryDto>> getAllDeliveries() {
        AseJwtAuthentication authentication = (AseJwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
        var principalEmail = (String) authentication.getPrincipal();
        var role = authentication.getRole();

        List<Delivery> deliveries;
        if (role == Role.DISPATCHER) {
            deliveries = deliveryService.listAllDeliveries();
        } else if (role == Role.DELIVERER) {
            deliveries = deliveryService.listDeliveriesForCourier(principalEmail);
        } else {
            deliveries = deliveryService.listDeliveriesForCustomer(principalEmail);
        }
        List<DeliveryDto> deliveriesResult = deliveries.stream().map(this::generateDeliveryDto).toList();
        return ResponseEntity.ok(deliveriesResult);
    }

    @GetMapping("/box/{boxId}")
    @PreAuthorize("hasAnyRole('DISPATCHER')")
    public ResponseEntity<List<DeliveryDto>> getDeliveriesForBox(@PathVariable("boxId") String boxId) {
        List<DeliveryDto> deliveriesResult = deliveryService.listDeliveriesForBox(boxId).stream().map(this::generateDeliveryDto).toList();
        return ResponseEntity.ok(deliveriesResult);
    }

    @GetMapping("/track/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<DeliveryDto> getActiveDelivery(@PathVariable("id") String deliveryId) {
        Optional<Delivery> delivery = deliveryService.getDeliveryById(deliveryId);

        //Extracts user Email out of the authentication object
        AseJwtAuthentication authentication = (AseJwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
        String userEmail = (String) authentication.getPrincipal();

        //Check if the delivery exists, and if the user is allowed to access it
        //Also check if the delivery is not yet picked_up
        if(delivery.isPresent() &&
                delivery.get().getCustomerEmail().equals(userEmail) &&
                delivery.get().getStatus() != DeliveryStatus.COMPLETED) {

            return ResponseEntity.ok(generateDeliveryDto(delivery.get()));
        }

        return ResponseEntity.badRequest().body(null);
    }

    /**
     * Called when a courier picks up a package for delivery and scans the QR code.
     * Updates the status of that delivery to "EN ROUTE".
     * @param deliveryId The delivery that was picked up
     * @return The box to which the delivery should be shipped
     */
    @PostMapping("/en_route/{deliveryId}")
    @PreAuthorize("hasAnyRole('DELIVERER')")
    public ResponseEntity<Box> deliveryEnRoute(@PathVariable("deliveryId") String deliveryId) {
        AseJwtAuthentication authentication = (AseJwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
        var principalEmail = (String) authentication.getPrincipal();
        Optional<Delivery> delivery = deliveryService.getDeliveryById(deliveryId);
        if (delivery.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (!delivery.get().getCourierEmail().equals(principalEmail)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        if (delivery.get().getStatus() != DeliveryStatus.CREATED) {
            return ResponseEntity.badRequest().body(null);
        }
        deliveryService.updateDeliveryStatus(delivery.get(), DeliveryStatus.EN_ROUTE);
        return ResponseEntity.ok(boxService.getBoxById(delivery.get().getBoxId()).orElse(null));
    }

    private DeliveryDto generateDeliveryDto(Delivery delivery) {
        return new DeliveryDto(delivery, this.getQrUrl + delivery.getId());
    }
}
