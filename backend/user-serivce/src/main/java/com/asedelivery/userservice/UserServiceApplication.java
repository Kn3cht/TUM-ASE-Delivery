package com.asedelivery.userservice;

import com.asedelivery.userservice.model.AseUser;
import com.asedelivery.userservice.model.Role;
import com.asedelivery.userservice.model.Status;
import com.asedelivery.userservice.repository.UserRepository;
import com.mongodb.client.MongoClient;
import com.netflix.discovery.converters.Auto;
import jdk.jfr.StackTrace;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.FileCopyUtils;

import java.io.FileOutputStream;
import java.util.Arrays;

@SpringBootApplication
@EnableMongoRepositories(basePackageClasses = {UserRepository.class})
@EnableMongoAuditing
@EnableEurekaClient
@EnableWebSecurity
public class UserServiceApplication implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(UserServiceApplication.class);

	@Autowired
	MongoClient mongoClient;

	@Autowired
	UserRepository userRepository;

	@Autowired
	BCryptPasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		try {
			FileCopyUtils.copy(new ClassPathResource("ase_project.keystore").getInputStream(),
					new FileOutputStream("/tmp/ase_project.keystore"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		SpringApplication.run(UserServiceApplication.class, args);
	}


	@Override
	public void run(String... args) throws Exception {
		log.info("MongoClient = " + mongoClient.getClusterDescription());

		generateDemoData();
	}

	private void generateDemoData() {
		String encryptedPassword = passwordEncoder.encode("test123");

		try {

			AseUser mainDispatcher = AseUser.builder()
					.email("maindispatcher@asedelivery.com")
					.password(encryptedPassword)
					.role(Role.DISPATCHER)
					.build();
			userRepository.insert(mainDispatcher);
		} catch (Exception exception) {
			System.err.println(Arrays.toString(exception.getStackTrace()));
		}

		try {
			AseUser demoDeliverer = AseUser.builder()
					.email("deliverer@asedelivery.com")
					.password(encryptedPassword)
					.role(Role.DELIVERER)
					.build();
			userRepository.insert(demoDeliverer);
		} catch (Exception e) {
			System.err.println(Arrays.toString(e.getStackTrace()));
		}

		try {
			AseUser demoCustomer = AseUser.builder()
					.email("customer@asedelivery.com")
					.password(encryptedPassword)
					.role(Role.CUSTOMER)
					.build();
			userRepository.insert(demoCustomer);
		} catch (Exception e) {
			System.err.println(Arrays.toString(e.getStackTrace()));
		}
	}
}
