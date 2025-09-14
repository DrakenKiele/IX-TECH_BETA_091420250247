

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("sie_ldm_socratic_demo.py", "system_initialization", "import", "Auto-generated dev log entry")

SIE-LDM Integration Demo
Demonstrates how the Socratic Inquiry Engine uses Long-Term Declarative Memory
for contextual, knowledge-informed questioning using Extension, Exploration, and Review.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import time
from datetime import datetime, timedelta
from backend.core.caf import CognitiveFramework
from backend.memory.wms import WorkingMemorySystem
from backend.memory.ldm import LongTermDeclarativeMemory
from backend.learning.sie import SocraticInquiryEngine

def demo_socratic_inquiry_engine():
    """Demonstrate the three types of Socratic questions: Extension, Exploration, and Review"""
    
    print("=== Socratic Inquiry Engine Demo ===")
    print("Demonstrating Extension, Exploration, and Review questioning\n")
    
    # Initialize the system hierarchy
    print("1. Initializing system components...")
    caf = CognitiveFramework()
    caf.initialize()
    
    wms = WorkingMemorySystem(parent_caf=caf)
    wms.initialize()
    
    ldm = LongTermDeclarativeMemory(parent_wms=wms)
    ldm.initialize()
    
    sie = SocraticInquiryEngine(parent_caf=caf)
    sie.initialize()
    
    # Register modules in hierarchy
    caf.register_module(wms)
    caf.register_module(ldm)
    caf.register_module(sie)
    wms.add_child(ldm)
    caf.add_child(sie)
    
    print("✓ System components initialized\n")
    
    # Seed LDM with some knowledge for context
    print("2. Seeding LDM with learning context...")
    
    learning_memories = [
        {
            'id': 'concept_photosynthesis',
            'content': {
                'type': 'scientific_concept',
                'subject': 'biology',
                'topic': 'photosynthesis',
                'details': 'Process by which plants convert light energy into chemical energy',
                'complexity_level': 'intermediate',
                'prerequisites': ['basic_chemistry', 'plant_biology'],
                'applications': ['ecosystem_energy', 'agriculture', 'climate_science']
            },
            'type': 'semantic'
        },
        {
            'id': 'skill_problem_solving',
            'content': {
                'type': 'learning_skill',
                'subject': 'mathematics',
                'topic': 'algebraic_problem_solving',
                'details': 'Systematic approach to solving algebraic equations',
                'complexity_level': 'intermediate',
                'steps': ['identify_variables', 'set_up_equation', 'solve_systematically'],
                'common_mistakes': ['sign_errors', 'order_of_operations']
            },
            'type': 'procedural'
        },
        {
            'id': 'experience_discovery',
            'content': {
                'type': 'learning_experience',
                'subject': 'physics',
                'topic': 'scientific_discovery',
                'details': 'Learner discovered relationship between force and acceleration',
                'insight': 'Greater force leads to greater acceleration when mass is constant',
                'emotional_response': 'excitement_and_curiosity',
                'follow_up_interests': ['momentum', 'energy', 'mechanics']
            },
            'type': 'episodic'
        }
    ]
    
    # Store memories in WMS and consolidate to LDM
    for memory in learning_memories:
        wms.store_memory(memory['id'], memory['content'], memory['type'])
        # Set high consolidation score to ensure transfer to LDM
        wms.active_memories[memory['id']]['consolidation_score'] = 0.9
    
    # Force consolidation
    wms.last_decay_cycle = datetime.now() - timedelta(seconds=wms.decay_interval + 1)
    decay_stats = wms.process_decay_cycle()
    print(f"✓ Consolidated {decay_stats['consolidated_count']} memories to LDM\n")
    
    # Demonstrate Extension Questions
    print("3. Demonstrating EXTENSION Questions (going deeper)...")
    print("   Purpose: Expand understanding and connect to existing knowledge\n")
    
    extension_context = {
        'topic': 'photosynthesis',
        'learner_understanding': 'basic',
        'triggers': ['basic_comprehension', 'need_depth'],
        'current_knowledge': 'knows plants need sunlight and water',
        'session_stage': 'deepening'
    }
    
    extension_q1 = sie.generate_question(extension_context, 'student_alice')
    if extension_q1:
        print(f"Extension Question 1: {extension_q1['question']}")
        print(f"Type: {extension_q1['type']}")
        print(f"Purpose: {extension_q1['purpose']}\n")
        
        # Simulate learner response
        response = {
            'answer': 'Plants need carbon dioxide too, and they produce oxygen',
            'confidence': 'medium',
            'additional_questions': ['Where does the carbon dioxide come from?']
        }
        
        follow_up = sie.process_learner_response(extension_q1['inquiry_id'], response)
        if follow_up and follow_up.get('question'):
            print(f"Follow-up Extension: {follow_up['question']}\n")
    
    # Demonstrate Exploration Questions
    print("4. Demonstrating EXPLORATION Questions (discovering connections)...")
    print("   Purpose: Investigate relationships and patterns\n")
    
    exploration_context = {
        'topic': 'algebraic_problem_solving',
        'learner_understanding': 'exploring',
        'triggers': ['pattern_recognition', 'need_discovery'],
        'current_activity': 'solving_equations',
        'session_stage': 'investigation'
    }
    
    exploration_q1 = sie.generate_question(exploration_context, 'student_bob')
    if exploration_q1:
        print(f"Exploration Question 1: {exploration_q1['question']}")
        print(f"Type: {exploration_q1['type']}")
        print(f"Purpose: {exploration_q1['purpose']}\n")
        
        # Simulate deeper exploration
        response = {
            'answer': 'I notice that when I add the same number to both sides, the equation stays balanced',
            'insight_level': 'good',
            'connections_made': ['balance_concept', 'symmetry']
        }
        
        follow_up = sie.process_learner_response(exploration_q1['inquiry_id'], response)
        if follow_up and follow_up.get('question'):
            print(f"Follow-up Exploration: {follow_up['question']}\n")
    
    # Demonstrate Review Questions
    print("5. Demonstrating REVIEW Questions (consolidating learning)...")
    print("   Purpose: Reflect on and consolidate understanding\n")
    
    review_context = {
        'topic': 'scientific_discovery',
        'learner_understanding': 'comprehensive',
        'triggers': ['learning_complete', 'consolidation_needed'],
        'session_stage': 'reflection',
        'discoveries_made': ['force_acceleration_relationship']
    }
    
    review_q1 = sie.generate_question(review_context, 'student_charlie')
    if review_q1:
        print(f"Review Question 1: {review_q1['question']}")
        print(f"Type: {review_q1['type']}")
        print(f"Purpose: {review_q1['purpose']}\n")
        
        # Simulate reflective response
        response = {
            'reflection': 'I learned that experiments can reveal hidden patterns in nature',
            'confidence': 'high',
            'changed_understanding': 'Now I see physics as interconnected principles',
            'new_questions': ['How do these principles apply to other areas?']
        }
        
        follow_up = sie.process_learner_response(review_q1['inquiry_id'], response)
        if follow_up:
            print(f"Review outcome: {follow_up.get('message', 'Continued reflection')}\n")
    
    # Demonstrate Full Learning Session
    print("6. Demonstrating Complete Socratic Learning Session...")
    
    session_id = sie.start_learning_session(
        learner_id='student_diana',
        topic='ecosystem_energy_flow',
        context={
            'complexity_level': 'advanced_beginner',
            'prior_knowledge': ['photosynthesis', 'food_chains'],
            'learning_goal': 'understand_energy_transfer'
        }
    )
    
    print(f"✓ Started learning session: {session_id}")
    
    # Simulate session progression through all three question types
    question_sequence = [
        ('exploration', 'What patterns do you notice in how energy moves through an ecosystem?'),
        ('extension', 'How does this energy flow connect to the photosynthesis process we studied?'),
        ('review', 'What insights have you gained about energy in living systems?')
    ]
    
    for i, (expected_type, sample_question) in enumerate(question_sequence, 1):
        print(f"\nSession Question {i} ({expected_type.title()}):")
        
        # In a real system, this would be generated dynamically
        context = {
            'topic': 'ecosystem_energy_flow',
            'session_id': session_id,
            'question_number': i,
            'triggers': [f'need_{expected_type}']
        }
        
        question = sie.generate_question(context, 'student_diana')
        if question:
            print(f"Generated: {question['question']}")
            print(f"Type: {question['type']}")
            
            # Simulate appropriate response
            if question['type'] == 'exploration':
                response = {'discovery': 'Energy seems to flow from plants to animals to decomposers'}
            elif question['type'] == 'extension':
                response = {'connection': 'Plants capture solar energy and pass it through food webs'}
            else:  # review
                response = {'insight': 'Energy flows in one direction but matter cycles'}
            
            sie.process_learner_response(question['inquiry_id'], response)
    
    # Get session progress
    progress = sie.get_session_progress(session_id)
    if progress:
        print(f"\nSession Progress:")
        print(f"  Duration: {progress['duration']}")
        print(f"  Total Questions: {progress['total_inquiries']}")
        print(f"  Completed: {progress['completed_inquiries']}")
        print(f"  Status: {progress['session_state']}")
    
    # End session and get summary
    summary = sie.end_learning_session(session_id)
    print(f"\nSession Summary:")
    for key, value in summary.items():
        if key != 'error':
            print(f"  {key}: {value}")
    
    # Demonstrate Learner Insights
    print("\n7. Generating Learner Insights...")
    
    insights = sie.get_learner_insights('student_diana')
    if 'error' not in insights:
        print("Learner Analysis:")
        for key, value in insights.items():
            if key != 'learner_id':
                print(f"  {key}: {value}")
    
    # Show System Statistics
    print("\n8. System Statistics:")
    
    ldm_stats = ldm.get_memory_statistics()
    print(f"LDM Statistics:")
    print(f"  Active memories: {ldm_stats['active_memories']}")
    print(f"  Memory clusters: {ldm_stats['memory_clusters']}")
    print(f"  Index keywords: {ldm_stats['index_keywords']}")
    
    print(f"\nSIE Statistics:")
    print(f"  Active inquiries: {len(sie.active_inquiries)}")
    print(f"  Learning sessions: {len(sie.learning_sessions)}")
    print(f"  Tracked learners: {len(sie.learner_states)}")
    
    # Demonstrate Question Type Distribution
    print("\n9. Question Type Analysis:")
    
    for q_type, config in sie.question_types.items():
        print(f"\n{q_type.title()} Questions:")
        print(f"  Purpose: {config['purpose']}")
        print(f"  Sample patterns: {len(config['patterns'])} available")
        print(f"  Triggers: {', '.join(config['triggers'])}")
        print(f"  Example: {config['patterns'][0]}")
    
    print("\n=== Socratic Inquiry Demo Complete ===")
    print("\nKey Achievements:")
    print("✓ Extension questions deepen understanding")
    print("✓ Exploration questions discover connections") 
    print("✓ Review questions consolidate learning")
    print("✓ Knowledge-informed questioning using LDM")
    print("✓ Adaptive question generation based on learner state")
    print("✓ Complete learning session management")
    print("✓ Learner progress tracking and insights")

if __name__ == "__main__":
    demo_socratic_inquiry_engine()
