



import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("microvibration_auth.py", "system_initialization", "import", "Auto-generated dev log entry")

import time
import math
import statistics
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from templates.base_module import BaseModule


@dataclass
class MouseEvent:
    """Single mouse movement event with temporal and spatial data"""
    timestamp: float
    x: float
    y: float
    event_type: str  # 'move', 'click', 'drag'
    velocity: float = 0.0
    acceleration: float = 0.0


@dataclass
class MicrovibrationVector:
    """Triadic vector representation of microvibration data"""
    temporal: float    # Time-based component (duration, frequency)
    radial: float      # Distance from expected position
    spatial: float     # X,Y coordinate deviation magnitude
    
    def correlation_with(self, other: 'MicrovibrationVector') -> float:
        """Calculate correlation between two microvibration vectors"""
        # Pearson correlation coefficient for triadic vectors
        vec1 = [self.temporal, self.radial, self.spatial]
        vec2 = [other.temporal, other.radial, other.spatial]
        
        if len(vec1) != len(vec2):
            return 0.0
            
        mean1 = statistics.mean(vec1)
        mean2 = statistics.mean(vec2)
        
        numerator = sum((a - mean1) * (b - mean2) for a, b in zip(vec1, vec2))
        
        sum_sq1 = sum((a - mean1) ** 2 for a in vec1)
        sum_sq2 = sum((b - mean2) ** 2 for b in vec2)
        
        denominator = math.sqrt(sum_sq1 * sum_sq2)
        
        if denominator == 0:
            return 0.0
            
        return numerator / denominator


