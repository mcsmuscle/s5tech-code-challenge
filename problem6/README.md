# Real-Time Leaderboard System - API Specification

## Overview
This module implements a secure, real-time leaderboard system that tracks and displays the top 10 users by score. The system prevents unauthorized score manipulation through cryptographic verification and implements efficient real-time updates using WebSocket connections.

## Tech Stack

This specification requires the following core technologies, as detailed in the architecture sections.

### 1. Core Backend Technologies

*   **Runtime Environment**: Node.js (v18+) or any other modern backend runtime capable of handling high concurrency.
*   **Database (Primary Storage)**: **PostgreSQL**. Used for storing user data, score transactions (audit trail), and action tokens.
*   **Cache & Real-Time Data Store**: **Redis Cluster**.
    *   **Sorted Sets (Z-SET)**: For implementing the high-performance leaderboard (`leaderboard:global`).
    *   **Hashes**: For caching individual user scores (`user:score:{user_id}`).
    *   **Key-Value with TTL**: For blacklisting used tokens (`token:used:{token_hash}`).
    *   **Pub/Sub**: For broadcasting updates across multiple WebSocket server instances to enable horizontal scaling.
*   **Real-Time Communication**: **WebSocket**. Manages persistent connections for live leaderboard updates (`/api/v1/leaderboard/stream`).
*   **Authentication & Authorization**: **JSON Web Tokens (JWT)**.
    *   **Access Tokens**: For securing API endpoints.
    *   **Action Tokens**: Custom JWTs generated for authorizing single-use score updates, preventing replay attacks.
*   **Message Queue (Optional for Scaling)**: RabbitMQ or Kafka. Mentioned as a potential component for asynchronous processing in a large-scale architecture.

### 2. Security & Infrastructure

*   **Rate Limiting Algorithm**: **Sliding Window Algorithm** implemented with Redis for both user-level and IP-level limits.
*   **Reverse Proxy / Load Balancer**: NGINX or AWS ALB. Manages incoming HTTP/WebSocket traffic and distributes it to API server instances.
*   **SSL Termination**: Let's Encrypt, AWS Certificate Manager, or Cloudflare for securing communications (HTTPS/WSS).

### 3. Development & Testing Tools

*   **API Testing**: Postman or Insomnia (including WebSocket testing capabilities).
*   **Database Management**: pgAdmin for PostgreSQL.
*   **Load Testing**: Tools like k6, JMeter, or Locust to simulate high traffic as outlined in the "Load Tests" section.
*   **Containerization**: Docker (for development consistency) and Kubernetes (for production orchestration).

### 4. Monitoring & Observability

*   **Metrics Collection**: Prometheus, Datadog, or similar tools to track key metrics (e.g., cache hit ratio, latency).
*   **Logging**: Structured logging (JSON format) aggregated by a system like ELK Stack (Elasticsearch, Logstash, Kibana) or Datadog Logs.
*   **Error Tracking**: Sentry or a similar service for real-time error reporting and alerting.

## System Flow Diagram

The following sequence diagram illustrates the complete, end-to-end flow of the system, from a client fetching the leaderboard to generating a token, submitting a score, and receiving real-time updates via WebSocket. It also covers key security scenarios like replay attack prevention.

