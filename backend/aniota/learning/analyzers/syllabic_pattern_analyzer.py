


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("syllabic_pattern_analyzer.py", "system_initialization", "import", "Auto-generated dev log entry")

Syllabic Pattern Analysis for Truth Engine
Analyzes syllabic rhythms and patterns that correlate with truthful statements.
"""

import re
from typing import List, Dict, Tuple

class SyllabicPatternAnalyzer:
    """Analyzes syllabic patterns in statements to assess naturalness and truth likelihood."""
    
    def __init__(self):
        # Common vowel patterns for syllable counting
        self.vowel_groups = re.compile(r'[aeiouy]+', re.IGNORECASE)
        
        # Natural syllabic patterns that tend to appear in truthful statements
        self.natural_patterns = {
            'scientific_facts': {
                'pattern': [2, 3, 2, 1],  # "Water boils at one hundred"
                'weight': 0.8
            },
            'mathematical_facts': {
                'pattern': [1, 2, 2, 1],  # "Two plus two equals four"
                'weight': 0.9
            },
            'balanced_rhythm': {
                'pattern': [2, 2, 2, 2],  # Consistent rhythm
                'weight': 0.7
            },
            'simple_facts': {
                'pattern': [1, 1, 1, 1],  # "The sun is hot"
                'weight': 0.6
            }
        }
        
        # Awkward patterns that often indicate fabrication
        self.awkward_patterns = {
            'inconsistent_rhythm': {
                'variance_threshold': 3.0,  # High syllable variance
                'penalty': -0.5
            },
            'overly_complex': {
                'average_threshold': 4.0,  # Too many long words
                'penalty': -0.3
            },
            'monotonous': {
                'same_syllable_ratio': 0.8,  # 80% same syllable count
                'penalty': -0.4
            }
        }
    
    def count_syllables(self, word: str) -> int:
        """Count syllables in a word using vowel groups."""
        if not word or len(word) <= 2:
            return 1
        
        # Remove silent 'e' at the end
        word = re.sub(r'e$', '', word, flags=re.IGNORECASE)
        
        # Count vowel groups
        vowel_groups = self.vowel_groups.findall(word)
        syllable_count = len(vowel_groups)
        
        # Minimum of 1 syllable per word
        return max(1, syllable_count)
    
    def extract_syllable_pattern(self, statement: str) -> List[int]:
        """Extract syllable pattern from a statement."""
        # Clean the statement and extract words
        words = re.findall(r'\b[a-zA-Z]+\b', statement.lower())
        
        # Filter out very short words (already done in main analyzer)
        meaningful_words = [word for word in words if len(word) > 2]
        
        # Count syllables for each word
        syllable_pattern = [self.count_syllables(word) for word in meaningful_words]
        
        return syllable_pattern
    
    def calculate_pattern_naturalness(self, syllable_pattern: List[int]) -> Dict:
        """Calculate how natural the syllabic pattern is."""
        if len(syllable_pattern) < 2:
            return {'naturalness_score': 0.5, 'pattern_type': 'too_short'}
        
        # Calculate basic statistics
        total_syllables = sum(syllable_pattern)
        avg_syllables = total_syllables / len(syllable_pattern)
        
        # Calculate variance (measure of rhythm consistency)
        variance = sum((x - avg_syllables) ** 2 for x in syllable_pattern) / len(syllable_pattern)
        
        # Check for monotony (too many words with same syllable count)
        most_common_count = max(set(syllable_pattern), key=syllable_pattern.count)
        same_syllable_ratio = syllable_pattern.count(most_common_count) / len(syllable_pattern)
        
        # Start with lower base score - must earn points
        naturalness_score = 0.2
        pattern_analysis = []
        
        # More restrictive natural pattern matching
        pattern_matches = 0
        for pattern_name, pattern_data in self.natural_patterns.items():
            if len(syllable_pattern) >= len(pattern_data['pattern']):
                # Check if pattern matches (stricter tolerance)
                match_score = self._calculate_pattern_match(
                    syllable_pattern[:len(pattern_data['pattern'])], 
                    pattern_data['pattern']
                )
                if match_score > 0.8:  # Stricter match requirement
                    naturalness_score += pattern_data['weight'] * match_score * 0.3  # Reduced weight
                    pattern_analysis.append(f"Matches {pattern_name}")
                    pattern_matches += 1
        
        # Bonus for optimal rhythm (variance between 0.2 and 1.0)
        if 0.2 <= variance <= 1.0:
            naturalness_score += 0.2
            pattern_analysis.append("Good rhythmic variance")
        
        # Bonus for balanced syllable distribution
        if 0.3 <= same_syllable_ratio <= 0.7:  # Not too monotonous, not too chaotic
            naturalness_score += 0.15
            pattern_analysis.append("Balanced syllable distribution")
        
        # Penalties for awkward patterns (stricter)
        if variance > 2.0:  # Lowered threshold
            naturalness_score += self.awkward_patterns['inconsistent_rhythm']['penalty']
            pattern_analysis.append("Inconsistent rhythm penalty")
        
        if avg_syllables > 3.0:  # Lowered threshold
            naturalness_score += self.awkward_patterns['overly_complex']['penalty']
            pattern_analysis.append("Overly complex vocabulary penalty")
        
        if same_syllable_ratio > 0.8:
            naturalness_score += self.awkward_patterns['monotonous']['penalty']
            pattern_analysis.append("Monotonous pattern penalty")
        
        # Penalty for too many pattern matches (suspicious over-matching)
        if pattern_matches > 2:
            naturalness_score -= 0.3
            pattern_analysis.append("Suspicious over-pattern-matching penalty")
        
        # Normalize score to 0-1 range
        naturalness_score = max(0, min(1, naturalness_score))
        
        return {
            'naturalness_score': naturalness_score,
            'syllable_pattern': syllable_pattern,
            'avg_syllables': avg_syllables,
            'variance': variance,
            'same_syllable_ratio': same_syllable_ratio,
            'pattern_analysis': pattern_analysis,
            'pattern_matches': pattern_matches,
            'pattern_type': 'analyzed'
        }
    
    def _calculate_pattern_match(self, actual: List[int], expected: List[int]) -> float:
        """Calculate how well actual pattern matches expected pattern."""
        if len(actual) != len(expected):
            return 0.0
        
        total_diff = sum(abs(a - e) for a, e in zip(actual, expected))
        max_possible_diff = len(expected) * 3  # Assuming max 3 syllable difference per word
        
        match_score = 1.0 - (total_diff / max_possible_diff)
        return max(0.0, match_score)
    
    def analyze_syllabic_truth_score(self, statement: str) -> Dict:
        """Main method to analyze syllabic patterns for truth scoring."""
        print(f"\n🎵 SYLLABIC PATTERN ANALYSIS")
        print(f"Statement: '{statement}'")
        print("=" * 50)
        
        # Extract syllable pattern
        syllable_pattern = self.extract_syllable_pattern(statement)
        
        if not syllable_pattern:
            return {
                'syllabic_score': 0,
                'analysis': 'No meaningful words found'
            }
        
        print(f"Syllable pattern: {syllable_pattern}")
        
        # Calculate naturalness
        naturalness_result = self.calculate_pattern_naturalness(syllable_pattern)
        
        print(f"Average syllables per word: {naturalness_result['avg_syllables']:.1f}")
        print(f"Pattern variance: {naturalness_result['variance']:.2f}")
        print(f"Same syllable ratio: {naturalness_result['same_syllable_ratio']:.2f}")
        print(f"Pattern analysis: {naturalness_result['pattern_analysis']}")
        
        # Convert to percentage
        syllabic_score = naturalness_result['naturalness_score'] * 100
        
        print(f"Syllabic Truth Score: {syllabic_score:.1f}%")
        
        return {
            'syllabic_score': syllabic_score,
            'syllable_pattern': syllable_pattern,
            'naturalness_analysis': naturalness_result,
            'analysis': f"Syllabic naturalness: {syllabic_score:.1f}%"
        }

def test_syllabic_patterns():
    """Test the syllabic pattern analyzer."""
    analyzer = SyllabicPatternAnalyzer()
    
    test_statements = [
        "Water boils at one hundred degrees Celsius",
        "The Earth revolves around the Sun every year",
        "Two plus two equals four exactly",
        "Purple elephants dance backwards on Tuesdays regularly",
        "Gravity makes all objects fall upward consistently",
        "The mitochondria is the powerhouse of the cell"
    ]
    
    for statement in test_statements:
        result = analyzer.analyze_syllabic_truth_score(statement)
        print()

if __name__ == "__main__":
    test_syllabic_patterns()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
