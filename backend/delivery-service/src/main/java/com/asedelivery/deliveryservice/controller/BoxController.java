package com.asedelivery.deliveryservice.controller;

import com.asedelivery.deliveryservice.dto.SendEmailRequestDto;
import com.asedelivery.deliveryservice.dto.box.BoxInfoDto;
import com.asedelivery.deliveryservice.dto.box.BoxRequestDto;
import com.asedelivery.deliveryservice.dto.box.CreateBoxRequest;
import com.asedelivery.deliveryservice.dto.box.DeleteBoxResponseDto;
import com.asedelivery.deliveryservice.jwt.AseJwtAuthentication;
import com.asedelivery.deliveryservice.model.*;
import com.asedelivery.deliveryservice.service.BoxService;
import com.asedelivery.deliveryservice.service.DeliveryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/boxes")
public class BoxController {

    private static final Logger log = LoggerFactory.getLogger(BoxController.class);

    @Autowired
    private BoxService boxService;

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private UserService userService;

    @Autowired
    private MessagingService messagingService;

    @PostMapping
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<Box> createBox(@RequestBody CreateBoxRequest box) {
        // catch duplicate key errors
        if (boxService.getBoxByName(box.getName()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        Box boxToCreate = new Box(box.getRaspberryPiId(), box.getAddress(), box.getName());

        Box createdBox = boxService.createBox(boxToCreate);
        return ResponseEntity.ok(createdBox);
    }

    /**
     * Deletes a box and returns the id of the deleted box
     */
    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<DeleteBoxResponseDto> deleteBox(@PathVariable("id") String id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Delivery> deliveriesForBox = deliveryService.listDeliveriesForBox(id);
        // There are deliveries that are assigned to that box that are not yet
        // finished
        if (deliveriesForBox
                .stream()
                .anyMatch(delivery ->
                                !delivery
                                        .getStatus()
                                        .equals(DeliveryStatus.COMPLETED))) {
            return ResponseEntity.badRequest().body(null);
        }


        Optional<String> deletedBoxIdOptional = boxService.deleteBox(id);
        if (deletedBoxIdOptional.isPresent()) {
            return ResponseEntity.ok(new DeleteBoxResponseDto(deletedBoxIdOptional));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new DeleteBoxResponseDto(Optional.empty()));
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<Box> updateBox(@PathVariable("id") String id, @RequestBody Box box) {
        if (id == null || box == null || box.getId() == null || !id.equals(box.getId())) {
            return ResponseEntity.badRequest().body(null);
        }

        Optional<Box> updatedBox = boxService.updateBox(box);
        return updatedBox.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.badRequest().body(null));
    }

    @GetMapping
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<List<Box>> listBoxes() {
        return ResponseEntity.ok(boxService.listBoxes());
    }

    /**
     * Returns available boxes. A box is available either if there are no deliveries that are ongoing (status for all deliveries is completed -> box is empty) or
     * if all deliveries for that box that are ongoing belong to the customer
     */
    @GetMapping("/available/{customerEmail}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<List<Box>> listAvailableBoxes(@PathVariable("customerEmail") String customerEmail) {
        return ResponseEntity.ok(boxService.listAvailableBoxes(customerEmail));
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'DISPATCHER', 'DELIVERER')")
    public ResponseEntity<Box> getBoxById(@PathVariable("id") String boxId) {
        Optional<Box> box = boxService.getBoxById(boxId);

        //Extract email from authentication object
        AseJwtAuthentication authentication = (AseJwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
        String userMail = (String) authentication.getPrincipal();

        if (box.isPresent() && authentication.getRole() == Role.DISPATCHER) {
            return ResponseEntity.ok(box.get());
        }

        //Get deliveries for the box
        List<Delivery> deliveries = deliveryService.listDeliveriesForBox(boxId);

        //Check if a customer has deliveries for this box
        //Check if a deliverer has an assigned delivery for that box
        if (box.isPresent() && authentication.getRole() == Role.CUSTOMER && deliveries.stream().anyMatch(delivery -> delivery.getCustomerEmail().equals(userMail))) {
            return ResponseEntity.ok(box.get());
        } else if (box.isPresent() && authentication.getRole() == Role.DELIVERER && deliveries.stream().anyMatch(delivery -> delivery.getCourierEmail().equals(userMail))) {
            return ResponseEntity.ok(box.get());
        }
        return ResponseEntity.badRequest().body(null);
    }


    /**
     * Called when a user (CUSTOMER OR DELIVERER) tries to open the box,
     * checks if the box and the user´s e-Mail address match
     * @param boxId The box identification, pre-configured at the RaspberryPi
     * @return True, if and only if the box contains a delivery which is to be handled by the user
     */
    @GetMapping("/auth/{boxId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'DELIVERER')")
    public ResponseEntity<Boolean> authorizeUser(@PathVariable("boxId") String boxId) {
        //Extract email from authentication object
        AseJwtAuthentication authentication = (AseJwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
        String userMail = (String) authentication.getPrincipal();
        Role role = authentication.getRole();

        //Retrieve box from repository
        Optional<Box> box = boxService.getBoxByName(boxId);

        //User was not found or box is empty or does not exist
        if (userMail == null || userMail.equals("") || box.isEmpty()) {
            return ResponseEntity.badRequest().body(false);
        }

        List<Delivery> deliveries = deliveryService.listDeliveriesForBox(box.get().getId());

        //if no deliveries are present throw error
        if (deliveries.isEmpty()) {
            return ResponseEntity.badRequest().body(false);
        }

        //Check if the deliveries in the box are indeed for the user if it´s a CUSTOMER
        //Check if at least one delivery in the box is designated to be delivered by the DELIVERER
        if(role == Role.CUSTOMER) {
            return ResponseEntity.ok(deliveries.stream().anyMatch(delivery -> delivery.getStatus() != DeliveryStatus.COMPLETED && delivery.getCustomerEmail().equals(userMail)));
        } else if (role == Role.DELIVERER) {
            return ResponseEntity.ok(deliveries.stream().anyMatch(delivery -> delivery.getStatus() == DeliveryStatus.EN_ROUTE && delivery.getCourierEmail().equals(userMail)));
        }
        return ResponseEntity.ok(false);
    }

    /**
     * Called by a box when it was successfully closed.
     * If a customer closed the box, all deliveries are marked as COMPLETED.
     * If a deliverer closed the box, all deliveries are marked as DELIVERED
     * @return All ids of the deliveries that were updated
     */
    @PostMapping("/closed/{boxId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'DELIVERER')")
    public ResponseEntity<List<String>> boxClosed(@PathVariable("boxId") String boxId) {
        //Extract email from authentication object
        AseJwtAuthentication authentication = (AseJwtAuthentication) SecurityContextHolder.getContext().getAuthentication();
        String userMail = (String) authentication.getPrincipal();

        //Retrieve box from repository
        Optional<Box> boxOpt = boxService.getBoxByName(boxId);

        if (boxOpt.isEmpty() || userMail == null || userMail.equals("")) {
            return ResponseEntity.ok(List.of());
        }

        User user = User.builder().emailAddress(userMail).role(authentication.getRole()).build();
        Box box = boxOpt.get();

        List<Delivery> deliveries = deliveryService.listDeliveriesForBox(box.getId());
        List<String> updatedDeliveries = deliveries.stream().map(delivery -> {
            if (user.getRole() == Role.CUSTOMER
                    && delivery.getCustomerEmail().equals(user.getEmailAddress())
                    && delivery.getStatus() == DeliveryStatus.DELIVERED) {
                String id = deliveryService.updateDeliveryStatus(delivery, DeliveryStatus.COMPLETED).getId();
                SendEmailRequestDto emailDto = SendEmailRequestDto.builder()
                        .delivery(delivery)
                        .box(box)
                        .recipient(user).build();
                messagingService.sendDeliveryCollectedEmail(emailDto);
                return id;
            } else if (user.getRole() == Role.DELIVERER
                    && delivery.getCourierEmail().equals(user.getEmailAddress())
                    && delivery.getStatus() == DeliveryStatus.EN_ROUTE) {
                String id = deliveryService.updateDeliveryStatus(delivery, DeliveryStatus.DELIVERED).getId();
                SendEmailRequestDto emailDto = SendEmailRequestDto.builder()
                        .delivery(delivery)
                        .box(box)
                        .recipient(User.builder().emailAddress(delivery.getCustomerEmail()).build()).build();
                messagingService.sendDeliveryDeliveredEmail(emailDto);
                return id;
            }
            return "";
        }).filter(id -> !id.equals("")).collect(Collectors.toList());
        return ResponseEntity.ok(updatedDeliveries);
    }

    /**
     * Called by the dispatcher to retrieve information about a box, for setup.
     * @param boxId The name of the box.
     * @return A BoxInfoDto that can be used as a config file
     */
    @GetMapping("/info/{boxId}")
    @PreAuthorize("hasRole('DISPATCHER')")
    public ResponseEntity<BoxInfoDto> getBoxInfo(@PathVariable("boxId") String boxId) {
        Optional<Box> boxOptional = boxService.getBoxByName(boxId);
        if (boxOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Box box = boxOptional.get();
        BoxInfoDto boxInfo = BoxInfoDto.builder()
                .address(box.getAddress())
                .name(box.getName())
                .raspberryPiId(box.getRaspberryPiId())
                .boxId(box.getId())
                .build();
        return ResponseEntity.ok(boxInfo);
    }
}
