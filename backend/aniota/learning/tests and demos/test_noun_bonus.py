



import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("test_noun_bonus.py", "system_initialization", "import", "Auto-generated dev log entry")

from iterative_keyword_elimination import IterativeKeywordAnalyzer

analyzer = IterativeKeywordAnalyzer()

test_cases = [
    "Gravity makes objects fall down",     # Noun first word
    "Plants use photosynthesis to grow",   # Noun first word
    "Democracy involves citizen voting",   # Noun first word
    "Running is good exercise",            # Verb first word (should not get bonus)
    "Quickly the car moved",               # Adverb first word (should not get bonus)
    "The formula converts temperature",    # Article first word (should not get bonus)
    "Mathematics includes many concepts",  # Noun first word
    "C F 32 5 9",                         # Letter first word (should not get bonus)
]

print("🧪 TESTING NOUN-ONLY FIRST WORD BONUS")
print("=" * 70)

for i, test_case in enumerate(test_cases, 1):
    print(f"\n📊 TEST CASE {i}: '{test_case}'")
    result = analyzer.find_optimal_combination(test_case)
    
    print(f"Weighted Score: {result['weighted_score']}/100")
    print(f"Strongest Words: {result['strongest_words']}")
    
    # Check if first word got bonus
    word_analysis = result['word_analysis']
    first_word = word_analysis.get('first_word', 'None')
    print(f"First word: '{first_word}'")
    
    # Show top word weights
    print("Top word weights:")
    top_words = sorted(word_analysis['word_weights'].items(), 
                      key=lambda x: x[1], reverse=True)[:3]
    for word, weight in top_words:
        print(f"  '{word}': {weight:.1f}")
    
    print("-" * 70)# 2025-09-11 | [XX]    | [Description]                        | [Reason]