**[➡️ View the Interactive Diagram on Mermaid Live](https://mermaidchart.com/play?utm_source=mermaid_live_editor&utm_medium=share#pako:eNrNWOtT20gS_1f69OHKbAwYB0hQLbnyQwtOjO21RMjmuHKNpcGeQpa8oxEsR_G_b89D9hjJQOr2qtYfrMf0u3_d06NHJ0wj6rhORn_PaRLSLiMzThbXCeBvSbhgIVuSREAnZhQvJIMrOjVPZap-W1L0UxJBm8QEBfIyUWvUk1Ty4lN-V0mSi7mikVdJxEJapvLDlFNJpm-20nWVVaM0EzNO_V_7ZYoxjVgmifRNh4TzCjlXvvHfT8NbKuA8n5aJhmJOuaTTNzpS2XWiKQepoJDerRbqisqFXsIEIzF00iShoWBpAv-EPiUR5dOU8Ai-MnqvReh_zb776VO_7cKZF8A-WbL9u4P9eM20L9Klpu63kRID7sIvKb-X8sYy4ZlJIa7guvLdhe9j7-u4NTjzwBLlzuJ0SmJNTmKhQwTnzEiQP8W_WygK0iUcNOAyozyDLhFEE9I4o4b5gmXZmlvb0EVvfK_vdQL4CX4ZDy8gVwKG4643hvZvIFJB4kmmEt71_A70exe9ADWtJXXbKyOkdrQLqaOSqsLdVre71dOyW8Mvxo8kWscOF3U-XGg2GkgD7zaS99kfDuzkbUPBGloWDm5S6QKJdwO2oHC5jIig2VYoIEarkJAJTouyVmC48jE6S6z1iFrKNMGVL73F0nPhK4mZVAifrwJM6S01JHJ114hRrzXlit-KiOWKlwkyjVk2p5GlySRCgnhbHlY5kPo6OeeyF1kRrtJblJSfkGU2T8VrJaiw0kkXy5higKGlTd417p3RhHKyjlFF6EdDf12GRLFn-zPNR3eFFPPzlO9_etRrE_GwpC5cO53hxajvBd7kouf7PUSK8_QDVfssT8oLn2bZytIiVeuCkG_QbBYiQ2S7oyWqbroWqQPhxWzGpixm4qEmS7IOlhc7ml0xmiLuzGl4C5yGatfQwajDktM7-eKG8AVLZppN16vRqvXEdFOiWeyQOMxjtEk9o4E5rVlm1CFiNzcMScTDjpVszmZzAekNGDF614GwkJaB6icqOWafC0mSpAIWJGFLRWOH6ZlVBhoUS0SFZsKijejUtfjJnbS3DkmK22JFxHoD3xsHeAmGK26JmUzZVVP3kznJ5nVYadkQTP9YMk6zCRE7FYHVMPYFPkS28gIZBu-a7B14UpiF98o2twlnySnxTB8-z6dn4d7e3rVjWyXXzEvLbhd7d-PpTcXp59MFE9mqSCNj9NsqUunM9jMl5HXL_141mEQjnoYoUi3UbMNXcNipROdXytnNg-rfPpslROR8S3GpitX5X2cfaj_DEWCxvihdGbKHoYXT08Kcqooxrd771vMDX3O5SB65j2t4Pz1r-UYTIgNTkCcR1M7StHC2XEab00O5kK7OvbEHa3VwCv-C1qArzY4QpdDzYXDZ728tIWVEXdmDmYxK-_rzbtOmM5aoCWhKcPYJOEkyYuHWNr7tnfUGEOD45bc6Qa-YGmySy1G3FXhmLPJxz7QnotONp3eytCynWaScHXvB5XjQG5zBTxVO6gEj0iitJfReC8MyPW40tkbdbl66uMXaT9PBnnWtiMaC6C2BpXmm1WB7LDTWrSRVNrS1AjPi0WibeSZoZTTIABaJP4XB8Kq2A1UI2YqGC8JvdbSiik1weCGH01I-X0CLDr99AnlWO997g84YB-HyqCSzDY8mytuqiN4XmmQ-KzVgTLxv24oT3iMbtsqDa6dagw5LOybhLU564nlYjI5zE3juanStzNbgsIx7Ll-fHQxKX-gx5hjzpSpQrwRpTJJbF47KwosO7ueh7MVYYKpKZG3jvWR7dbPMNKsLguc22nU-6sC17qe3HBfaHA_aIck2RuECQXeMrM8T5Q1GDtKjXA3jFrPm3VKp0lZp3k55dh9dtvs9_3wj1rk-qayCvVHahaynivnemFV1RnjpbAoNOIGrXnDud4Zjz68QbI6k90x-VFDTgB2XzdPD-ih2gekiMz0dPhYzu6V-oh2VY004J8mMop3_xhHiP_UNI_W7J1tXKY0ihVa8-giAbcV8PXiLbpT-JtD4NMw5TvF4shnTZUweoCUEFiuM9Gz-f5unoOYTPMCq_rDzA8PVXzAK_Q9jh9rt_wE13dZaMR6jowfV7neqOoPHecqLJmhTVzaGw8aJTPZNzEITQar5rx0tgRgJ0lgFsDRSEBh7o37rt0krCFqdL6tZ9c2JV-Mdwss60P8V2dZS9YsfG6D_NuPuCzuzJjVOwic9Feeyw5FZ-ioWTMi3wKABbbIKTCUSjF4bBMHwizeYeN9GvbHXxXg7dWfGWeS4amtxFpQviHx0HqXWawdhsMBWIVkjnFrkBi55liT5nqaLgo2n-WzuuDckzvBJ9xfzVXhFQhNsQB2sDOG4R0qC4z46fzhu86Cxh_vYcfOkcXzUOD48_lh3Hhx39_Bk78PR8Ydm4_3JyXHz_eFT3fmv0tnca344bn5sHh1-PGkcHh6cPP0Jr3JKdg)**

## Architecture Components

### 1. Core Services
- **Score Service**: Handles score verification, updates, and leaderboard queries
- **WebSocket Service**: Manages real-time connections and broadcasts leaderboard updates
- **Authentication Service**: Validates user sessions and generates action tokens
- **Redis Cache**: Stores leaderboard data using Sorted Sets for O(log N) performance

### 2. Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    total_score BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_total_score (total_score DESC)
);

