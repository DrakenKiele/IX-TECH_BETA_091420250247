



import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("test_weighted.py", "system_initialization", "import", "Auto-generated dev log entry")

from iterative_keyword_elimination import IterativeKeywordAnalyzer

analyzer = IterativeKeywordAnalyzer()
result = analyzer.find_optimal_combination('C F 32 5 9')
print('Statement: C F 32 5 9')
print(f'Weighted Score: {result["weighted_score"]}/100')
print(f'Strongest Words: {result["strongest_words"]}')# 2025-09-11 | [XX]    | [Description]                        | [Reason]
