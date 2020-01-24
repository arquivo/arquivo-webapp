# Arquivo.pt web application

This repository contains the frontend of [Arquivo.pt](https://arquivo.pt).

## Build

It produces a war file to be run on a Java servlet web server like Apache Tomcat.

```bash
mvn clean verify
```

## Development

To start an apache tomcat on the fly, using a 8.0.xx version, run:

```bash
mvn -P tomcat.run
```

To run this application on tomcat 9 use:

```bash
mvn clean verify && mvn -P tomcat.run -Dtomcat.version=9.0.30 -Dcargo.maven.containerId=tomcat9x
```

## Dependencies
Some specific dependencies haven't been found on the central maven repository. The solution, for now, is to install locally on **my-repo** folder.

Commands used to install those files:
```bash

mvn install:install-file -Dfile=/home/ibranco/projects/arquivo/pwa-technologies-mobile/PwaArchive-access/projects/nutchwax/nutchwax-thirdparty/nutch/lib/taglibs-i18n-1.0.jar -DgroupId=org.apache.taglibs -DartifactId=taglibs-i18n -Dversion=1.0 -Dpackaging=jar -DlocalRepositoryPath=./mvn-repo

mvn install:install-file -Dfile=/home/ibranco/projects/arquivo/pwa-technologies-mobile/PwaArchive-access/projects/nutchwax/nutchwax-thirdparty/nutch/lib/taglibs-log-1.0.jar -DgroupId=org.apache.taglibs -DartifactId=taglibs-log -Dversion=1.0 -Dpackaging=jar -DlocalRepositoryPath=./mvn-repo
```
