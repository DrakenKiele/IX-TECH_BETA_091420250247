


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("test_enhanced_truth.py", "system_initialization", "import", "Auto-generated dev log entry")

Enhanced Truth Engine Test - Proximity and Subject Analysis
Testing the improved Truth Engine with word proximity and subject consistency features.
"""

import sys
import os

sys.path.append(os.path.dirname(__file__))

from hard_coded_knowledge import HardCodedKnowledgeBase
from truth_engine import TruthEngine

def test_enhanced_truth_engine():
    """Test the enhanced Truth Engine with proximity and subject analysis."""
    print("🔍 ENHANCED TRUTH ENGINE TEST")
    print("=" * 60)
    
    # Initialize knowledge base and truth engine
    knowledge_base = HardCodedKnowledgeBase()
    truth_engine = TruthEngine(knowledge_base)
    
    # Test cases designed to test specific features
    test_cases = [
        {
            'statement': 'Plants use photosynthesis to make food from sunlight',
            'expected_range': (85, 100),
            'test_focus': 'High truth, good proximity, consistent subject'
        },
        {
            'statement': 'Gravity makes objects fall upward into the sky',
            'expected_range': (0, 30),
            'test_focus': 'Major contradiction detection'
        },
        {
            'statement': 'Addition combines numbers to get a sum total',
            'expected_range': (80, 100),
            'test_focus': 'Good proximity between related math terms'
        },
        {
            'statement': 'Nouns are action words that show movement',
            'expected_range': (10, 40),
            'test_focus': 'Contradiction: nouns vs action words'
        },
        {
            'statement': 'Democracy involves citizens voting to choose leaders',
            'expected_range': (75, 95),
            'test_focus': 'Good subject consistency in social studies'
        },
        {
            'statement': 'Atoms have electrons but democracy uses votes',
            'expected_range': (30, 60),
            'test_focus': 'Poor subject consistency across domains'
        },
        {
            'statement': 'Plants photosynthesis sunlight water democracy',
            'expected_range': (20, 50),
            'test_focus': 'Poor proximity between unrelated terms'
        }
    ]
    
    print(f"\nTesting {len(test_cases)} cases with enhanced proximity and subject analysis...\n")
    
    results = []
    for i, test_case in enumerate(test_cases, 1):
        print(f"🧪 TEST CASE {i}: {test_case['test_focus']}")
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
        
        results.append({
            'test': i,
            'statement': test_case['statement'],
            'score': score,
            'expected_range': test_case['expected_range'],
            'passed': in_range,
            'focus': test_case['test_focus']
        })
        
        print()
    
    # Summary
    passed = sum(1 for r in results if r['passed'])
    total = len(results)
    pass_rate = (passed / total) * 100
    
    print("📊 TEST SUMMARY")
    print("=" * 40)
    print(f"Tests Passed: {passed}/{total} ({pass_rate:.1f}%)")
    print()
    
    if passed == total:
        print("🎉 All tests passed! Enhanced Truth Engine is working correctly.")
    else:
        print("⚠️ Some tests failed. Review the scoring logic.")
        print("\nFailed tests:")
        for result in results:
            if not result['passed']:
                print(f"   - Test {result['test']}: {result['score']}/100 (expected {result['expected_range']})")
                print(f"     Focus: {result['focus']}")
    
    print(f"\n🔍 Truth Engine Status:")
    status = truth_engine.get_truth_engine_status()
    print(f"   Version: {status['version']}")
    print(f"   Knowledge Base: {status['knowledge_base_size']} concepts")
    print(f"   Enhanced Features: Proximity Analysis, Subject Consistency, Contradiction Detection")

if __name__ == "__main__":
    test_enhanced_truth_engine()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
