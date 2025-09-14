# BREADCRUMB: [Project/Module] > test_main.py
# This file is the root entry point and orchestrator for the entire system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: test_main.py
# Purpose: Central entry point and orchestrator for the system.
#
# Type: Main launcher script (not a class file, but acts as a system controller)
#
# Responsibilities:
#   - Loads configuration and resolves paths for all major dependencies ([List dependencies])
#   - Checks and manages the status of critical services (starts/stops as needed)
#   - Launches and monitors all core services:
#       * [Service 1] ([Tech/Port])
#       * [Service 2] ([Tech/Port])
#       * [Service 3] ([Tech/Port])
#       * [Service 4] ([Tech/Port])
#   - Provides command-line flags for status reporting and service termination ([flags])
#   - Handles process cleanup and error reporting
#
# Key Functions:
#   - main(): Orchestrates the full launch sequence and handles CLI flags
#   - launch_service(): Starts a subprocess for a given service
#   - stream_logs(): Streams and truncates logs from subprocesses
#   - run_static_server(): Runs the static file server (if applicable)
#   - is_port_in_use(): Checks if a TCP port is active
#   - get_service_status(): Returns a dict of service statuses
#   - check_service(): Ensures a service is running, starts if not
#   - resolve_path(): Finds the first valid path for a dependency from config
#   - find_dependency_path(): Locates the executable for a dependency
#
# Relationships:
#   - Reads from configuration files for dependency paths
#   - Launches and monitors other scripts and processes
#   - Interacts with the OS for process and port management
#
# Usefulness & Execution Path:
#   - main() is the required entry point and is always used.
#   - [List of essential functions] are all actively used and essential for orchestrating the system.
#   - [Legacy/optional functions] may become obsolete as the system evolves.
#
# Suggestions:
#   - **Performance:** [Performance notes]
#   - **Code Cleanliness:** [Code cleanliness notes]
#   - **Location:** [Location notes]
#   - **Function:** [Function notes]
#   - **Legacy:** [Legacy notes]
#   - **Config:** [Config notes]
#   - **Error Handling:** [Error handling notes]
#   - **Cross-Platform:** [Cross-platform notes]
#
# Summary:
#   - This file is essential, well-placed, and mostly clean.
#   - All major functions are used and support the requirements for modularity, orchestration, and portability.
#   - Minor cleanup (removing redundant code, legacy functions) is recommended to enhance maintainability.
#   - Overall, it effectively serves as the central controller for the system.
#
# CHANGE MANAGEMENT LOG
# Date        | Initials | Description of Change                | Reason for Change
# -----------------------------------------------------------------------------
# 2025-09-05 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

# test_main.py
# Unit tests for CHRYSALIX Cognitive Framework API

import pytest
from fastapi.testclient import TestClient
import json
import sys
import os

# Add the app directory to the path

from docs.main import app

# Create test client
client = TestClient(app)


class TestBasicEndpoints:
    """Test basic API endpoints"""
    
    def test_read_root(self):
        """Test the root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "CHRYSALIX Cognitive Framework"
        assert data["status"] == "running"
        assert data["version"] == "0.1.0"
        assert "cognitive_modules" in data
        assert len(data["cognitive_modules"]) == 6
        
        print("✓ Root endpoint test passed")
    
    def test_health_check(self):
        """Test the health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert data["cognitive_status"] == "operational"
        assert data["learning_engines"] == "active"
        
        print("✓ Health check test passed")


class TestCAFEndpoints:
    """Test Cognitive Analysis Framework endpoints"""
    
    def test_caf_status(self):
        """Test CAF status endpoint"""
        response = client.get("/api/caf/status")
        assert response.status_code == 200
        
        data = response.json()
        assert data["module"] == "CAF - Cognitive Analysis Framework"
        assert data["status"] == "initialized"
        assert "registered_modules" in data
        assert len(data["registered_modules"]) == 4
        assert data["common_sense_enabled"] is True
        
        print("✓ CAF status test passed")
    
    def test_cognitive_query_processing(self):
        """Test cognitive query processing"""
        test_query = {
            "query_type": "learning_analysis",
            "context": {
                "subject": "mathematics",
                "difficulty": "intermediate"
            },
            "user_data": {
                "session_id": "test_session"
            }
        }
        
        response = client.post("/api/caf/query", json=test_query)
        assert response.status_code == 200
        
        data = response.json()
        assert data["query_type"] == "learning_analysis"
        assert data["processed"] is True
        assert "cognitive_response" in data
        assert "recommendations" in data
        assert len(data["recommendations"]) == 3
        
        print("✓ Cognitive query processing test passed")


