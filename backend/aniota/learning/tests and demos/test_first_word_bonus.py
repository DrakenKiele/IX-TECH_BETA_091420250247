



import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("test_first_word_bonus.py", "system_initialization", "import", "Auto-generated dev log entry")

from iterative_keyword_elimination import IterativeKeywordAnalyzer

analyzer = IterativeKeywordAnalyzer()

test_cases = [
    "Gravity makes objects fall down",
    "Plants use photosynthesis to make food", 
    "C F 32 5 9",  # Non-meaningful first word
    "The formula for temperature conversion"  # Connective first word
]

print("🧪 TESTING FIRST WORD BONUS")
print("=" * 60)

for i, test_case in enumerate(test_cases, 1):
    print(f"\n📊 TEST CASE {i}: '{test_case}'")
    result = analyzer.find_optimal_combination(test_case)
    
    print(f"Weighted Score: {result['weighted_score']}/100")
    print(f"Strongest Words: {result['strongest_words']}")
    
    # Show word analysis
    word_analysis = result['word_analysis']
    print(f"First word detected: '{word_analysis.get('first_word', 'None')}'")
    print("Word weights:")
    
    for word, weight in sorted(word_analysis['word_weights'].items(), 
                             key=lambda x: x[1], reverse=True):
        print(f"  '{word}': {weight:.1f}")
    
    print("-" * 60)# 2025-09-11 | [XX]    | [Description]                        | [Reason]
