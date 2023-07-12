# Api Gateway

This file describes how you can clone and execute this spring service on your local machine.

## Clone repository

Clone this repository by executing

```
git clone <repository-url>
```

Make sure that you checked out the branch `main` by executing

```
git status
```

## Requirements

The sourceCompatibility is set to `17`. Make sure that you have a suitable version of Java installed.

## Preparation

Make sure that there is a running instance of MongoDB running on your machine.
The required settings are
- `MONGO_INITDB_ROOT_USERNAME`=aseAdmin
- `MONGO_INITDB_ROOT_PASSWORD`=test
- `PORT`=27017 (default)

You can start an instance of mongo inside docker by executing

```
docker run -d -p 27017:27017 --name mongo_docker \
      -e MONGO_INITDB_ROOT_USERNAME=aseAdmin \
      -e MONGO_INITDB_ROOT_PASSWORD=test \
      mongo
```

## Execution
**!!!IMPORTANT!!!:** in order to execute the services you have to use the spring profile `dev`. Otherwise, the service will fail to start.

You can start the service either by starting it in your IDE or by executing

```
./gradlew bootRun --args='--spring.profiles.active=dev'
```