class TestTVMLEEndpoints:
    """Test Triadic Vector Mathematical Learning Engine endpoints"""
    
    def test_learning_event_processing(self):
        """Test TVMLE learning event processing"""
        test_event = {
            "event_type": "mouse_click",
            "x": 120.5,
            "y": 200.3,
            "timestamp": 1625097600.0,
            "metadata": {
                "button": "left",
                "context": "learning_interface"
            }
        }
        
        response = client.post("/api/tvmle/learn", json=test_event)
        assert response.status_code == 200
        
        data = response.json()
        assert data["event_processed"] is True
        assert "triadic_vector" in data
        assert "correlation_analysis" in data
        assert "mathematical_insights" in data
        
        # Test triadic vector components
        vector = data["triadic_vector"]
        assert "temporal" in vector
        assert "radial" in vector
        assert "spatial" in vector
        
        # Test correlation analysis
        correlation = data["correlation_analysis"]
        assert correlation["pattern_detected"] is True
        assert 0 <= correlation["confidence"] <= 1
        
        print("✓ TVMLE learning event processing test passed")
    
    def test_learning_stats(self):
        """Test TVMLE learning statistics"""
        response = client.get("/api/tvmle/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_vectors_processed" in data
        assert "correlation_patterns" in data
        assert "learning_velocity" in data
        assert "mathematical_confidence" in data
        assert "signature_strength" in data
        assert "recent_insights" in data
        
        # Validate data types and ranges
        assert isinstance(data["total_vectors_processed"], int)
        assert 0 <= data["mathematical_confidence"] <= 1
        assert 0 <= data["signature_strength"] <= 1
        assert isinstance(data["recent_insights"], list)
        
        print("✓ TVMLE learning stats test passed")


class TestMicrovibrationEndpoints:
    """Test Microvibration Authentication endpoints"""
    
    def test_microvibration_analysis(self):
        """Test microvibration pattern analysis"""
        test_event = {
            "event_type": "mouse_movement",
            "x": 150.2,
            "y": 180.7,
            "timestamp": 1625097605.0,
            "metadata": {
                "velocity_x": 2.3,
                "velocity_y": 1.8,
                "acceleration": 0.5
            }
        }
        
        response = client.post("/api/microvibration/analyze", json=test_event)
        assert response.status_code == 200
        
        data = response.json()
        assert data["vibration_pattern_detected"] is True
        assert "authentication_confidence" in data
        assert "pattern_consistency" in data
        assert "biometric_signature" in data
        assert "authentication_result" in data
        
        # Validate confidence scores
        assert 0 <= data["authentication_confidence"] <= 1
        assert 0 <= data["pattern_consistency"] <= 1
        
        # Validate biometric signature
        signature = data["biometric_signature"]
        assert "tremor_frequency" in signature
        assert "correction_speed" in signature
        assert "overshoot_tendency" in signature
        
        # Validate authentication result
        assert data["authentication_result"] in ["verified", "rejected"]
        
        print("✓ Microvibration analysis test passed")


class TestSIEEndpoints:
    """Test Socratic Inquiry Engine endpoints"""
    
    def test_socratic_question_generation(self):
        """Test Socratic question generation"""
        test_context = {
            "topic": "programming logic",
            "level": "beginner",
            "current_understanding": "basic"
        }
        
        response = client.post("/api/sie/question", json=test_context)
        assert response.status_code == 200
        
        data = response.json()
        assert "socratic_questions" in data
        assert "inquiry_level" in data
        assert "cognitive_strategy" in data
        assert "expected_learning_outcome" in data
        
        # Validate questions structure
        questions = data["socratic_questions"]
        assert "primary" in questions
        assert "follow_up" in questions
        assert "deeper" in questions
        assert "reflective" in questions
        
        # Validate all questions are strings and not empty
        for question_type, question in questions.items():
            assert isinstance(question, str)
            assert len(question) > 0
            assert "programming logic" in question
        
        print("✓ Socratic question generation test passed")


class TestVisualizationEndpoints:
    """Test visualization data endpoints"""
    
    def test_learning_patterns_visualization(self):
        """Test learning patterns visualization data"""
        test_request = {
            "type": "learning_patterns",
            "time_range": "last_hour",
            "detail_level": "high"
        }
        
        response = client.post("/api/visualization/data", json=test_request)
        assert response.status_code == 200
        
        data = response.json()
        assert data["data_type"] == "triadic_vectors"
        assert "vectors" in data
        assert "correlations" in data
        assert "learning_trend" in data
        assert data["visualization_ready"] is True
        
        # Validate vectors structure
        vectors = data["vectors"]
        assert len(vectors) == 3
        for vector in vectors:
            assert "temporal" in vector
            assert "radial" in vector
            assert "spatial" in vector
            assert isinstance(vector["spatial"], list)
            assert len(vector["spatial"]) == 2
        
        # Validate correlations
        correlations = data["correlations"]
        assert len(correlations) == 3
        for corr in correlations:
            assert 0 <= corr <= 1
        
        print("✓ Learning patterns visualization test passed")
    
    def test_microvibration_visualization(self):
        """Test microvibration authentication visualization data"""
        test_request = {
            "type": "microvibration_auth",
            "user_id": "test_user",
            "session": "auth_session"
        }
        
        response = client.post("/api/visualization/data", json=test_request)
        assert response.status_code == 200
        
        data = response.json()
        assert data["data_type"] == "authentication_patterns"
        assert "pattern_strength" in data
        assert "tremor_signature" in data
        assert "authentication_history" in data
        assert data["visualization_ready"] is True
        
        # Validate pattern strength
        assert 0 <= data["pattern_strength"] <= 1
        
        # Validate tremor signature
        tremor_sig = data["tremor_signature"]
        assert isinstance(tremor_sig, list)
        assert len(tremor_sig) == 4
        
        # Validate authentication history
        auth_history = data["authentication_history"]
        assert isinstance(auth_history, list)
        for result in auth_history:
            assert result in ["verified", "rejected"]
        
        print("✓ Microvibration visualization test passed")
    
    def test_unknown_visualization_type(self):
        """Test unknown visualization type handling"""
        test_request = {
            "type": "unknown_type",
            "data": "test"
        }
        
        response = client.post("/api/visualization/data", json=test_request)
        assert response.status_code == 200
        
        data = response.json()
        assert "error" in data
        assert data["error"] == "Unknown visualization type"
        
        print("✓ Unknown visualization type test passed")


class TestSystemIntegration:
    """Test system integration endpoints"""
    
    def test_system_integration_status(self):
        """Test system integration status"""
        response = client.get("/api/system/integration")
        assert response.status_code == 200
        
        data = response.json()
        
        # Test all integration statuses
        expected_integrations = [
            "caf_integration",
            "tvmle_integration",
            "microvibration_integration",
            "sie_integration"
        ]
        
        for integration in expected_integrations:
            assert integration in data
            assert data[integration] == "active"
        
        # Test system metrics
        assert "aniota_epicenter_connection" in data
        assert data["aniota_epicenter_connection"] == "ready"
        assert "mathematical_pipeline" in data
        assert data["mathematical_pipeline"] == "operational"
        assert "total_integrations" in data
        assert data["total_integrations"] == 6
        assert "system_coherence" in data
        assert 0 <= data["system_coherence"] <= 1
        
        print("✓ System integration status test passed")


def run_all_tests():
    """Run all test suites"""
    print("🧪 Starting CHRYSALIX Cognitive Framework API Tests")
    print("=" * 60)
    
    try:
        # Basic endpoints
        print("\n📋 Testing Basic Endpoints...")
        basic_tests = TestBasicEndpoints()
        basic_tests.test_read_root()
        basic_tests.test_health_check()
        
        # CAF endpoints
        print("\n🧠 Testing CAF Endpoints...")
        caf_tests = TestCAFEndpoints()
        caf_tests.test_caf_status()
        caf_tests.test_cognitive_query_processing()
        
        # TVMLE endpoints
        print("\n📊 Testing TVMLE Endpoints...")
        tvmle_tests = TestTVMLEEndpoints()
        tvmle_tests.test_learning_event_processing()
        tvmle_tests.test_learning_stats()
        
        # Microvibration endpoints
        print("\n🔐 Testing Microvibration Endpoints...")
        microvib_tests = TestMicrovibrationEndpoints()
        microvib_tests.test_microvibration_analysis()
        
        # SIE endpoints
        print("\n❓ Testing SIE Endpoints...")
        sie_tests = TestSIEEndpoints()
        sie_tests.test_socratic_question_generation()
        
        # Visualization endpoints
        print("\n📈 Testing Visualization Endpoints...")
        viz_tests = TestVisualizationEndpoints()
        viz_tests.test_learning_patterns_visualization()
        viz_tests.test_microvibration_visualization()
        viz_tests.test_unknown_visualization_type()
        
        # System integration
        print("\n🔗 Testing System Integration...")
        integration_tests = TestSystemIntegration()
        integration_tests.test_system_integration_status()
        
        print("\n" + "=" * 60)
        print("🎉 ALL TESTS PASSED! CHRYSALIX API is ready for integration.")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}")
        print("=" * 60)
        return False


if __name__ == "__main__":
    success = run_all_tests()
    if not success:
        exit(1)
