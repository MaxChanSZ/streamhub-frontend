#!/bin/bash

# start in frontend folder

# Start Apache Zookeeper
echo "Starting Apache Zookeeper..."
cd ../kafka_2.13-3.8.0/ # go to kafka folder
bin/zookeeper-server-start.sh config/zookeeper.properties & # run zookeeper
ZOOKEEPER_PID=$!

# Start Apache Kafka
echo "Starting Apache Kafka..."
bin/kafka-server-start.sh config/server.properties & # run kafka server
KAFKA_PID=$!

# Start Spring Boot Application
# echo "Starting Spring Boot Application..."
# cd ../streamhub-backend
# # ./mvnw clean compile & # run mvn clean compile
# ./mvnw  spring-boot:run -Dspring-boot.run.arguments="spring.profiles.active=local" &
# SPRING_BOOT_PID=$!

# Start React Application
echo "Starting React Application..."
cd ../streamhub-frontend
npm run dev &
REACT_PID=$!

# Wait for all processes to complete
wait $ZOOKEEPER_PID $KAFKA_PID $REACT_PID # $SPRING_BOOT_PID