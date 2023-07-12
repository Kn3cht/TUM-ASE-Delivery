import importlib
from time import sleep
import RPi.GPIO as GPIO
import profiles as profiles

#Import the authenticator program
authenticator = importlib.import_module("authenticator")

#Import the RFID Reader
from mfrc522 import SimpleMFRC522
reader = SimpleMFRC522()

#Extract configuration of the box from the config file
import config

#Entry point for the hardware program of the ASE-Project
try:
 running = True
 while running == True:
                        usr_choice = input("Do you want to override a card, read a card, start authentication procedure or exit?[o/r/a/e]")
                        if usr_choice == "O" or usr_choice == "o":
                                #Write crendetials to the RFID-Card
                                eMail = input("Enter user eMail address:")
                                pwd = input("Enter user password:")
                                print("Hold your RFID-Card next to the reader.")
                                reader.write(eMail + ":" + pwd)
                                print("Text was written.")
                                print("You can remove your tag now.")
                                sleep(1)
                        elif usr_choice == "E" or usr_choice == "e":
                            running = False
                        elif usr_choice == "R" or usr_choice == "r":
                            #Read and print credentials on an RFID-Card
                            print("Hold a tag near the reader.")
                            id, user_obj = reader.read()
                            print("ID: %s\nText: %s" % (id,user_obj))
                            sleep(1)
                        elif usr_choice == "A" or usr_choice == "a":
                                #Load operational profile, extract hostname and start authentication system
                                print("Welcome to the ase-project authentication system.")
                                print("Choose your profile:")
                                profile_choice = input("Dev, Local Deployment, Production? [d/l/p]")
                                hostname = ''

                                if profile_choice == "d" or profile_choice == "D":
                                     hostname = profiles.DEV
                                elif profile_choice == "l" or profile_choice == "L":
                                     hostname = profiles.LOCAL_DEPLOYMENT
                                elif profile_choice == "p" or profile_choice == "P":
                                     hostname = profiles.PROD
                                print("Your hostname: " + hostname) 
                                authenticator.start(config.BOX_NAME, hostname)
 GPIO.cleanup()
except KeyboardInterrupt:
    GPIO.cleanup()
    raise
