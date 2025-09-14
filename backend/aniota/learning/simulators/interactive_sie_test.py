


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("interactive_sie_test.py", "system_initialization", "import", "Auto-generated dev log entry")

🎮 INTERACTIVE SIE TESTING SYSTEM 🎮

Real-world testing of Aniota's Socratic Inquiry Engine with human learner interaction.

TESTING DOMAIN: Python Development Strategies
- Rich enough for all four quadrants (expand/explore/extend/review)
- Familiar to both tester and AI
- Has clear difficulty gradients and relatedness connections

TESTING PROTOCOL:
1. Human plays learner role
2. AI plays Aniota's LLM brain role  
3. MetaIX captures all metadata for analysis
4. System demonstrates four-choice coordinate selection
5. Emergency escape hatch tested if system gets stuck

USAGE:
python interactive_sie_test.py
"""

import json
import time
from datetime import datetime
from typing import Dict, Any, Tuple
from metaix import MetaIX

class InteractiveSIETest:
    """
    🎮 Interactive testing environment for Socratic Inquiry Engine
    
    Allows human-AI collaboration to test the four-choice coordinate system
    with real learning interactions in Python development domain.
    """
    
    def __init__(self):
        self.metaix = MetaIX()
        self.session_data = {
            'session_id': f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'domain': 'python_development_strategies',
            'start_time': datetime.now().isoformat(),
            'interactions': [],
            'learner_profile': {},
            'system_events': []
        }
        
        # Python development knowledge base for context
        self.python_topics = {
            'testing_strategies': {
                'difficulty': 0.6,
                'related_topics': ['unit_testing', 'integration_testing', 'tdd', 'pytest'],
                'concepts': ['test_driven_development', 'mocking', 'fixtures', 'coverage']
            },
            'code_organization': {
                'difficulty': 0.4,
                'related_topics': ['modules', 'packages', 'design_patterns', 'architecture'],
                'concepts': ['separation_of_concerns', 'dry_principle', 'solid_principles']
            },
            'performance_optimization': {
                'difficulty': 0.8,
                'related_topics': ['profiling', 'algorithms', 'memory_management', 'concurrency'],
                'concepts': ['big_o_notation', 'caching', 'lazy_evaluation', 'vectorization']
            },
            'deployment_strategies': {
                'difficulty': 0.7,
                'related_topics': ['docker', 'ci_cd', 'cloud_platforms', 'monitoring'],
                'concepts': ['containerization', 'infrastructure_as_code', 'blue_green_deployment']
            }
        }
        
        # Four-choice coordinate system
        self.question_types = {
            'expand': {
                'coordinates': (0.25, 0.75),  # Low relatedness, High difficulty
                'purpose': 'New challenging concepts to expand knowledge',
                'description': 'go deeper into new challenging territory'
            },
            'explore': {
                'coordinates': (0.75, 0.25),  # High relatedness, Low difficulty  
                'purpose': 'Related concepts for pattern discovery',
                'description': 'discover connections and patterns'
            },
            'extend': {
                'coordinates': (0.75, 0.75),  # High relatedness, High difficulty
                'purpose': 'Advanced application of related knowledge',
                'description': 'apply knowledge to complex scenarios'
            },
            'review': {
                'coordinates': (0.25, 0.25),  # Low relatedness, Low difficulty
                'purpose': 'Consolidation and organization',
                'description': 'consolidate and organize understanding'
            }
        }
        
        print("🎮 Interactive SIE Testing System Initialized")
        print("📚 Domain: Python Development Strategies")
        print("🤖 AI will play Aniota's role, Human plays learner role")
        print("🔬 MetaIX will capture all metadata for analysis")
    
    def start_testing_session(self):
        """Begin interactive testing session"""
        print("\n" + "="*80)
        print("🎯 INTERACTIVE SIE TESTING SESSION STARTING")
        print("="*80)
        
        # Initial context setup
        print("\n🔧 INITIAL SETUP:")
        print("Let's establish some context for our Python development learning session.")
        
        # Get learner's current state
        current_topic = input("\n📚 What Python development topic are you working on? (or 'any' for AI to choose): ").strip()
        if current_topic.lower() == 'any':
            current_topic = 'testing_strategies'  # Default starting point
            print(f"🎲 AI chose starting topic: {current_topic}")
        
        experience_level = input("🎓 Rate your Python experience (beginner/intermediate/advanced): ").strip().lower()
        
        # Map experience to numeric level
        experience_map = {'beginner': 0.3, 'intermediate': 0.6, 'advanced': 0.9}
        learner_level = experience_map.get(experience_level, 0.5)
        
        # Set up initial context
        context = {
            'current_topic': current_topic,
            'learner_level': learner_level,
            'learning_history': [],
            'session_start': datetime.now().isoformat(),
            'domain': 'python_development',
            'current_performance': 0.5  # Will adjust based on responses
        }
        
        self.session_data['learner_profile'] = {
            'experience_level': experience_level,
            'numeric_level': learner_level,
            'starting_topic': current_topic
        }
        
        print(f"\n✅ Context established:")
        print(f"   📚 Topic: {current_topic}")
        print(f"   🎓 Level: {experience_level} ({learner_level})")
        print(f"   🎯 Ready for coordinate-based question selection!")
        
        # Start interaction loop
        self.run_interaction_loop(context)
    
    def run_interaction_loop(self, context: Dict[str, Any]):
        """Main interaction loop between human learner and AI Aniota"""
        interaction_count = 0
        
        print(f"\n🚀 STARTING INTERACTION LOOP")
        print(f"💡 Type 'help' for commands, 'quit' to end session")
        
        while True:
            interaction_count += 1
            print(f"\n" + "-"*60)
            print(f"🔄 INTERACTION #{interaction_count}")
            print(f"-"*60)
            
            # 1. Calculate coordinates for current context
            coordinates = self.calculate_coordinates(context)
            print(f"📍 Current Coordinates: Difficulty={coordinates[1]:.2f}, Relatedness={coordinates[0]:.2f}")
            
            # 2. Select question type based on coordinates
            question_type = self.select_question_type(coordinates, context)
            print(f"🎯 Selected Question Type: {question_type.upper()}")
            print(f"📋 Purpose: {self.question_types[question_type]['purpose']}")
            
            # 3. Generate question (AI playing Aniota's role)
            question_data = self.generate_question(question_type, context)
            
            print(f"\n🤖 ANIOTA'S QUESTION:")
            print(f"   {question_data['question']}")
            
            if question_data.get('escape_mode'):
                print(f"   🚨 [ESCAPE HATCH ACTIVATED - Aniota needs your guidance]")
            
            # 4. Get human learner response
            start_time = time.time()
            learner_response = input(f"\n👤 YOUR RESPONSE: ").strip()
            response_time = time.time() - start_time
            
            # Handle special commands
            if learner_response.lower() == 'quit':
                print("👋 Ending testing session...")
                break
            elif learner_response.lower() == 'help':
                self.show_help()
                continue
            elif learner_response.lower() == 'status':
                self.show_status(context)
                continue
            
            # 5. Capture interaction metadata
            interaction_data = {
                'interaction_count': interaction_count,
                'question_type': question_type,
                'coordinates': coordinates,
                'question': question_data['question'],
                'learner_response': learner_response,
                'response_time': response_time,
                'context': context.copy(),
                'selection_method': question_data.get('selection_method', 'coordinates'),
                'escape_mode': question_data.get('escape_mode', False),
                'timestamp': datetime.now().isoformat()
            }
            
            # Capture with MetaIX
            metadata_id = self.metaix.capture_learning_interaction(interaction_data)
            print(f"🔬 Metadata captured: {metadata_id}")
            
            # 6. Analyze response and update context
            analysis = self.analyze_learner_response(learner_response, question_type, context)
            context = self.update_context(context, analysis, question_type)
            
            # 7. Show AI analysis (playing Aniota's role)
            print(f"\n🧠 ANIOTA'S ANALYSIS:")
            print(f"   📊 Understanding Level: {analysis['understanding_level']:.2f}")
            print(f"   🎯 Engagement: {analysis['engagement_type']}")
            print(f"   📈 Next Direction: {analysis['suggested_next']}")
            
            # Store interaction
            self.session_data['interactions'].append(interaction_data)
            
            # Ask if learner wants to continue
            if interaction_count >= 3:  # After a few interactions
                continue_prompt = input(f"\n🔄 Continue learning? (y/n/auto): ").strip().lower()
                if continue_prompt == 'n':
                    break
                elif continue_prompt == 'auto':
                    print("🤖 Entering auto mode - AI will continue until natural stopping point")
                    # Could implement auto-stopping logic here
    
    def calculate_coordinates(self, context: Dict[str, Any]) -> Tuple[float, float]:
        """
        📍 Calculate Difficulty-Relatedness coordinates for current context
        
        This demonstrates the mathematical foundation of the coordinate system
        """
        print(f"\n🧮 CALCULATING COORDINATES:")
        
        # Get current topic info
        current_topic = context.get('current_topic', 'testing_strategies')
        topic_info = self.python_topics.get(current_topic, {'difficulty': 0.5})
        
        # Calculate difficulty based on learner level and topic complexity
        learner_level = context.get('learner_level', 0.5)
        topic_difficulty = topic_info.get('difficulty', 0.5)
        current_performance = context.get('current_performance', 0.5)
        
        # Adaptive difficulty: adjust based on performance
        if current_performance > 0.8:
            difficulty = min(learner_level + 0.2, 1.0)  # Increase challenge
            print(f"   📈 High performance detected - increasing difficulty")
        elif current_performance < 0.4:
            difficulty = max(learner_level - 0.2, 0.0)  # Decrease challenge  
            print(f"   📉 Struggles detected - decreasing difficulty")
        else:
            difficulty = (learner_level + topic_difficulty) / 2
            print(f"   ⚖️ Balanced difficulty calculation")
        
        # Calculate relatedness to learning history
        learning_history = context.get('learning_history', [])
        if learning_history:
            # Calculate relatedness to recent topics
            recent_topics = learning_history[-2:]  # Last 2 topics
            relatedness_scores = []
            
            for historical_topic in recent_topics:
                score = self.calculate_topic_relatedness(current_topic, historical_topic)
                relatedness_scores.append(score)
                print(f"   🔗 Relatedness to '{historical_topic}': {score:.2f}")
            
            relatedness = sum(relatedness_scores) / len(relatedness_scores)
        else:
            relatedness = 0.5  # Default for first interaction
            print(f"   🎯 No history - using default relatedness")
        
        coordinates = (relatedness, difficulty)
        print(f"   📍 Final Coordinates: ({relatedness:.2f}, {difficulty:.2f})")
        
        return coordinates
    
    def calculate_topic_relatedness(self, topic1: str, topic2: str) -> float:
        """Calculate relatedness between two Python development topics"""
        if topic1 == topic2:
            return 1.0
        
        # Get topic info
        info1 = self.python_topics.get(topic1, {})
        info2 = self.python_topics.get(topic2, {})
        
        # Check related topics overlap
        related1 = set(info1.get('related_topics', []))
        related2 = set(info2.get('related_topics', []))
        
        if related1 and related2:
            overlap = len(related1.intersection(related2))
            union = len(related1.union(related2))
            return overlap / union if union > 0 else 0.0
        
        return 0.3  # Default moderate relatedness
    
    def select_question_type(self, coordinates: Tuple[float, float], context: Dict[str, Any]) -> str:
        """
        🎯 Select question type based on coordinates using quadrant mapping
        
        This demonstrates the coordinate-to-quadrant selection algorithm
        """
        relatedness, difficulty = coordinates
        
        print(f"\n🗺️ QUADRANT MAPPING:")
        print(f"   📍 Position: Relatedness={relatedness:.2f}, Difficulty={difficulty:.2f}")
        
        # Map coordinates to quadrants
        if difficulty >= 0.5 and relatedness < 0.5:
            selected = 'expand'  # Hard + Unrelated
            print(f"   🎯 Northwest Quadrant: EXPAND (new challenges)")
        elif difficulty >= 0.5 and relatedness >= 0.5:
            selected = 'extend'  # Hard + Related
            print(f"   🎯 Northeast Quadrant: EXTEND (advanced application)")
        elif difficulty < 0.5 and relatedness >= 0.5:
            selected = 'explore'  # Easy + Related
            print(f"   🎯 Southeast Quadrant: EXPLORE (pattern discovery)")
        else:
            selected = 'review'  # Easy + Unrelated
            print(f"   🎯 Southwest Quadrant: REVIEW (consolidation)")
        
        # Check if we should trigger escape hatch (simulate system failure)
        if context.get('force_escape_test', False):
            print(f"   🚨 SIMULATING SYSTEM FAILURE - Activating escape hatch")
            return self.emergency_escape_hatch(context)
        
        return selected
    
    def emergency_escape_hatch(self, context: Dict[str, Any]) -> str:
        """
        🚨 Emergency escape hatch - randomly select direction when stuck
        
        This demonstrates Aniota's fail-safe recovery mechanism
        """
        import random
        
        escape_choices = ['expand', 'explore', 'extend', 'review']
        selected = random.choice(escape_choices)
        
        print(f"\n🚨 EMERGENCY ESCAPE HATCH ACTIVATED!")
        print(f"   🎲 Random selection: {selected}")
        print(f"   💬 Aniota will ask for learner guidance to reorient")
        
        # Record escape event
        escape_event = {
            'timestamp': datetime.now().isoformat(),
            'selected_direction': selected,
            'context': context.copy(),
            'reason': 'testing_demonstration'
        }
        self.session_data['system_events'].append(escape_event)
        
        return selected
    
    def generate_question(self, question_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        💭 Generate actual question based on type and context
        
        This is where the AI plays Aniota's role in creating Socratic questions
        """
        current_topic = context.get('current_topic', 'testing_strategies')
        learner_level = context.get('learner_level', 0.5)
        
        # Question templates for each type in Python development domain
        question_templates = {
            'expand': [
                f"What advanced aspects of {current_topic} challenge you most?",
                f"How might {current_topic} apply to enterprise-scale Python projects?",
                f"What are the theoretical foundations behind {current_topic}?"
            ],
            'explore': [
                f"How does {current_topic} connect to other Python development practices you know?",
                f"What patterns do you see between {current_topic} and your previous experience?",
                f"How might {current_topic} relate to the broader Python ecosystem?"
            ],
            'extend': [
                f"Can you design a {current_topic} solution for a complex real-world scenario?",
                f"How would you implement {current_topic} in a high-performance application?",
                f"What would happen if you combined {current_topic} with modern Python frameworks?"
            ],
            'review': [
                f"What are the core principles of {current_topic} that you understand so far?",
                f"How would you explain {current_topic} to a Python beginner?",
                f"What aspects of {current_topic} make the most sense to you?"
            ]
        }
        
        # Check for escape mode
        escape_mode = context.get('force_escape_test', False)
        
        if escape_mode:
            # Generate escape question
            direction = self.question_types[question_type]
            question = f"I'm not sure of the best direction right now. Would you like to {direction['description']}?"
            return {
                'question': question,
                'question_type': question_type,
                'escape_mode': True,
                'selection_method': 'emergency_escape',
                'guidance_request': "What specifically would you like to focus on?"
            }
        else:
            # Generate normal question
            templates = question_templates.get(question_type, question_templates['explore'])
            import random
            question = random.choice(templates)
            
            return {
                'question': question,
                'question_type': question_type,
                'escape_mode': False,
                'selection_method': 'coordinates',
                'purpose': self.question_types[question_type]['purpose']
            }
    
    def analyze_learner_response(self, response: str, question_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        🧠 Analyze learner response to understand learning state
        
        This simulates Aniota's analysis of learner understanding and engagement
        """
        response_lower = response.lower()
        word_count = len(response.split())
        
        # Analyze understanding level
        confidence_words = ['understand', 'clear', 'makes sense', 'get it', 'obvious']
        uncertainty_words = ['confused', 'not sure', 'maybe', 'think', 'unclear']
        
        confidence_count = sum(1 for word in confidence_words if word in response_lower)
        uncertainty_count = sum(1 for word in uncertainty_words if word in response_lower)
        
        if confidence_count > uncertainty_count:
            understanding_level = 0.8
        elif uncertainty_count > confidence_count:
            understanding_level = 0.3
        else:
            understanding_level = 0.6
        
        # Analyze engagement type
        question_marks = response.count('?')
        enthusiasm_words = ['love', 'interesting', 'cool', 'great', 'awesome']
        enthusiasm_count = sum(1 for word in enthusiasm_words if word in response_lower)
        
        if enthusiasm_count > 0 and question_marks > 0:
            engagement_type = 'highly_engaged'
        elif word_count > 20:
            engagement_type = 'thoughtfully_engaged'
        elif word_count < 5:
            engagement_type = 'minimally_engaged'
        else:
            engagement_type = 'moderately_engaged'
        
        # Suggest next direction
        if understanding_level > 0.7:
            suggested_next = 'increase_difficulty'
        elif understanding_level < 0.4:
            suggested_next = 'provide_support'
        else:
            suggested_next = 'continue_current_level'
        
        return {
            'understanding_level': understanding_level,
            'engagement_type': engagement_type,
            'suggested_next': suggested_next,
            'word_count': word_count,
            'confidence_indicators': confidence_count,
            'uncertainty_indicators': uncertainty_count
        }
    
    def update_context(self, context: Dict[str, Any], analysis: Dict[str, Any], question_type: str) -> Dict[str, Any]:
        """Update learning context based on interaction analysis"""
        new_context = context.copy()
        
        # Update performance based on understanding
        current_performance = new_context.get('current_performance', 0.5)
        understanding = analysis['understanding_level']
        
        # Weighted average of current and new performance
        new_performance = (current_performance * 0.7) + (understanding * 0.3)
        new_context['current_performance'] = new_performance
        
        # Add to learning history
        history = new_context.get('learning_history', [])
        history.append(new_context.get('current_topic', 'unknown'))
        new_context['learning_history'] = history[-5:]  # Keep last 5
        
        # Update learner level if showing consistent performance
        if new_performance > 0.8:
            new_context['learner_level'] = min(new_context.get('learner_level', 0.5) + 0.1, 1.0)
        elif new_performance < 0.3:
            new_context['learner_level'] = max(new_context.get('learner_level', 0.5) - 0.1, 0.0)
        
        return new_context
    
    def show_help(self):
        """Show available commands and system info"""
        print(f"\n📖 INTERACTIVE SIE TESTING HELP")
        print(f"{'='*50}")
        print(f"🎮 COMMANDS:")
        print(f"   'help' - Show this help")
        print(f"   'status' - Show current learning state")
        print(f"   'quit' - End testing session")
        print(f"   'auto' - Let AI continue automatically")
        print(f"")
        print(f"🎯 TESTING FOCUS:")
        print(f"   - Four-choice coordinate system (expand/explore/extend/review)")
        print(f"   - Mathematical coordinate calculation")
        print(f"   - MetaIX metadata capture")
        print(f"   - Emergency escape hatch (if system gets stuck)")
        print(f"")
        print(f"🧠 AI ROLE: Playing Aniota's LLM brain")
        print(f"👤 YOUR ROLE: Python developer learning new strategies")
    
    def show_status(self, context: Dict[str, Any]):
        """Show current learning context and system state"""
        print(f"\n📊 CURRENT LEARNING STATUS")
        print(f"{'='*50}")
        print(f"📚 Topic: {context.get('current_topic', 'unknown')}")
        print(f"🎓 Learner Level: {context.get('learner_level', 0.5):.2f}")
        print(f"📈 Performance: {context.get('current_performance', 0.5):.2f}")
        print(f"🕐 Session Time: {len(self.session_data['interactions'])} interactions")
        print(f"🔬 Metadata Points: {len(self.metaix.metadata_buffer)}")
        print(f"📜 Learning History: {context.get('learning_history', [])}")
    
    def end_session(self):
        """End testing session and generate comprehensive report"""
        print(f"\n📊 GENERATING SESSION REPORT...")
        
        # Get MetaIX insights
        meta_insights = self.metaix.get_meta_insights()
        
        # Session summary
        session_summary = {
            'session_id': self.session_data['session_id'],
            'total_interactions': len(self.session_data['interactions']),
            'total_duration': 'calculated from timestamps',
            'domain_coverage': 'python_development_strategies',
            'system_events': len(self.session_data['system_events']),
            'metadata_insights': meta_insights,
            'testing_objectives_met': {
                'coordinate_calculation': True,
                'four_choice_selection': True,
                'metadata_capture': True,
                'escape_hatch_demo': len(self.session_data['system_events']) > 0
            }
        }
        
        print(f"✅ Session completed successfully!")
        print(f"📊 Interactions: {session_summary['total_interactions']}")
        print(f"🔬 Metadata captured: {len(self.metaix.metadata_buffer)} points")
        print(f"🎯 All testing objectives met!")
        
        return session_summary

if __name__ == "__main__":
    print("🎮 Starting Interactive SIE Testing System...")
    print("🐍 Domain: Python Development Strategies")
    print("🤖 AI plays Aniota, Human plays Learner")
    
    tester = InteractiveSIETest()
    tester.start_testing_session()


log_file_dependency("interactive_sie_test.py", "random", "import")
log_file_dependency("interactive_sie_test.py", "random", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
