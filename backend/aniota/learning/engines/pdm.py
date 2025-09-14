


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("pdm.py", "system_initialization", "import", "Auto-generated dev log entry")

PDM - Zone of Proximal Development Map Module
Module #11 in the Aniota Nuts & Bolts specification

Maps learner progress within 4D space representing subjects, difficulty coordinates, and temporal progression.

Parent: LRS
Children: None
"""

from typing import Dict, List, Any, Optional, Tuple
import logging
from datetime import datetime
import numpy as np
from ..base_module import BaseModule

class ZoneProximalDevelopmentMap(BaseModule):
    """
    PDM - Zone of Proximal Development Map
    
    Core Responsibilities:
    1. Maintains 4D coordinate system: {subject_layers, difficulty_x, difficulty_y, timestamp}
    2. Tracks learning progression across multiple domains simultaneously
    3. Maps optimal challenge zones for individual learners
    4. Integrates with LRS scaffolding decisions
    """
    
    def __init__(self, parent=None):
        super().__init__("PDM", parent)
        
        # 4D coordinate system structure
        self.dimensions = {
            "subject_layer": "categorical",  # Subject/domain
            "difficulty_x": "continuous",    # Complexity level (0-10)
            "difficulty_y": "continuous",    # Conceptual depth (0-10)
            "timestamp": "temporal"          # Time progression
        }
        
        # Core data structures
        self.progress_map_4d = {}
        self.zone_boundaries = {}
        self.learning_velocity = {}
        self.mastery_thresholds = {
            "struggling": 0.3,
            "developing": 0.6,
            "proficient": 0.8,
            "mastery": 0.95
        }
        
        # Subject layer definitions
        self.subject_layers = {
            "mathematics": 0,
            "science": 1,
            "language_arts": 2,
            "social_studies": 3,
            "arts": 4,
            "physical_education": 5,
            "technology": 6,
            "life_skills": 7
        }
        
        # Zone calculation parameters
        self.zone_parameters = {
            "comfort_radius": 1.5,      # Comfort zone radius
            "challenge_radius": 2.5,    # Challenge zone radius
            "frustration_radius": 4.0,  # Beyond this = frustration zone
            "velocity_weight": 0.3      # Weight of learning velocity in zone calculation
        }
        
    def initialize(self) -> bool:
        """Initialize the PDM module"""
        try:
            self.logger.info("Initializing Zone of Proximal Development Map module")
            
            # Initialize 4D progress map structure
            self._initialize_4d_structure()
            
            # Load existing progress data if available
            self._load_progress_data()
            
            # Initialize zone boundaries
            self._initialize_zone_boundaries()
            
            self.is_initialized = True
            self.logger.info("PDM module initialized successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to initialize PDM module: {e}")
            return False
    
    def map_current_position(self, subject: str, performance_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Determines current position in 4D difficulty space
        
        Args:
            subject: Subject/domain being assessed
            performance_data: Recent performance metrics
            
        Returns:
            Current 4D coordinates and position analysis
        """
        try:
            # Get subject layer
            subject_layer = self.subject_layers.get(subject.lower(), 0)
            
            # Calculate difficulty coordinates based on performance
            difficulty_x, difficulty_y = self._calculate_difficulty_coordinates(performance_data)
            
            # Get current timestamp
            timestamp = datetime.now()
            
            # Create 4D position
            current_position = {
                "subject_layer": subject_layer,
                "subject_name": subject,
                "difficulty_x": difficulty_x,
                "difficulty_y": difficulty_y,
                "timestamp": timestamp.isoformat(),
                "coordinates": (subject_layer, difficulty_x, difficulty_y, timestamp.timestamp())
            }
            
            # Analyze position relative to learning zones
            zone_analysis = self._analyze_position_zones(current_position)
            
            # Update progress map
            self._update_progress_map(subject, current_position, performance_data)
            
            result = {
                "position": current_position,
                "zone_analysis": zone_analysis,
                "mastery_level": performance_data.get("mastery_level", 0.5),
                "progression_rate": self._calculate_progression_rate(subject),
                "recommendations": self._generate_position_recommendations(zone_analysis)
            }
            
            self.logger.debug(f"Mapped position for {subject}: x={difficulty_x:.2f}, y={difficulty_y:.2f}")
            return result
            
        except Exception as e:
            self.logger.error(f"Error mapping current position: {e}")
            return {"error": str(e)}
    
    def calculate_proximal_zone(self, current_position: Dict[str, Any], 
                              learning_velocity: Dict[str, Any]) -> Dict[str, Any]:
        """
        Defines optimal challenge zone boundaries
        
        Args:
            current_position: Current 4D coordinates
            learning_velocity: Learning velocity vector
            
        Returns:
            Zone boundaries and recommendations
        """
        try:
            # Extract coordinates
            x, y = current_position["difficulty_x"], current_position["difficulty_y"]
            subject = current_position["subject_name"]
            
            # Calculate velocity-adjusted center
            velocity_x = learning_velocity.get("x_velocity", 0)
            velocity_y = learning_velocity.get("y_velocity", 0)
            
            # Adjust zone center based on learning velocity
            zone_center_x = x + (velocity_x * self.zone_parameters["velocity_weight"])
            zone_center_y = y + (velocity_y * self.zone_parameters["velocity_weight"])
            
            # Define zone boundaries
            zones = {
                "comfort_zone": {
                    "center": (zone_center_x, zone_center_y),
                    "radius": self.zone_parameters["comfort_radius"],
                    "description": "Current skill level - minimal challenge",
                    "learning_rate": "low",
                    "recommended": False
                },
                "proximal_zone": {
                    "center": (zone_center_x, zone_center_y),
                    "inner_radius": self.zone_parameters["comfort_radius"],
                    "outer_radius": self.zone_parameters["challenge_radius"],
                    "description": "Optimal learning zone - appropriate challenge",
                    "learning_rate": "optimal",
                    "recommended": True
                },
                "challenge_zone": {
                    "center": (zone_center_x, zone_center_y),
                    "inner_radius": self.zone_parameters["challenge_radius"],
                    "outer_radius": self.zone_parameters["frustration_radius"],
                    "description": "High challenge - risk of frustration",
                    "learning_rate": "variable",
                    "recommended": False
                },
                "frustration_zone": {
                    "center": (zone_center_x, zone_center_y),
                    "radius": self.zone_parameters["frustration_radius"],
                    "description": "Too difficult - likely to cause frustration",
                    "learning_rate": "negative",
                    "recommended": False
                }
            }
            
            # Generate specific learning targets within proximal zone
            learning_targets = self._generate_learning_targets(zones["proximal_zone"], subject)
            
            # Store zone boundaries for future reference
            self.zone_boundaries[subject] = {
                "zones": zones,
                "learning_targets": learning_targets,
                "calculated_at": datetime.now().isoformat(),
                "valid_until": (datetime.now().timestamp() + 3600)  # Valid for 1 hour
            }
            
            result = {
                "subject": subject,
                "zones": zones,
                "learning_targets": learning_targets,
                "current_zone": self._identify_current_zone(current_position, zones),
                "recommendations": self._generate_zone_recommendations(zones, current_position)
            }
            
            self.logger.info(f"Calculated proximal zone for {subject}")
            return result
            
        except Exception as e:
            self.logger.error(f"Error calculating proximal zone: {e}")
            return {"error": str(e)}
    
    def update_progress_map(self, subject: str, new_coordinates: Tuple[float, float], 
                          timestamp: datetime) -> Dict[str, Any]:
        """
        Records movement through difficulty space over time
        
        Args:
            subject: Subject/domain
            new_coordinates: New (x,y) difficulty coordinates
            timestamp: Timestamp of the update
            
        Returns:
            Progress update confirmation and analysis
        """
        try:
            subject_layer = self.subject_layers.get(subject.lower(), 0)
            
            # Create new progress entry
            progress_entry = {
                "subject_layer": subject_layer,
                "subject_name": subject,
                "difficulty_x": new_coordinates[0],
                "difficulty_y": new_coordinates[1],
                "timestamp": timestamp.isoformat(),
                "unix_timestamp": timestamp.timestamp()
            }
            
            # Initialize subject in progress map if needed
            if subject not in self.progress_map_4d:
                self.progress_map_4d[subject] = {
                    "progression_history": [],
                    "current_position": None,
                    "velocity": {"x_velocity": 0, "y_velocity": 0},
                    "mastery_progression": []
                }
            
            # Add to progression history
            self.progress_map_4d[subject]["progression_history"].append(progress_entry)
            
            # Update current position
            previous_position = self.progress_map_4d[subject]["current_position"]
            self.progress_map_4d[subject]["current_position"] = progress_entry
            
            # Calculate velocity if we have previous position
            if previous_position:
                velocity = self._calculate_velocity(previous_position, progress_entry)
                self.progress_map_4d[subject]["velocity"] = velocity
            
            # Analyze progression patterns
            progression_analysis = self._analyze_progression_patterns(subject)
            
            # Maintain history size (keep last 100 entries)
            if len(self.progress_map_4d[subject]["progression_history"]) > 100:
                self.progress_map_4d[subject]["progression_history"] = \
                    self.progress_map_4d[subject]["progression_history"][-100:]
            
            result = {
                "subject": subject,
                "updated_position": progress_entry,
                "previous_position": previous_position,
                "velocity": self.progress_map_4d[subject]["velocity"],
                "progression_analysis": progression_analysis,
                "update_timestamp": datetime.now().isoformat()
            }
            
            self.logger.debug(f"Updated progress map for {subject}: {new_coordinates}")
            return result
            
        except Exception as e:
            self.logger.error(f"Error updating progress map: {e}")
            return {"error": str(e)}
    
    def suggest_next_challenge(self, current_zone: Dict[str, Any], 
                             mastery_indicators: Dict[str, Any]) -> Dict[str, Any]:
        """
        Recommends next learning target within proximal development zone
        
        Args:
            current_zone: Current zone boundaries and position
            mastery_indicators: Indicators of current mastery level
            
        Returns:
            Recommended next challenge with difficulty coordinates
        """
        try:
            subject = current_zone.get("subject", "unknown")
            current_position = current_zone.get("current_position", {})
            mastery_level = mastery_indicators.get("mastery_level", 0.5)
            
            # Get current coordinates
            current_x = current_position.get("difficulty_x", 5.0)
            current_y = current_position.get("difficulty_y", 5.0)
            
            # Determine challenge direction based on mastery
            if mastery_level >= self.mastery_thresholds["mastery"]:
                # High mastery - advance significantly
                challenge_vector = (1.5, 1.5)
                challenge_type = "advancement"
            elif mastery_level >= self.mastery_thresholds["proficient"]:
                # Good mastery - moderate advancement
                challenge_vector = (1.0, 0.8)
                challenge_type = "progression"
            elif mastery_level >= self.mastery_thresholds["developing"]:
                # Developing - small advancement or lateral movement
                challenge_vector = (0.5, 0.3)
                challenge_type = "consolidation"
            else:
                # Struggling - backup or lateral movement
                challenge_vector = (-0.5, 0.0)
                challenge_type = "reinforcement"
            
            # Calculate target coordinates
            target_x = max(0, min(10, current_x + challenge_vector[0]))
            target_y = max(0, min(10, current_y + challenge_vector[1]))
            
            # Ensure target is within proximal zone
            zone_boundaries = self.zone_boundaries.get(subject, {}).get("zones", {})
            proximal_zone = zone_boundaries.get("proximal_zone", {})
            
            if proximal_zone:
                target_x, target_y = self._constrain_to_proximal_zone(
                    target_x, target_y, proximal_zone
                )
            
            # Generate specific challenge recommendation
            challenge_recommendation = {
                "subject": subject,
                "challenge_type": challenge_type,
                "current_coordinates": (current_x, current_y),
                "target_coordinates": (target_x, target_y),
                "difficulty_increase": {
                    "x_delta": target_x - current_x,
                    "y_delta": target_y - current_y
                },
                "mastery_level": mastery_level,
                "reasoning": self._generate_challenge_reasoning(challenge_type, mastery_level),
                "estimated_time": self._estimate_challenge_time(challenge_vector),
                "prerequisite_check": self._check_prerequisites(subject, target_x, target_y),
                "success_probability": self._estimate_success_probability(
                    mastery_level, challenge_vector
                ),
                "generated_at": datetime.now().isoformat()
            }
            
            self.logger.info(f"Suggested next challenge for {subject}: {challenge_type} to ({target_x:.1f}, {target_y:.1f})")
            return challenge_recommendation
            
        except Exception as e:
            self.logger.error(f"Error suggesting next challenge: {e}")
            return {"error": str(e)}
    
    def get_progress_visualization_data(self, subject: str) -> Dict[str, Any]:
        """
        Get data for visualizing progress in 4D space
        
        Args:
            subject: Subject to visualize
            
        Returns:
            Visualization data including trajectories and zones
        """
        try:
            if subject not in self.progress_map_4d:
                return {"error": "No progress data available for subject"}
            
            subject_data = self.progress_map_4d[subject]
            history = subject_data["progression_history"]
            
            # Extract coordinate trajectories
            x_trajectory = [entry["difficulty_x"] for entry in history]
            y_trajectory = [entry["difficulty_y"] for entry in history]
            timestamps = [entry["unix_timestamp"] for entry in history]
            
            # Get zone boundaries
            zones = self.zone_boundaries.get(subject, {}).get("zones", {})
            
            # Calculate statistics
            if len(x_trajectory) > 1:
                x_progress = x_trajectory[-1] - x_trajectory[0]
                y_progress = y_trajectory[-1] - y_trajectory[0]
                total_distance = sum(
                    ((x_trajectory[i] - x_trajectory[i-1])**2 + 
                     (y_trajectory[i] - y_trajectory[i-1])**2)**0.5
                    for i in range(1, len(x_trajectory))
                )
            else:
                x_progress = y_progress = total_distance = 0
            
            visualization_data = {
                "subject": subject,
                "trajectory": {
                    "x_coordinates": x_trajectory,
                    "y_coordinates": y_trajectory,
                    "timestamps": timestamps
                },
                "zones": zones,
                "current_position": subject_data["current_position"],
                "velocity": subject_data["velocity"],
                "statistics": {
                    "x_progress": x_progress,
                    "y_progress": y_progress,
                    "total_distance": total_distance,
                    "session_count": len(history),
                    "time_span": timestamps[-1] - timestamps[0] if len(timestamps) > 1 else 0
                },
                "milestones": self._identify_progress_milestones(history),
                "generated_at": datetime.now().isoformat()
            }
            
            return visualization_data
            
        except Exception as e:
            self.logger.error(f"Error getting visualization data: {e}")
            return {"error": str(e)}
    
    # Private helper methods
    
    def _initialize_4d_structure(self):
        """Initialize the 4D progress map structure"""
        self.progress_map_4d = {}
        self.zone_boundaries = {}
        self.learning_velocity = {}
        
        self.logger.debug("Initialized 4D progress map structure")
    
    def _load_progress_data(self):
        """Load existing progress data from storage"""
        # Placeholder for loading from Chrome storage
        # In production, this would load saved progress data
        pass
    
    def _initialize_zone_boundaries(self):
        """Initialize default zone boundaries for each subject"""
        for subject in self.subject_layers.keys():
            self.zone_boundaries[subject] = {
                "default_center": (5.0, 5.0),
                "last_calculated": None,
                "zones": {}
            }
    
    def _calculate_difficulty_coordinates(self, performance_data: Dict[str, Any]) -> Tuple[float, float]:
        """Calculate difficulty coordinates based on performance data"""
        # Base coordinates from mastery level
        mastery = performance_data.get("mastery_level", 0.5)
        
        # Convert mastery to difficulty scale (0-10)
        base_difficulty = mastery * 10
        
        # Adjust based on performance metrics
        success_rate = performance_data.get("success_rate", 0.5)
        avg_response_time = performance_data.get("avg_response_time", 30)  # seconds
        question_complexity = performance_data.get("question_complexity", 5)
        
        # Calculate x-coordinate (complexity level)
        difficulty_x = (base_difficulty * 0.4) + (question_complexity * 0.4) + (success_rate * 2)
        
        # Calculate y-coordinate (conceptual depth)
        # Higher values for deeper understanding, faster response times
        time_factor = max(0, min(10, 10 - (avg_response_time / 10)))
        difficulty_y = (base_difficulty * 0.5) + (time_factor * 0.3) + (success_rate * 2)
        
        # Constrain to valid range
        difficulty_x = max(0, min(10, difficulty_x))
        difficulty_y = max(0, min(10, difficulty_y))
        
        return difficulty_x, difficulty_y
    
    def _analyze_position_zones(self, position: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze which zone the current position falls into"""
        subject = position["subject_name"]
        x, y = position["difficulty_x"], position["difficulty_y"]
        
        # Get zone boundaries if available
        zone_data = self.zone_boundaries.get(subject, {}).get("zones", {})
        
        if not zone_data:
            return {"zone": "unknown", "analysis": "No zone boundaries calculated"}
        
        # Check each zone
        for zone_name, zone_info in zone_data.items():
            if self._is_position_in_zone(x, y, zone_info):
                return {
                    "zone": zone_name,
                    "description": zone_info.get("description", ""),
                    "learning_rate": zone_info.get("learning_rate", "unknown"),
                    "recommended": zone_info.get("recommended", False)
                }
        
        return {"zone": "undefined", "analysis": "Position outside mapped zones"}
    
    def _is_position_in_zone(self, x: float, y: float, zone_info: Dict[str, Any]) -> bool:
        """Check if a position is within a specific zone"""
        center = zone_info.get("center", (5, 5))
        center_x, center_y = center
        
        distance = ((x - center_x)**2 + (y - center_y)**2)**0.5
        
        if "radius" in zone_info:
            return distance <= zone_info["radius"]
        elif "inner_radius" in zone_info and "outer_radius" in zone_info:
            return zone_info["inner_radius"] <= distance <= zone_info["outer_radius"]
        
        return False
    
    def _generate_position_recommendations(self, zone_analysis: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on current zone position"""
        zone = zone_analysis.get("zone", "unknown")
        
        recommendations = {
            "comfort_zone": [
                "Consider increasing challenge level",
                "Look for opportunities to apply skills in new contexts",
                "Move toward proximal development zone"
            ],
            "proximal_zone": [
                "Continue with current difficulty level",
                "Focus on consolidating understanding",
                "Gradually increase complexity"
            ],
            "challenge_zone": [
                "Provide additional scaffolding",
                "Break down concepts into smaller steps",
                "Consider moving to proximal zone"
            ],
            "frustration_zone": [
                "Reduce difficulty immediately",
                "Review prerequisite concepts",
                "Provide extensive support"
            ]
        }
        
        return recommendations.get(zone, ["Continue current approach"])
    
    def _update_progress_map(self, subject: str, position: Dict[str, Any], 
                           performance_data: Dict[str, Any]):
        """Update the internal progress map with new position data"""
        if subject not in self.progress_map_4d:
            self.progress_map_4d[subject] = {
                "progression_history": [],
                "current_position": None,
                "velocity": {"x_velocity": 0, "y_velocity": 0},
                "mastery_progression": []
            }
        
        # Add mastery progression tracking
        mastery_entry = {
            "mastery_level": performance_data.get("mastery_level", 0.5),
            "timestamp": position["timestamp"]
        }
        self.progress_map_4d[subject]["mastery_progression"].append(mastery_entry)
    
    def _calculate_progression_rate(self, subject: str) -> Dict[str, float]:
        """Calculate the rate of progression for a subject"""
        if subject not in self.progress_map_4d:
            return {"x_rate": 0, "y_rate": 0, "mastery_rate": 0}
        
        history = self.progress_map_4d[subject]["progression_history"]
        mastery_history = self.progress_map_4d[subject]["mastery_progression"]
        
        if len(history) < 2:
            return {"x_rate": 0, "y_rate": 0, "mastery_rate": 0}
        
        # Calculate rates over recent history (last 10 sessions)
        recent_history = history[-10:]
        time_span = recent_history[-1]["unix_timestamp"] - recent_history[0]["unix_timestamp"]
        
        if time_span == 0:
            return {"x_rate": 0, "y_rate": 0, "mastery_rate": 0}
        
        x_change = recent_history[-1]["difficulty_x"] - recent_history[0]["difficulty_x"]
        y_change = recent_history[-1]["difficulty_y"] - recent_history[0]["difficulty_y"]
        
        # Calculate mastery rate
        mastery_rate = 0
        if len(mastery_history) >= 2:
            mastery_change = mastery_history[-1]["mastery_level"] - mastery_history[0]["mastery_level"]
            mastery_rate = mastery_change / time_span
        
        return {
            "x_rate": x_change / time_span,
            "y_rate": y_change / time_span,
            "mastery_rate": mastery_rate
        }
    
    def _generate_learning_targets(self, proximal_zone: Dict[str, Any], 
                                 subject: str) -> List[Dict[str, Any]]:
        """Generate specific learning targets within the proximal zone"""
        center = proximal_zone.get("center", (5, 5))
        inner_radius = proximal_zone.get("inner_radius", 1.5)
        outer_radius = proximal_zone.get("outer_radius", 2.5)
        
        # Generate target points within the proximal zone
        targets = []
        center_x, center_y = center
        
        # Create targets at different angles and distances within the zone
        for angle in [0, 45, 90, 135, 180, 225, 270, 315]:  # 8 directions
            for distance_factor in [0.7, 1.0]:  # Near and far within zone
                angle_rad = angle * 3.14159 / 180
                distance = inner_radius + (outer_radius - inner_radius) * distance_factor
                
                target_x = center_x + distance * np.cos(angle_rad)
                target_y = center_y + distance * np.sin(angle_rad)
                
                # Constrain to valid coordinates
                target_x = max(0, min(10, target_x))
                target_y = max(0, min(10, target_y))
                
                targets.append({
                    "coordinates": (target_x, target_y),
                    "angle": angle,
                    "distance": distance,
                    "description": f"Challenge at {angle}° from current position",
                    "estimated_difficulty": self._estimate_target_difficulty(target_x, target_y)
                })
        
        return targets[:6]  # Return top 6 targets
    
    def _identify_current_zone(self, position: Dict[str, Any], 
                             zones: Dict[str, Any]) -> str:
        """Identify which zone the current position is in"""
        x, y = position["difficulty_x"], position["difficulty_y"]
        
        for zone_name, zone_info in zones.items():
            if self._is_position_in_zone(x, y, zone_info):
                return zone_name
        
        return "unknown"
    
    def _generate_zone_recommendations(self, zones: Dict[str, Any], 
                                     position: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on zone analysis"""
        current_zone = self._identify_current_zone(position, zones)
        return self._generate_position_recommendations({"zone": current_zone})
    
    def _calculate_velocity(self, previous_position: Dict[str, Any], 
                          current_position: Dict[str, Any]) -> Dict[str, float]:
        """Calculate learning velocity between two positions"""
        time_diff = current_position["unix_timestamp"] - previous_position["unix_timestamp"]
        
        if time_diff == 0:
            return {"x_velocity": 0, "y_velocity": 0, "magnitude": 0}
        
        x_velocity = (current_position["difficulty_x"] - previous_position["difficulty_x"]) / time_diff
        y_velocity = (current_position["difficulty_y"] - previous_position["difficulty_y"]) / time_diff
        magnitude = (x_velocity**2 + y_velocity**2)**0.5
        
        return {
            "x_velocity": x_velocity,
            "y_velocity": y_velocity,
            "magnitude": magnitude
        }
    
    def _analyze_progression_patterns(self, subject: str) -> Dict[str, Any]:
        """Analyze patterns in learning progression"""
        if subject not in self.progress_map_4d:
            return {"pattern": "no_data"}
        
        history = self.progress_map_4d[subject]["progression_history"]
        
        if len(history) < 3:
            return {"pattern": "insufficient_data"}
        
        # Analyze recent trajectory
        recent = history[-5:]  # Last 5 sessions
        
        x_trend = "stable"
        y_trend = "stable"
        
        if len(recent) >= 2:
            x_changes = [recent[i]["difficulty_x"] - recent[i-1]["difficulty_x"] for i in range(1, len(recent))]
            y_changes = [recent[i]["difficulty_y"] - recent[i-1]["difficulty_y"] for i in range(1, len(recent))]
            
            avg_x_change = sum(x_changes) / len(x_changes)
            avg_y_change = sum(y_changes) / len(y_changes)
            
            x_trend = "increasing" if avg_x_change > 0.1 else "decreasing" if avg_x_change < -0.1 else "stable"
            y_trend = "increasing" if avg_y_change > 0.1 else "decreasing" if avg_y_change < -0.1 else "stable"
        
        return {
            "pattern": f"x_{x_trend}_y_{y_trend}",
            "x_trend": x_trend,
            "y_trend": y_trend,
            "session_count": len(history),
            "progression_consistency": self._calculate_consistency(history)
        }
    
    def _calculate_consistency(self, history: List[Dict[str, Any]]) -> float:
        """Calculate consistency of progression"""
        if len(history) < 3:
            return 0.0
        
        # Calculate variance in progression direction
        x_changes = [history[i]["difficulty_x"] - history[i-1]["difficulty_x"] for i in range(1, len(history))]
        y_changes = [history[i]["difficulty_y"] - history[i-1]["difficulty_y"] for i in range(1, len(history))]
        
        if not x_changes:
            return 0.0
        
        x_variance = np.var(x_changes) if len(x_changes) > 1 else 0
        y_variance = np.var(y_changes) if len(y_changes) > 1 else 0
        
        # Lower variance = higher consistency
        consistency = 1.0 / (1.0 + x_variance + y_variance)
        return min(1.0, consistency)
    
    def _constrain_to_proximal_zone(self, target_x: float, target_y: float, 
                                   proximal_zone: Dict[str, Any]) -> Tuple[float, float]:
        """Constrain target coordinates to stay within proximal zone"""
        center = proximal_zone.get("center", (5, 5))
        outer_radius = proximal_zone.get("outer_radius", 2.5)
        
        center_x, center_y = center
        distance = ((target_x - center_x)**2 + (target_y - center_y)**2)**0.5
        
        if distance > outer_radius:
            # Scale down to fit within zone
            scale_factor = outer_radius / distance
            target_x = center_x + (target_x - center_x) * scale_factor
            target_y = center_y + (target_y - center_y) * scale_factor
        
        return target_x, target_y
    
    def _generate_challenge_reasoning(self, challenge_type: str, mastery_level: float) -> str:
        """Generate reasoning for the challenge recommendation"""
        reasoning_map = {
            "advancement": f"High mastery ({mastery_level:.2f}) indicates readiness for significant advancement",
            "progression": f"Good mastery ({mastery_level:.2f}) supports moderate progression",
            "consolidation": f"Developing mastery ({mastery_level:.2f}) suggests consolidation with small advances",
            "reinforcement": f"Low mastery ({mastery_level:.2f}) requires reinforcement and review"
        }
        
        return reasoning_map.get(challenge_type, "Standard progression recommended")
    
    def _estimate_challenge_time(self, challenge_vector: Tuple[float, float]) -> int:
        """Estimate time needed to complete the challenge"""
        vector_magnitude = (challenge_vector[0]**2 + challenge_vector[1]**2)**0.5
        
        # Base time estimates in minutes
        base_times = {
            "small": 15,    # Vector magnitude < 0.5
            "medium": 30,   # Vector magnitude 0.5-1.5
            "large": 60     # Vector magnitude > 1.5
        }
        
        if vector_magnitude < 0.5:
            return base_times["small"]
        elif vector_magnitude < 1.5:
            return base_times["medium"]
        else:
            return base_times["large"]
    
    def _check_prerequisites(self, subject: str, target_x: float, target_y: float) -> Dict[str, Any]:
        """Check if prerequisites are met for the target difficulty"""
        current_data = self.progress_map_4d.get(subject, {})
        current_pos = current_data.get("current_position", {})
        
        current_x = current_pos.get("difficulty_x", 0)
        current_y = current_pos.get("difficulty_y", 0)
        
        # Simple prerequisite check - target shouldn't be too far from current
        x_gap = target_x - current_x
        y_gap = target_y - current_y
        
        prerequisites_met = abs(x_gap) <= 2.0 and abs(y_gap) <= 2.0
        
        return {
            "prerequisites_met": prerequisites_met,
            "x_gap": x_gap,
            "y_gap": y_gap,
            "recommendations": [] if prerequisites_met else [
                "Review foundational concepts",
                "Complete intermediate challenges first"
            ]
        }
    
    def _estimate_success_probability(self, mastery_level: float, 
                                    challenge_vector: Tuple[float, float]) -> float:
        """Estimate probability of success for the challenge"""
        vector_magnitude = (challenge_vector[0]**2 + challenge_vector[1]**2)**0.5
        
        # Base probability on mastery level
        base_probability = mastery_level
        
        # Adjust based on challenge magnitude
        if vector_magnitude < 0.5:
            adjustment = 0.2  # Easy challenge bonus
        elif vector_magnitude < 1.5:
            adjustment = 0.0  # Moderate challenge
        else:
            adjustment = -0.3  # Difficult challenge penalty
        
        probability = max(0.1, min(0.95, base_probability + adjustment))
        return round(probability, 2)
    
    def _estimate_target_difficulty(self, target_x: float, target_y: float) -> str:
        """Estimate difficulty level of a target position"""
        avg_difficulty = (target_x + target_y) / 2
        
        if avg_difficulty < 2:
            return "very_easy"
        elif avg_difficulty < 4:
            return "easy"
        elif avg_difficulty < 6:
            return "moderate"
        elif avg_difficulty < 8:
            return "challenging"
        else:
            return "very_challenging"
    
    def _identify_progress_milestones(self, history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identify significant milestones in learning progression"""
        milestones = []
        
        if len(history) < 2:
            return milestones
        
        # Look for significant jumps in difficulty
        for i in range(1, len(history)):
            prev = history[i-1]
            curr = history[i]
            
            x_jump = curr["difficulty_x"] - prev["difficulty_x"]
            y_jump = curr["difficulty_y"] - prev["difficulty_y"]
            
            if x_jump > 1.5 or y_jump > 1.5:
                milestones.append({
                    "type": "difficulty_breakthrough",
                    "timestamp": curr["timestamp"],
                    "description": f"Significant difficulty increase: x+{x_jump:.1f}, y+{y_jump:.1f}",
                    "coordinates": (curr["difficulty_x"], curr["difficulty_y"])
                })
        
        # Add first and latest positions as milestones
        if history:
            milestones.insert(0, {
                "type": "starting_point",
                "timestamp": history[0]["timestamp"],
                "description": "Learning journey started",
                "coordinates": (history[0]["difficulty_x"], history[0]["difficulty_y"])
            })
            
            if len(history) > 1:
                milestones.append({
                    "type": "current_position",
                    "timestamp": history[-1]["timestamp"],
                    "description": "Current learning position",
                    "coordinates": (history[-1]["difficulty_x"], history[-1]["difficulty_y"])
                })
        
        return milestones


log_file_dependency("pdm.py", "logging", "import")
log_file_dependency("pdm.py", "numpy", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
