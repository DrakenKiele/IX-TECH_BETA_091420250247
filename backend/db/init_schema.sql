-- IX-TECH Aniota App: Initial Database Schema
-- This schema is designed for extensibility and correlation/pattern analysis.

CREATE TABLE IF NOT EXISTS learning_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    x DOUBLE PRECISION,
    y DOUBLE PRECISION,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS cognitive_queries (
    id SERIAL PRIMARY KEY,
    query_type VARCHAR(64) NOT NULL,
    context JSONB,
    user_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    interaction_type VARCHAR(64) NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    context VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS input_events (
    id SERIAL PRIMARY KEY,
    event JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    weight DOUBLE PRECISION DEFAULT 1.0
);

CREATE TABLE IF NOT EXISTS correlation_results (
    id SERIAL PRIMARY KEY,
    pattern JSONB NOT NULL,
    confidence DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for efficient correlation and pattern matching
CREATE INDEX IF NOT EXISTS idx_learning_events_timestamp ON learning_events (timestamp);
CREATE INDEX IF NOT EXISTS idx_input_events_timestamp ON input_events (timestamp);
CREATE INDEX IF NOT EXISTS idx_correlation_results_created_at ON correlation_results (created_at);
