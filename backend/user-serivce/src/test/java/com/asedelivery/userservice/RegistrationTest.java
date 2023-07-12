package com.asedelivery.userservice;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class RegistrationTest {

    @Test
    public void registerUser_SUCCESS() throws IOException {
        // Test-data
        String endPoint = "users/register";
        String payload = """
                {"email":"test3@gmail.com","password":"test","role": "CUSTOMER"}
                """;

        StringEntity entity = new StringEntity(payload,
                ContentType.APPLICATION_JSON);

        HttpPost request = new HttpPost(TestConfiguration.getBaseAPI() + endPoint);
        request.setEntity(entity);

        // When
        HttpResponse httpResponse = HttpClientBuilder.create().build().execute(request);

        // Then
        assertEquals(
                HttpStatus.SC_OK,
                httpResponse.getStatusLine().getStatusCode());
    }

    @Test
    public void registerUser_FAILURE_UserAlreadyExists() throws IOException {
        // Test-data
        String endPoint = "users/register";
        String payload = """
                {"email":"test1@gmail.com","password":"test","role": "CUSTOMER"}
                """;

        StringEntity entity = new StringEntity(payload,
                ContentType.APPLICATION_JSON);

        HttpPost request = new HttpPost(TestConfiguration.getBaseAPI() + endPoint);
        request.setEntity(entity);

        // When
        HttpResponse httpResponse = HttpClientBuilder.create().build().execute(request);

        // Then
        assertEquals(
                HttpStatus.SC_BAD_REQUEST,
                httpResponse.getStatusLine().getStatusCode());
    }

}
