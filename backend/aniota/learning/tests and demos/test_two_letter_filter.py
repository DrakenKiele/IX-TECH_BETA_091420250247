


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("test_two_letter_filter.py", "system_initialization", "import", "Auto-generated dev log entry")

Test the effect of eliminating two-letter words from the analysis.
"""

from iterative_keyword_elimination import IterativeKeywordAnalyzer
from pattern_proximity_analyzer import PatternProximityAnalyzer

def test_two_letter_filtering():
    """Test how filtering two-letter words affects the analysis."""
    
    analyzer = IterativeKeywordAnalyzer()
    pattern_analyzer = PatternProximityAnalyzer()
    
    # Test statements with various two-letter words
    test_statements = [
        "To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9",
        "In space no one can hear you scream",
        "The cat is on the mat",
        "An AI or ML system can do this",
        "Go to the store if you want to buy it",
        "At my house we eat ice cream"
    ]
    
    print("🔍 TESTING TWO-LETTER WORD FILTERING")
    print("=" * 60)
    
    for i, statement in enumerate(test_statements, 1):
        print(f"\n--- Test {i} ---")
        print(f"Statement: '{statement}'")
        
        # Show which words are extracted (should exclude 2-letter words)
        extracted_words = analyzer.extract_all_words(statement)
        print(f"Extracted words (>2 letters): {extracted_words}")
        
        # Show word positions (should also exclude 2-letter words)  
        word_positions = pattern_analyzer.extract_word_positions(statement)
        print(f"Word positions: {word_positions}")
        
        # Run pattern analysis
        result = pattern_analyzer.analyze_statement_pattern(statement)
        print(f"Final Score: {result['final_score']:.1f}%")
        print(f"Components - Elimination: {result['elimination_score']:.1f}%, "
              f"Proximity: {result['proximity_score']:.1f}%, "
              f"Pattern: {result['pattern_score']:.1f}%")

if __name__ == "__main__":
    test_two_letter_filtering()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
