


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("test_problem_cases.py", "system_initialization", "import", "Auto-generated dev log entry")

Truth Engine Focused Test - Problem Cases
Testing specific problematic cases with the enhanced Truth Engine.
"""

import sys
import os

sys.path.append(os.path.dirname(__file__))

from hard_coded_knowledge import HardCodedKnowledgeBase
from truth_engine import TruthEngine

def test_problem_cases():
    """Test the specific cases that were failing."""
    print("🔍 TRUTH ENGINE FOCUSED TEST - Problem Cases")
    print("=" * 60)
    
    # Initialize knowledge base and truth engine
    knowledge_base = HardCodedKnowledgeBase()
    truth_engine = TruthEngine(knowledge_base)
    
    # Focus on the problematic test cases
    test_cases = [
        {
            'statement': 'Gravity makes objects fall upward into the sky',
            'expected_range': (0, 30),
            'description': 'Major physics contradiction'
        },
        {
            'statement': 'Nouns are action words that show movement',
            'expected_range': (10, 40),
            'description': 'Grammar contradiction (should be moderate penalty)'
        },
        {
            'statement': 'Addition combines numbers to get a sum total',
            'expected_range': (80, 100),
            'description': 'Natural mathematical sentence'
        },
        {
            'statement': 'Plants photosynthesis sunlight water democracy',
            'expected_range': (20, 50),
            'description': 'Unnatural keyword list'
        }
    ]
    
    print(f"\nTesting {len(test_cases)} problem cases...\n")
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"🧪 TEST {i}: {test_case['description']}")
        print(f"   Statement: \"{test_case['statement']}\"")
        
        # Run verification
        verification = truth_engine.verify_statement(test_case['statement'])
        score = verification['truth_score']
        
        # Check if score is in expected range
        min_expected, max_expected = test_case['expected_range']
        in_range = min_expected <= score <= max_expected
        status = "✅ PASS" if in_range else "❌ FAIL"
        
        print(f"   Result: {score}/100 ({verification['truth_level']})")
        print(f"   Expected: {min_expected}-{max_expected} → {status}")
        print()

if __name__ == "__main__":
    test_problem_cases()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
