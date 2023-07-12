package com.asedelivery.deliveryservice;

import com.asedelivery.deliveryservice.helpers.RandomEnumGenerator;
import com.asedelivery.deliveryservice.model.*;
import com.asedelivery.deliveryservice.repository.BoxRepository;
import com.asedelivery.deliveryservice.repository.DeliveryRepository;
import com.mongodb.client.MongoClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.util.FileCopyUtils;

import java.io.FileOutputStream;
import java.util.Arrays;
import java.util.Date;

@SpringBootApplication
@EnableMongoRepositories(basePackageClasses = {BoxRepository.class, DeliveryRepository.class})
@EnableMongoAuditing
@EnableEurekaClient
@EnableWebSecurity
@EnableFeignClients
public class DeliveryServiceApplication implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(DeliveryServiceApplication.class);

	@Autowired
	MongoClient mongoClient;

	@Autowired
	BoxRepository boxRepository;

	@Autowired
	DeliveryRepository deliveryRepository;

	public static void main(String[] args) {
		try {
			FileCopyUtils.copy(new ClassPathResource("ase_project.keystore").getInputStream(),
					new FileOutputStream("/tmp/ase_project.keystore"));
		} catch (Exception e) {
			e.printStackTrace();
		}

		SpringApplication.run(DeliveryServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		log.info("MongoClient = " + mongoClient.getClusterDescription());

		generateDemoData();
	}

	private void generateDemoData() {
		// Initialization of demo boxes
		String boxId = null;
		try {
			Address demoBoxAddressGarching = new Address("Sesamstraße",
					"Garching",
					Country.GERMANY);
			demoBoxAddressGarching.setHouseNumber(42);
			demoBoxAddressGarching.setZipCode(86123);
			demoBoxAddressGarching.setAddition("b");
			Box demoBoxGarching = new Box("AsePi", demoBoxAddressGarching, "AseBoxGarching");
			 boxRepository.insert(demoBoxGarching).getId();
		} catch (Exception exception) {
			System.err.println(Arrays.toString(exception.getStackTrace()));
		}

		try {
			Address demoBoxAddressMunich = new Address("Arcisstraße",
					"Munich",
					Country.GERMANY);
			demoBoxAddressMunich.setHouseNumber(21);
			demoBoxAddressMunich.setZipCode(80333);
			Box demoBoxMunich = new Box("AsePi-not-present", demoBoxAddressMunich, "AseBoxMunich");
			boxRepository.insert(demoBoxMunich);
			boxId = demoBoxMunich.getId();
		} catch (Exception exception) {
			System.err.println(Arrays.toString(exception.getStackTrace()));
		}


		// Demo box could be created
		if (boxId != null) {
			long DAY_IN_MS = 1000 * 60 * 60 * 24;

			RandomEnumGenerator reg = new RandomEnumGenerator(DeliveryStatus.class);

			// Initialization of demo deliveries
			for (int i = 0; i < 30; i++) {
				DeliveryStatus deliveryStatus = (DeliveryStatus) reg.randomEnum();
				Delivery demoDelivery = Delivery.builder()
						.status(deliveryStatus)
						.courierEmail("deliverer@asedelivery.com")
						.customerEmail("customer@asedelivery.com")
						.boxId(boxId)
						.build();

				var dayOffset = getRandomNumber(3, 30);

				try {
					Delivery newDelivery = deliveryRepository.insert(demoDelivery);
					newDelivery.setCreatedAt(new Date(new Date().getTime() - (dayOffset * DAY_IN_MS)));
					deliveryRepository.save(newDelivery);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	private int getRandomNumber(int min, int max) {
		return (int) ((Math.random() * (max - min)) + min);
	}
}