-- Score transactions table (audit trail)
CREATE TABLE score_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    score_delta INTEGER NOT NULL,
    previous_score BIGINT NOT NULL,
    new_score BIGINT NOT NULL,
    action_token_hash VARCHAR(64) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_action_token (action_token_hash)
);

-- Action tokens table (prevents replay attacks)
CREATE TABLE action_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    score_value INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);
```

### 3. Redis Data Structure

```
# Leaderboard sorted set (Z-SET)
Key: "leaderboard:global"
Score: user's total score
Member: user_id

# User score cache
Key: "user:score:{user_id}"
Value: JSON {score: INT, username: STRING, updated_at: TIMESTAMP}
TTL: 3600 seconds

# Action token blacklist (prevents double-use)
Key: "token:used:{token_hash}"
Value: "1"
TTL: token expiration time + 3600 seconds
```

## API Endpoints

### 3.1 Generate Action Token
**Endpoint**: `POST /api/v1/actions/generate-token`

**Purpose**: Generate a cryptographically signed token that authorizes a score update.

**Request Headers**:
```
Authorization: Bearer {jwt_access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
    "action_type": "COMPLETE_MISSION",
    "metadata": {
        "mission_id": "uuid",
        "difficulty": "hard"
    }
}
```

**Response** (200 OK):
```json
{
    "action_token": "eyJhbGc...",
    "expires_at": "2025-10-01T12:35:00Z",
    "score_value": 100
}
```

**Token Structure** (JWT):
```json
{
    "sub": "user_id",
    "action_type": "COMPLETE_MISSION",
    "score_value": 100,
    "nonce": "random_string",
    "iat": 1727784600,
    "exp": 1727784900
}
```

**Business Logic**:
1. Validate user authentication
2. Verify action eligibility (prevent farming/abuse)
3. Calculate score value based on action_type
4. Generate JWT with 5-minute expiration
5. Store token hash in database with expiration
6. Return token to client

**Error Responses**:
- `401 Unauthorized`: Invalid or missing authentication
- `429 Too Many Requests`: Rate limit exceeded
- `400 Bad Request`: Invalid action_type

---

### 3.2 Submit Score Update
**Endpoint**: `POST /api/v1/scores/submit`

**Purpose**: Submit a completed action with its token to update user score.

**Request Headers**:
```
Authorization: Bearer {jwt_access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
    "action_token": "eyJhbGc..."
}
```

**Response** (200 OK):
```json
{
    "success": true,
    "user": {
        "id": "uuid",
        "username": "player123",
        "previous_score": 1500,
        "new_score": 1600,
        "score_delta": 100
    },
    "leaderboard_position": 5,
    "transaction_id": "uuid"
}
```

**Business Logic**:
1. Validate JWT access token (user authentication)
2. Decode and verify action token signature
3. Check token expiration (5 minutes)
4. Verify token hasn't been used (check Redis blacklist)
5. Verify token belongs to authenticated user
6. Verify token hash exists in database and is unused
7. Begin database transaction:
   - Update user's total_score
   - Insert score_transaction record
   - Mark action_token as used
8. Update Redis leaderboard (ZINCRBY)
9. Update user cache in Redis
10. Mark token as used in Redis blacklist
11. Commit transaction
12. Broadcast leaderboard update via WebSocket (async)
13. Return success response

**Error Responses**:
- `401 Unauthorized`: Invalid authentication
- `400 Bad Request`: Invalid or expired token
- `409 Conflict`: Token already used (replay attack detected)
- `403 Forbidden`: Token doesn't belong to user
- `500 Internal Server Error`: Database error (transaction rolled back)

---

### 3.3 Get Leaderboard
**Endpoint**: `GET /api/v1/leaderboard/top`

**Purpose**: Retrieve the top 10 users by score.

**Query Parameters**:
```
limit: integer (default: 10, max: 100)
offset: integer (default: 0)
```

**Response** (200 OK):
```json
{
    "leaderboard": [
        {
            "rank": 1,
            "user_id": "uuid",
            "username": "player123",
            "score": 15000,
            "updated_at": "2025-10-01T12:30:00Z"
        }
    ],
    "total_users": 50000,
    "cached_at": "2025-10-01T12:30:05Z"
}
```

**Business Logic**:
1. Check Redis cache for leaderboard (cache-aside pattern)
2. If cache hit: Return cached data
3. If cache miss:
   - Query database for top users (ORDER BY total_score DESC)
   - Populate Redis sorted set
   - Set TTL to 60 seconds
   - Return data
4. Enrich response with rank calculation

**Performance**:
- Redis query: O(log N + M) where M = limit
- Database fallback: < 10ms with proper indexing
- Cache TTL: 60 seconds

---

### 3.4 WebSocket Connection
**Endpoint**: `WS /api/v1/leaderboard/stream`

**Purpose**: Real-time leaderboard updates via WebSocket.

**Connection Headers**:
```
Authorization: Bearer {jwt_access_token}
Upgrade: websocket
```

**Connection Flow**:
1. Client initiates WebSocket handshake
2. Server validates JWT token
3. Connection established
4. Server sends initial leaderboard snapshot
5. Server sends incremental updates on score changes

**Message Format** (Server → Client):
```json
{
    "type": "leaderboard_update",
    "timestamp": "2025-10-01T12:30:00Z",
    "changes": [
        {
            "user_id": "uuid",
            "username": "player123",
            "old_rank": 6,
            "new_rank": 5,
            "score": 1600,
            "score_delta": 100
        }
    ],
    "leaderboard": [
        {
            "rank": 1,
            "user_id": "uuid",
            "username": "player123",
            "score": 15000
        }
    ]
}
```

**Heartbeat/Ping**:
```json
{
    "type": "ping",
    "timestamp": "2025-10-01T12:30:00Z"
}
```

**Client Response**:
```json
{
    "type": "pong"
}
```

**Disconnection Handling**:
- Automatic reconnection with exponential backoff
- Server maintains connection for 5 minutes idle
- Client should ping every 30 seconds

---

### 3.5 Get User Rank
**Endpoint**: `GET /api/v1/users/{user_id}/rank`

**Purpose**: Get specific user's current rank and score.

**Response** (200 OK):
```json
{
    "user_id": "uuid",
    "username": "player123",
    "score": 1600,
    "rank": 5,
    "users_above": 4,
    "users_below": 45000,
    "percentile": 99.99
}
```

**Business Logic**:
1. Query Redis sorted set: ZREVRANK for rank
2. Query Redis sorted set: ZSCORE for score
3. Calculate percentile: (users_below / total_users) * 100
4. Return enriched data

## Security Implementation

### 4.1 Token Security
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret Key**: 256-bit randomly generated, stored in environment variable
- **Token Lifetime**: 5 minutes (prevents long-term replay attacks)
- **Nonce**: Unique random string per token (prevents token forgery)
- **Token Hash Storage**: SHA-256 hash stored in database (prevents rainbow table attacks)

### 4.2 Replay Attack Prevention
1. Each action token can only be used once
2. Token hash stored in Redis blacklist after use (TTL = token expiration + 1 hour)
3. Database constraint ensures token uniqueness
4. Concurrent requests handled with optimistic locking

### 4.3 Rate Limiting
```
User-level limits:
- Token generation: 60 requests/minute
- Score submission: 30 requests/minute
- Leaderboard queries: 120 requests/minute

