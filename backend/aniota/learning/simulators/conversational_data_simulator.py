


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("conversational_data_simulator.py", "system_initialization", "import", "Auto-generated dev log entry")

🎭 CONVERSATIONAL LEARNING DATA SIMULATOR 🎭

PURPOSE: Generate realistic learning conversation data without requiring live LLM
- Creates JSON-based conversation structures for testing
- Simulates user choice patterns and learning paths
- Generates data that mimics real Aniota-user interactions
- Produces learning modules from conversation recordings

APPROACH:
1. Domain knowledge stored in structured JSON
2. Conversation templates with realistic response patterns
3. User choice simulation based on learning psychology
4. One-sided recording format (choices only, no conversation text)
5. Queen Bee compatible data structures

This simulates what Queen Bee will receive from real user sessions:
- User choices at each decision point
- Learning path progression
- Performance indicators
- Metadata patterns
"""

import json
import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple
from pathlib import Path

class ConversationalDataSimulator:
    """
    🎭 Simulates realistic learning conversation data for testing SIE system
    
    Creates JSON conversation structures that mimic real user interactions
    without requiring live LLM responses.
    """
    
    def __init__(self, domain_name: str = "python_development"):
        self.domain_name = domain_name
        self.conversation_templates = {}
        self.user_personas = {}
        self.learning_paths = {}
        
        # Load or create domain data
        self.domain_data = self._initialize_domain_data()
        self.conversation_patterns = self._initialize_conversation_patterns()
        
        print(f"🎭 Conversational Data Simulator initialized for domain: {domain_name}")
    
    def _initialize_domain_data(self) -> Dict[str, Any]:
        """
        🏗️ Create comprehensive domain knowledge structure
        
        This represents the structured knowledge that an AI would use
        to generate questions and responses.
        """
        return {
            "domain_info": {
                "name": "python_development",
                "description": "Python development strategies and best practices",
                "difficulty_range": [0.1, 0.9],
                "topic_count": 12,
                "learning_objectives": [
                    "Master testing strategies",
                    "Understand code organization",
                    "Optimize performance",
                    "Deploy applications effectively"
                ]
            },
            
            "topics": {
                "unit_testing": {
                    "difficulty": 0.4,
                    "relatedness_map": {
                        "integration_testing": 0.8,
                        "tdd": 0.9,
                        "pytest_basics": 0.7,
                        "mocking": 0.6,
                        "code_organization": 0.4
                    },
                    "concepts": ["test_functions", "assertions", "fixtures", "parametrization"],
                    "question_seeds": [
                        "What makes a good unit test?",
                        "How do you test functions with dependencies?", 
                        "When should you mock vs use real objects?"
                    ],
                    "common_responses": [
                        "Tests should be fast and isolated",
                        "I'm not sure about mocking",
                        "We don't really write tests at my company"
                    ]
                },
                
                "test_driven_development": {
                    "difficulty": 0.6,
                    "relatedness_map": {
                        "unit_testing": 0.9,
                        "refactoring": 0.7,
                        "design_patterns": 0.5,
                        "code_quality": 0.6
                    },
                    "concepts": ["red_green_refactor", "failing_tests", "incremental_development"],
                    "question_seeds": [
                        "How does TDD change your development process?",
                        "What's the hardest part about writing tests first?",
                        "How do you handle TDD with legacy code?"
                    ],
                    "common_responses": [
                        "It feels backwards at first",
                        "Tests help me think about design",
                        "Hard to know what to test before coding"
                    ]
                },
                
                "performance_optimization": {
                    "difficulty": 0.8,
                    "relatedness_map": {
                        "profiling": 0.9,
                        "algorithms": 0.7,
                        "memory_management": 0.8,
                        "concurrency": 0.6
                    },
                    "concepts": ["profiling", "bottlenecks", "big_o", "caching", "vectorization"],
                    "question_seeds": [
                        "How do you identify performance bottlenecks?",
                        "When is optimization premature?",
                        "What's your approach to scaling Python applications?"
                    ],
                    "common_responses": [
                        "I usually just guess where the slow parts are",
                        "Profiling tools are confusing",
                        "NumPy makes everything faster"
                    ]
                },
                
                "code_organization": {
                    "difficulty": 0.3,
                    "relatedness_map": {
                        "modules": 0.9,
                        "packages": 0.8,
                        "design_patterns": 0.6,
                        "project_structure": 0.7
                    },
                    "concepts": ["modules", "packages", "imports", "namespace", "structure"],
                    "question_seeds": [
                        "How do you organize a Python project?",
                        "When do you create a new module vs adding to existing?",
                        "How do you handle circular imports?"
                    ],
                    "common_responses": [
                        "I put everything in one file usually",
                        "Packages are confusing",
                        "I follow what I see in other projects"
                    ]
                }
            },
            
            "learning_progressions": {
                "beginner_path": [
                    "code_organization", "unit_testing", "basic_debugging", "documentation"
                ],
                "intermediate_path": [
                    "test_driven_development", "design_patterns", "error_handling", "packaging"
                ],
                "advanced_path": [
                    "performance_optimization", "concurrency", "architecture", "deployment"
                ]
            }
        }
    
    def _initialize_conversation_patterns(self) -> Dict[str, Any]:
        """
        🗣️ Create realistic conversation response patterns
        
        These simulate how real users respond to different types of questions
        """
        return {
            "response_patterns": {
                "confident_learner": {
                    "avg_response_length": 25,
                    "question_probability": 0.3,
                    "uncertainty_words": 0.1,
                    "enthusiasm_words": 0.4,
                    "technical_depth": 0.7
                },
                "uncertain_learner": {
                    "avg_response_length": 15,
                    "question_probability": 0.6,
                    "uncertainty_words": 0.4,
                    "enthusiasm_words": 0.1,
                    "technical_depth": 0.3
                },
                "experienced_learner": {
                    "avg_response_length": 35,
                    "question_probability": 0.2,
                    "uncertainty_words": 0.05,
                    "enthusiasm_words": 0.2,
                    "technical_depth": 0.9
                },
                "beginner_learner": {
                    "avg_response_length": 8,
                    "question_probability": 0.7,
                    "uncertainty_words": 0.5,
                    "enthusiasm_words": 0.3,
                    "technical_depth": 0.2
                }
            },
            
            "choice_patterns": {
                "explorer": {"expand": 0.15, "explore": 0.45, "extend": 0.25, "review": 0.15},
                "depth_seeker": {"expand": 0.4, "explore": 0.2, "extend": 0.3, "review": 0.1},
                "practical_learner": {"expand": 0.2, "explore": 0.2, "extend": 0.5, "review": 0.1},
                "consolidator": {"expand": 0.1, "explore": 0.2, "extend": 0.2, "review": 0.5}
            }
        }
    
    def generate_learning_session(self, session_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        🎬 Generate a complete simulated learning session
        
        This creates realistic user choice data that mimics what Queen Bee
        will receive from real Aniota sessions.
        """
        session_id = str(uuid.uuid4())
        learner_type = session_config.get('learner_type', 'uncertain_learner')
        choice_pattern = session_config.get('choice_pattern', 'explorer')
        session_length = session_config.get('interactions', 8)
        
        session_data = {
            "session_id": session_id,
            "timestamp": datetime.now().isoformat(),
            "domain": self.domain_name,
            "learner_profile": {
                "type": learner_type,
                "choice_pattern": choice_pattern,
                "initial_level": session_config.get('initial_level', 0.5)
            },
            "interactions": [],
            "learning_path": [],
            "performance_data": [],
            "choice_analytics": {
                "expand_count": 0,
                "explore_count": 0, 
                "extend_count": 0,
                "review_count": 0,
                "escape_events": 0
            }
        }
        
        # Simulate the learning session
        current_context = self._initialize_session_context(session_config)
        
        for interaction_num in range(session_length):
            interaction = self._generate_interaction(
                interaction_num, 
                current_context, 
                learner_type, 
                choice_pattern
            )
            
            session_data["interactions"].append(interaction)
            session_data["learning_path"].append(interaction["selected_topic"])
            session_data["choice_analytics"][f"{interaction['question_type']}_count"] += 1
            
            # Update context for next interaction
            current_context = self._update_context_from_interaction(current_context, interaction)
        
        # Generate session analytics
        session_data["session_analytics"] = self._analyze_session(session_data)
        
        print(f"🎬 Generated learning session: {session_length} interactions, {learner_type} pattern")
        
        return session_data
    
    def _generate_interaction(self, interaction_num: int, context: Dict[str, Any], 
                            learner_type: str, choice_pattern: str) -> Dict[str, Any]:
        """
        🎯 Generate a single learning interaction
        
        This simulates one question-response cycle including:
        - Coordinate calculation
        - Question type selection  
        - User choice simulation
        - Response pattern simulation
        """
        
        # Calculate coordinates based on current context
        coordinates = self._calculate_coordinates(context)
        
        # Select question type (simulate SIE decision)
        question_type = self._select_question_type_from_coordinates(coordinates, context)
        
        # Check if escape hatch should trigger (rare event)
        if random.random() < 0.05:  # 5% chance of system getting stuck
            question_type = self._simulate_escape_hatch(context)
            escape_event = True
        else:
            escape_event = False
        
        # Select topic based on question type and context
        selected_topic = self._select_topic_for_question(question_type, context)
        
        # Simulate user response (choice-based, not conversational)
        user_choice_data = self._simulate_user_choice(
            question_type, selected_topic, learner_type, choice_pattern
        )
        
        # Generate interaction metadata
        interaction = {
            "interaction_id": f"int_{interaction_num:03d}",
            "timestamp": (datetime.now() + timedelta(minutes=interaction_num*3)).isoformat(),
            "coordinates": coordinates,
            "question_type": question_type,
            "selected_topic": selected_topic,
            "escape_event": escape_event,
            "user_choice_data": user_choice_data,
            "context_snapshot": context.copy(),
            "metadata": {
                "selection_method": "escape_hatch" if escape_event else "coordinates",
                "relatedness_score": coordinates[0],
                "difficulty_score": coordinates[1],
                "learner_performance": context.get('performance', 0.5)
            }
        }
        
        return interaction
    
    def _calculate_coordinates(self, context: Dict[str, Any]) -> Tuple[float, float]:
        """Calculate difficulty/relatedness coordinates from context"""
        learner_level = context.get('learner_level', 0.5)
        current_performance = context.get('performance', 0.5)
        learning_history = context.get('learning_history', [])
        
        # Adaptive difficulty calculation
        if current_performance > 0.8:
            difficulty = min(learner_level + 0.2, 1.0)
        elif current_performance < 0.4:
            difficulty = max(learner_level - 0.2, 0.0)
        else:
            difficulty = learner_level
        
        # Relatedness calculation
        if len(learning_history) > 0:
            recent_topic = learning_history[-1]
            current_topic = context.get('current_topic', 'unit_testing')
            
            topic_data = self.domain_data['topics'].get(current_topic, {})
            relatedness_map = topic_data.get('relatedness_map', {})
            relatedness = relatedness_map.get(recent_topic, 0.5)
        else:
            relatedness = 0.5
        
        return (relatedness, difficulty)
    
    def _select_question_type_from_coordinates(self, coordinates: Tuple[float, float], 
                                             context: Dict[str, Any]) -> str:
        """Map coordinates to question type using quadrant system"""
        relatedness, difficulty = coordinates
        
        if difficulty >= 0.5 and relatedness < 0.5:
            return 'expand'  # Hard + Unrelated
        elif difficulty >= 0.5 and relatedness >= 0.5:
            return 'extend'  # Hard + Related
        elif difficulty < 0.5 and relatedness >= 0.5:
            return 'explore'  # Easy + Related
        else:
            return 'review'  # Easy + Unrelated
    
    def _simulate_escape_hatch(self, context: Dict[str, Any]) -> str:
        """Simulate emergency escape hatch activation"""
        escape_choices = ['expand', 'explore', 'extend', 'review']
        return random.choice(escape_choices)
    
    def _select_topic_for_question(self, question_type: str, context: Dict[str, Any]) -> str:
        """Select appropriate topic based on question type and learning path"""
        current_level = context.get('learner_level', 0.5)
        learning_history = context.get('learning_history', [])
        
        # Filter topics by difficulty level and question type
        suitable_topics = []
        
        for topic_name, topic_data in self.domain_data['topics'].items():
            topic_difficulty = topic_data['difficulty']
            
            # Skip recently covered topics (unless reviewing)
            if question_type != 'review' and topic_name in learning_history[-2:]:
                continue
            
            # Match difficulty to question type intent
            if question_type == 'expand' and topic_difficulty > current_level + 0.1:
                suitable_topics.append(topic_name)
            elif question_type == 'extend' and abs(topic_difficulty - current_level) < 0.2:
                suitable_topics.append(topic_name)
            elif question_type == 'explore' and topic_difficulty < current_level + 0.1:
                suitable_topics.append(topic_name)
            elif question_type == 'review':
                suitable_topics.append(topic_name)
        
        return random.choice(suitable_topics) if suitable_topics else 'unit_testing'
    
    def _simulate_user_choice(self, question_type: str, topic: str, 
                            learner_type: str, choice_pattern: str) -> Dict[str, Any]:
        """
        🎭 Simulate user choice data (NOT conversational text)
        
        This represents what Queen Bee actually receives from real sessions:
        - User choices and selections
        - Performance indicators  
        - Timing data
        - Engagement metrics
        """
        
        # Get learner and choice patterns
        learner_pattern = self.conversation_patterns['response_patterns'][learner_type]
        choice_weights = self.conversation_patterns['choice_patterns'][choice_pattern]
        
        # Simulate response timing
        base_time = 10  # seconds
        time_variance = random.uniform(0.5, 2.0)
        response_time = base_time * time_variance
        
        # Simulate engagement level
        engagement_score = random.uniform(0.3, 1.0)
        if learner_type == 'experienced_learner':
            engagement_score = random.uniform(0.6, 1.0)
        elif learner_type == 'beginner_learner':
            engagement_score = random.uniform(0.3, 0.8)
        
        # Simulate choice preference
        # User might prefer different direction than what was suggested
        choice_override_chance = 0.2  # 20% chance user wants different direction
        if random.random() < choice_override_chance:
            preferred_choice = random.choices(
                list(choice_weights.keys()),
                weights=list(choice_weights.values())
            )[0]
        else:
            preferred_choice = question_type
        
        # Simulate understanding level
        understanding_indicators = {
            'confidence_level': random.uniform(0.2, 0.9),
            'asks_questions': random.random() < learner_pattern['question_probability'],
            'shows_uncertainty': random.random() < learner_pattern['uncertainty_words'],
            'demonstrates_knowledge': random.random() < learner_pattern['technical_depth']
        }
        
        return {
            "response_time_seconds": round(response_time, 1),
            "engagement_score": round(engagement_score, 2),
            "preferred_direction": preferred_choice,
            "direction_override": preferred_choice != question_type,
            "understanding_indicators": understanding_indicators,
            "choice_metadata": {
                "learner_type": learner_type,
                "choice_pattern": choice_pattern,
                "topic_familiarity": random.uniform(0.1, 0.8)
            }
        }
    
    def _initialize_session_context(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Initialize starting context for session"""
        return {
            "learner_level": config.get('initial_level', 0.5),
            "performance": 0.5,
            "current_topic": "unit_testing",  # Default starting topic
            "learning_history": [],
            "session_start": datetime.now().isoformat()
        }
    
    def _update_context_from_interaction(self, context: Dict[str, Any], 
                                       interaction: Dict[str, Any]) -> Dict[str, Any]:
        """Update context based on interaction results"""
        new_context = context.copy()
        
        # Update performance based on understanding indicators
        understanding = interaction['user_choice_data']['understanding_indicators']
        confidence = understanding['confidence_level']
        
        current_performance = new_context.get('performance', 0.5)
        new_performance = (current_performance * 0.7) + (confidence * 0.3)
        new_context['performance'] = new_performance
        
        # Add topic to learning history
        history = new_context.get('learning_history', [])
        history.append(interaction['selected_topic'])
        new_context['learning_history'] = history[-5:]  # Keep last 5
        
        # Update current topic
        new_context['current_topic'] = interaction['selected_topic']
        
        return new_context
    
    def _analyze_session(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate analytics for the completed session"""
        interactions = session_data['interactions']
        
        # Calculate session metrics
        total_time = sum(i['user_choice_data']['response_time_seconds'] for i in interactions)
        avg_engagement = sum(i['user_choice_data']['engagement_score'] for i in interactions) / len(interactions)
        
        # Direction preferences
        direction_changes = sum(1 for i in interactions if i['user_choice_data']['direction_override'])
        
        # Learning progression
        start_performance = interactions[0]['context_snapshot']['performance']
        end_performance = interactions[-1]['context_snapshot']['performance']
        performance_change = end_performance - start_performance
        
        return {
            "session_duration_minutes": round(total_time / 60, 1),
            "average_engagement": round(avg_engagement, 2),
            "direction_override_rate": round(direction_changes / len(interactions), 2),
            "performance_improvement": round(performance_change, 2),
            "topics_covered": len(set(i['selected_topic'] for i in interactions)),
            "quadrant_distribution": {
                qtype: sum(1 for i in interactions if i['question_type'] == qtype)
                for qtype in ['expand', 'explore', 'extend', 'review']
            }
        }
    
    def save_session_data(self, session_data: Dict[str, Any], filename: str = None):
        """Save session data to JSON file for analysis"""
        if filename is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"learning_session_{timestamp}.json"
        
        filepath = Path(filename)
        
        with open(filepath, 'w') as f:
            json.dump(session_data, f, indent=2)
        
        print(f"💾 Session data saved to: {filepath}")
        return filepath
    
    def generate_multiple_sessions(self, count: int, session_configs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate multiple learning sessions for comprehensive testing"""
        sessions = []
        
        for i in range(count):
            config = session_configs[i % len(session_configs)]  # Cycle through configs
            config['session_number'] = i + 1
            
            session = self.generate_learning_session(config)
            sessions.append(session)
            
            print(f"📊 Generated session {i+1}/{count}")
        
        return sessions
    
    def export_for_queen_bee_analysis(self, sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        👑 Export session data in format suitable for Queen Bee analysis
        
        This represents what Queen Bee would receive from real user interactions
        """
        export_data = {
            "export_timestamp": datetime.now().isoformat(),
            "domain": self.domain_name,
            "total_sessions": len(sessions),
            "data_format": "choice_based_learning_paths",
            "sessions": []
        }
        
        for session in sessions:
            # Extract only choice-based data (no conversational content)
            queen_bee_session = {
                "session_id": session["session_id"],
                "learner_profile": session["learner_profile"],
                "choice_sequence": [
                    {
                        "interaction_id": i["interaction_id"],
                        "coordinates": i["coordinates"],
                        "question_type_suggested": i["question_type"],
                        "user_preferred_direction": i["user_choice_data"]["preferred_direction"],
                        "direction_override": i["user_choice_data"]["direction_override"],
                        "topic": i["selected_topic"],
                        "engagement_score": i["user_choice_data"]["engagement_score"],
                        "understanding_indicators": i["user_choice_data"]["understanding_indicators"],
                        "response_time": i["user_choice_data"]["response_time_seconds"]
                    }
                    for i in session["interactions"]
                ],
                "session_analytics": session["session_analytics"],
                "learning_path": session["learning_path"]
            }
            
            export_data["sessions"].append(queen_bee_session)
        
        # Generate aggregate analytics
        export_data["aggregate_analytics"] = self._generate_aggregate_analytics(sessions)
        
        return export_data
    
    def _generate_aggregate_analytics(self, sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate analytics across multiple sessions"""
        total_interactions = sum(len(s["interactions"]) for s in sessions)
        
        # Choice pattern analysis
        all_overrides = []
        all_engagements = []
        
        for session in sessions:
            for interaction in session["interactions"]:
                all_overrides.append(interaction["user_choice_data"]["direction_override"])
                all_engagements.append(interaction["user_choice_data"]["engagement_score"])
        
        return {
            "total_interactions": total_interactions,
            "average_session_length": total_interactions / len(sessions),
            "direction_override_rate": sum(all_overrides) / len(all_overrides),
            "average_engagement": sum(all_engagements) / len(all_engagements),
            "learner_type_distribution": {
                ltype: sum(1 for s in sessions if s["learner_profile"]["type"] == ltype)
                for ltype in ["confident_learner", "uncertain_learner", "experienced_learner", "beginner_learner"]
            }
        }

def create_test_scenarios():
    """Create different testing scenarios for comprehensive evaluation"""
    return [
        {
            "name": "confident_explorer",
            "learner_type": "confident_learner",
            "choice_pattern": "explorer",
            "initial_level": 0.6,
            "interactions": 10
        },
        {
            "name": "uncertain_depth_seeker", 
            "learner_type": "uncertain_learner",
            "choice_pattern": "depth_seeker",
            "initial_level": 0.3,
            "interactions": 8
        },
        {
            "name": "experienced_practical",
            "learner_type": "experienced_learner", 
            "choice_pattern": "practical_learner",
            "initial_level": 0.8,
            "interactions": 12
        },
        {
            "name": "beginner_consolidator",
            "learner_type": "beginner_learner",
            "choice_pattern": "consolidator", 
            "initial_level": 0.2,
            "interactions": 6
        }
    ]

if __name__ == "__main__":
    print("🎭 Creating Conversational Learning Data Simulator...")
    
    simulator = ConversationalDataSimulator("python_development")
    test_scenarios = create_test_scenarios()
    
    print(f"🎬 Generating {len(test_scenarios)} different learning sessions...")
    sessions = simulator.generate_multiple_sessions(len(test_scenarios), test_scenarios)
    
    print(f"👑 Exporting data for Queen Bee analysis...")
    queen_bee_data = simulator.export_for_queen_bee_analysis(sessions)
    
    # Save the data
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    data_file = f"queen_bee_learning_data_{timestamp}.json"
    
    with open(data_file, 'w') as f:
        json.dump(queen_bee_data, f, indent=2)
    
    print(f"💾 Queen Bee data saved to: {data_file}")
    print(f"📊 Generated {queen_bee_data['total_sessions']} sessions with {queen_bee_data['aggregate_analytics']['total_interactions']} total interactions")
    print(f"🎯 Ready for SIE system testing and Queen Bee analysis!")


log_file_dependency("conversational_data_simulator.py", "random", "import")
log_file_dependency("conversational_data_simulator.py", "uuid", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
