

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("caf_definition_demo.py", "system_initialization", "import", "Auto-generated dev log entry")

CAF Definition System Demo

This demonstrates CAF's enhanced ability to load knowledge from JSON files
and provide definitions for learner interrogation.

The CAF module now:
1. Loads all knowledge structures from JSON files at initialization
2. Provides get_definition() method for concept lookup
3. Supports learner questions like "What does honesty mean?"
"""

import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from core.caf import CognitiveFramework

def demonstrate_definition_system():
    """Demonstrate CAF's definition and concept interrogation system"""
    
    print("=== CAF Definition System Demo ===\n")
    
    # Initialize CAF
    print("1. Initializing CAF with JSON knowledge loading...")
    caf = CognitiveFramework()
    caf.initialize()
    
    print(f"   ✓ CAF initialized successfully")
    print(f"   ✓ Loaded {len(caf.programming_paradigms)} programming paradigms")
    print(f"   ✓ Loaded {len(caf.problem_solving_techniques)} problem solving techniques")
    print(f"   ✓ Loaded {len(caf.cognitive_patterns)} cognitive patterns")
    print(f"   ✓ Loaded {len(caf.behavioral_rules)} behavioral rules")
    print(f"   ✓ Loaded {len(caf.basic_keywords)} BASIC keywords")
    print(f"   ✓ Loaded concept definitions with {len(caf.concept_definitions)} categories\n")
    
    # Demonstrate definition lookups
    print("2. Testing definition lookups (simulating learner questions)...")
    
    test_terms = [
        "honesty",          # From ethical concepts
        "decomposition",    # From programming paradigms
        "debugging",        # From problem solving techniques
        "abstraction",      # Could be in multiple places
        "IF",              # From BASIC keywords
        "nonexistent_term" # Should return None
    ]
    
    for term in test_terms:
        print(f"\n   Learner asks: 'What does {term} mean?'")
        definition = caf.get_definition(term)
        
        if definition:
            print(f"   ✓ Found in: {definition['source']}")
            print(f"     Definition: {definition['definition']}")
            
            # Show additional context based on source
            if 'natural_language' in definition:
                print(f"     In simple terms: {definition['natural_language']}")
            if 'examples' in definition:
                examples = definition['examples'][:2]  # Show first 2 examples
                print(f"     Examples: {', '.join(examples)}")
            if 'rule' in definition:
                print(f"     Rule: {definition['rule']}")
        else:
            print(f"   ✗ No definition found")
    
    # Demonstrate concept listing
    print("\n3. Listing available concepts by category...")
    
    categories = ['programming_paradigms', 'behavioral_rules', 'basic_keywords']
    
    for category in categories:
        concepts = caf.list_available_concepts(category)
        print(f"\n   {category.replace('_', ' ').title()}: {len(concepts)} concepts")
        print(f"     Sample concepts: {', '.join(concepts[:5])}")
        if len(concepts) > 5:
            print(f"     ... and {len(concepts) - 5} more")
    
    # Demonstrate knowledge integration
    print("\n4. Testing knowledge integration for teaching...")
    
    # Show how a teacher might use this system
    problem_context = {
        'description': 'complex multistep programming challenge',
        'domain': 'software_development'
    }
    
    print(f"\n   Given problem: {problem_context['description']}")
    
    # Get relevant paradigms
    if 'decomposition' in caf.programming_paradigms:
        decomp_data = caf.programming_paradigms['decomposition']
        print(f"   Suggested paradigm: decomposition")
        print(f"   Teaching approach: {decomp_data.get('teaching_approach', 'Not specified')}")
        print(f"   Key questions: {decomp_data.get('questions_to_ask', [])[:2]}")
    
    # Show system status
    print("\n5. CAF System Status:")
    status = caf.get_system_status()
    print(f"   Status: {status['caf_status']}")
    print(f"   Registered modules: {status['registered_modules']}")
    print(f"   Common sense enabled: {status['common_sense_enabled']}")
    
    print("\n=== Demo Complete ===")
    print("\nCAF now successfully loads all knowledge from JSON files and")
    print("provides rich definition lookup for learner interrogation!")

if __name__ == "__main__":
    demonstrate_definition_system()
