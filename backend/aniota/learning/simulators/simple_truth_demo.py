


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("simple_truth_demo.py", "system_initialization", "import", "Auto-generated dev log entry")

🔍 SIMPLE TRUTH ENGINE DEMONSTRATION 🔍

Shows the elegant simplicity of the Truth Engine:
1. Extract keywords (remove connective words)
2. Find correlating facts
3. Calculate truth score 0-100

Simple and effective fact verification system.
"""

from hard_coded_knowledge import HardCodedKnowledgeBase
from truth_engine import TruthEngine

def run_simple_truth_demo():
    """Simple demonstration of Truth Engine concept"""
    
    print("🔍 SIMPLE TRUTH ENGINE DEMONSTRATION")
    print("="*50)
    print()
    print("🎯 CONCEPT: Extract keywords → Find correlations → Score truth 0-100")
    print()
    
    # Initialize
    knowledge_base = HardCodedKnowledgeBase()
    truth_engine = TruthEngine(knowledge_base)
    
    # Test statements with expected results
    test_cases = [
        {
            'statement': "Plants use sunlight to make food through photosynthesis",
            'expected': "HIGH (true statement)",
            'category': "Science fact"
        },
        {
            'statement': "Gravity makes objects fall upward", 
            'expected': "LOW (false statement)",
            'category': "Science misconception"
        },
        {
            'statement': "Addition combines numbers to get a sum",
            'expected': "HIGH (true statement)", 
            'category': "Math fact"
        },
        {
            'statement': "Nouns are action words",
            'expected': "LOW (false - verbs are action words)",
            'category': "Grammar misconception"
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"🧪 TEST CASE #{i}: {test['category']}")
        print(f"   📝 Statement: \"{test['statement']}\"")
        print(f"   🎯 Expected: {test['expected']}")
        
        # Verify with Truth Engine
        result = truth_engine.verify_statement(test['statement'])
        
        print(f"   📊 Truth Score: {result['truth_score']}/100")
        print(f"   📈 Truth Level: {result['truth_level']}")
        print(f"   ✅ Result: {'CORRECT' if ((result['truth_score'] >= 60 and 'HIGH' in test['expected']) or (result['truth_score'] < 60 and 'LOW' in test['expected'])) else 'NEEDS_REVIEW'}")
        print()
    
    print("🎯 TRUTH ENGINE SUMMARY:")
    print("   • Simple keyword extraction")
    print("   • Fact correlation matching") 
    print("   • 0-100 truth scoring")
    print("   • Fast and offline-capable")
    print("   • Reports degree of certainty to user")

if __name__ == "__main__":
    run_simple_truth_demo()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