IP-level limits:
- Token generation: 300 requests/minute
- Score submission: 150 requests/minute
```

Implementation: Redis with sliding window algorithm

### 4.4 Input Validation
- JWT signature verification
- Token expiration check
- User ID matching (token.sub === authenticated_user.id)
- Action type whitelisting
- Score value validation (must match server-calculated value)

### 4.5 Audit Trail
All score changes logged in `score_transactions` table with:
- User ID
- Action type
- Score delta
- IP address
- User agent
- Timestamp
- Token hash (for forensic analysis)

## Performance Optimization

### 5.1 Caching Strategy
- **Leaderboard Cache**: Redis sorted set, TTL 60 seconds
- **User Score Cache**: Redis hash, TTL 1 hour
- **Write-through cache**: Update both DB and cache on score changes
- **Cache invalidation**: Selective invalidation on score updates

### 5.2 Database Optimization
- Indexed queries on `total_score DESC`
- Connection pooling (min: 10, max: 50)
- Read replicas for leaderboard queries
- Master DB for writes only

### 5.3 WebSocket Scaling
- **Load Balancing**: Redis Pub/Sub for multi-instance broadcast
- **Connection Limit**: 10,000 connections per instance
- **Message Batching**: Group updates within 100ms window
- **Selective Broadcasting**: Only broadcast top 100 position changes

### 5.4 Horizontal Scaling
- Stateless API servers (can add instances freely)
- Redis Cluster for cache distribution
- PostgreSQL read replicas for query distribution
- Message queue (RabbitMQ/Kafka) for async processing

## Monitoring & Observability

### 6.1 Metrics
- Token generation rate
- Token validation success/failure rate
- Score update latency (p50, p95, p99)
- WebSocket connection count
- Cache hit/miss ratio
- Database query latency
- Replay attack detection count

### 6.2 Alerts
- Token validation failure rate > 5%
- Score update latency p95 > 500ms
- Cache hit ratio < 80%
- Database connection pool exhaustion
- Suspected abuse pattern detected

### 6.3 Logging
```json
{
    "timestamp": "2025-10-01T12:30:00Z",
    "level": "info",
    "service": "score-service",
    "action": "score_update",
    "user_id": "uuid",
    "score_delta": 100,
    "new_score": 1600,
    "latency_ms": 45,
    "transaction_id": "uuid"
}
```

## Error Handling

### 7.1 Client Errors (4xx)
- Return detailed error messages in development
- Return generic messages in production
- Log all validation failures

### 7.2 Server Errors (5xx)
- Automatic retry with exponential backoff
- Transaction rollback on failure
- Alert on-call engineer
- Graceful degradation (return cached data if DB fails)

### 7.3 WebSocket Errors
- Automatic reconnection (max 5 attempts)
- Fallback to HTTP polling if WebSocket unavailable
- Connection state recovery

## Deployment Configuration

### 8.1 Environment Variables
```bash
# Database
DB_HOST=postgres.example.com
DB_PORT=5432
DB_NAME=leaderboard
DB_USER=app_user
DB_PASSWORD=<secret>
DB_POOL_MIN=10
DB_POOL_MAX=50

