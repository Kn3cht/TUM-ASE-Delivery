package com.asedelivery.deliveryservice.service;

import com.asedelivery.deliveryservice.exception.BoxNotEmptyException;
import com.asedelivery.deliveryservice.model.Box;
import com.asedelivery.deliveryservice.model.Delivery;
import com.asedelivery.deliveryservice.model.DeliveryStatus;
import com.asedelivery.deliveryservice.repository.BoxRepository;
import com.asedelivery.deliveryservice.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BoxService {

    @Autowired
    private BoxRepository boxRepository;
    @Autowired
    private DeliveryRepository deliveryRepository;

    public Box createBox(Box box) {
        return boxRepository.insert(box);
    }

    public List<Box> listBoxes() {
        return boxRepository.findAll();
    }

    /**
     * Returns available boxes. A box is available either if there are no deliveries that are ongoing (status for all deliveries is completed -> box is empty) or
     * if all deliveries for that box that are ongoing belong to the customer
     */
    public List<Box> listAvailableBoxes(String customerEmail) {

        List<Box> allBoxes = boxRepository.findAll();
        List<Delivery> allDeliveries = deliveryRepository.findAll();

        return allBoxes.stream().filter(box -> {
                            List<Delivery> deliveriesForBox = allDeliveries.stream()
                                    .filter(delivery -> delivery.getBoxId().equals(box.getId())).toList();

                    // A box is empty if there are no deliveries that are ongoing (no delivery with a status other than COMPLETE)
                    var boxEmpty = deliveriesForBox.stream().noneMatch(delivery ->
                                    delivery.getStatus() != DeliveryStatus.COMPLETED);

                    var boxAssignedToUser = deliveriesForBox.stream().allMatch(delivery ->
                            delivery.getStatus() != DeliveryStatus.COMPLETED &&
                                    delivery.getCustomerEmail().equals(customerEmail) || delivery.getStatus() == DeliveryStatus.COMPLETED);

                    return boxEmpty || boxAssignedToUser;
                })
                .toList();
    }

    public Optional<String> deleteBox(String id) {
        if (boxRepository.findById(id).isPresent()) {
            boxRepository.deleteById(id);
            return Optional.of(id);
        }
        return Optional.empty();
    }

    public Optional<Box> updateBox(Box box) {
        Optional<Box> boxOptional = boxRepository.findById(box.getId());

        if (boxOptional.isPresent()) {
            // Allow updates only if there are no open deliveries for the box
            List<Delivery> deliveriesForBox = deliveryRepository.findDeliveryByBoxId(box.getId());
            if (!deliveriesForBox.isEmpty()) {
                throw new BoxNotEmptyException();
            }
            box.setCreatedAt(boxOptional.get().getCreatedAt());

            boxRepository.save(box);
            return Optional.of(box);
        }
        return Optional.empty();
    }

    public Optional<Box> getBoxByName(String id) {
        return boxRepository.findByName(id);
    }

    public Optional<Box> getBoxById(String id) {
        return boxRepository.findById(id);
    }
}
