# Arquivo.pt web application

This repository contains the frontend of [Arquivo.pt](https://arquivo.pt).

## Build

It produces a war file to be run on a Java servlet web server like Apache Tomcat.

```bash
mvn clean verify
```

## Development

To make development more rapid there is a docker-compose.yml file that runs the web application inside a docker.

Example run

```bash
mvn clean verify -Dbackend.url=https://preprod.arquivo.pt && docker-compose up
```

Example that use a development environment for the majority of the services, but for query suggestion service use production environment.

```bash
mvn clean verify -Dbackend.url=http://p25.arquivo.pt -Dquery.suggestion.server=https://arquivo.pt && docker-compose up
```

## IDE

To prepare you IDE you can download sources and javadocs of the dependencies, using:

```bash
mvn eclipse:eclipse -DdownloadSources=true -DdownloadJavadocs=true
```

## Docker for production

```bash
docker build . -t arquivo-webapp
docker run -p 127.0.0.1:8080:8080 arquivo-webapp
```
