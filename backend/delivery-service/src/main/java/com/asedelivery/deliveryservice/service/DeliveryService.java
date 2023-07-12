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

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private BoxRepository boxRepository;

    public Optional<Delivery> addDelivery(Delivery delivery) {
        if (boxRepository.findById(delivery.getBoxId()).isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(deliveryRepository.insert(delivery));
    }

    public Optional<Delivery> getDeliveryById(String id) {
        return deliveryRepository.findDeliveryById(id);
    }

    public List<Delivery> listAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public List<Delivery> listDeliveriesForCourier(String courierEmail) {
        return deliveryRepository.findAllByCourierEmail(courierEmail);
    }
    public List<Delivery> listDeliveriesForCustomer(String customerEmail) {
        return deliveryRepository.findAllByCustomerEmail(customerEmail);
    }

    public List<Delivery> listDeliveriesForBox(String boxId) {
        return deliveryRepository.findDeliveryByBoxId(boxId);
    }

    public Delivery updateDeliveryStatus(Delivery delivery, DeliveryStatus status) {
        delivery.setStatus(status);
        return deliveryRepository.save(delivery);
    }

    public Optional<Delivery> updateDelivery(Delivery updatedDelivery) {
        Optional<Delivery> deliveryOptional = deliveryRepository.findById(updatedDelivery.getId());

        if (deliveryOptional.isPresent() &&
                isBoxAvailable(updatedDelivery.getBoxId(), updatedDelivery.getCustomerEmail())) {
            deliveryOptional.get().setBoxId(updatedDelivery.getBoxId());
            deliveryOptional.get().setCourierEmail(updatedDelivery.getCourierEmail());
            deliveryOptional.get().setCustomerEmail(updatedDelivery.getCustomerEmail());
            return Optional.of(deliveryRepository.save(deliveryOptional.get()));
        }
        return Optional.empty();
    }

    public Optional<String> deleteDelivery(String id) {
        if (deliveryRepository.findById(id).isPresent()) {
            deliveryRepository.deleteById(id);
            return Optional.of(id);
        }
        return Optional.empty();
    }

    /**
     * Check whether a box is available for a user, i.e. it contains no active deliveries for other users
     * @param boxId The id of the box
     * @param customerEmail The email of the CUSTOMER
     * @return <code>True</code> If a delivery for this user can be assigned to the box
     */
    public boolean isBoxAvailable(String boxId, String customerEmail) {
        List<Delivery> deliveriesForBox = listDeliveriesForBox(boxId);
        return deliveriesForBox.stream().noneMatch(delivery -> delivery.getStatus() != DeliveryStatus.COMPLETED
                && !delivery.getCustomerEmail().equals(customerEmail));
    }
}
