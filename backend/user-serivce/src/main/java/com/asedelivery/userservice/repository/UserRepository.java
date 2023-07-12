package com.asedelivery.userservice.repository;

import com.asedelivery.userservice.model.AseUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<AseUser, String> {

    Optional<AseUser> findByEmail(String email);
}
