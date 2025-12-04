# System Architecture

## High-Level Overview

```mermaid
graph TD
    Client[Web & Mobile Clients] --> LB[AWS ALB]
    LB --> Ingress[K8s Ingress Controller]
    
    subgraph EKS Cluster
        Ingress --> API[Backend API Pods]
        Ingress --> Socket[WebSocket Service]
        
        API --> Telemetry[Telemetry Worker]
    end
    
    subgraph Data Layer
        API --> RDS[(Postgres + PostGIS)]
        API --> Redis[(Redis Cache)]
        Telemetry --> Influx[(InfluxDB / Prometheus)]
        Telemetry --> RabbitMQ[Message Queue]
    end
    
    IoT[Truck Sensors] --> MQTT[IoT Gateway] --> RabbitMQ
```

## Database Schema (ERD)

```mermaid
erDiagram
    User ||--o{ PickupRequest : requests
    User {
        string id
        string email
        enum role
    }
    
    PickupRequest {
        string id
        enum type
        enum status
        point location
    }
    
    Truck ||--o{ Route : executes
    Truck {
        string id
        string plate
        point current_location
        float fuel_level
    }
    
    Route ||--o{ Stop : contains
    Route {
        string id
        date scheduled_date
    }
    
    Bin {
        string id
        float fill_level
        point location
        enum type
    }
```

## Key Components

1. **Backend API**: RESTful service (Fastify) handling users, assets, and pickup CRUD.
2. **Telemetry Ingestion**: A separate worker service that consumes high-frequency GPS and sensor data from RabbitMQ/SQS and writes to TimescaleDB/InfluxDB.
3. **PostGIS**: Used for geospatial queries (e.g., "Find all bins within 5km of Truck A").
