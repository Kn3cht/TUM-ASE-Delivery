package com.asedelivery.messagingservice.service;

import com.asedelivery.messagingservice.model.Box;
import com.asedelivery.messagingservice.model.Delivery;
import io.pebbletemplates.pebble.PebbleEngine;
import io.pebbletemplates.pebble.template.PebbleTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

@Service
public class MailFormatService
{
	@Autowired
	private PebbleEngine engine;
	private final String ORDER_NUM_VAR = "orderNumber";
	private final String BOX_ADDRESS_VAR = "boxAddress";
	private final String BOX_NAME_VAR = "boxName";
	private final String TRACK_URL_VAR = "trackUrl";
	@Value("${delivery.track-url}")
	private String TRACK_URL;

	/**
	 * Creates the email text for when a delivery was successfully collected by the recipient.
	 *
	 * @param delivery The delivery that was collected
	 * @param box
	 * @return Email content as String
	 * @throws IOException In case a required field is missing
	 */
	public String createDeliveryCollectedMail(Delivery delivery, Box box) throws IOException
	{
		PebbleTemplate compiledTemplate = engine.getTemplate("DeliveryCollected");

		Writer writer = new StringWriter();
		Map<String, Object> context = new HashMap<>();
		context.put(ORDER_NUM_VAR, delivery.getId());
		context.put(BOX_NAME_VAR, box.getName());
		context.put(TRACK_URL_VAR, this.TRACK_URL + delivery.getId());
		compiledTemplate.evaluate(writer, context);

		return writer.toString();
	}

	/**
	 * Creates the email text for when a delivery was created by the dispatcher.
	 *
	 * @param delivery The delivery that was created
	 * @param box
	 * @return Email content as String
	 * @throws IOException In case a required field is missing
	 */
	public String createDeliveryCreatedMail(Delivery delivery, Box box) throws IOException
	{
		PebbleTemplate compiledTemplate = engine.getTemplate("DeliveryCreated");

		Writer writer = new StringWriter();
		Map<String, Object> context = new HashMap<>();
		context.put(ORDER_NUM_VAR, delivery.getId());
		context.put(BOX_ADDRESS_VAR, box.getAddress().toString());
		context.put(TRACK_URL_VAR, this.TRACK_URL + delivery.getId());
		compiledTemplate.evaluate(writer, context);

		return writer.toString();
	}

	/**
	 * Creates the email text for when the order was successfully delivered by the deliverer.
	 *
	 * @param delivery The delivery that was delivered
	 * @param box
	 * @return Email content as String
	 * @throws IOException In case a required field is missing
	 */
	public String createOrderDeliveredMail(Delivery delivery, Box box) throws IOException
	{
		PebbleTemplate compiledTemplate = engine.getTemplate("DeliveryDelivered");

		Writer writer = new StringWriter();
		Map<String, Object> context = new HashMap<>();
		context.put(ORDER_NUM_VAR, delivery.getId());
		context.put(BOX_ADDRESS_VAR, box.getAddress().toString());
		context.put(BOX_NAME_VAR, box.getName());
		context.put(TRACK_URL_VAR, this.TRACK_URL + delivery.getId());
		compiledTemplate.evaluate(writer, context);

		return writer.toString();
	}
}