# Redis
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=<secret>
REDIS_CLUSTER_ENABLED=true

# Security
JWT_SECRET=<256-bit-secret>
ACTION_TOKEN_SECRET=<256-bit-secret>
TOKEN_EXPIRATION_SECONDS=300

# Rate Limiting
RATE_LIMIT_TOKEN_GENERATION=60
RATE_LIMIT_SCORE_SUBMISSION=30

# WebSocket
WS_MAX_CONNECTIONS=10000
WS_HEARTBEAT_INTERVAL=30
WS_IDLE_TIMEOUT=300

# Monitoring
SENTRY_DSN=<sentry-url>
LOG_LEVEL=info
```

### 8.2 Infrastructure Requirements
- **API Servers**: 3+ instances (behind load balancer)
- **PostgreSQL**: Primary + 2 read replicas
- **Redis**: 3-node cluster (master + 2 replicas)
- **Load Balancer**: NGINX or AWS ALB
- **Minimum Resources per API instance**:
  - CPU: 2 cores
  - Memory: 4GB
  - Network: 1Gbps

## 9. Testing Checklist

This checklist outlines the minimum required tests to ensure the system is robust, secure, and performant. Tests should be automated where possible.

### 9.1 API Endpoint Tests: Core Functionality & Security

#### `POST /api/v1/actions/generate-token`
- [ ] **Success Case**: A valid, authenticated user can generate a token and the token hash is stored correctly in the `action_tokens` table.
- [ ] **Authentication Failure**: Request with a missing, invalid, or expired JWT access token returns a `401 Unauthorized` error.
- [ ] **Rate Limiting**: Exceeding the request limit (e.g., >60 requests/minute) for a single user returns a `429 Too Many Requests` error.
- [ ] **Abuse Prevention**: Test logic that prevents token farming (e.g., user cannot generate tokens too frequently without completing actions).

#### `POST /api/v1/scores/submit`
- [ ] **Valid Score Update**: A valid `action_token` successfully increments the user's `total_score`, creates a `score_transactions` record, and marks the `action_token` as used. The response contains the correct `new_score` and `leaderboard_position`.
- [ ] **Invalid Token**: Submitting a malformed or non-existent token returns a `400 Bad Request`.
- [ ] **Expired Token**: Submitting a token after its 5-minute expiration window returns a `400 Bad Request`.
- [ ] **Used Token (Replay Attack)**: Submitting the same valid token a second time returns a `409 Conflict` error, both by checking the Redis blacklist and the database `used_at` field.
- [ ] **Token Ownership Mismatch**: User A attempting to use a token generated for User B returns a `403 Forbidden` error.
- [ ] **Authentication Failure**: Submitting a score with an invalid JWT access token returns a `401 Unauthorized`.
- [ ] **Rate Limiting**: Exceeding the submission limit (e.g., >30 requests/minute) returns a `429 Too Many Requests`.

#### `GET /api/v1/leaderboard/top`
- [ ] **Success Case (Cache Miss)**: The first request correctly queries the database, returns the top 10 users, and populates the Redis cache.
- [ ] **Success Case (Cache Hit)**: A subsequent request within the 60-second TTL returns the cached leaderboard data without hitting the database.
- [ ] **Parameter Handling**: Verify that `limit` and `offset` query parameters work as expected and are capped at the maximum allowed value (100).

#### `GET /api/v1/users/{user_id}/rank`
- [ ] **Success Case**: Correctly returns the user's rank, score, and percentile by querying Redis (`ZREVRANK`, `ZSCORE`).
- [ ] **User Not Found**: Requesting a rank for a non-existent user ID returns a `404 Not Found`.

### 9.2 WebSocket Tests: Real-Time Functionality

- [ ] **Connection Authentication**: A client with a valid JWT access token can successfully establish a WebSocket connection. An invalid token results in connection termination.
- [ ] **Initial State Snapshot**: Upon successful connection, the client immediately receives the current top 10 leaderboard snapshot.
- [ ] **Leaderboard Update Broadcast**: A score update that changes the top 10 rankings (e.g., a user enters the top 10, or positions change within the top 10) triggers a `leaderboard_update` message to all connected clients.
- [ ] **No Broadcast on Minor Changes**: A score update for a user ranked outside the top 10 (which does not affect the top 10) **does not** trigger a broadcast. This is critical for performance.
- [ ] **Multiple Clients**: All connected clients receive the same update simultaneously.
- [ ] **Disconnection/Reconnection**: A client can gracefully disconnect and reconnect, receiving the latest leaderboard snapshot upon reconnection.
- [ ] **Heartbeat Mechanism**: The server correctly handles `ping` messages from the client and responds appropriately to maintain the connection.

### 9.3 Integration & System Tests

- [ ] **End-to-End Flow**: Simulate the full user journey: generate token -> submit score -> verify database and cache updates -> confirm WebSocket broadcast is received by other clients.
- [ ] **Database Transaction Integrity**: Force a failure mid-transaction (e.g., after updating `users` table but before updating `action_tokens`). Verify that the entire transaction is rolled back and the database remains in a consistent state.
- [ ] **Cache Consistency**: Verify that after a score update, both the database and Redis (sorted set and user score cache) contain the same, correct score.
- [ ] **Token Cleanup**: If a cleanup job is implemented, verify that it correctly removes old, expired tokens from the `action_tokens` table without affecting active ones.

### 9.4 Load & Performance Tests

- [ ] **Concurrent Score Updates**: Test the system with a high rate of concurrent score submissions (target: 1000 RPS). Monitor API response times (p95, p99 < 500ms) and database CPU usage.
- [ ] **WebSocket Connection Scalability**: Stress test the system by maintaining a large number of concurrent WebSocket connections (target: 10,000 per instance). Monitor server memory usage and message latency.
- [ ] **Database Performance Under Load**: Ensure that leaderboard queries (`ORDER BY total_score DESC`) remain fast (< 50ms) even with millions of users in the `users` table.
- [ ] **Cache Performance**: Measure the cache hit/miss ratio under a realistic load. The hit ratio for the main leaderboard should be high (>80%).

### 9.5 Security & Failure Scenario Tests

- [ ] **Token Forgery Attempts**: Attempt to submit score updates with manually crafted JWTs (invalid signature, modified payload). These must be rejected.
- [ ] **SQL Injection**: Test all endpoints with potential SQL injection payloads to ensure inputs are properly sanitized.
- [ ] **Graceful Degradation (Redis Failure)**: Simulate a Redis outage. Verify that the system can gracefully fall back to the database for leaderboard queries without crashing.
- [ ] **Graceful Degradation (Database Failure)**: Simulate a database write failure. Verify that API calls return a `500 Internal Server Error` and transactions are rolled back, preventing data corruption.

## API Client Example

### JavaScript/TypeScript Client
```typescript
class LeaderboardClient {
    private ws: WebSocket;
    private token: string;
    
