

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("htm_rfm_integration_demo.py", "system_initialization", "import", "Auto-generated dev log entry")

HTM-RFM Integration Demo
Demonstrates how HTM and RFM work as "flip sides of the questioning technique"
to detect negative learning patterns and provide appropriate interventions.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import time
from datetime import datetime, timedelta
from backend.core.caf import CognitiveFramework
from backend.learning.sie import SocraticInquiryEngine
from backend.learning.htm import HypothesisTestingModule
from backend.learning.rfm import ReflectiveFeedbackModule

def demo_htm_rfm_integration():
    """Demonstrate HTM and RFM working together to detect and intervene in negative learning patterns"""
    
    print("=== HTM-RFM Integration Demo ===")
    print("Demonstrating clipboard analysis and intervention strategy\n")
    
    # Initialize the system hierarchy
    print("1. Initializing system components...")
    caf = CognitiveFramework()
    caf.initialize()
    
    sie = SocraticInquiryEngine(parent_caf=caf)
    sie.initialize()
    
    htm = HypothesisTestingModule(parent_sie=sie)
    htm.initialize()
    
    rfm = ReflectiveFeedbackModule(parent_sie=sie)
    rfm.initialize()
    
    # Register modules in hierarchy
    caf.register_module(sie)
    caf.add_child(sie)
    sie.add_child(htm)
    sie.add_child(rfm)
    
    print("✓ System components initialized\n")
    
    # Simulate clipboard monitoring and analysis
    print("2. Simulating clipboard content analysis...")
    
    # Sample clipboard contents that suggest negative learning patterns
    clipboard_samples = [
        {
            'content': 'What is the formula for quadratic equations?',
            'context': 'Copying question to external site'
        },
        {
            'content': 'How do you solve for x in algebra?',
            'context': 'Another question being copied out'
        },
        {
            'content': 'The answer is x = (-b ± √(b²-4ac)) / 2a',
            'context': 'Copying answer from external source'
        },
        {
            'content': 'Why is photosynthesis important for plants?',
            'context': 'Yet another external question'
        }
    ]
    
    # Process each clipboard event
    clipboard_analyses = []
    for i, sample in enumerate(clipboard_samples, 1):
        print(f"\\nClipboard Event {i}: {sample['context']}")
        print(f"Content: \"{sample['content']}\"")
        
        # HTM analyzes the clipboard content
        analysis = htm.analyze_clipboard_content(sample['content'])
        clipboard_analyses.append(analysis)
        
        print(f"HTM Analysis:")
        print(f"  Content Type: {analysis['content_type']}")
        print(f"  Keywords: {', '.join(analysis['keywords'][:5])}")
        print(f"  Behavioral Inference: {analysis['behavioral_inference']['learning_engagement_level']}")
        print(f"  External Question Confidence: {analysis['confidence_scores'].get('external_question_copying', 0):.2f}")
        print(f"  External Answer Confidence: {analysis['confidence_scores'].get('external_answer_copying', 0):.2f}")
        
        # Small delay to simulate real-time events
        time.sleep(0.5)
    
    # Check for negative learning pattern
    print("\\n3. Detecting negative learning patterns...")
    
    pattern_detection = htm.detect_negative_learning_pattern()
    
    if pattern_detection and pattern_detection['pattern_detected']:
        print(f"🚨 NEGATIVE LEARNING PATTERN DETECTED!")
        print(f"  Confidence: {pattern_detection['confidence']:.2f}")
        print(f"  Recent Events: {pattern_detection['recent_events_count']}")
        print(f"  Intervention Recommended: {pattern_detection['intervention_recommendation']['intervention_type']}")
        print(f"  Priority Order: {', '.join(pattern_detection['intervention_recommendation']['priority_order'])}")
        
        # RFM triggers intervention
        print("\\n4. RFM Triggering Intervention...")
        
        intervention = rfm.trigger_intervention(pattern_detection, 'student_alex')
        
        print(f"Intervention Message: \"{intervention['message']}\"")
        print("\\nThree Choices Presented:")
        
        for i, choice in enumerate(intervention['choices'], 1):
            print(f"  {i}. {choice['type'].title()}: {choice['description']}")
            print(f"     Difficulty: {choice['difficulty']} | Weight: {choice['selection_weight']}")
        
        # Simulate learner choosing Review (easiest choice)
        print("\\n5. Simulating Learner Choice (Review - Easiest Option)...")
        
        choice_result = rfm.process_learner_choice(intervention['intervention_id'], 'review')
        
        print(f"Choice Recorded: {choice_result['choice_recorded']}")
        print(f"Follow-up Question: \"{choice_result['follow_up_question']}\"")
        print(f"This Reveals: {choice_result['reveals']}")
        
        # Simulate learner response to follow-up
        print("\\n6. Simulating Follow-up Response...")
        
        learner_response = "I want to review quadratic equations and factoring"
        print(f"Learner Response: \"{learner_response}\"")
        
        follow_up_result = rfm.process_follow_up_response(intervention['intervention_id'], learner_response)
        
        print("\\nRFM Analysis Results:")
        print(f"  Detected Subject: {follow_up_result['response_analysis']['subject_area']['detected_subject']}")
        print(f"  Subject Confidence: {follow_up_result['response_analysis']['subject_area']['confidence']:.2f}")
        print(f"  Dominant Mindset: {follow_up_result['response_analysis']['mindset']['dominant_mindset']}")
        print(f"  Mindset Confidence: {follow_up_result['response_analysis']['mindset']['confidence']:.2f}")
        print(f"  Response Specificity: {follow_up_result['response_analysis']['specificity']['specificity_level']}")
        
        print("\\nLearner Insights Generated:")
        insights = follow_up_result['learner_insights']
        print(f"  Primary Insight: {insights['primary_insight']}")
        print(f"  Motivation Level: {insights['motivation_level']}")
        print(f"  Support Needed: {', '.join(insights['support_needed'])}")
        print(f"  Intervention Success: {insights['intervention_success']}")
        
    else:
        print("No negative learning pattern detected yet.")
    
    # Demonstrate alternative choice scenarios
    print("\\n7. Demonstrating Alternative Choice Scenarios...")
    
    # Simulate "Extend" choice (hardest)
    print("\\nScenario A: Learner chooses 'Extend' (Most Difficult)")
    
    # Create a new intervention for demonstration
    mock_pattern = {
        'pattern_detected': True,
        'confidence': 0.75,
        'intervention_recommendation': {'intervention_type': 'socratic_questioning'}
    }
    
    extend_intervention = rfm.trigger_intervention(mock_pattern, 'student_motivated')
    extend_choice = rfm.process_learner_choice(extend_intervention['intervention_id'], 'extend')
    
    print(f"Follow-up Question: \"{extend_choice['follow_up_question']}\"")
    print(f"This reveals: {extend_choice['reveals']}")
    
    # Simulate motivated response
    motivated_response = "I want to explore advanced calculus applications and derivatives"
    extend_result = rfm.process_follow_up_response(extend_intervention['intervention_id'], motivated_response)
    
    print(f"Analysis: {extend_result['learner_insights']['primary_insight']}")
    print(f"Motivation: {extend_result['learner_insights']['motivation_level']}")
    
    # Simulate "Explore" choice (medium)
    print("\\nScenario B: Learner chooses 'Explore' (Medium Difficulty)")
    
    explore_intervention = rfm.trigger_intervention(mock_pattern, 'student_curious')
    explore_choice = rfm.process_learner_choice(explore_intervention['intervention_id'], 'explore')
    
    print(f"Follow-up Question: \"{explore_choice['follow_up_question']}\"")
    
    curious_response = "I'm curious about how math connects to physics and engineering"
    explore_result = rfm.process_follow_up_response(explore_intervention['intervention_id'], curious_response)
    
    print(f"Analysis: {explore_result['learner_insights']['primary_insight']}")
    print(f"Detected Interest: {explore_result['response_analysis']['subject_area']['detected_subject']}")
    
    # Show system statistics
    print("\\n8. System Statistics:")
    
    htm_confidence = htm.get_confidence_levels()
    print("\\nHTM Confidence Levels:")
    for pattern, confidence in htm_confidence.items():
        print(f"  {pattern}: {confidence:.3f}")
    
    rfm_stats = rfm.get_intervention_statistics()
    print("\\nRFM Intervention Statistics:")
    print(f"  Total Interventions: {rfm_stats['total_interventions']}")
    print(f"  Completion Rate: {rfm_stats['completion_rate']:.2f}")
    print(f"  Choice Distribution: {rfm_stats['choice_distribution']}")
    
    # Demonstrate the flip-side relationship
    print("\\n9. HTM-RFM 'Flip Sides' Relationship:")
    
    print("\\nHTM (Analysis Side):")
    print("  ✓ Monitors clipboard content before copying")
    print("  ✓ Extracts keywords and analyzes punctuation")
    print("  ✓ Detects external question/answer copying patterns")
    print("  ✓ Builds confidence in negative learning hypothesis")
    print("  ✓ Triggers intervention when threshold reached")
    
    print("\\nRFM (Intervention Side):")
    print("  ✓ Receives HTM analysis and triggers intervention")
    print("  ✓ Presents three choices (Review=easy, Explore=medium, Extend=hard)")
    print("  ✓ Learner naturally chooses easiest (Review) when struggling")
    print("  ✓ Follow-up 'What would you like to review?' reveals subject area")
    print("  ✓ Response analysis reveals learner mindset and motivation")
    
    print("\\nKey Intelligence Gained:")
    print("  • Review choice + specific response = Known subject area + confidence level")
    print("  • Explore choice + response = Curiosity patterns + broader interests") 
    print("  • Extend choice + response = High motivation + specific challenge areas")
    print("  • Response specificity = Engagement level + learning investment")
    
    print("\\n=== HTM-RFM Integration Demo Complete ===")
    print("\\nKey Achievements:")
    print("✓ HTM detects negative learning patterns from clipboard behavior")
    print("✓ RFM provides graduated intervention choices")
    print("✓ Review choice (easiest) most likely when learner struggling")
    print("✓ Follow-up questions reveal subject area and mindset")
    print("✓ System gains intelligence about learner without being intrusive")
    print("✓ Intervention redirects from external dependency to internal learning")

if __name__ == "__main__":
    demo_htm_rfm_integration()
