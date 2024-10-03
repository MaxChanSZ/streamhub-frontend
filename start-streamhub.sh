#!/bin/bash

# start in frontend folder (streamhub-frontend)

# Start Apache Zookeeper
echo "Starting Apache Zookeeper..."
cd ../kafka_2.13-3.8.0/ # go to kafka folder, change to your kafka path as needed, default assume in same parent directory
bin/zookeeper-server-start.sh config/zookeeper.properties & # run zookeeper
ZOOKEEPER_PID=$!

# Start Apache Kafka
echo "Starting Apache Kafka..."
bin/kafka-server-start.sh config/server.properties & # run kafka server
KAFKA_PID=$!

# Start Spring Boot Application
# echo "Starting Spring Boot Application..."
# cd ../streamhub-backend # go to streamhub-backend folder, change path as needed, default assume in same parent directory
# # ./mvnw clean compile & # run mvn clean compile
# ./mvnw  spring-boot:run -Dspring-boot.run.profiles=local &
# SPRING_BOOT_PID=$!

# Start React Application
echo "Starting React Application..."
cd ../streamhub-frontend # go to streamhub-frontend folder, change path as needed, default assume in same parent directory
npm install
npm run dev &
REACT_PID=$!

# Wait for all processes to complete
wait $ZOOKEEPER_PID $KAFKA_PID $REACT_PID 
# $SPRING_BOOT_PID