    async generateActionToken(actionType: string): Promise<string> {
        const response = await fetch('/api/v1/actions/generate-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action_type: actionType })
        });
        const data = await response.json();
        return data.action_token;
    }
    
    async submitScore(actionToken: string): Promise<void> {
        const response = await fetch('/api/v1/scores/submit', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action_token: actionToken })
        });
        
        if (!response.ok) {
            throw new Error('Score submission failed');
        }
    }
    
    connectWebSocket(onUpdate: (data: any) => void): void {
        this.ws = new WebSocket(`wss://api.example.com/api/v1/leaderboard/stream`);
        
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                type: 'authenticate',
                token: this.token
            }));
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };
        
        // Heartbeat
        setInterval(() => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);
    }
}
```

## Additional Notes

### Critical Implementation Considerations

1. **Token Generation Timing**: Tokens should be generated by the server BEFORE the user starts an action, not after completion. This prevents the client from controlling when tokens are issued.

2. **Server-Side Validation**: The server must independently verify that the user actually completed the action. The token authorizes the score update, but server-side validation (e.g., checking game state, mission completion status) is still required to prevent cheating.

3. **Score Value Calculation**: Score values must be calculated server-side based on action type and difficulty. Never trust client-provided score values.

4. **Atomic Operations**: Use database transactions to ensure atomicity of score updates. If any step fails, the entire operation should rollback.

5. **Graceful Degradation**: If Redis is unavailable, the system should fallback to database queries. If WebSocket fails, clients should fallback to HTTP polling.

6. **Time Synchronization**: Ensure all servers have synchronized clocks (use NTP) to prevent token expiration issues across multiple instances.

7. **Token Rotation**: Rotate JWT secrets periodically (every 90 days) using a dual-secret system to avoid downtime during rotation.

8. **CORS Configuration**: Properly configure CORS headers for WebSocket and HTTP endpoints to prevent unauthorized access.

9. **DDoS Protection**: Implement rate limiting at multiple layers (CDN, load balancer, application) to prevent abuse.

10. **Data Consistency**: Use optimistic locking or distributed locks to handle concurrent score updates for the same user.

### Potential Improvements for V2

1. **Multi-Region Support**: Implement geo-distributed databases and caches for lower latency globally.

2. **Machine Learning Fraud Detection**: Implement ML models to detect abnormal scoring patterns and automated bots.

3. **Leaderboard Segmentation**: Support multiple leaderboards (daily, weekly, monthly, all-time, regional).

4. **Achievement System**: Extend the system to support achievements and badges alongside scores.

5. **Social Features**: Add friend leaderboards and direct challenges between users.

6. **Historical Analytics**: Track score trends over time for user engagement analysis.

7. **Dynamic Difficulty Adjustment**: Adjust score values based on user skill level and action completion time.

8. **Blockchain Integration**: For ultimate transparency, store score transactions on a blockchain (for high-stakes gaming scenarios).

---

**Document Version**: 1.0  
**Last Updated**: Jan 1, 2025  
**Review Status**: Ready for Implementation