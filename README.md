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

## Dependencies
Some specific dependencies haven't been found on the central maven repository. The solution, for now, is to install locally on **my-repo** folder.

Commands used to install those files:

```bash

mvn install:install-file -Dfile=/home/ibranco/projects/arquivo/pwa-technologies-mobile/PwaArchive-access/projects/nutchwax/nutchwax-thirdparty/nutch/lib/taglibs-i18n-1.0.jar -DgroupId=org.apache.taglibs -DartifactId=taglibs-i18n -Dversion=1.0 -Dpackaging=jar -DlocalRepositoryPath=./mvn-repo

mvn install:install-file -Dfile=/home/ibranco/projects/arquivo/pwa-technologies-mobile/PwaArchive-access/projects/nutchwax/nutchwax-thirdparty/nutch/lib/taglibs-log-1.0.jar -DgroupId=org.apache.taglibs -DartifactId=taglibs-log -Dversion=1.0 -Dpackaging=jar -DlocalRepositoryPath=./mvn-repo
```
