package com.asedelivery.deliveryservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConstantsConfig
{
	@Value("${scan-qr.url}")
	private String qrUrl;

	@Bean
	public String getQrUrl() {
		return this.qrUrl;
	}
}