class MicrovibrationAnalyzer(BaseModule):
    """
    Mathematical analysis engine for microvibration-based authentication.
    Captures mouse movement patterns during natural gameplay and converts to
    mathematical signatures using triadic vector correlation analysis.
    """
    
    def __init__(self):
        super().__init__()
        self.movement_history: List[MouseEvent] = []
        self.baseline_patterns: List[MicrovibrationVector] = []
        # Correlation threshold for authentication
        self.authentication_threshold = 0.75
        self.collection_window = 10.0  # Seconds of data to analyze
        self.is_learning = True
        self.signature_established = False
        
    def process_mouse_event(self, x: float, y: float, 
                          event_type: str = 'move') -> Optional[MicrovibrationVector]:
        """
        Process a single mouse event and convert to microvibration vector.
        Called passively during natural gameplay interaction.
        """
        current_time = time.time()
        
        # Calculate velocity and acceleration if we have previous events
        velocity = 0.0
        acceleration = 0.0
        
        if len(self.movement_history) >= 1:
            prev_event = self.movement_history[-1]
            time_delta = current_time - prev_event.timestamp
            if time_delta > 0:
                distance = math.sqrt((x - prev_event.x)**2 + (y - prev_event.y)**2)
                velocity = distance / time_delta
                
                if len(self.movement_history) >= 2:
                    velocity_change = velocity - prev_event.velocity
                    acceleration = velocity_change / time_delta
        
        # Create mouse event
        event = MouseEvent(
            timestamp=current_time,
            x=x, y=y,
            event_type=event_type,
            velocity=velocity,
            acceleration=acceleration
        )
        
        self.movement_history.append(event)
        
        # Trim history to collection window
        cutoff_time = current_time - self.collection_window
        self.movement_history = [e for e in self.movement_history if e.timestamp > cutoff_time]
        
        # Generate microvibration vector if we have enough data
        if len(self.movement_history) >= 5:
            return self._generate_microvibration_vector(event)
            
        return None
    
    def _generate_microvibration_vector(self, current_event: MouseEvent) -> MicrovibrationVector:
        """Generate triadic vector from current movement context"""
        recent_events = self.movement_history[-5:]  # Last 5 events for context
        
        # Temporal component: movement frequency and timing patterns
        time_deltas = []
        for i in range(1, len(recent_events)):
            time_deltas.append(recent_events[i].timestamp - recent_events[i-1].timestamp)
        
        temporal = statistics.mean(time_deltas) if time_deltas else 0.0
        
        # Radial component: deviation from smooth movement (tremor/jitter analysis)
        if len(recent_events) >= 3:
            # Calculate expected position based on linear interpolation
            start = recent_events[0]
            end = recent_events[-1]
            progress = (current_event.timestamp - start.timestamp) / (end.timestamp - start.timestamp)
            
            expected_x = start.x + (end.x - start.x) * progress
            expected_y = start.y + (end.y - start.y) * progress
            
            radial = math.sqrt((current_event.x - expected_x)**2 + (current_event.y - expected_y)**2)
        else:
            radial = 0.0
        
        # Spatial component: overall movement magnitude and direction
        if len(recent_events) >= 2:
            total_distance = 0.0
            for i in range(1, len(recent_events)):
                prev = recent_events[i-1]
                curr = recent_events[i]
                total_distance += math.sqrt((curr.x - prev.x)**2 + (curr.y - prev.y)**2)
            spatial = total_distance
        else:
            spatial = 0.0
        
        return MicrovibrationVector(temporal=temporal, radial=radial, spatial=spatial)
    
    def update_baseline_patterns(self, vector: MicrovibrationVector):
        """Update baseline patterns during learning phase"""
        if not self.is_learning:
            return
            
        self.baseline_patterns.append(vector)
        
        # Establish signature after collecting enough patterns
        if len(self.baseline_patterns) >= 50 and not self.signature_established:
            self.signature_established = True
            self.is_learning = False
            self.log_info(f"Microvibration signature established with {len(self.baseline_patterns)} patterns")
    
    def authenticate_user(self, test_vectors: List[MicrovibrationVector]) -> Tuple[bool, float]:
        """
        Authenticate user based on microvibration pattern correlation.
        Returns (is_authenticated, confidence_score)
        """
        if not self.signature_established or len(self.baseline_patterns) == 0:
            return False, 0.0
        
        if len(test_vectors) < 10:
            return False, 0.0  # Need minimum sample size
        
        # Calculate correlation scores against baseline patterns
        correlation_scores = []
        
        for test_vector in test_vectors:
            vector_correlations = []
            for baseline_vector in self.baseline_patterns:
                correlation = test_vector.correlation_with(baseline_vector)
                vector_correlations.append(correlation)
            
            # Use maximum correlation (best match)
            if vector_correlations:
                correlation_scores.append(max(vector_correlations))
        
        if not correlation_scores:
            return False, 0.0
        
        # Calculate overall authentication confidence
        mean_correlation = statistics.mean(correlation_scores)
        confidence = abs(mean_correlation)  # Both positive and negative correlations are signatures
        
        is_authenticated = confidence >= self.authentication_threshold
        
        self.log_info(f"Authentication attempt: correlation={mean_correlation:.4f}, confidence={confidence:.4f}, authenticated={is_authenticated}")
        
        return is_authenticated, confidence
    
    def get_signature_strength(self) -> float:
        """Calculate the mathematical strength of the established signature"""
        if not self.signature_established or len(self.baseline_patterns) < 2:
            return 0.0
        
        # Calculate internal consistency of baseline patterns
        correlations = []
        for i in range(len(self.baseline_patterns)):
            for j in range(i + 1, len(self.baseline_patterns)):
                correlation = self.baseline_patterns[i].correlation_with(self.baseline_patterns[j])
                correlations.append(correlation)
        
        if not correlations:
            return 0.0
        
        # Signature strength is the consistency of internal correlations
        return abs(statistics.mean(correlations))
    
    def export_signature_data(self) -> Dict:
        """Export signature data for Queen Bee validation system"""
        return {
            'signature_established': self.signature_established,
            'pattern_count': len(self.baseline_patterns),
            'signature_strength': self.get_signature_strength(),
            'authentication_threshold': self.authentication_threshold,
            'collection_window': self.collection_window,
            'baseline_patterns': [
                {
                    'temporal': p.temporal,
                    'radial': p.radial, 
                    'spatial': p.spatial
                } for p in self.baseline_patterns
            ]
        }

def create_microvibration_analyzer() -> MicrovibrationAnalyzer:
    """Factory function to create microvibration analyzer instance"""
    return MicrovibrationAnalyzer()


# Log dependencies
log_file_dependency("microvibration_auth.py", "math", "import")
log_file_dependency("microvibration_auth.py", "statistics", "import")
