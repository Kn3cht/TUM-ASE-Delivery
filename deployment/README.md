# Local Deployment

This section describes how to locally deploy the ASE Delivery System.
Deploying the system locally means that in the end there will be a running instance
of the system on your machine. For production deployment see [Production Deployment](#production-deployment).

## Preamble

### Preparation

This section describes the necessary steps in order to deploy the system locally.

#### Docker

Make sure that you have docker compose `v2.10.2` or higher installed on your machine. You can check that by executing

```docker compose version```

You will have to log in with docker on the university gitlab server using

```docker login https://gitlab.lrz.de:5005```


#### File hierarchy

Create new folder called `ase-delivery` and clone all gitlab repositories into this folder to obtain the following file hierarchy.
You can clone a repository by navigating into the desired destination folder and executing. 

```
git clone <repository>
```

The default branch and the branch for the local deployment among all spring and react projects is `main`.
You can check if you checked out the correct branch by executing

```
git status
```

File hierarchy:
```
ase-delivery/
├─ ase-delivery-portal/
├─ api-gateway/
├─ discovery-service/
├─ delivery-service/
├─ messaging-service/
├─ user-service/
├─ deployment/
│  ├─ docker-compose.localdeployment.yaml
│  ├─ docker-compose.yaml
```

Navigate to the directory `deployment` using the command `cd <path>` in the terminal.

#### Ports

The application will run on the default port for http (`80`). Make sure that the port is not already used by another application.
In linux you can do that with the command

```
lsof -i -P -n | grep LISTEN | grep :80
```

### Restrictions of local deployment

The local setup of the system has some drawbacks. Due to the usage of sota 
security configurations it is not possible to:
- Scan the provided QR-codes with a different device than the one running on localhost
  - As a workaround for this issue we implemented a functionality to copy the content of the QR-code to the clipboard in order to open it in the browser directly
  - Accessing it with the machines ip address will also not work as cors would fail in that case due to a domain mismatch.
- The links provided in the email templates also link to localhost, so it is required to open them on the same machine as the one docker is running.

## Installation

### Backend and Frontend (React)

Make sure that you followed the steps described in [Preparation](#preparation) before continuing.

Execute the call

```
docker compose -f docker-compose.localdeployment.yaml up -d
```

This will fetch and build all required images. The flag `-d` detaches the docker process from the terminal.

After the successful start of docker you will now be able to access the `ase-delivery-portal` by opening the url
[http://localhost](http://localhost) in your browser.

### Hardware setup
We assume a clean raspberry pi setup, which has debian OS already installed.
You can access your Raspberry Pi by either connecting it to a display via an HDMI cable, or you can
just SSH (Secure Shell) into it. 

To enable ssh, go to Menu −→ Preferences −→ Raspberry Pi Configuration. On the Interfaces tab, you will
find the SSH option. Go ahead and set it to `Enabled`.

Connect to the raspberry-pi via `ssh`.
```ssh pi@<IP address>```

To interact with the RFID chip, you have to first enable the Serial Peripheral Interface (SPI) in your
Raspberry Pi. Open a command line and run ```sudo raspi-config```. On the screen that comes up, go
to `Interfacing Options` by using the arrow keys. Once you enter into this option, choose `SPI` on the
new screen that appears. Now, it will ask you whether you would like to enable the SPI interface. Choose
yes and press Enter. Wait until you see The SPI interface is enabled message on the screen. Now, go
back to the command line and restart your Raspberry Pi with ```sudo reboot command```. 

Login with credentials:
- Username
- Password

Create a working directory:
```mkdir Desktop/ase-project/```

Navigate to the directory:
```cd Desktop/ase-project/```

Install all required libraries:
```
sudo-apt get update
sudo-apt get upgrade
sudo apt-get install python3-dev python3-pip 
sudo pip3 install mfrc522 
sudo pip install aiohttp
```

#### Clone repository
Clone the repository from the server
```git clone https://gitlab.lrz.de/ase-22-23/team04/frontend/raspberrypi.git```

#### Profile Configuration
The first step is to adjust the network profiles.

1. Open the `profiles.py` file
```sudo nano profiles.py```
2. Enter all required information into the file
DEV = "[ip-address]:[port of api-gateway]"
LOCAL_DEPLOYMENT = "[ip-address]/gateway/"
PROD = "[hostname]/gateway/"

#### Box initialization
To load the configuration file from the server, do the following:

1. Start the initialize.py file
```sudo python initialize.py```
2. Follow the instructions of the program, choose your local profile

#### Wiring
The RFC-Reader must be wired according to `Figure 7: Wiring the RFID-RC522 to a Raspberry Pi` in the exercise file [gpio-setup.pdf](gpio-setup.pdf)

- The `green` pin of the LED is wired to `GPIO-Pin 40`
- The `red` pin of the LED is wired to `GPIO-Pin 38`
- The `lightsensor` pin is wired to `GPIO-Pin 36`

#### Main program
If you now want to configure RFID-Cards, read RFID-Cards or start the authentication program, you start the `main.py` file.
```sudo python main.py```

Starting the authentication program will start a loop which expects the user to put RFID-Cards to the reader, if authenticated he can open the box and place or collect deliveries.
The LED light indicates the status.

## Testing the System

After completing all the steps above you are ready to go 🎉. Navigate to the url
[http://localhost](http://localhost). There are two demo users created that you can use in order to test the system.

**Role: DISPATCHER**

- email: maindispatcher@asedelivery.com
- password: test123

**Role: DELIVERER**

- email: deliverer@asedelivery.com
- password: test123

We also provided you with two already configured boxes that you can use for testing.
Before you create your first delivery make sure to create `CUSTOMER` accounts (with real email-addresses) in order to see
the full functionality of the system including email notifications.

The full frontend documentation and explanation can be found [here](https://gitlab.lrz.de/ase-22-23/team04/frontend/ase-delivery-portal/-/blob/main/README.md).

## Troubleshooting
In some rare cases, docker fails to load and build dependencies. These are external issues, which can not be controlled by ourselves.
In this case, re-run the docker build script for the entire project:
```docker compose -f docker-compose.localdeployment.yaml build```

In case you want to build a single service:
```docker compose -f docker-compose.localdeployment.yaml build <service-name>```

In case you want to restart a single service and detach it from the main process:
```docker compose -f docker-compose.localdeployment.yaml up <service-name> -d```

If you are using macOS on a machine with the Silicon 1 processor you might face issues when building the `ase-delivery-portal`.
This [issue](https://github.com/docker/buildx/issues/476) might help you solving this problem.


# Production Deployment

This section describes how to deploy the full system in production.

For the university internal presentation we set up the system on a Linux machine and executed the steps below.
To make the system accessible via the internet we used the dynamic dns service [no-ip](https://www.noip.com/).

The configured hostname will therefore only be accessible for demonstration purposes.

## Preamble

For full re-deployment (in case a different remote address is desired). Please follow all steps in the 
Preamble for [Local Deployment](#local-deployment).

## Endpoint configuration

Some services have pre-configured endpoints. To change the endpoints adjust the files `application-prod.yml` in the
projects `messaging-service` and `delivery-service` to point to the desired IP Address of the remote server.
These links are later used for the email delivery and the generation of the QR-codes.

Additionally, you have to adjust the `REACT_APP_BACKEND_ENDPOINT`. It is important that the url contains the trailing `/gateway` as the setup
is designed to have only one forwarded port for the frontend. The internally running nginx server will proxy all backend calls to the actual backend inside the docker network.

After completing the steps above push the changes to `origin/master`. The CI/CD pipeline will automatically create containers for each of the changed services.

## Setup

### Setup for Backend and Frontend (React)

To start the system, navigate to the director where the `docker-compse.yaml`

```
docker compose up -d
```

This command will fetch all containers from the container registry and execute them.

### Setup Raspberry Pi
Setup for production is the same as for local deployment [Hardware setup](#hardware-setup), you only have to choose the production profile in the respective sections.


