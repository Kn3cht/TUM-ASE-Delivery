package com.asedelivery.deliveryservice.repository;

import com.asedelivery.deliveryservice.model.Box;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoxRepository extends MongoRepository<Box, String> {

    Optional<Box> findByName(String name);

}
