# Analysis of queuing services in a distributed architecutre.

*By*  
**Sanjay Nag Bangalore Ravishankar  
Daniel Sampreeth Reddy Eadara  
Atish Maitreya and   
Viraj Upadhyay**

## Steps to run the application

### Start the Zookeeper and Kafka Broker 
```
cd canvas-backend/
cd kafka_2.11-1.1.0/
bin/zookeeper-server-start.sh config/zookeeper.properties 
bin/kafka-server-start.sh config/server.properties

<!--For creating topics-->
bin/kafka-topics.sh --create --zookeeper 127.0.0.1:2181 --replication-factor 1 --partitions 1 --topic response_topic 
```

### Start the Kafka producer
```
cd canvas-backend/
cd kafka-frontend/
npm install
node index.js
```

### Start the Kafka consumer
```
cd canvas-backend/
cd kafka-backend/
npm install
npm start
```

### Start React Frontend
```
cd canvas-frontend/
npm install
npm start
```

