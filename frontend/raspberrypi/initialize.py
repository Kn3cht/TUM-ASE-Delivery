import asyncio
import json

import backendConnection as con
import profiles

#Entry point for the hardware setup program of the ASE-Project
print("Welcome to the ase-project hardware setup.")
print("Choose your profile:")
profile_choice = input("Dev, Local Deployment, Production? [d/l/p]")

#Select a profile to load hostname for connection, which is pre-configured
hostname = ''

if profile_choice == "d" or profile_choice == "D":
	hostname = profiles.DEV
elif profile_choice == "l" or profile_choice == "L":
	hostname = profiles.LOCAL_DEPLOYMENT
elif profile_choice == "p" or profile_choice == "P":
	hostname = profiles.PROD

print("Your hostname: " + hostname)

if hostname != "":
	#Authenticate the user and load box configuration information from the server
	eMail = input("Now enter your dispatcher email:")
	pwd = input("Enter your password:")
	boxId = input("Enter unique box name:")
	loop = asyncio.get_event_loop()
	box_obj = json.loads(loop.run_until_complete(con.get_config(boxId, eMail + ":" + pwd, hostname)))
	if box_obj != "":
		#Create the config file based on the box information
		str_file = "BOX_ID = '" + box_obj["boxId"] + "'\n" + "RASPI_ID = '" + box_obj["raspberryPiId"] + "'\n" + "BOX_NAME = '" + box_obj["name"] + "'\n" + "ADDRESS = '" + box_obj["address"]["street"] + " " + str(box_obj["address"]["houseNumber"]) + ", " +  str(box_obj["address"]["zipCode"]) + " " + box_obj["address"]["city"] + ", " +  box_obj["address"]["country"] + "'" 
		f = open("config.py", "w")
		f.write(str_file)
		f.close()
		print("Configuration file successfully created.")
	else:
		print("Could not load configuartion file, try again.")
