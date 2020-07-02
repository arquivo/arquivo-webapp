# Use maven container to build and tomcat container to run.
FROM maven:3.6.3-openjdk-11 AS builder

WORKDIR /tmp/build
COPY mvn-repo mvn-repo
COPY pom.xml pom.xml
COPY src src
RUN mvn verify

# Container to run
FROM tomcat:9.0.36-jdk11-openjdk
COPY --from=builder /tmp/build/target/arquivo-webapp.war $CATALINA_HOME/webapps/ROOT.war

HEALTHCHECK --interval=1m --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:8080/ROOT/ || exit 1
