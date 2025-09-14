

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("tvmle.py", "system_initialization", "import", "Auto-generated dev log entry")

QVMLE - Quad Vector Mathematical Learning Engine
Mathematical implementation to prove quad-dimensional learning consciousness concept

Converts micro-events (mouse, keyboard, clipboard) into quad vectors
and performs mathematical correlation analysis for learning patterns.
Supports the four-choice Socratic system: Expand/Explore/Extend/Review
"""

from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import math
from templates.base_module import CoreSystemModule


class QuadVector:
    """
    Represents a learning event as a quad vector in coordinate space:
    - expand: High Relatedness + High Difficulty (same topic, deeper)
    - explore: Low Relatedness + Low Difficulty (broad discovery, accessible)  
    - extend: Low Relatedness + High Difficulty (new applications, complex)
    - review: High Relatedness + Low Difficulty (familiar consolidation)
    
    Maps to 2D coordinate system where:
    - X-axis: Relatedness (0.0 = unrelated, 1.0 = highly related)
    - Y-axis: Difficulty (0.0 = easy, 1.0 = challenging)
    """
    def __init__(self, expand: float, explore: float, extend: float, review: float,
                 difficulty: float = None, relatedness: float = None):
        self.expand = expand      # High/High quadrant
        self.explore = explore    # Low/Low quadrant  
        self.extend = extend      # Low/High quadrant
        self.review = review      # High/Low quadrant
        self.timestamp = datetime.now()
        
        # Optional coordinate mapping
        self.difficulty = difficulty    # Y-axis coordinate
        self.relatedness = relatedness  # X-axis coordinate
        
    def to_coordinates(self) -> Tuple[float, float]:
        """Convert quad vector to (relatedness, difficulty) coordinates"""
        if self.difficulty is not None and self.relatedness is not None:
            return (self.relatedness, self.difficulty)
            
        # Calculate coordinates from vector components
        # Relatedness: expand & review are high relatedness
        relatedness = (self.expand + self.review) / 2.0
        
        # Difficulty: expand & extend are high difficulty  
        difficulty = (self.expand + self.extend) / 2.0
        
        return (relatedness, difficulty)
        
    def dominant_quadrant(self) -> str:
        """Determine which learning dimension is strongest"""
        dimensions = {
            'expand': self.expand,
            'explore': self.explore,
            'extend': self.extend,
            'review': self.review
        }
        return max(dimensions.keys(), key=lambda k: dimensions[k])
        
    def magnitude(self) -> float:
        """Calculate the magnitude of the quad vector"""
        return math.sqrt(self.expand**2 + self.explore**2 + self.extend**2 + self.review**2)
        
    def correlation_with(self, other_vector) -> float:
        """Calculate mathematical correlation between two quad vectors using cosine similarity"""
        # Dot product normalized by magnitudes
        dot_product = (
            self.expand * other_vector.expand + 
            self.explore * other_vector.explore +
            self.extend * other_vector.extend +
            self.review * other_vector.review
        )
        
        self_magnitude = self.magnitude()
        other_magnitude = other_vector.magnitude()
        
        if self_magnitude == 0 or other_magnitude == 0:
            return 0.0
            
        # Cosine similarity (ranges from -1 to 1, normalized to 0-1)
        correlation = (dot_product / (self_magnitude * other_magnitude) + 1) / 2
        return correlation

class QuadVectorMathematicalLearningEngine(CoreSystemModule):
    """
    QVMLE - Quad Vector Mathematical Learning Engine
    
    Converts micro-events into quad vectors and learns through
    mathematical correlation analysis across four learning dimensions.
    Integrates with the four-choice Socratic Inquiry System.
    """
    
    def __init__(self, parent=None):
        super().__init__("QVMLE", parent)
        
        # Quad Vector storage
        self.learned_vectors: List[QuadVector] = []
        self.correlation_threshold = 0.75  # High correlation threshold
        
        # Learning statistics
        self.total_events = 0
        self.recognized_patterns = 0
        self.new_patterns_learned = 0
        
        # Quad dimension statistics
        self.dimension_stats = {
            'expand': {'count': 0, 'avg_strength': 0.0},
            'explore': {'count': 0, 'avg_strength': 0.0}, 
            'extend': {'count': 0, 'avg_strength': 0.0},
            'review': {'count': 0, 'avg_strength': 0.0}
        }
        
    def process_mouse_event(self, event_data: Dict[str, Any]) -> Optional[QuadVector]:
        """Convert mouse event into quad vector"""
        try:
            # Extract timing data
            start_time = event_data.get('start_time', 0)
            end_time = event_data.get('end_time', 0)
            duration = end_time - start_time
            
            # Map mouse behavior to learning dimensions
            # Expand: deliberate, slower movements (going deeper)
            expand = min(duration / 5.0, 1.0) if duration > 1.0 else 0.0
            
            # Explore: rapid movements, scanning behavior (discovering)
            velocity = event_data.get('velocity', 0)
            explore = min(velocity / 100.0, 1.0) if velocity > 10 else 0.0
            
            # Extend: movements toward new areas of screen (applying)
            x_pos = event_data.get('x', 0) / 1000.0  # Normalize
            y_pos = event_data.get('y', 0) / 1000.0
            extend = abs(x_pos - 0.5) + abs(y_pos - 0.5)  # Distance from center
            
            # Review: return movements, hesitation patterns (reflecting)
            review = 0.0
            if 'return_movement' in event_data and event_data['return_movement']:
                review = 0.8
            elif duration > 3.0:  # Long pause = reflection
                review = 0.6
                
            vector = QuadVector(expand, explore, extend, review)
            return self._learn_from_vector(vector)
            
        except Exception as e:
            self.logger.error(f"Error processing mouse event: {e}")
            return None
    
    def process_keyboard_event(self, event_data: Dict[str, Any]) -> Optional[QuadVector]:
        """Convert keyboard event into quad vector"""
        try:
            # Extract timing between keystrokes
            interval = event_data.get('interval', 0)
            key_type = event_data.get('key_type', 'letter')
            sequence_length = len(event_data.get('sequence', ''))
            
            # Map keyboard behavior to learning dimensions
            # Expand: deliberate typing, corrections (going deeper)
            expand = 0.0
            if 'backspace' in event_data or interval > 2.0:
                expand = 0.7  # Corrections indicate deeper thinking
                
            # Explore: rapid typing bursts (discovering ideas)
            explore = max(0, 1.0 - (interval / 5.0)) if interval < 5.0 else 0.0
            
            # Extend: special characters, numbers (applying concepts)
            extend_mapping = {
                'letter': 0.1,
                'number': 0.6,
                'symbol': 0.8,
                'function': 0.9
            }
            extend = extend_mapping.get(key_type, 0.5)
            
            # Review: pauses in typing (reflecting)
            review = min(interval / 10.0, 1.0) if interval > 3.0 else 0.0
                
            vector = QuadVector(expand, explore, extend, review)
            return self._learn_from_vector(vector)
            
        except Exception as e:
            self.logger.error(f"Error processing keyboard event: {e}")
            return None
    
    def process_clipboard_event(self, event_data: Dict[str, Any]) -> Optional[QuadVector]:
        """Convert clipboard event into quad vector"""
        try:
            action = event_data.get('action', 'copy')  # copy, paste, cut
            duration = event_data.get('duration', 0)
            content_length = event_data.get('content_length', 0)
            
            # Map clipboard behavior to learning dimensions
            # Expand: copying detailed content (preserving depth)
            expand = min(content_length / 200.0, 1.0) if action == 'copy' else 0.0
            
            # Explore: rapid copy/paste cycles (discovering connections)
            explore = 0.8 if duration < 1.0 and action in ['copy', 'paste'] else 0.0
            
            # Extend: pasting into new contexts (applying knowledge)
            extend = 0.9 if action == 'paste' else 0.0
            
            # Review: careful selection and cutting (reflecting on content)
            review = 0.7 if action == 'cut' or duration > 3.0 else 0.0
                
            vector = QuadVector(expand, explore, extend, review)
            return self._learn_from_vector(vector)
            
        except Exception as e:
            self.logger.error(f"Error processing clipboard event: {e}")
            return None
    
    def _learn_from_vector(self, new_vector: QuadVector) -> QuadVector:
        """Core learning logic: compare quad vector with existing patterns"""
        self.total_events += 1
        
        # Update dimension statistics
        self._update_dimension_stats(new_vector)
        
        # Find highest correlation with existing vectors
        best_correlation = 0.0
        best_match = None
        
        for existing_vector in self.learned_vectors:
            correlation = new_vector.correlation_with(existing_vector)
            if correlation > best_correlation:
                best_correlation = correlation
                best_match = existing_vector
        
        # Learning decision
        if best_correlation >= self.correlation_threshold:
            # Recognized pattern
            self.recognized_patterns += 1
            self.logger.info(f"Quad pattern recognized with {best_correlation:.3f} correlation")
        else:
            # New pattern - learn it
            self.learned_vectors.append(new_vector)
            self.new_patterns_learned += 1
            self.logger.info(f"New quad pattern learned. Total patterns: {len(self.learned_vectors)}")
        
        return new_vector
    
    def _update_dimension_stats(self, vector: QuadVector):
        """Update statistics for each learning dimension"""
        dimensions = [
            ('expand', vector.expand),
            ('explore', vector.explore), 
            ('extend', vector.extend),
            ('review', vector.review)
        ]
        
        for name, value in dimensions:
            stats = self.dimension_stats[name]
            stats['count'] += 1
            # Running average
            stats['avg_strength'] = (stats['avg_strength'] * (stats['count'] - 1) + value) / stats['count']
    
    def get_learning_stats(self) -> Dict[str, Any]:
        """Return current learning statistics for quad vector system"""
        return {
            'total_events': self.total_events,
            'recognized_patterns': self.recognized_patterns,
            'new_patterns_learned': self.new_patterns_learned,
            'total_learned_vectors': len(self.learned_vectors),
            'recognition_rate': self.recognized_patterns / max(self.total_events, 1),
            'learning_rate': self.new_patterns_learned / max(self.total_events, 1),
            'dimension_stats': self.dimension_stats,
            'strongest_dimension': max(self.dimension_stats.keys(), 
                                     key=lambda x: self.dimension_stats[x]['avg_strength']),
            'system_type': 'QVMLE_v1.0'
        }
    
    def explain_learning(self, vector: QuadVector) -> str:
        """Explain the mathematical reasoning behind a quad vector learning decision"""
        correlations = []
        for existing_vector in self.learned_vectors[:5]:  # Show top 5
            correlation = vector.correlation_with(existing_vector)
            correlations.append(f"Quad vector correlation: {correlation:.3f}")
        
        # Determine dominant dimension
        dimensions = [
            ('expand', vector.expand),
            ('explore', vector.explore),
            ('extend', vector.extend), 
            ('review', vector.review)
        ]
        dominant = max(dimensions, key=lambda x: x[1])
        
        explanation = f"""
Quad Vector Mathematical Learning Analysis:
Vector: expand={vector.expand:.2f}, explore={vector.explore:.2f}, extend={vector.extend:.2f}, review={vector.review:.2f}
Magnitude: {vector.magnitude():.3f}
Dominant dimension: {dominant[0]} ({dominant[1]:.2f})
Correlations with existing patterns:
{chr(10).join(correlations[:3])}
Decision: {'Recognized' if max([v.correlation_with(vector) for v in self.learned_vectors] + [0]) >= self.correlation_threshold else 'New quad pattern learned'}
Learning context: Socratic {dominant[0]} behavior detected
"""
        return explanation


log_file_dependency("tvmle.py", "math", "import")
