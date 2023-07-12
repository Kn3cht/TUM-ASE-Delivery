package com.asedelivery.userservice;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpHead;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class AuthorizationTest {
	@Test
	void unauthorizedTest() throws IOException {
		// Test-data
		String endPoint = "auth/login";
		String username = "test@gmail.com";
		String password = "falsePassword";

		HttpUriRequest request = new HttpPost( TestConfiguration.getBaseAPI() + endPoint);
		String credential = Base64.encodeBase64String((username+":"+password).getBytes(StandardCharsets.UTF_8));
		request.setHeader("Authorization", "Basic " + credential);
		request.setHeader("Accept", "application/json");
		request.setHeader("Connection", "close");

		// When
		HttpResponse httpResponse = HttpClientBuilder.create().build().execute(request);

		// Then
		assertEquals(
				HttpStatus.SC_UNAUTHORIZED,
				httpResponse.getStatusLine().getStatusCode());
	}
	@Test
	void authorizedTest() throws IOException {
		// Test-data
		String endPoint = "auth/login";
		String username = "test@gmail.com";
		String password = "test";

		HttpUriRequest request = new HttpPost( TestConfiguration.getBaseAPI() + endPoint);
		String credential = Base64.encodeBase64String((username+":"+password).getBytes(StandardCharsets.UTF_8));
		request.setHeader("Authorization", "Basic " + credential);
		request.setHeader("Accept", "application/json");
		request.setHeader("Connection", "close");

		// When
		HttpResponse httpResponse = HttpClientBuilder.create().build().execute(request);

		// Then
		assertEquals(HttpStatus.SC_OK,
				httpResponse.getStatusLine().getStatusCode());
	}
}
