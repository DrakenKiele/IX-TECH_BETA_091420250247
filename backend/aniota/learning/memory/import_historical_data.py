


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("import_historical_data.py", "system_initialization", "import", "Auto-generated dev log entry")

Truth Engine Historical Data Import
Imports all historical test data from conversation backtrack.
"""

import json
import datetime
from truth_engine_metrics import TruthEngineMetrics

def import_historical_data():
    """Import all historical test data from the conversation."""
    
    # Historical data from conversation backtrack
    historical_snapshots = [
        {
            'timestamp': '2025-09-01T10:00:00',
            'version': '0.5-offline-demo',
            'total_tests': 8,
            'passed_tests': 5,
            'failed_tests': 3,
            'success_rate': 62.5,
            'test_results': [
                {
                    'test_name': 'Offline Query 1: Multiplication',
                    'statement': 'What is multiplication?',
                    'expected_range': (60, 100),
                    'actual_score': 100,
                    'passed': True,
                    'focus_area': 'Basic math concepts',
                    'timestamp': '2025-09-01T10:00:00'
                },
                {
                    'test_name': 'Offline Query 2: Nouns explanation',
                    'statement': 'Explain what nouns are',
                    'expected_range': (60, 100),
                    'actual_score': 0,
                    'passed': False,
                    'focus_area': 'Grammar concepts',
                    'timestamp': '2025-09-01T10:00:00'
                },
                {
                    'test_name': 'Offline Query 3: Photosynthesis',
                    'statement': 'How does photosynthesis work?',
                    'expected_range': (60, 100),
                    'actual_score': 50,
                    'passed': False,
                    'focus_area': 'Science concepts',
                    'timestamp': '2025-09-01T10:00:00'
                },
                {
                    'test_name': 'Offline Query 4: Gravity',
                    'statement': 'What is gravity?',
                    'expected_range': (60, 100),
                    'actual_score': 100,
                    'passed': True,
                    'focus_area': 'Physics concepts',
                    'timestamp': '2025-09-01T10:00:00'
                },
                {
                    'test_name': 'Offline Query 5: Democracy',
                    'statement': 'Tell me about democracy',
                    'expected_range': (60, 100),
                    'actual_score': 33,
                    'passed': False,
                    'focus_area': 'Social studies',
                    'timestamp': '2025-09-01T10:00:00'
                },
                {
                    'test_name': 'Offline Query 6: Fractions',
                    'statement': 'What are fractions?',
                    'expected_range': (60, 100),
                    'actual_score': 0,
                    'passed': False,
                    'focus_area': 'Math concepts',
                    'timestamp': '2025-09-01T10:00:00'
                },
                {
                    'test_name': 'Offline Query 7: Civil War',
                    'statement': 'Explain the Civil War',
                    'expected_range': (60, 100),
                    'actual_score': 33,
                    'passed': False,
                    'focus_area': 'History concepts',
                    'timestamp': '2025-09-01T10:00:00'
                },
                {
                    'test_name': 'Offline Query 8: Atoms',
                    'statement': 'What are atoms made of?',
                    'expected_range': (60, 100),
                    'actual_score': 0,
                    'passed': False,
                    'focus_area': 'Chemistry concepts',
                    'timestamp': '2025-09-01T10:00:00'
                }
            ],
            'improvements': ['Initial hard-coded knowledge base', 'Basic offline operation capability'],
            'issues': ['Limited knowledge coverage', 'No truth verification system']
        },
        {
            'timestamp': '2025-09-01T11:00:00',
            'version': '1.0-simple-truth',
            'total_tests': 4,
            'passed_tests': 3,
            'failed_tests': 1,
            'success_rate': 75.0,
            'test_results': [
                {
                    'test_name': 'Simple Truth Test 1: Photosynthesis fact',
                    'statement': 'Plants use sunlight to make food through photosynthesis',
                    'expected_range': (85, 100),
                    'actual_score': 100,
                    'passed': True,
                    'focus_area': 'Science accuracy',
                    'timestamp': '2025-09-01T11:00:00'
                },
                {
                    'test_name': 'Simple Truth Test 2: Gravity misconception',
                    'statement': 'Gravity makes objects fall upward',
                    'expected_range': (0, 30),
                    'actual_score': 71,
                    'passed': False,
                    'focus_area': 'Contradiction detection',
                    'timestamp': '2025-09-01T11:00:00'
                },
                {
                    'test_name': 'Simple Truth Test 3: Addition fact',
                    'statement': 'Addition combines numbers to get a sum',
                    'expected_range': (80, 100),
                    'actual_score': 79,
                    'passed': True,
                    'focus_area': 'Math accuracy',
                    'timestamp': '2025-09-01T11:00:00'
                },
                {
                    'test_name': 'Simple Truth Test 4: Noun misconception',
                    'statement': 'Nouns are action words',
                    'expected_range': (10, 40),
                    'actual_score': 42,
                    'passed': True,
                    'focus_area': 'Grammar contradiction',
                    'timestamp': '2025-09-01T11:00:00'
                }
            ],
            'improvements': ['Added Truth Engine with keyword correlation', 'Simple fact verification'],
            'issues': ['Gravity contradiction not detected properly', 'Need better contradiction logic']
        },
        {
            'timestamp': '2025-09-01T12:00:00',
            'version': '1.1-enhanced-proximity',
            'total_tests': 7,
            'passed_tests': 5,
            'failed_tests': 2,
            'success_rate': 71.4,
            'test_results': [
                {
                    'test_name': 'Enhanced Test 1: High truth good proximity',
                    'statement': 'Plants use photosynthesis to make food from sunlight',
                    'expected_range': (85, 100),
                    'actual_score': 100,
                    'passed': True,
                    'focus_area': 'Basic science accuracy',
                    'timestamp': '2025-09-01T12:00:00'
                },
                {
                    'test_name': 'Enhanced Test 2: Major contradiction',
                    'statement': 'Gravity makes objects fall upward into the sky',
                    'expected_range': (0, 30),
                    'actual_score': 0,
                    'passed': True,
                    'focus_area': 'Contradiction detection',
                    'timestamp': '2025-09-01T12:00:00'
                },
                {
                    'test_name': 'Enhanced Test 3: Math terms proximity',
                    'statement': 'Addition combines numbers to get a sum total',
                    'expected_range': (80, 100),
                    'actual_score': 79,
                    'passed': False,
                    'focus_area': 'Mathematics accuracy',
                    'timestamp': '2025-09-01T12:00:00'
                },
                {
                    'test_name': 'Enhanced Test 4: Grammar contradiction',
                    'statement': 'Nouns are action words that show movement',
                    'expected_range': (10, 40),
                    'actual_score': 15,
                    'passed': True,
                    'focus_area': 'Grammar contradiction detection',
                    'timestamp': '2025-09-01T12:00:00'
                },
                {
                    'test_name': 'Enhanced Test 5: Social studies consistency',
                    'statement': 'Democracy involves citizens voting to choose leaders',
                    'expected_range': (75, 95),
                    'actual_score': 92,
                    'passed': True,
                    'focus_area': 'Social studies accuracy',
                    'timestamp': '2025-09-01T12:00:00'
                },
                {
                    'test_name': 'Enhanced Test 6: Mixed domains',
                    'statement': 'Atoms have electrons but democracy uses votes',
                    'expected_range': (30, 60),
                    'actual_score': 46,
                    'passed': True,
                    'focus_area': 'Cross-domain consistency',
                    'timestamp': '2025-09-01T12:00:00'
                },
                {
                    'test_name': 'Enhanced Test 7: Poor proximity',
                    'statement': 'Plants photosynthesis sunlight water democracy',
                    'expected_range': (20, 50),
                    'actual_score': 69,
                    'passed': False,
                    'focus_area': 'Unrelated terms detection',
                    'timestamp': '2025-09-01T12:00:00'
                }
            ],
            'improvements': [
                'Added proximity analysis with word distance calculations',
                'Implemented subject consistency scoring', 
                'Enhanced contradiction detection for physics and grammar',
                'Added penalty system for contradictions'
            ],
            'issues': [
                'Math statement just below threshold (79/100 vs 80+ needed)',
                'Unrelated terms scoring too high (69/100 vs 20-50 expected)',
                'Need to fine-tune proximity bonus calculations'
            ]
        }
    ]
    
    # Import the data
    metrics = TruthEngineMetrics()
    metrics.add_historical_data(historical_snapshots)
    
    return metrics

def main():
    """Import historical data and show progress report."""
    print("📚 IMPORTING HISTORICAL TRUTH ENGINE DATA")
    print("=" * 50)
    
    metrics = import_historical_data()
    
    print("\n" + metrics.get_progress_report())
    
    # Show the trend analysis
    print("\n🔍 DETAILED TREND ANALYSIS")
    print("=" * 50)
    
    success_rates = [snapshot.success_rate for snapshot in metrics.history]
    versions = [snapshot.version for snapshot in metrics.history]
    
    print("Version History:")
    for i, (version, rate) in enumerate(zip(versions, success_rates)):
        trend = ""
        if i > 0:
            change = rate - success_rates[i-1]
            if change > 0:
                trend = f" (+{change:.1f}% ↗️)"
            elif change < 0:
                trend = f" ({change:.1f}% ↘️)"
            else:
                trend = " (→)"
        
        print(f"  {i+1}. {version}: {rate}%{trend}")
    
    # Identify the biggest issues to fix
    print("\n🎯 PRIORITY FIXES NEEDED")
    print("=" * 30)
    latest = metrics.history[-1]
    failed_tests = [result for result in latest.test_results if not result.passed]
    
    for test in failed_tests:
        gap = test.expected_range[0] - test.actual_score
        print(f"• {test.test_name}")
        print(f"  Current: {test.actual_score}, Target: {test.expected_range}")
        print(f"  Gap: {gap} points to minimum threshold")
        print(f"  Focus: {test.focus_area}")
        print()

if __name__ == "__main__":
    main()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
