package com.asedelivery.deliveryservice.repository;

import com.asedelivery.deliveryservice.model.Delivery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends MongoRepository<Delivery, String> {

    Optional<Delivery> findDeliveryById(String id);

    List<Delivery> findDeliveryByBoxId(String boxId);

    List<Delivery> findAllByCourierEmail(String courierEmail);

    List<Delivery> findAllByCustomerEmail(String customerEmail);
}
