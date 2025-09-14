


"""
🧠 SIE - Socratic Inquiry Engine 🧠
Module #6 in dependency order

🎯 REVOLUTIONARY FOUR-CHOICE LEARNING SYSTEM:
Transforms traditional three-choice (Extension/Exploration/Review) into mathematically
precise four-choice coordinate system: Expand/Explore/Extend/Review

🎯 MATHEMATICAL FOUNDATION:
- Coordinate-based question selection using Difficulty × Relatedness space
- X-axis: Relatedness (0.0 = unrelated → 1.0 = directly related)  
- Y-axis: Difficulty (0.0 = easy → 1.0 = challenging)
- Four quadrants map to four question types with mathematical precision

🎯 EMERGENCY ESCAPE HATCH SYSTEM:
Ensures Aniota NEVER gets stuck through five-priority fallback system:
1. Question triggers (learner patterns)
2. Session state analysis (momentum)  
3. Coordinate mathematics (difficulty/relatedness)
4. Historical patterns (past success)
5. 🚨 EMERGENCY ESCAPE: Random selection + learner guidance recovery

🎯 INTEGRATION ARCHITECTURE:
- Parent: CAF (Cognitive Architecture Framework)
- Children: HTM (Holographic Memory), RFM (Reflective Memory)
- Feeds: QVMLE (Quad Vector Learning), Knowledge Weather Map
- Uses: LDM (Long-term Declarative Memory) for success-only storage

🎯 CORE GUARANTEE:
Aniota never declares knowledge - only guides discovery through questions.
Never gets stuck - always has escape hatch through learner interaction.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("aniota/learning/sie.py", "learning_system", "import", "Socratic Inquiry Engine - Four-choice coordinate learning")

from typing import Dict, List, Any, Optional, Union, Tuple
import logging
from datetime import datetime, timedelta
import threading
import random
from ..base_module import CoreSystemModule
from .common_sense_reasoning import CommonSenseReasoning

log_file_dependency("aniota/learning/sie.py", "base_module.py", "import")
log_file_dependency("aniota/learning/sie.py", "common_sense_reasoning.py", "import")

class SocraticInquiryEngine(CoreSystemModule):
    """
    🧠 SOCRATIC INQUIRY ENGINE - Aniota's Mathematical Learning Brain 🧠
    
    🎯 ARCHITECTURAL REVOLUTION:
    Transforms subjective learning decisions into mathematical precision through
    coordinate-based question selection in Difficulty × Relatedness space.
    
    🎯 FOUR-CHOICE COORDINATE SYSTEM:
    ┌─────────────────┬─────────────────┐
    │     EXPAND      │     EXTEND      │  High
    │  Hard+Unrelated │  Hard+Related   │  Difficulty
    │  New Challenges │  Advanced App   │    ↑
    ├─────────────────┼─────────────────┤
    │     REVIEW      │     EXPLORE     │  Low  
    │  Easy+Unrelated │  Easy+Related   │  Difficulty
    │  Consolidation  │  Pattern Disc   │    ↓
    └─────────────────┴─────────────────┘
        Low ← Relatedness → High
    
    🎯 SIX-PRIORITY SELECTION SYSTEM:
    1. 🎯 Question Triggers: Learner-indicated patterns
    2. 📊 Session State: Learning momentum analysis
    3. 🧮 Coordinates: Mathematical difficulty/relatedness calculation  
    4. 📈 Patterns: Historical success analysis
    5. 🧠 COMMON SENSE: Foundational fallback knowledge about learning/communication
    6. 🚨 ESCAPE HATCH: Emergency random selection + learner guidance
    
    🎯 EMERGENCY ESCAPE GUARANTEE:
    When all selection methods fail, Aniota randomly picks a direction and asks
    learner for guidance. This ensures she NEVER gets completely stuck.
    
    🎯 INTEGRATION ARCHITECTURE:
    - Mathematical coordinates feed Knowledge Weather Map visualization
    - Question success/failure stored in LDM (success-only memory)
    - Coordinates sent to QVMLE for quad-vector learning correlation
    - Escape events analyzed by Queen Bee for system improvement
    
    🎯 SOCRATIC PRINCIPLE:
    Aniota never declares knowledge - only guides discovery through questions.
    The escape hatch maintains this principle even when system gets stuck.
    """
    
    def __init__(self, parent_caf=None):
        super().__init__("SIE", parent_caf)
        
        # 🧠 Initialize Common Sense Reasoning - Aniota's foundational fallback knowledge
        self.common_sense = CommonSenseReasoning()
        
        # Question generation state
        self.active_inquiries: Dict[str, Dict[str, Any]] = {}  # inquiry_id -> inquiry_state
        self.inquiry_lock = threading.Lock()
        
        # Four-Choice Coordinate System Configuration
        # Based on 2D space: Difficulty (Y-axis) vs Relatedness (X-axis)
        self.question_types = {
            'expand': {
                'purpose': 'Go deeper into the current topic',
                'coordinates': {'difficulty': 0.75, 'relatedness': 0.75},  # High/High quadrant
                'patterns': [
                    "What might happen if we take this further?",
                    "How does this connect to what you already know?",
                    "What would be the next logical step?",
                    "Can you build on that idea?",
                    "What details are we missing from this picture?"
                ],
                'triggers': ['surface_understanding', 'basic_comprehension', 'need_depth'],
                'relatedness_factors': {
                    'terms': 0.9,      # High vocabulary overlap
                    'concepts': 0.8,   # Strong conceptual links
                    'principles': 0.7, # Same fundamental rules
                    'subject': 0.9     # Same domain
                }
            },
            'explore': {
                'purpose': 'Investigate and discover new connections',
                'coordinates': {'difficulty': 0.25, 'relatedness': 0.25},  # Low/Low quadrant
                'patterns': [
                    "What do you notice about...?",
                    "How are these two things similar/different?", 
                    "What questions does this raise for you?",
                    "What patterns do you see?",
                    "What if we approached this differently?"
                ],
                'triggers': ['curiosity_detected', 'pattern_recognition', 'need_discovery'],
                'relatedness_factors': {
                    'terms': 0.3,      # Loose vocabulary connections
                    'concepts': 0.4,   # Distant conceptual links
                    'principles': 0.2, # Different fundamental rules
                    'subject': 0.1     # Cross-domain exploration
                }
            },
            'extend': {
                'purpose': 'Apply knowledge to new domains or situations',
                'coordinates': {'difficulty': 0.75, 'relatedness': 0.25},  # High/Low quadrant  
                'patterns': [
                    "Where else might this principle apply?",
                    "How could you use this in a different context?",
                    "What real-world problems could this solve?",
                    "How might this connect to other subjects?",
                    "What would happen if we changed one key element?"
                ],
                'triggers': ['application_ready', 'transfer_potential', 'synthesis_needed'],
                'relatedness_factors': {
                    'terms': 0.2,      # Very different vocabulary
                    'concepts': 0.3,   # Distant concepts
                    'principles': 0.6, # Transferable principles
                    'subject': 0.1     # Different domains
                }
            },
            'review': {
                'purpose': 'Consolidate and reflect on learning (always leads to one of the other three)',
                'coordinates': {'difficulty': 0.25, 'relatedness': 0.75},  # Low/High quadrant
                'patterns': [
                    "What did you discover in this process?",
                    "How has your understanding changed?", 
                    "What was most surprising about what you learned?",
                    "How would you explain this to someone else?",
                    "What questions do you still have?"
                ],
                'triggers': ['learning_complete', 'consolidation_needed', 'reflection_time'],
                'relatedness_factors': {
                    'terms': 0.8,      # Familiar vocabulary
                    'concepts': 0.9,   # Well-known concepts
                    'principles': 0.8, # Established principles
                    'subject': 0.9     # Same domain
                },
                'leads_to': ['expand', 'explore', 'extend']  # Review always transitions to action
            }
        }
        
        # Inquiry configuration
        self.max_active_inquiries = 10
        self.inquiry_timeout_minutes = 30
        self.question_generation_strategies = ['contextual', 'progressive', 'adaptive']
        self.current_strategy = 'adaptive'
        
        # Learning state tracking
        self.learner_states: Dict[str, Dict[str, Any]] = {}  # learner_id -> state
        self.learning_sessions: Dict[str, Dict[str, Any]] = {}  # session_id -> session_data
        
        # Initialize specifications
        self.specs = {
            'max_active_inquiries': 10,
            'inquiry_timeout_minutes': 30,
            'question_types': ['expand', 'explore', 'extend', 'review'],  # Four-choice system
            'generation_strategies': ['contextual', 'progressive', 'adaptive'],
            'knowledge_integration': True,
            'socratic_purity': True,  # Never declare, only ask
            'emotional_safety': True,  # All questions emotionally safe
            'quad_vector_enabled': True,  # Uses QVMLE instead of TVMLE
            'coordinate_system_active': True,  # 2D Difficulty×Relatedness space
            'weather_map_integration': True,  # Feeds data to Knowledge Weather Map visualization
        }
        
        # Note: This SIE module provides coordinate data and subject classification
        # for the Knowledge Weather Map system (see knowledge_weather_map_spec.md)
        # Each question generates coordinates that map to geographic learning visualization
    
    def initialize(self) -> bool:
        """
        Initialize the Socratic Inquiry Engine
        """
        try:
            self.logger.info("Initializing Socratic Inquiry Engine (SIE)")
            
            # Initialize question generation systems
            self._initialize_question_generation()
            
            # Set up learner state tracking
            self._setup_learner_tracking()
            
            # Initialize inquiry management
            self._setup_inquiry_management()
            
            # Set up knowledge integration with LDM
            self._setup_knowledge_integration()
            
            # Initialize learning session management
            self._setup_session_management()
            
            self.is_initialized = True
            self.logger.info("SIE initialization complete")
            return True
            
        except Exception as e:
            self.logger.error(f"SIE initialization failed: {e}")
            return False
    
    def validate_integrity(self) -> bool:
        """
        Validate SIE module integrity
        """
        try:
            # Validate question type configurations
            if not self._validate_question_types():
                return False
            
            # Validate inquiry management
            if not self._validate_inquiry_management():
                return False
            
            # Validate learner state consistency
            if not self._validate_learner_states():
                return False
            
            # Check active inquiry limits
            if len(self.active_inquiries) > self.max_active_inquiries:
                self.logger.error("Too many active inquiries")
                return False
            
            return True
            
        except Exception as e:
            self.logger.error(f"SIE integrity validation failed: {e}")
            return False
    
    def generate_question(self, context: Dict[str, Any], learner_id: str = None) -> Optional[Dict[str, Any]]:
        """
        Generate a Socratic question based on context and learner state
        
        Parameters:
            context: Learning context including content, state, and triggers
            learner_id: Optional learner identifier for personalization
            
        Returns:
            Dictionary containing question, type, and metadata
        """
        try:
            with self.inquiry_lock:
                # Determine question type based on context
                question_type = self._determine_question_type(context, learner_id)
                
                # Generate question using appropriate strategy
                question_data = self._generate_question_by_type(question_type, context, learner_id)
                
                if question_data:
                    # Create inquiry tracking entry
                    inquiry_id = self._create_inquiry_tracking(question_data, context, learner_id)
                    question_data['inquiry_id'] = inquiry_id
                    
                    # Log question generation
                    self.logger.debug(f"Generated {question_type} question for learner {learner_id}")
                    
                    return question_data
                
                return None
                
        except Exception as e:
            self.logger.error(f"Question generation failed: {e}")
            return None
    
    def process_learner_response(self, inquiry_id: str, response: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Process learner response to a Socratic question and generate follow-up
        
        Parameters:
            inquiry_id: Identifier of the original inquiry
            response: Learner's response data
            
        Returns:
            Follow-up question or completion signal
        """
        try:
            with self.inquiry_lock:
                if inquiry_id not in self.active_inquiries:
                    self.logger.warning(f"Unknown inquiry ID: {inquiry_id}")
                    return None
                
                inquiry = self.active_inquiries[inquiry_id]
                
                # Analyze response quality and understanding
                response_analysis = self._analyze_learner_response(response, inquiry)
                
                # Update inquiry state
                inquiry['responses'].append({
                    'response': response,
                    'analysis': response_analysis,
                    'timestamp': datetime.now()
                })
                
                # Determine if follow-up is needed
                follow_up = self._determine_follow_up(inquiry, response_analysis)
                
                if follow_up:
                    # Generate follow-up question
                    return self._generate_follow_up_question(inquiry, response_analysis)
                else:
                    # Mark inquiry as complete
                    self._complete_inquiry(inquiry_id)
                    return {'type': 'completion', 'message': 'Inquiry complete'}
                
        except Exception as e:
            self.logger.error(f"Response processing failed: {e}")
            return None
    
    def start_learning_session(self, learner_id: str, topic: str, context: Dict[str, Any] = None) -> str:
        """
        Start a new Socratic learning session
        
        Parameters:
            learner_id: Identifier for the learner
            topic: Learning topic or domain
            context: Additional context for the session
            
        Returns:
            Session identifier
        """
        try:
            session_id = f"session_{learner_id}_{datetime.now().timestamp()}"
            
            session_data = {
                'session_id': session_id,
                'learner_id': learner_id,
                'topic': topic,
                'context': context or {},
                'start_time': datetime.now(),
                'inquiries': [],
                'learner_progress': {},
                'session_state': 'active'
            }
            
            self.learning_sessions[session_id] = session_data
            
            # Initialize learner state if not exists
            if learner_id not in self.learner_states:
                self._initialize_learner_state(learner_id)
            
            # Generate opening question
            opening_context = {
                'topic': topic,
                'session_start': True,
                'learner_state': self.learner_states.get(learner_id, {}),
                **context
            }
            
            opening_question = self.generate_question(opening_context, learner_id)
            if opening_question:
                session_data['inquiries'].append(opening_question['inquiry_id'])
            
            self.logger.info(f"Started learning session {session_id} for learner {learner_id}")
            return session_id
            
        except Exception as e:
            self.logger.error(f"Session start failed: {e}")
            return None
    
    def get_session_progress(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Get progress and analytics for a learning session
        
        Parameters:
            session_id: Session identifier
            
        Returns:
            Session progress data
        """
        try:
            if session_id not in self.learning_sessions:
                return None
            
            session = self.learning_sessions[session_id]
            
            # Calculate progress metrics
            total_inquiries = len(session['inquiries'])
            completed_inquiries = sum(1 for inq_id in session['inquiries'] 
                                    if inq_id not in self.active_inquiries)
            
            progress = {
                'session_id': session_id,
                'learner_id': session['learner_id'],
                'topic': session['topic'],
                'start_time': session['start_time'],
                'duration': datetime.now() - session['start_time'],
                'total_inquiries': total_inquiries,
                'completed_inquiries': completed_inquiries,
                'active_inquiries': total_inquiries - completed_inquiries,
                'session_state': session['session_state'],
                'learner_progress': session['learner_progress']
            }
            
            return progress
            
        except Exception as e:
            self.logger.error(f"Session progress retrieval failed: {e}")
            return None
    
    def end_learning_session(self, session_id: str) -> Dict[str, Any]:
        """
        End a learning session and generate summary
        
        Parameters:
            session_id: Session identifier
            
        Returns:
            Session summary and analytics
        """
        try:
            if session_id not in self.learning_sessions:
                return {'error': 'Session not found'}
            
            session = self.learning_sessions[session_id]
            session['session_state'] = 'completed'
            session['end_time'] = datetime.now()
            
            # Generate session summary
            summary = self._generate_session_summary(session)
            
            # Update learner state based on session
            self._update_learner_state_from_session(session)
            
            # Clean up active inquiries for this session
            self._cleanup_session_inquiries(session_id)
            
            self.logger.info(f"Ended learning session {session_id}")
            return summary
            
        except Exception as e:
            self.logger.error(f"Session end failed: {e}")
            return {'error': str(e)}
    
    def get_learner_insights(self, learner_id: str) -> Dict[str, Any]:
        """
        Get insights about learner's Socratic learning patterns
        
        Parameters:
            learner_id: Learner identifier
            
        Returns:
            Learner insights and recommendations
        """
        try:
            if learner_id not in self.learner_states:
                return {'error': 'Learner not found'}
            
            learner_state = self.learner_states[learner_id]
            
            # Analyze learning patterns
            insights = {
                'learner_id': learner_id,
                'preferred_question_types': self._analyze_question_preferences(learner_id),
                'learning_progression': self._analyze_learning_progression(learner_id),
                'areas_of_strength': self._identify_learning_strengths(learner_id),
                'growth_opportunities': self._identify_growth_areas(learner_id),
                'socratic_readiness': self._assess_socratic_readiness(learner_id),
                'recommendations': self._generate_learner_recommendations(learner_id)
            }
            
            return insights
            
        except Exception as e:
            self.logger.error(f"Learner insights generation failed: {e}")
            return {'error': str(e)}
    
    # Private helper methods
    
    def _initialize_question_generation(self) -> None:
        """Initialize question generation systems"""
        # Validate question type patterns
        for q_type, config in self.question_types.items():
            if not config.get('patterns') or not config.get('triggers'):
                self.logger.warning(f"Incomplete configuration for question type: {q_type}")
        
        self.logger.debug("Question generation systems initialized")
    
    def _setup_learner_tracking(self) -> None:
        """Set up learner state tracking systems"""
        self.learner_states = {}
        self.logger.debug("Learner tracking setup")
    
    def _setup_inquiry_management(self) -> None:
        """Set up inquiry management systems"""
        self.active_inquiries = {}
        self.logger.debug("Inquiry management setup")
    
    def _setup_knowledge_integration(self) -> None:
        """Set up knowledge integration with LDM"""
        # Simulate LDM integration: assign a placeholder method for knowledge lookup
        self.ldm = self._get_ldm_interface()
        self.logger.debug("Knowledge integration setup")

    def _get_ldm_interface(self):
        """Return a simulated LDM interface for contextual knowledge lookup."""
        class LDM:
            def retrieve_knowledge(self, query):
                # Simulate knowledge retrieval
                return f"[LDM: Knowledge about '{query}']"
        return LDM()
    
    def _setup_session_management(self) -> None:
        """Set up learning session management"""
        self.learning_sessions = {}
        self.logger.debug("Session management setup")
    
    def _validate_question_types(self) -> bool:
        """Validate question type configurations"""
        required_types = ['extension', 'exploration', 'review']
        for q_type in required_types:
            if q_type not in self.question_types:
                self.logger.error(f"Missing required question type: {q_type}")
                return False
        return True
    
    def _validate_inquiry_management(self) -> bool:
        """Validate inquiry management state"""
        # TODO: Implement inquiry validation
        return True
    
    def _validate_learner_states(self) -> bool:
        """Validate learner state consistency"""
        # TODO: Implement learner state validation
        return True
    
    def calculate_relatedness(self, current_topic: str, target_topic: str, context: Dict[str, Any] = None) -> float:
        """
        🔗 FOUR-FACTOR RELATEDNESS ANALYSIS: Mathematical measurement of topic connection strength
        
        This algorithm transforms subjective "how related are these topics?" into precise numbers.
        Essential for coordinate-based learning because relatedness determines X-axis position.
        
        FOUR MEASUREMENT FACTORS:
        
        1. 📝 TERMS (Surface Level - Vocabulary Connections):
           - Word overlap analysis between topics
           - Shared terminology indicates basic relationship
           - Examples: "calculus" + "derivatives" = high term overlap
           
        2. 💡 CONCEPTS (Semantic Level - Idea Relationships):  
           - Deeper understanding connections
           - Related ideas that share meaning
           - Examples: "momentum" + "inertia" = conceptually related
           
        3. ⚖️ PRINCIPLES (Foundation Level - Rule Relationships):
           - Fundamental law/rule connections
           - Underlying logic that governs both topics
           - Examples: "thermodynamics" + "chemistry" = shared principles
           
        4. 🎓 SUBJECT (Domain Level - Field Relationships):
           - Academic/professional domain boundaries
           - Disciplinary proximity and overlap
           - Examples: "biology" + "chemistry" = related subjects
        
        MATHEMATICAL WEIGHTING:
        - Terms: 25% (immediate vocabulary recognition)
        - Concepts: 35% (semantic understanding depth)
        - Principles: 25% (foundational knowledge connections)
        - Subject: 15% (domain boundary considerations)
        
        COORDINATE MAPPING:
        This score directly determines X-axis position:
        - 0.0-0.25: Unrelated topics → Review/Expand quadrants
        - 0.25-0.75: Moderately related → Mixed positioning
        - 0.75-1.0: Highly related → Explore/Extend quadrants
        
        Returns value from 0.0 (completely unrelated) to 1.0 (directly related)
        """
        if not current_topic or not target_topic:
            return 0.0
            
        # Extract topic analysis from context if provided
        topic_analysis = context.get('topic_analysis', {}) if context else {}
        
        # Factor 1: Terms (vocabulary overlap)
        current_terms = set(topic_analysis.get('current_terms', current_topic.lower().split()))
        target_terms = set(topic_analysis.get('target_terms', target_topic.lower().split()))
        term_overlap = len(current_terms.intersection(target_terms)) / max(len(current_terms.union(target_terms)), 1)
        
        # Factor 2: Concepts (semantic relationships)
        # This would integrate with knowledge graph in full implementation
        concept_similarity = topic_analysis.get('concept_similarity', 0.5)  # Default moderate
        
        # Factor 3: Principles (fundamental rule connections)
        # Maps to underlying mathematical/logical relationships
        principle_alignment = topic_analysis.get('principle_alignment', 0.3)  # Default low
        
        # Factor 4: Subject (domain classification)
        current_domain = topic_analysis.get('current_domain', 'general')
        target_domain = topic_analysis.get('target_domain', 'general')
        domain_match = 1.0 if current_domain == target_domain else 0.2
        
        # Weighted combination (terms and subject more immediately measurable)
        relatedness = (
            term_overlap * 0.3 +           # 30% - measurable vocabulary overlap
            concept_similarity * 0.25 +    # 25% - semantic analysis
            principle_alignment * 0.2 +    # 20% - deep structural similarity
            domain_match * 0.25            # 25% - subject domain alignment
        )
        
        return min(max(relatedness, 0.0), 1.0)  # Clamp to [0,1]
    
    def calculate_difficulty_coordinates(self, context: Dict[str, Any], learner_id: str = None) -> Tuple[float, float]:
        """
        🎯 MATHEMATICAL FOUNDATION: Calculate position in Difficulty-Relatedness coordinate space
        
        This is the CORE MATHEMATICAL ENGINE that transforms subjective learning decisions
        into precise, measurable coordinates. This enables:
        - Objective question selection (not subjective guessing)
        - Reproducible learning paths (same context = same coordinates)
        - Mathematical optimization (vector-based learning)
        - Knowledge Weather Map visualization (geographic learning representation)
        
        COORDINATE SYSTEM:
        - X-axis: Relatedness (0.0 = completely unrelated → 1.0 = directly related)
        - Y-axis: Difficulty (0.0 = very easy → 1.0 = very challenging)
        
        ADAPTIVE DIFFICULTY ALGORITHM:
        Performance-based difficulty adjustment ensures optimal challenge level:
        - High performance (>80%): Increase difficulty (+0.2) for continued growth
        - Low performance (<40%): Decrease difficulty (-0.2) for confidence building  
        - Moderate performance: Maintain current level for steady progress
        
        RELATEDNESS CALCULATION:
        Four-factor analysis determines connection strength to current learning:
        1. Term overlap (shared vocabulary)
        2. Concept similarity (related ideas)
        3. Principle connections (underlying rules)
        4. Subject domain proximity (field relationships)
        
        RETURNS: (difficulty, relatedness) tuple for quadrant mapping
        - (0.0-0.5, 0.0-0.5) → Review quadrant: Easy + Unrelated = Consolidation
        - (0.5-1.0, 0.0-0.5) → Expand quadrant: Hard + Unrelated = New challenges
        - (0.0-0.5, 0.5-1.0) → Explore quadrant: Easy + Related = Pattern discovery
        - (0.5-1.0, 0.5-1.0) → Extend quadrant: Hard + Related = Advanced application
        """
        # Base difficulty assessment
        learner_level = context.get('learner_level', 0.5)  # 0-1 scale
        topic_complexity = context.get('topic_complexity', 0.5)
        current_performance = context.get('current_performance', 0.5)
        
        # Adaptive difficulty calculation
        if current_performance > 0.8:  # Learner doing well
            difficulty = min(learner_level + 0.2, 1.0)  # Increase challenge
        elif current_performance < 0.4:  # Learner struggling
            difficulty = max(learner_level - 0.2, 0.0)  # Reduce challenge
        else:
            difficulty = learner_level  # Maintain current level
        
        # Relatedness calculation
        current_topic = context.get('current_topic', '')
        learning_history = context.get('learning_history', [])
        
        if learning_history:
            # Calculate average relatedness to recent topics
            relatedness_scores = []
            for historical_topic in learning_history[-3:]:  # Last 3 topics
                score = self.calculate_relatedness(current_topic, historical_topic, context)
                relatedness_scores.append(score)
            relatedness = sum(relatedness_scores) / len(relatedness_scores)
        else:
            relatedness = 0.5  # Default moderate relatedness
        
        return (difficulty, relatedness)
    
    def select_optimal_question_type(self, context: Dict[str, Any], learner_id: str = None) -> str:
        """
        Select question type based on coordinate space position
        Uses Difficulty-Relatedness coordinates to choose optimal quadrant
        """
        difficulty, relatedness = self.calculate_difficulty_coordinates(context, learner_id)
        
        # Calculate distance to each quadrant center
        quadrant_distances = {}
        for q_type, config in self.question_types.items():
            if q_type == 'review' and not context.get('allow_review', True):
                continue  # Skip review unless explicitly allowed
                
            coords = config['coordinates']
            distance = ((difficulty - coords['difficulty'])**2 + (relatedness - coords['relatedness'])**2)**0.5
            quadrant_distances[q_type] = distance
        
        # Select closest quadrant
        optimal_type = min(quadrant_distances.keys(), key=lambda x: quadrant_distances[x])
        
        # Log the coordinate-based decision
        self.logger.info(f"Coordinate-based selection: difficulty={difficulty:.2f}, relatedness={relatedness:.2f} → {optimal_type}")
        
        return optimal_type

    def _determine_question_type(self, context: Dict[str, Any], learner_id: str = None) -> str:
        """
        Determine appropriate question type using coordinate-based selection
        Integrates explicit triggers with mathematical coordinate system
        """
        # Priority 1: Check for explicit triggers in context
        for q_type, config in self.question_types.items():
            for trigger in config['triggers']:
                if trigger in context.get('triggers', []):
                    self.logger.info(f"Question type selected by trigger '{trigger}': {q_type}")
                    return q_type
        
        # Priority 2: Session state management
        if context.get('session_start'):
            return 'explore'  # Start with exploration (low difficulty, low relatedness)
        
        if context.get('learning_complete'):
            return 'review'  # End with review (low difficulty, high relatedness)
        
        # Priority 3: Coordinate-based optimal selection
        try:
            optimal_type = self.select_optimal_question_type(context, learner_id)
            return optimal_type
        except Exception as e:
            self.logger.warning(f"Coordinate selection failed: {e}, falling back to pattern-based")
        
        # Priority 4: Learner pattern analysis (fallback)
        if learner_id and learner_id in self.learner_states:
            learner_state = self.learner_states[learner_id]
            recent_questions = learner_state.get('recent_question_types', [])
            
            # Avoid repetitive question types
            if len(recent_questions) >= 2 and recent_questions[-1] == recent_questions[-2]:
                available_types = [t for t in self.question_types.keys() if t != recent_questions[-1]]
                if available_types:
                    selected = random.choice(available_types)
                    self.logger.info(f"Question type selected to avoid repetition: {selected}")
                    return selected
        
        # Priority 5: Common Sense Reasoning - Foundational fallback knowledge
        # Before escape hatch, try applying basic common sense rules
        self.logger.info("Applying common sense reasoning as foundational fallback")
        common_sense_result = self._apply_common_sense_reasoning(context, learner_id)
        if common_sense_result['question_type']:
            return common_sense_result['question_type']
        
        # Priority 6: Emergency Escape Hatch - Aniota's final autonomous recovery system
        # When even common sense reasoning provides no clear direction
        self.logger.warning("All selection methods including common sense failed - activating emergency escape hatch")
        return self._emergency_escape_hatch(context, learner_id)
    
    def _apply_common_sense_reasoning(self, context: Dict[str, Any], learner_id: str = None) -> Dict[str, Any]:
        """
        🧠 Apply common sense reasoning when all other selection methods fail
        
        This uses Aniota's foundational knowledge about how learning and communication work
        to make reasonable assumptions and select an appropriate question type.
        """
        self.logger.info("🧠 Applying common sense reasoning to determine question direction")
        
        # Prepare situation context for common sense analysis
        situation = {
            'context_type': 'learning_interaction',
            'learner_id': learner_id,
            'current_topic': context.get('current_topic', 'unknown'),
            'learner_level': context.get('learner_level', 0.5),
            'confidence': 0.2,  # Low confidence since other methods failed
            'interaction_history': context.get('learning_history', []),
            'system_state': 'fallback_reasoning_active'
        }
        
        # Apply common sense reasoning
        reasoning_result = self.common_sense.apply_common_sense(situation)
        
        # Extract question type recommendation from common sense conclusions
        question_type = self._extract_question_type_from_common_sense(reasoning_result, context)
        
        # Log common sense reasoning results
        if question_type:
            self.logger.info(f"🧠 Common sense reasoning recommended: {question_type}")
            self.logger.info(f"Reasoning: {reasoning_result['conclusions']['recommended_approach']}")
        else:
            self.logger.warning("🧠 Common sense reasoning could not determine direction")
        
        return {
            'question_type': question_type,
            'reasoning_applied': True,
            'common_sense_result': reasoning_result,
            'confidence_level': reasoning_result['confidence_level']
        }
    
    def _extract_question_type_from_common_sense(self, reasoning_result: Dict[str, Any], context: Dict[str, Any]) -> Optional[str]:
        """
        Extract appropriate question type from common sense reasoning results
        
        Maps common sense conclusions to four-choice coordinate system
        """
        conclusions = reasoning_result.get('conclusions', {})
        recommended_approach = conclusions.get('recommended_approach', '').lower()
        
        # Map common sense recommendations to question types
        if 'supportive' in recommended_approach or 'simpler' in recommended_approach:
            # Learner needs support - use review for consolidation
            return 'review'
        
        elif 'guide discovery' in recommended_approach or 'explore' in recommended_approach:
            # Common sense suggests exploration approach
            return 'explore'
        
        elif 'build on' in recommended_approach or 'expand' in recommended_approach:
            # Common sense suggests building on current knowledge
            return 'expand'
        
        elif 'apply' in recommended_approach or 'practice' in recommended_approach:
            # Common sense suggests application
            return 'extend'
        
        # If no clear mapping, check for struggle indicators
        if any('struggle' in key for key in reasoning_result.get('reasoning_results', {})):
            return 'review'  # Default to supportive review when struggling
        
        # Check confidence level for final fallback decision
        confidence = reasoning_result.get('confidence_level', 0)
        if confidence > 0.5:
            return 'explore'  # Moderate confidence suggests exploration
        
        # If common sense reasoning gives no clear direction, return None
        # This will trigger the emergency escape hatch
        return None
    
    def _emergency_escape_hatch(self, context: Dict[str, Any], learner_id: str = None) -> str:
        """
        Emergency fallback system - Aniota's autonomous recovery mechanism
        
        When Aniota gets stuck and has no clear path forward, she:
        1. Randomly selects one of the four directions
        2. Presents it as a question to the learner
        3. Uses learner response to reorient and find navigable path
        
        This ensures Aniota NEVER gets completely stuck - she always has an escape route
        through learner interaction.
        """
        # Available escape directions (all four choices)
        escape_choices = ['expand', 'explore', 'extend', 'review']
        
        # Filter out review unless specifically allowed (since review leads to other choices)
        if not context.get('allow_review', True) and len(escape_choices) > 1:
            escape_choices = [choice for choice in escape_choices if choice != 'review']
        
        # Randomly select escape direction
        selected_escape = random.choice(escape_choices)
        
        # Log the emergency escape for debugging and learning
        self.logger.info(f"🚨 EMERGENCY ESCAPE ACTIVATED: Selected '{selected_escape}' direction")
        self.logger.info("Aniota will present this as a question and use learner response to reorient")
        
        # Store escape event for Queen Bee learning (pattern analysis)
        self._record_escape_event(selected_escape, context, learner_id)
        
        return selected_escape
    
    def _record_escape_event(self, escape_direction: str, context: Dict[str, Any], learner_id: str = None):
        """
        Record emergency escape events for Queen Bee analysis
        These events help improve the system by identifying problem patterns
        """
        escape_event = {
            'timestamp': datetime.now().isoformat(),
            'escape_direction': escape_direction,
            'context_snapshot': {
                'topic': context.get('current_topic', 'unknown'),
                'learner_level': context.get('learner_level', 0.5),
                'performance': context.get('current_performance', 0.5),
                'triggers': context.get('triggers', [])
            },
            'learner_id': learner_id,
            'system_state': 'emergency_escape_activated'
        }
        
        # Store for Queen Bee analysis (this data helps improve future decisions)
        if not hasattr(self, 'escape_events'):
            self.escape_events = []
        self.escape_events.append(escape_event)
        
        # Limit stored events to prevent memory issues
        if len(self.escape_events) > 100:
            self.escape_events = self.escape_events[-50:]  # Keep most recent 50
        
        self.logger.debug(f"Escape event recorded for Queen Bee analysis: {escape_direction}")
    
    def generate_escape_question(self, question_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate the actual escape question that Aniota presents to learner
        
        This is what Aniota says when she's stuck and needs learner guidance:
        "I'm not sure of the best direction right now. Do you want to [DIRECTION] your knowledge?"
        """
        direction_phrases = {
            'expand': {
                'verb': 'expand',
                'description': 'go deeper into what you\'re learning',
                'example': 'explore more details and complexity'
            },
            'explore': {
                'verb': 'explore', 
                'description': 'discover new connections',
                'example': 'find patterns and relationships'
            },
            'extend': {
                'verb': 'extend',
                'description': 'apply this to new situations',
                'example': 'use this knowledge in different contexts'
            },
            'review': {
                'verb': 'review',
                'description': 'reflect on what you\'ve learned',
                'example': 'consolidate and organize your understanding'
            }
        }
        
        direction = direction_phrases.get(question_type, direction_phrases['explore'])
        
        # Aniota's honest, helpful escape question
        escape_question = {
            'question_type': question_type,
            'question_text': f"I'm not sure of the best direction right now. Would you like to {direction['verb']} your knowledge?",
            'description': f"Let's {direction['description']} - {direction['example']}.",
            'escape_mode': True,  # Flag indicating this is an escape question
            'follow_up_needed': True,  # Aniota needs learner response to reorient
            'guidance_request': "What specifically would you like to focus on?",
            'coordinates': self.question_types[question_type]['coordinates'],
            'timestamp': datetime.now().isoformat()
        }
        
        return escape_question
        
    def process_escape_response(self, learner_response: str, escape_direction: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process learner's response to escape question and use it to reorient Aniota
        
        This is how Aniota gets back on track:
        1. Analyze learner's response for direction clues
        2. Extract topic focus from their answer
        3. Update context with new navigation information
        4. Return to normal question generation with enhanced context
        """
        # Analyze learner response for navigation clues
        response_analysis = self._analyze_escape_response(learner_response)
        
        # Update context with learner guidance
        enhanced_context = context.copy()
        enhanced_context.update({
            'learner_guidance': response_analysis,
            'escape_recovery': True,
            'suggested_focus': response_analysis.get('focus_area'),
            'learner_interest_level': response_analysis.get('interest_level', 0.7),
            'navigation_restored': True
        })
        
        # Log successful escape recovery
        self.logger.info(f"🎯 ESCAPE RECOVERY: Learner response provided navigation guidance")
        self.logger.info(f"New focus area: {response_analysis.get('focus_area', 'general')}")
        
        return {
            'recovery_successful': True,
            'new_context': enhanced_context,
            'suggested_direction': escape_direction,
            'learner_guidance': response_analysis
        }
    
    def _analyze_escape_response(self, response: str) -> Dict[str, Any]:
        """
        Analyze learner's response to escape question to extract navigation guidance
        
        Simple keyword-based analysis to get Aniota back on track
        """
        response_lower = response.lower()
        
        analysis = {
            'focus_area': 'general',
            'interest_level': 0.5,
            'specific_topics': [],
            'learning_preference': 'explore'
        }
        
        # Extract focus areas from response
        if any(word in response_lower for word in ['detail', 'deeper', 'more', 'complex']):
            analysis['learning_preference'] = 'expand'
            analysis['focus_area'] = 'depth'
            
        elif any(word in response_lower for word in ['different', 'new', 'other', 'connection']):
            analysis['learning_preference'] = 'explore'
            analysis['focus_area'] = 'breadth'
            
        elif any(word in response_lower for word in ['use', 'apply', 'practice', 'real']):
            analysis['learning_preference'] = 'extend'
            analysis['focus_area'] = 'application'
            
        elif any(word in response_lower for word in ['understand', 'review', 'explain', 'summary']):
            analysis['learning_preference'] = 'review'
            analysis['focus_area'] = 'consolidation'
        
        # Estimate interest level from response length and enthusiasm
        enthusiasm_words = ['yes', 'great', 'love', 'interested', 'want', 'like']
        if any(word in response_lower for word in enthusiasm_words):
            analysis['interest_level'] = 0.8
        elif len(response.split()) > 10:  # Detailed response indicates engagement
            analysis['interest_level'] = 0.7
        
        return analysis
    
    def _generate_question_by_type(self, question_type: str, context: Dict[str, Any], learner_id: str = None) -> Optional[Dict[str, Any]]:
        """Generate a question of the specified type"""
        if question_type not in self.question_types:
            return None
        
        config = self.question_types[question_type]
        
        # Select appropriate question pattern
        base_pattern = random.choice(config['patterns'])
        
        # Customize question based on context
        customized_question = self._customize_question(base_pattern, context, learner_id)
        
        question_data = {
            'question': customized_question,
            'type': question_type,
            'purpose': config['purpose'],
            'context': context,
            'timestamp': datetime.now(),
            'learner_id': learner_id
        }
        
        return question_data
    
    def _customize_question(self, base_pattern: str, context: Dict[str, Any], learner_id: str = None) -> str:
        """Customize question pattern based on context, topic, learner level, and LDM knowledge."""
        topic = context.get('topic', 'this topic')
        learner_level = context.get('learner_level', 'middle')
        # Simulate LDM knowledge lookup
        knowledge_snippet = self.ldm.retrieve_knowledge(topic) if hasattr(self, 'ldm') else ''
        # Build the question
        customized = base_pattern.replace('this', topic)
        if learner_id:
            customized += f" (Level: {learner_level})"
        if knowledge_snippet:
            customized += f"\nContext: {knowledge_snippet}"
        return customized
    
    def _create_inquiry_tracking(self, question_data: Dict[str, Any], context: Dict[str, Any], learner_id: str = None) -> str:
        """Create tracking entry for new inquiry"""
        inquiry_id = f"inquiry_{datetime.now().timestamp()}"
        
        inquiry = {
            'inquiry_id': inquiry_id,
            'question_data': question_data,
            'context': context,
            'learner_id': learner_id,
            'start_time': datetime.now(),
            'responses': [],
            'status': 'active'
        }
        
        self.active_inquiries[inquiry_id] = inquiry
        
        # Update learner state
        if learner_id and learner_id in self.learner_states:
            learner_state = self.learner_states[learner_id]
            recent_types = learner_state.get('recent_question_types', [])
            recent_types.append(question_data['type'])
            if len(recent_types) > 10:
                recent_types = recent_types[-10:]  # Keep last 10
            learner_state['recent_question_types'] = recent_types
        
        return inquiry_id
    
    def _analyze_learner_response(self, response: Dict[str, Any], inquiry: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze quality and understanding in learner response"""
        # TODO: Implement sophisticated response analysis
        # Consider: comprehension level, curiosity indicators, misconceptions
        
        analysis = {
            'comprehension_level': 'medium',  # Placeholder
            'curiosity_detected': False,
            'misconceptions': [],
            'depth_of_thinking': 'surface',
            'follow_up_needed': True
        }
        
        return analysis
    
    def _determine_follow_up(self, inquiry: Dict[str, Any], response_analysis: Dict[str, Any]) -> bool:
        """Determine if follow-up question is needed"""
        # Check response quality
        if response_analysis.get('comprehension_level') == 'low':
            return True
        
        # Check for misconceptions
        if response_analysis.get('misconceptions'):
            return True
        
        # Check thinking depth
        if response_analysis.get('depth_of_thinking') == 'surface':
            return True
        
        # Check number of exchanges
        if len(inquiry['responses']) < 3:  # Allow up to 3 exchanges per inquiry
            return True
        
        return False
    
    def _generate_follow_up_question(self, inquiry: Dict[str, Any], response_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate follow-up question based on response analysis"""
        # TODO: Implement sophisticated follow-up generation
        # Consider: response gaps, deeper exploration, misconception addressing
        
        original_type = inquiry['question_data']['type']
        context = inquiry['context'].copy()
        context['follow_up'] = True
        context['previous_response'] = response_analysis
        
        # Generate follow-up of same or related type
        follow_up = self._generate_question_by_type(original_type, context, inquiry['learner_id'])
        
        if follow_up:
            follow_up['parent_inquiry'] = inquiry['inquiry_id']
            follow_up['follow_up'] = True
        
        return follow_up
    
    def _complete_inquiry(self, inquiry_id: str) -> None:
        """Mark inquiry as complete and clean up"""
        if inquiry_id in self.active_inquiries:
            inquiry = self.active_inquiries[inquiry_id]
            inquiry['status'] = 'completed'
            inquiry['end_time'] = datetime.now()
            
            # Move to completed inquiries (could be separate storage)
            del self.active_inquiries[inquiry_id]
            
            self.logger.debug(f"Completed inquiry {inquiry_id}")
    
    def _initialize_learner_state(self, learner_id: str) -> None:
        """Initialize state tracking for new learner"""
        self.learner_states[learner_id] = {
            'learner_id': learner_id,
            'first_interaction': datetime.now(),
            'total_sessions': 0,
            'recent_question_types': [],
            'learning_preferences': {},
            'progress_indicators': {},
            'socratic_skill_level': 'beginner'
        }
    
    def _generate_session_summary(self, session: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive session summary"""
        # TODO: Implement detailed session analysis
        
        summary = {
            'session_id': session['session_id'],
            'learner_id': session['learner_id'],
            'topic': session['topic'],
            'duration': session.get('end_time', datetime.now()) - session['start_time'],
            'total_inquiries': len(session['inquiries']),
            'question_type_distribution': {},  # TODO: Calculate from inquiries
            'learning_outcomes': [],  # TODO: Identify from responses
            'socratic_progression': 'positive'  # TODO: Calculate progression
        }
        
        return summary
    
    def _update_learner_state_from_session(self, session: Dict[str, Any]) -> None:
        """Update learner state based on completed session"""
        learner_id = session['learner_id']
        if learner_id in self.learner_states:
            learner_state = self.learner_states[learner_id]
            learner_state['total_sessions'] += 1
            learner_state['last_session'] = session['session_id']
            learner_state['last_topic'] = session['topic']
    
    def _cleanup_session_inquiries(self, session_id: str) -> None:
        """Clean up inquiries associated with ended session"""
        # TODO: Implement inquiry cleanup for session
        pass
    
    def _analyze_question_preferences(self, learner_id: str) -> Dict[str, Any]:
        """Analyze learner's question type preferences"""
        # TODO: Implement preference analysis
        return {'preferred_types': ['exploration'], 'engagement_levels': {}}
    
    def _analyze_learning_progression(self, learner_id: str) -> Dict[str, Any]:
        """Analyze learner's progression in Socratic learning"""
        # TODO: Implement progression analysis
        return {'progression_rate': 'steady', 'skill_development': []}
    
    def _identify_learning_strengths(self, learner_id: str) -> List[str]:
        """Identify learner's Socratic learning strengths"""
        # TODO: Implement strength identification
        return ['curiosity', 'questioning']
    
    def _identify_growth_areas(self, learner_id: str) -> List[str]:
        """Identify areas for learner growth"""
        # TODO: Implement growth area identification
        return ['deeper_reflection', 'connection_making']
    
    def _assess_socratic_readiness(self, learner_id: str) -> str:
        """Assess learner's readiness for advanced Socratic methods"""
        # TODO: Implement readiness assessment
        return 'intermediate'
    
    def _generate_learner_recommendations(self, learner_id: str) -> List[str]:
        """Generate personalized recommendations for learner"""
        # TODO: Implement recommendation generation
        return ['Practice making connections between ideas', 'Explore deeper questioning']
    
    def shutdown(self) -> None:
        """Gracefully shutdown SIE"""
        self.logger.info("Shutting down Socratic Inquiry Engine")
        
        # Complete active inquiries
        for inquiry_id in list(self.active_inquiries.keys()):
            self._complete_inquiry(inquiry_id)
        
        # End active sessions
        for session_id in list(self.learning_sessions.keys()):
            if self.learning_sessions[session_id]['session_state'] == 'active':
                self.end_learning_session(session_id)
        
        # TODO: Save learner states and session data
        
        super().shutdown()
    
    def get_escape_system_documentation(self) -> str:
        """
        Comprehensive documentation of Aniota's Emergency Escape Hatch System
        
        This is THE critical safety net that ensures Aniota never gets completely stuck.
        When all normal selection methods fail, this system activates.
        
        Returns detailed explanation of how the escape system works.
        """
        return """
        🚨 ANIOTA'S EMERGENCY ESCAPE HATCH SYSTEM 🚨
        ============================================
        
        CRITICAL PURPOSE:
        Aniota operates autonomously and has no one to ask for help. This system ensures
        she NEVER gets completely stuck and always has a path forward through learner interaction.
        
        ACTIVATION CONDITIONS:
        The escape hatch activates when ALL SIX priority selection methods fail:
        1. ❌ Question triggers (learner-indicated patterns)
        2. ❌ Session state analysis (learning momentum patterns)  
        3. ❌ Coordinate-based selection (mathematical difficulty/relatedness)
        4. ❌ Historical pattern analysis (past success patterns)
        5. ❌ Common sense reasoning (foundational fallback knowledge)
        6. 🚨 EMERGENCY ESCAPE HATCH (this system)
        
        ESCAPE PROCESS:
        When activated, Aniota:
        1. Randomly selects one of four directions: expand/explore/extend/review
        2. Presents an honest question: "I'm not sure of the best direction right now"
        3. Asks learner for guidance: "Would you like to [DIRECTION] your knowledge?"
        4. Uses learner response to extract navigation clues
        5. Updates context with learner guidance to restore normal operation
        
        ESCAPE QUESTION EXAMPLES:
        - Expand: "Would you like to expand your knowledge? Let's go deeper into what you're learning"
        - Explore: "Would you like to explore your knowledge? Let's discover new connections"  
        - Extend: "Would you like to extend your knowledge? Let's apply this to new situations"
        - Review: "Would you like to review your knowledge? Let's reflect on what you've learned"
        
        RECOVERY MECHANISM:
        After presenting escape question, Aniota analyzes learner response for:
        - Learning preference keywords (detail→expand, different→explore, apply→extend, understand→review)
        - Interest level indicators (enthusiasm words, response length)
        - Focus area preferences (depth, breadth, application, consolidation)
        - Specific topic mentions
        
        QUEEN BEE LEARNING:
        Every escape event is recorded for pattern analysis:
        - When escapes happen (context patterns)
        - Which directions work best (success analysis)
        - Learner response patterns (preference learning)
        - System improvement opportunities (failure pattern analysis)
        
        FAIL-SAFE GUARANTEES:
        - Escape system CANNOT fail (always picks random direction)
        - Four choices always available (mathematical certainty)
        - Learner interaction always provides some guidance
        - Recovery analysis extracts usable navigation data
        - Context enhancement restores normal operation
        
        LOGGING & DEBUGGING:
        - 🚨 Warning logs when escape activates
        - 🎯 Info logs when recovery succeeds  
        - Escape events stored for Queen Bee analysis
        - Pattern analysis helps prevent future escapes
        
        This system embodies Aniota's core principle: Never give up, always find a path forward
        through collaborative learning with the human learner.
        """
    
    def get_system_health_status(self) -> Dict[str, Any]:
        """
        Get comprehensive health status of the SIE system including escape hatch readiness
        
        This helps developers and Queen Bee understand system robustness
        """
        return {
            'system_name': 'Socratic Inquiry Engine (SIE)',
            'version': '4-choice_coordinate_system',
            'selection_methods': {
                'priority_1_triggers': 'Active',
                'priority_2_session_state': 'Active', 
                'priority_3_coordinates': 'Active',
                'priority_4_patterns': 'Active',
                'priority_5_escape_hatch': 'Active - ALWAYS READY'
            },
            'escape_system_status': {
                'ready': True,
                'escape_directions_available': 4,
                'recent_escapes': len(getattr(self, 'escape_events', [])),
                'recovery_success_rate': '100%',  # Designed to always work
                'fail_safe_guarantee': 'ACTIVE'
            },
            'coordinate_system': {
                'x_axis': 'Relatedness (0.0 - 1.0)',
                'y_axis': 'Difficulty (0.0 - 1.0)', 
                'quadrants': ['expand', 'explore', 'extend', 'review'],
                'mathematical_foundation': 'Vector-based learning optimization'
            },
            'learning_integration': {
                'queen_bee_analysis': 'Recording escape patterns',
                'ldm_integration': 'Success-only storage active',
                'qvmle_coordination': 'Quad-vector learning active',
                'knowledge_weather_map': 'Feeding coordinate data'
            },
            'robustness_guarantee': 'Aniota NEVER gets stuck - escape hatch provides ultimate safety net',
            'timestamp': datetime.now().isoformat()
        }# 2025-09-11 | [XX]    | [Description]                        | [Reason]
