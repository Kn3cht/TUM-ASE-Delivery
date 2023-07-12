import RPi.GPIO as GPIO
import json
import datetime
from time import sleep
from mfrc522 import SimpleMFRC522
import backendConnection as con
import aiohttp
import asyncio

green_pin = 40 
red_pin = 38
resistor_pin = 36
light = 0

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

GPIO.setup(green_pin, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(red_pin, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(resistor_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def light_led(color, sec = 3):
	GPIO.output(color, GPIO.HIGH)
	sleep(sec)
	GPIO.output(color, GPIO.LOW)

def authenticate(box_id, credentials, hostname):
	#Import the http request and use it here for authentication
	loop = asyncio.get_event_loop()
	return loop.run_until_complete(con.authorize_user(box_id, credentials, hostname))

def open_box(box_id, credentials, hostname):
	light_led(green_pin, 2)
	print("Box opened. Please close the box after you picked up the delivery.")
	if is_box_closed():
		print("Open_box: " + credentials)
		box_closed(box_id, credentials, hostname)

def box_closed(box_id, credentials, hostname):
	print("Box closed. Updating delivery status.")
	#Do http Call to the server to notify that the delivery has been picked up or been placed
	loop = asyncio.get_event_loop()
	deliveries = loop.run_until_complete(con.update_delivery(box_id, credentials, hostname))

	if deliveries:
		print("Delivery status successfully updated.")
	else:
		print("Delivery status could not be updated.")
	sleep(1)

def is_box_closed():
	#Checks the light in the surrounding area to see whether the box has been closed or not
	box_closed = False
	start_time = datetime.datetime.now()
	ten_sec_warning_displayed = False

	while box_closed != True:
		cur_time = datetime.datetime.now()
		delta = cur_time - start_time
		if delta.total_seconds() >= 10:
			GPIO.output(red_pin, GPIO.HIGH)
			if not ten_sec_warning_displayed:
				print("Please make sure the box is closed, after the delivery has been picked up")
				ten_sec_warning_displayed = True

		box_closed = GPIO.input(resistor_pin) != light
		if box_closed:
			GPIO.output(red_pin, GPIO.LOW)
	return True

#Entry point of authenticator program
def start(box_id, hostname):
	reader = SimpleMFRC522()
	try:
		running = True
		while running == True:
			#After reading credentials from RFID-Card try to authenticate and open the box
			print("Hold a tag near the reader")
			card_id, credentials = reader.read()
			print("ID: %s\nText: %s" % (card_id, credentials))
			try:
				if authenticate(box_id, credentials.strip(), hostname):
					print("Authentication successful.")
					open_box(box_id, credentials.strip(), hostname)
				else:
					print("Authentication Error: no match found")
					light_led(red_pin)
			except ValueError:
				print("Value Error")
				light_led(red_pin, 5)

	except KeyboardInterrupt:
		GPIO.cleanup()
		raise
