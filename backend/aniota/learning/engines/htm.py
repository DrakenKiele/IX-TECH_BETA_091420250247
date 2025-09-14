


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("htm.py", "system_initialization", "import", "Auto-generated dev log entry")

HTM - Hypothesis Testing Module
Module #7 in dependency order

Analyzes clipboard content and interaction patterns to detect learning behaviors.
Works with RFM to identify negative learning patterns and trigger interventions.

Parent: SIE
Children: None
"""

from typing import Dict, List, Any, Optional, Union, Tuple
import logging
from datetime import datetime, timedelta
import threading
import re
import string
from ..base_module import CoreSystemModule

class HypothesisTestingModule(CoreSystemModule):
    """
    HTM - Hypothesis Testing Module
    
    Architectural Intent:
    - Monitors clipboard content before it enters clipboard
    - Extracts keywords and determines punctuation patterns
    - Detects if questions are being copied externally from app
    - Identifies if statements are being copied to answer external questions
    - Tracks learning patterns to identify negative learning moments
    - Works with RFM to trigger appropriate interventions
    """
    
    def __init__(self, parent_sie=None):
        super().__init__("HTM", parent_sie)
        
        # Clipboard monitoring state
        self.clipboard_events: List[Dict[str, Any]] = []
        self.monitoring_lock = threading.Lock()
        
        # Pattern analysis configuration
        self.question_indicators = ['?', 'what', 'how', 'why', 'when', 'where', 'who', 'which']
        self.statement_indicators = ['.', '!', 'because', 'therefore', 'thus', 'since']
        self.keyword_extraction_patterns = {
            'question_words': r'\b(what|how|why|when|where|who|which|can|could|would|should|will|do|does|did|is|are|was|were)\b',
            'subject_nouns': r'\b[A-Z][a-z]+\b',  # Capitalized words (likely subjects)
            'technical_terms': r'\b\w{4,}\b',  # Words 4+ characters (likely technical)
            'numbers': r'\b\d+\b'
        }
        
        # Learning pattern tracking
        self.learning_events: List[Dict[str, Any]] = []
        self.pattern_analysis_window = 300  # 5 minutes
        self.negative_pattern_threshold = 3  # Number of events to trigger concern
        
        # Hypothesis states
        self.active_hypotheses: Dict[str, Dict[str, Any]] = {}
        self.confidence_levels = {
            'external_question_copying': 0.0,
            'external_answer_copying': 0.0,
            'negative_learning_pattern': 0.0,
            'learning_avoidance': 0.0
        }
        
        # Initialize specifications
        self.specs = {
            'clipboard_monitoring': True,
            'keyword_extraction': True,
            'punctuation_analysis': True,
            'pattern_detection': True,
            'confidence_thresholds': {
                'intervention_trigger': 0.7,
                'pattern_concern': 0.5,
                'hypothesis_validation': 0.8
            },
            'analysis_window_minutes': 5,
            'negative_pattern_threshold': 3
        }
    
    def initialize(self) -> bool:
        """
        Initialize the Hypothesis Testing Module
        """
        try:
            self.logger.info("Initializing Hypothesis Testing Module (HTM)")
            
            # Initialize clipboard monitoring
            self._setup_clipboard_monitoring()
            
            # Initialize pattern analysis
            self._setup_pattern_analysis()
            
            # Initialize hypothesis tracking
            self._setup_hypothesis_tracking()
            
            # Initialize keyword extraction
            self._setup_keyword_extraction()
            
            self.is_initialized = True
            self.logger.info("HTM initialization complete")
            return True
            
        except Exception as e:
            self.logger.error(f"HTM initialization failed: {e}")
            return False
    
    def validate_integrity(self) -> bool:
        """
        Validate HTM module integrity
        """
        try:
            # Validate monitoring systems
            if not self._validate_monitoring_systems():
                return False
            
            # Validate pattern analysis
            if not self._validate_pattern_analysis():
                return False
            
            # Validate hypothesis tracking
            if not self._validate_hypothesis_tracking():
                return False
            
            return True
            
        except Exception as e:
            self.logger.error(f"HTM integrity validation failed: {e}")
            return False
    
    def analyze_clipboard_content(self, content: str, timestamp: datetime = None) -> Dict[str, Any]:
        """
        Analyze clipboard content before it enters clipboard
        
        Parameters:
            content: Text content about to be copied
            timestamp: When the copy action occurred
            
        Returns:
            Analysis results including keywords, punctuation, and behavioral inference
        """
        try:
            if timestamp is None:
                timestamp = datetime.now()
            
            with self.monitoring_lock:
                # Extract keywords
                keywords = self._extract_keywords(content)
                
                # Analyze punctuation patterns
                punctuation_analysis = self._analyze_punctuation(content)
                
                # Determine content type
                content_type = self._determine_content_type(content, punctuation_analysis)
                
                # Assess behavioral implications
                behavioral_inference = self._assess_behavioral_implications(
                    content, content_type, punctuation_analysis, keywords
                )
                
                # Create event record
                clipboard_event = {
                    'timestamp': timestamp,
                    'content': content,
                    'keywords': keywords,
                    'punctuation_analysis': punctuation_analysis,
                    'content_type': content_type,
                    'behavioral_inference': behavioral_inference,
                    'confidence_scores': self._calculate_confidence_scores(
                        content_type, behavioral_inference
                    )
                }
                
                # Store event
                self.clipboard_events.append(clipboard_event)
                
                # Update learning pattern tracking
                self._update_learning_pattern_tracking(clipboard_event)
                
                # Update hypotheses
                self._update_hypotheses(clipboard_event)
                
                self.logger.debug(f"Analyzed clipboard content: {content_type}")
                return clipboard_event
                
        except Exception as e:
            self.logger.error(f"Clipboard content analysis failed: {e}")
            return {'error': str(e)}
    
    def detect_negative_learning_pattern(self) -> Optional[Dict[str, Any]]:
        """
        Detect if a negative learning pattern is emerging
        
        Returns:
            Pattern detection results or None if no pattern detected
        """
        try:
            current_time = datetime.now()
            window_start = current_time - timedelta(seconds=self.pattern_analysis_window)
            
            # Get recent learning events
            recent_events = [
                event for event in self.learning_events
                if event['timestamp'] >= window_start
            ]
            
            if len(recent_events) < self.negative_pattern_threshold:
                return None
            
            # Analyze pattern indicators
            pattern_indicators = self._analyze_pattern_indicators(recent_events)
            
            # Calculate pattern confidence
            pattern_confidence = self._calculate_pattern_confidence(pattern_indicators)
            
            # Check if intervention threshold is met
            if pattern_confidence >= self.specs['confidence_thresholds']['intervention_trigger']:
                
                # Generate intervention recommendation
                intervention_recommendation = self._generate_intervention_recommendation(
                    pattern_indicators, pattern_confidence
                )
                
                pattern_detection = {
                    'pattern_detected': True,
                    'confidence': pattern_confidence,
                    'indicators': pattern_indicators,
                    'recent_events_count': len(recent_events),
                    'intervention_recommendation': intervention_recommendation,
                    'detection_timestamp': current_time
                }
                
                self.logger.warning(f"Negative learning pattern detected with confidence {pattern_confidence:.2f}")
                return pattern_detection
            
            return None
            
        except Exception as e:
            self.logger.error(f"Pattern detection failed: {e}")
            return None
    
    def generate_hypothesis(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a hypothesis about learner behavior
        
        Parameters:
            context: Context information for hypothesis generation
            
        Returns:
            Generated hypothesis with confidence level
        """
        try:
            hypothesis_id = f"hyp_{datetime.now().timestamp()}"
            
            # Analyze current state
            current_state = self._analyze_current_state()
            
            # Generate hypothesis based on patterns
            hypothesis = self._generate_behavioral_hypothesis(context, current_state)
            
            # Calculate initial confidence
            initial_confidence = self._calculate_initial_confidence(hypothesis, current_state)
            
            hypothesis_data = {
                'hypothesis_id': hypothesis_id,
                'hypothesis': hypothesis,
                'context': context,
                'initial_confidence': initial_confidence,
                'generation_timestamp': datetime.now(),
                'validation_state': 'pending',
                'supporting_evidence': [],
                'contradicting_evidence': []
            }
            
            # Store hypothesis
            self.active_hypotheses[hypothesis_id] = hypothesis_data
            
            self.logger.debug(f"Generated hypothesis {hypothesis_id}: {hypothesis['description']}")
            return hypothesis_data
            
        except Exception as e:
            self.logger.error(f"Hypothesis generation failed: {e}")
            return {'error': str(e)}
    
    def update_hypothesis_confidence(self, hypothesis_id: str, new_evidence: Dict[str, Any]) -> bool:
        """
        Update hypothesis confidence based on new evidence
        
        Parameters:
            hypothesis_id: ID of hypothesis to update
            new_evidence: New evidence to consider
            
        Returns:
            True if update successful
        """
        try:
            if hypothesis_id not in self.active_hypotheses:
                self.logger.warning(f"Unknown hypothesis ID: {hypothesis_id}")
                return False
            
            hypothesis = self.active_hypotheses[hypothesis_id]
            
            # Classify evidence
            if self._evidence_supports_hypothesis(new_evidence, hypothesis):
                hypothesis['supporting_evidence'].append(new_evidence)
            else:
                hypothesis['contradicting_evidence'].append(new_evidence)
            
            # Recalculate confidence
            new_confidence = self._recalculate_hypothesis_confidence(hypothesis)
            hypothesis['current_confidence'] = new_confidence
            
            # Check if hypothesis should be validated or rejected
            validation_threshold = self.specs['confidence_thresholds']['hypothesis_validation']
            
            if new_confidence >= validation_threshold:
                hypothesis['validation_state'] = 'validated'
                self.logger.info(f"Hypothesis {hypothesis_id} validated with confidence {new_confidence:.2f}")
            elif new_confidence < 0.2:  # Low confidence threshold
                hypothesis['validation_state'] = 'rejected'
                self.logger.info(f"Hypothesis {hypothesis_id} rejected with confidence {new_confidence:.2f}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Hypothesis confidence update failed: {e}")
            return False
    
    def get_confidence_levels(self) -> Dict[str, float]:
        """
        Get current confidence levels for all tracked patterns
        
        Returns:
            Dictionary of confidence levels
        """
        try:
            return self.confidence_levels.copy()
            
        except Exception as e:
            self.logger.error(f"Confidence level retrieval failed: {e}")
            return {}
    
    def get_learning_pattern_analysis(self) -> Dict[str, Any]:
        """
        Get comprehensive analysis of learning patterns
        
        Returns:
            Learning pattern analysis results
        """
        try:
            current_time = datetime.now()
            
            # Analyze recent patterns
            recent_analysis = self._analyze_recent_patterns()
            
            # Get trend analysis
            trend_analysis = self._analyze_learning_trends()
            
            # Generate summary
            pattern_summary = {
                'analysis_timestamp': current_time,
                'recent_patterns': recent_analysis,
                'trends': trend_analysis,
                'confidence_levels': self.confidence_levels,
                'active_hypotheses_count': len(self.active_hypotheses),
                'validated_hypotheses': [
                    h for h in self.active_hypotheses.values()
                    if h['validation_state'] == 'validated'
                ],
                'intervention_recommendations': self._get_intervention_recommendations()
            }
            
            return pattern_summary
            
        except Exception as e:
            self.logger.error(f"Learning pattern analysis failed: {e}")
            return {'error': str(e)}
    
    # Private helper methods
    
    def _setup_clipboard_monitoring(self) -> None:
        """Set up clipboard monitoring systems"""
        self.clipboard_events = []
        self.logger.debug("Clipboard monitoring setup")
    
    def _setup_pattern_analysis(self) -> None:
        """Set up pattern analysis systems"""
        self.learning_events = []
        self.logger.debug("Pattern analysis setup")
    
    def _setup_hypothesis_tracking(self) -> None:
        """Set up hypothesis tracking systems"""
        self.active_hypotheses = {}
        self.logger.debug("Hypothesis tracking setup")
    
    def _setup_keyword_extraction(self) -> None:
        """Set up keyword extraction systems"""
        # TODO: Initialize advanced NLP tools for keyword extraction
        self.logger.debug("Keyword extraction setup")
    
    def _validate_monitoring_systems(self) -> bool:
        """Validate monitoring system integrity"""
        return True  # Placeholder
    
    def _validate_pattern_analysis(self) -> bool:
        """Validate pattern analysis integrity"""
        return True  # Placeholder
    
    def _validate_hypothesis_tracking(self) -> bool:
        """Validate hypothesis tracking integrity"""
        return True  # Placeholder
    
    def _extract_keywords(self, content: str) -> List[str]:
        """Extract keywords from content using pattern matching"""
        keywords = []
        
        for pattern_name, pattern in self.keyword_extraction_patterns.items():
            matches = re.findall(pattern, content, re.IGNORECASE)
            keywords.extend(matches)
        
        # Remove duplicates and common words
        keywords = list(set(keywords))
        common_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        keywords = [kw for kw in keywords if kw.lower() not in common_words]
        
        return keywords[:10]  # Limit to top 10 keywords
    
    def _analyze_punctuation(self, content: str) -> Dict[str, Any]:
        """Analyze punctuation patterns in content"""
        punctuation_counts = {}
        for char in string.punctuation:
            punctuation_counts[char] = content.count(char)
        
        # Determine dominant punctuation
        dominant_punctuation = max(punctuation_counts.items(), key=lambda x: x[1])
        
        # Analyze sentence structure
        sentences = content.split('.')
        questions = content.count('?')
        exclamations = content.count('!')
        
        return {
            'punctuation_counts': punctuation_counts,
            'dominant_punctuation': dominant_punctuation[0] if dominant_punctuation[1] > 0 else None,
            'sentence_count': len([s for s in sentences if s.strip()]),
            'question_count': questions,
            'exclamation_count': exclamations,
            'ends_with_question': content.strip().endswith('?'),
            'ends_with_statement': content.strip().endswith('.'),
            'ends_with_exclamation': content.strip().endswith('!')
        }
    
    def _determine_content_type(self, content: str, punctuation_analysis: Dict[str, Any]) -> str:
        """Determine if content is a question or statement"""
        content_lower = content.lower()
        
        # Check for question indicators
        question_score = 0
        for indicator in self.question_indicators:
            if indicator in content_lower:
                question_score += 1
        
        # Check for statement indicators
        statement_score = 0
        for indicator in self.statement_indicators:
            if indicator in content_lower:
                statement_score += 1
        
        # Consider punctuation
        if punctuation_analysis['ends_with_question']:
            question_score += 2
        if punctuation_analysis['ends_with_statement']:
            statement_score += 2
        
        # Determine type
        if question_score > statement_score:
            return 'question'
        elif statement_score > question_score:
            return 'statement'
        else:
            return 'ambiguous'
    
    def _assess_behavioral_implications(self, content: str, content_type: str, 
                                      punctuation_analysis: Dict[str, Any], keywords: List[str]) -> Dict[str, Any]:
        """Assess what the clipboard action implies about learner behavior"""
        implications = {
            'likely_external_question': False,
            'likely_external_answer': False,
            'learning_engagement_level': 'unknown',
            'subject_area_detected': None,
            'learning_motivation_indicators': []
        }
        
        # Assess if copying question externally
        if content_type == 'question':
            implications['likely_external_question'] = True
            implications['learning_engagement_level'] = 'seeking_help'
        
        # Assess if copying answer externally
        elif content_type == 'statement' and any(ind in content.lower() for ind in self.statement_indicators):
            implications['likely_external_answer'] = True
            implications['learning_engagement_level'] = 'providing_answer'
        
        # Try to detect subject area from keywords
        if keywords:
            implications['subject_area_detected'] = self._infer_subject_area(keywords)
        
        return implications
    
    def _calculate_confidence_scores(self, content_type: str, behavioral_inference: Dict[str, Any]) -> Dict[str, float]:
        """Calculate confidence scores for different behavioral hypotheses"""
        scores = {}
        
        # Confidence for external question copying
        if behavioral_inference['likely_external_question']:
            scores['external_question_copying'] = 0.8 if content_type == 'question' else 0.3
        else:
            scores['external_question_copying'] = 0.1
        
        # Confidence for external answer copying
        if behavioral_inference['likely_external_answer']:
            scores['external_answer_copying'] = 0.8 if content_type == 'statement' else 0.3
        else:
            scores['external_answer_copying'] = 0.1
        
        return scores
    
    def _update_learning_pattern_tracking(self, clipboard_event: Dict[str, Any]) -> None:
        """Update learning pattern tracking with new clipboard event"""
        learning_event = {
            'timestamp': clipboard_event['timestamp'],
            'event_type': 'clipboard_action',
            'content_type': clipboard_event['content_type'],
            'behavioral_inference': clipboard_event['behavioral_inference'],
            'confidence_scores': clipboard_event['confidence_scores']
        }
        
        self.learning_events.append(learning_event)
        
        # Clean old events (keep only recent window)
        cutoff_time = datetime.now() - timedelta(seconds=self.pattern_analysis_window * 2)
        self.learning_events = [
            event for event in self.learning_events
            if event['timestamp'] >= cutoff_time
        ]
    
    def _update_hypotheses(self, clipboard_event: Dict[str, Any]) -> None:
        """Update active hypotheses based on new clipboard event"""
        # Update confidence levels
        for confidence_type, score in clipboard_event['confidence_scores'].items():
            if confidence_type in self.confidence_levels:
                # Weighted average with existing confidence
                current_confidence = self.confidence_levels[confidence_type]
                self.confidence_levels[confidence_type] = (current_confidence * 0.7) + (score * 0.3)
    
    def _analyze_pattern_indicators(self, recent_events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze indicators of negative learning patterns"""
        indicators = {
            'external_question_frequency': 0,
            'external_answer_frequency': 0,
            'help_seeking_pattern': False,
            'avoidance_pattern': False,
            'subject_consistency': True
        }
        
        # Count external actions
        for event in recent_events:
            if event.get('behavioral_inference', {}).get('likely_external_question'):
                indicators['external_question_frequency'] += 1
            if event.get('behavioral_inference', {}).get('likely_external_answer'):
                indicators['external_answer_frequency'] += 1
        
        # Detect patterns
        total_events = len(recent_events)
        if total_events > 0:
            external_ratio = (indicators['external_question_frequency'] + 
                            indicators['external_answer_frequency']) / total_events
            
            if external_ratio > 0.7:  # 70% of actions are external
                indicators['avoidance_pattern'] = True
            elif indicators['external_question_frequency'] > indicators['external_answer_frequency']:
                indicators['help_seeking_pattern'] = True
        
        return indicators
    
    def _calculate_pattern_confidence(self, pattern_indicators: Dict[str, Any]) -> float:
        """Calculate confidence that a negative learning pattern exists"""
        confidence = 0.0
        
        # High external activity increases confidence
        total_external = (pattern_indicators['external_question_frequency'] + 
                         pattern_indicators['external_answer_frequency'])
        
        if total_external >= self.negative_pattern_threshold:
            confidence += 0.4
        
        # Avoidance pattern strongly indicates negative learning
        if pattern_indicators['avoidance_pattern']:
            confidence += 0.5
        
        # Help-seeking might indicate struggle
        if pattern_indicators['help_seeking_pattern']:
            confidence += 0.2
        
        return min(1.0, confidence)
    
    def _generate_intervention_recommendation(self, pattern_indicators: Dict[str, Any], 
                                            confidence: float) -> Dict[str, Any]:
        """Generate recommendation for SIE intervention"""
        return {
            'intervention_type': 'socratic_questioning',
            'question_sequence': ['review', 'explore', 'extend'],
            'priority_order': ['review', 'explore', 'extend'],  # Review is easiest choice
            'rationale': 'Negative learning pattern detected - redirect to internal learning',
            'confidence': confidence,
            'urgency': 'medium' if confidence > 0.8 else 'low'
        }
    
    # Additional placeholder methods for completeness
    def _analyze_current_state(self) -> Dict[str, Any]:
        """Analyze current learning state"""
        return {'state': 'analyzing'}  # Placeholder
    
    def _generate_behavioral_hypothesis(self, context: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate behavioral hypothesis"""
        return {'description': 'Learner behavior hypothesis', 'type': 'behavioral'}  # Placeholder
    
    def _calculate_initial_confidence(self, hypothesis: Dict[str, Any], state: Dict[str, Any]) -> float:
        """Calculate initial hypothesis confidence"""
        return 0.5  # Placeholder
    
    def _evidence_supports_hypothesis(self, evidence: Dict[str, Any], hypothesis: Dict[str, Any]) -> bool:
        """Check if evidence supports hypothesis"""
        return True  # Placeholder
    
    def _recalculate_hypothesis_confidence(self, hypothesis: Dict[str, Any]) -> float:
        """Recalculate hypothesis confidence"""
        return 0.6  # Placeholder
    
    def _analyze_recent_patterns(self) -> Dict[str, Any]:
        """Analyze recent learning patterns"""
        return {'recent_trends': 'stable'}  # Placeholder
    
    def _analyze_learning_trends(self) -> Dict[str, Any]:
        """Analyze learning trends"""
        return {'trend': 'improving'}  # Placeholder
    
    def _get_intervention_recommendations(self) -> List[Dict[str, Any]]:
        """Get intervention recommendations"""
        return []  # Placeholder
    
    def _infer_subject_area(self, keywords: List[str]) -> Optional[str]:
        """Infer subject area from keywords"""
        # Simple subject area inference
        math_keywords = ['equation', 'algebra', 'calculus', 'geometry', 'math']
        science_keywords = ['physics', 'chemistry', 'biology', 'experiment', 'molecule']
        
        for keyword in keywords:
            if any(math_kw in keyword.lower() for math_kw in math_keywords):
                return 'mathematics'
            elif any(sci_kw in keyword.lower() for sci_kw in science_keywords):
                return 'science'
        
        return None
    
    def shutdown(self) -> None:
        """Gracefully shutdown HTM"""
        self.logger.info("Shutting down Hypothesis Testing Module")
        
        # Save analysis state
        # TODO: Persist learning pattern data
        # TODO: Save active hypotheses
        
        super().shutdown()


log_file_dependency("htm.py", "logging", "import")
log_file_dependency("htm.py", "string", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
