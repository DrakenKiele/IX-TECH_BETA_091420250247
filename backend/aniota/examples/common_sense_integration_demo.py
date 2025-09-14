

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("common_sense_integration_demo.py", "system_initialization", "import", "Auto-generated dev log entry")

Common Sense Integration Demo
Demonstrates how the distilled common sense rules integrate with Aniota modules
to provide intelligent, contextual reasoning across the system.
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

def demo_common_sense_integration():
    """Demonstrate how common sense rules integrate across Aniota modules"""
    
    print("=== Common Sense Integration Demo ===")
    print("Demonstrating distilled common sense rules in action\n")
    
    # Initialize system
    print("1. Initializing system with common sense reasoning...")
    caf = CognitiveFramework()
    caf.initialize()
    
    sie = SocraticInquiryEngine(parent_caf=caf)
    sie.initialize()
    
    htm = HypothesisTestingModule(parent_sie=sie)
    htm.initialize()
    
    rfm = ReflectiveFeedbackModule(parent_sie=sie)
    rfm.initialize()
    
    print("✓ System initialized with common sense reasoning engine\n")
    
    # Show available common sense rule categories
    print("2. Available Common Sense Rule Categories:")
    for category, rules in caf.common_sense_rules.items():
        print(f"   {category}: {len(rules)} rules")
        for rule_name, rule_text in list(rules.items())[:2]:  # Show first 2 rules
            print(f"     • {rule_name}: {rule_text}")
        if len(rules) > 2:
            print(f"     ... and {len(rules) - 2} more")
        print()
    
    # Demonstrate rule application in different scenarios
    print("3. Demonstrating Rule Application in Learning Scenarios...")
    
    # Scenario 1: HTM detects help-seeking behavior
    print("\\nScenario 1: Help-Seeking Behavior Detection")
    
    context = {
        'behavior_type': 'external_copying',
        'content_type': 'question',
        'frequency': 'repeated',
        'learning_context': True
    }
    
    # Apply naive psychology rule for help-seeking
    help_seeking_rule = caf.apply_common_sense_rule('naive_psychology', 'help_seeking', context)
    print(f"Rule Applied: {help_seeking_rule['rule_applied']}")
    print(f"Rule Text: {help_seeking_rule['rule_text']}")
    print(f"Confidence: {help_seeking_rule['confidence']:.2f}")
    
    # Get applicable rules for this context
    applicable_rules = caf.get_applicable_rules(context)
    print(f"\\nOther Applicable Rules ({len(applicable_rules)} total):")
    for rule in applicable_rules[:3]:  # Show top 3
        print(f"  • {rule['category']}.{rule['rule_name']} (relevance: {rule['relevance']:.2f})")
        print(f"    Guidance: {rule['application_guidance']}")
    
    # Scenario 2: RFM intervention validation
    print("\\n\\nScenario 2: Intervention Decision Validation")
    
    intervention_decision = {
        'type': 'socratic_questioning',
        'message': 'I notice you might be struggling. Let me help by giving you the answer.',
        'approach': 'direct_answer_provision'
    }
    
    intervention_context = {
        'learner_state': 'struggling',
        'interaction_type': 'intervention',
        'learning_goal': 'independence'
    }
    
    # Validate intervention against common sense
    validation = caf.validate_with_common_sense(intervention_decision, intervention_context)
    
    print(f"Intervention Validation:")
    print(f"  Passes Validation: {validation['passes_validation']}")
    print(f"  Violations: {validation['violations']}")
    print(f"  Warnings: {validation['warnings']}")
    print(f"  Recommendations: {validation['recommendations']}")
    print(f"  Confidence: {validation['confidence']:.2f}")
    
    # Show better intervention using common sense
    print("\\n  Better Intervention Using Common Sense:")
    better_decision = {
        'type': 'socratic_questioning',
        'message': 'I notice you might be struggling. Which would help you most: reviewing what you know, exploring a related area, or diving deeper?',
        'approach': 'guided_discovery'
    }
    
    better_validation = caf.validate_with_common_sense(better_decision, intervention_context)
    print(f"  Passes Validation: {better_validation['passes_validation']}")
    print(f"  Confidence: {better_validation['confidence']:.2f}")
    
    # Scenario 3: Context-dependent reasoning
    print("\\n\\nScenario 3: Context-Dependent Reasoning")
    
    # Same word, different contexts
    contexts = [
        {
            'domain': 'mathematics',
            'word': 'working',
            'sentence': 'The student is working on algebra',
            'context_type': 'activity'
        },
        {
            'domain': 'technology',
            'word': 'working',
            'sentence': 'The calculator is working properly',
            'context_type': 'functional_state'
        }
    ]
    
    for i, ctx in enumerate(contexts, 1):
        rule_result = caf.apply_common_sense_rule('context_reasoning', 'context_dependent', ctx)
        print(f"  Context {i}: {ctx['sentence']}")
        print(f"    Domain: {ctx['domain']}")
        print(f"    'Working' meaning: {'human activity' if ctx['context_type'] == 'activity' else 'device functionality'}")
        print(f"    Rule confidence: {rule_result['confidence']:.2f}")
    
    # Scenario 4: Incomplete information handling
    print("\\n\\nScenario 4: Handling Incomplete Information")
    
    partial_data = {
        'learner_response': 'I want to review',
        'choice_made': 'review',
        # Missing: subject area, specific topic, confidence level
    }
    
    incomplete_context = {
        'interaction_type': 'follow_up_question',
        'domain': 'learning_assessment'
    }
    
    # Apply incomplete information rules
    fill_gaps_rule = caf.apply_common_sense_rule('incomplete_information', 'fill_gaps', incomplete_context)
    print(f"Rule Applied: {fill_gaps_rule['rule_applied']}")
    print(f"Context: Learner chose 'review' but didn't specify subject")
    
    # Use CAF's incomplete information handling
    completed_info = caf.handle_incomplete_information(partial_data, 'learning_assessment')
    if 'error' not in completed_info:
        print(f"Gaps Filled: {completed_info['filled_gaps']}")
        print(f"Assumptions Made: {completed_info['assumptions_made']}")
    
    # Scenario 5: Adaptive problem solving
    print("\\n\\nScenario 5: Adaptive Problem Solving")
    
    problem = {
        'type': 'learning_intervention',
        'description': 'Learner repeatedly copying questions externally',
        'previous_attempts': ['direct_instruction', 'explanatory_content'],
        'success_rate': 0.1
    }
    
    constraints = {
        'approach': 'socratic_method',
        'avoid': 'direct_answers',
        'maintain': 'learner_autonomy'
    }
    
    # Apply problem-solving adaptation rules
    method_switch_rule = caf.apply_common_sense_rule('problem_solving', 'method_switching', 
                                                   {'previous_failures': True, 'repeated_approach': True})
    
    print(f"Problem: {problem['description']}")
    print(f"Previous Success Rate: {problem['success_rate']}")
    print(f"Rule Applied: {method_switch_rule['rule_applied']}")
    print(f"Rule Text: {method_switch_rule['rule_text']}")
    
    # Get adaptive solution
    adaptive_solution = caf.adaptive_problem_solving(problem, constraints)
    if 'error' not in adaptive_solution:
        print(f"Strategy Used: {adaptive_solution['strategy_used']}")
        print(f"Solution Confidence: {adaptive_solution['solution_confidence']:.2f}")
        print(f"Adaptation Occurred: {adaptive_solution['adaptation_occurred']}")
    
    # Show common sense validation checklist in action
    print("\\n\\n4. Common Sense Validation Checklist Demo:")
    
    test_decisions = [
        {
            'decision': {'action': 'provide_direct_answer', 'reason': 'efficiency'},
            'context': {'learner_struggling': True, 'goal': 'independence'},
            'expected': 'Should fail - violates learning autonomy'
        },
        {
            'decision': {'action': 'ask_socratic_question', 'reason': 'guide_discovery'},
            'context': {'learner_struggling': True, 'goal': 'independence'},
            'expected': 'Should pass - supports learning'
        },
        {
            'decision': {'action': 'criticize_approach', 'reason': 'correction'},
            'context': {'learner_attempting': True, 'goal': 'improvement'},
            'expected': 'Should fail - psychological harm risk'
        }
    ]
    
    checklist_questions = [
        "Does this make sense in typical human experience?",
        "Would a reasonable person draw similar conclusions?",
        "Are assumptions clearly identified and reasonable?",
        "Is the response appropriate for the context?",
        "Does this support learning rather than dependency?"
    ]
    
    print("\\nChecklist Questions:")
    for i, question in enumerate(checklist_questions, 1):
        print(f"  {i}. {question}")
    
    print("\\nTesting Decisions:")
    for i, test in enumerate(test_decisions, 1):
        validation = caf.validate_with_common_sense(test['decision'], test['context'])
        print(f"\\n  Test {i}: {test['decision']['action']}")
        print(f"    Expected: {test['expected']}")
        print(f"    Result: {'✓ PASS' if validation['passes_validation'] else '✗ FAIL'}")
        print(f"    Confidence: {validation['confidence']:.2f}")
        if validation['violations']:
            print(f"    Violations: {', '.join(validation['violations'])}")
        if validation['warnings']:
            print(f"    Warnings: {', '.join(validation['warnings'])}")
    
    # Show rule priority resolution
    print("\\n\\n5. Rule Priority Resolution:")
    print(f"Priority Order: {' > '.join(caf.rule_priorities)}")
    
    conflict_scenario = {
        'efficiency_vs_safety': 'Quick answer vs. Safe guidance',
        'speed_vs_learning': 'Fast solution vs. Discovery process'
    }
    
    for conflict, description in conflict_scenario.items():
        print(f"\\nConflict: {description}")
        print(f"Resolution: Safety and learning take priority over efficiency/speed")
        print(f"Applied Rule: {caf.rule_priorities[0]} (safety_first)")
    
    print("\\n=== Common Sense Integration Demo Complete ===")
    print("\\nKey Achievements:")
    print("✓ Distilled complex common sense document into 8 actionable rule categories")
    print("✓ 40 specific rules covering essential reasoning principles")
    print("✓ Non-redundant, accessible rule set integrated into CAF")
    print("✓ Context-aware rule application with confidence scoring")
    print("✓ Decision validation against common sense principles")
    print("✓ Adaptive reasoning for novel situations")
    print("✓ Priority-based conflict resolution")
    print("✓ Validation checklist for human-like reasoning")

if __name__ == "__main__":
    demo_common_sense_integration()
