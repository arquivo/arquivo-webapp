

## Local maven repository
There is a mvn-repo folder that contains the old jar dependencies.

```bash

mvn install:install-file -Dfile=/home/ibranco/projects/arquivo/pwa-technologies-mobile/PwaArchive-access/projects/nutchwax/nutchwax-thirdparty/nutch/lib/taglibs-i18n-1.0.jar -DgroupId=org.apache.taglibs -DartifactId=taglibs-i18n -Dversion=1.0 -Dpackaging=jar -DlocalRepositoryPath=./mvn-repo

mvn install:install-file -Dfile=/home/ibranco/projects/arquivo/pwa-technologies-mobile/PwaArchive-access/projects/nutchwax/nutchwax-thirdparty/nutch/lib/taglibs-log-1.0.jar -DgroupId=org.apache.taglibs -DartifactId=taglibs-log -Dversion=1.0 -Dpackaging=jar -DlocalRepositoryPath=./mvn-repo
```

## Start tomcat on the fly

```bash
mvn -P tomcat.run
```

using tomcat 9:

```bash
mvn clean verify && mvn -P tomcat.run -Dtomcat.version=9.0.30 -Dcargo.maven.containerId=tomcat9x
```
