# Arquivo.pt web application

This repository contains the frontend of [Arquivo.pt](https://arquivo.pt).

## Build

It produces a war file to be run on a Java servlet web server like Apache Tomcat.

```bash
mvn clean verify
```

## Development

To start an apache tomcat on the fly locally, you need to add the following to your hosts, explaining bellow:
/etc/hosts

```
127.0.0.1 localdev.arquivo.pt
```

Because probably you are going to use the Arquivo.pt APIs that are pubically available and the latest browsers doesn't allow the requests from http://localhost:8080 to the https://arquivo.pt APIs because of the CORS event when Arquivo.pt API is returning the following HTTP response header.

```
Access-Control-Allow-Origin: *
```

Run using the default 8.0.xx tomcat version:

```bash
mvn -P tomcat.run
```

Run it using a tomcat 9 version:

```bash
mvn clean verify && mvn -P tomcat.run -Dtomcat.version=9.0.30 -Dcargo.maven.containerId=tomcat9x
```

Example that use a development environment for the majority of the services, but for query suggestion service use production environment.

```bash
mvn clean verify && mvn -P tomcat.run -Dbackend.url=http://p25.arquivo.pt -Dquery.suggestion.server=https://arquivo.pt
```


## Dependencies
Some specific dependencies haven't been found on the central maven repository. The solution, for now, is to install locally on **my-repo** folder.

Commands used to install those files:

```bash

mvn install:install-file -Dfile=/home/ibranco/projects/arquivo/pwa-technologies-mobile/PwaArchive-access/projects/nutchwax/nutchwax-thirdparty/nutch/lib/taglibs-i18n-1.0.jar -DgroupId=org.apache.taglibs -DartifactId=taglibs-i18n -Dversion=1.0 -Dpackaging=jar -DlocalRepositoryPath=./mvn-repo

mvn install:install-file -Dfile=/home/ibranco/projects/arquivo/pwa-technologies-mobile/PwaArchive-access/projects/nutchwax/nutchwax-thirdparty/nutch/lib/taglibs-log-1.0.jar -DgroupId=org.apache.taglibs -DartifactId=taglibs-log -Dversion=1.0 -Dpackaging=jar -DlocalRepositoryPath=./mvn-repo
```
