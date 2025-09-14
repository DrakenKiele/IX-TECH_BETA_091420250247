


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("homophone_pattern_analyzer.py", "system_initialization", "import", "Auto-generated dev log entry")

Homophone Pattern Analysis for Truth Engine
Analyzes homophone usage patterns to detect understanding vs. memorization/confusion.
"""

import re
from typing import List, Dict, Tuple, Set
from difflib import SequenceMatcher

class HomophonePatternAnalyzer:
    """Analyzes homophone and near-homophone patterns to assess genuine understanding."""
    
    def __init__(self):
        # Common homophones that often indicate confusion when misused
        self.homophones = {
            'rain': ['reign', 'rein'],
            'reign': ['rain', 'rein'],
            'rein': ['rain', 'reign'],
            'plain': ['plane'],
            'plane': ['plain'],
            'main': ['mane', 'maine'],
            'mane': ['main', 'maine'],
            'there': ['their', 'they\'re'],
            'their': ['there', 'they\'re'],
            'they\'re': ['there', 'their'],
            'to': ['too', 'two'],
            'too': ['to', 'two'],
            'two': ['to', 'too'],
            'your': ['you\'re'],
            'you\'re': ['your'],
            'its': ['it\'s'],
            'it\'s': ['its'],
            'affect': ['effect'],
            'effect': ['affect'],
            'accept': ['except'],
            'except': ['accept'],
            'principal': ['principle'],
            'principle': ['principal'],
            'lose': ['loose'],
            'loose': ['lose'],
            'break': ['brake'],
            'brake': ['break'],
            'write': ['right', 'rite', 'wright'],
            'right': ['write', 'rite', 'wright'],
            'site': ['sight', 'cite'],
            'sight': ['site', 'cite'],
            'cite': ['site', 'sight']
        }
        
        # Technical/scientific homophones that indicate domain knowledge
        self.technical_homophones = {
            'complementary': ['complimentary'],
            'complimentary': ['complementary'],
            'discrete': ['discreet'],
            'discreet': ['discrete'],
            'stationary': ['stationery'],
            'stationery': ['stationary'],
            'capitol': ['capital'],
            'capital': ['capitol'],
            'council': ['counsel'],
            'counsel': ['council'],
            'elicit': ['illicit'],
            'illicit': ['elicit']
        }
        
        # Context patterns that help identify correct vs incorrect usage
        self.context_patterns = {
            'rain': {
                'correct_contexts': ['weather', 'water', 'storm', 'clouds', 'wet', 'umbrella', 'falls', 'drops'],
                'incorrect_contexts': ['king', 'queen', 'royal', 'throne', 'rules', 'monarchy']
            },
            'reign': {
                'correct_contexts': ['king', 'queen', 'royal', 'throne', 'rules', 'monarchy', 'empire', 'ruler'],
                'incorrect_contexts': ['weather', 'water', 'storm', 'clouds', 'wet', 'umbrella']
            },
            'plain': {
                'correct_contexts': ['simple', 'clear', 'obvious', 'field', 'flat', 'land', 'prairie'],
                'incorrect_contexts': ['airplane', 'flight', 'pilot', 'aviation', 'sky', 'flying']
            },
            'plane': {
                'correct_contexts': ['airplane', 'flight', 'pilot', 'aviation', 'sky', 'flying', 'geometry', 'surface'],
                'incorrect_contexts': ['simple', 'clear', 'obvious', 'field']
            }
        }
    
    def extract_potential_homophones(self, statement: str) -> List[str]:
        """Extract words that have known homophones."""
        words = re.findall(r'\b[a-zA-Z\']+\b', statement.lower())
        potential_homophones = []
        
        for word in words:
            if word in self.homophones or word in self.technical_homophones:
                potential_homophones.append(word)
        
        return potential_homophones
    
    def analyze_homophone_context(self, word: str, statement: str) -> Dict:
        """Analyze if a homophone is used correctly in context."""
        statement_lower = statement.lower()
        
        if word not in self.context_patterns:
            return {'context_score': 0.5, 'analysis': 'No context patterns available'}
        
        correct_contexts = self.context_patterns[word]['correct_contexts']
        incorrect_contexts = self.context_patterns[word]['incorrect_contexts']
        
        correct_matches = sum(1 for context in correct_contexts if context in statement_lower)
        incorrect_matches = sum(1 for context in incorrect_contexts if context in statement_lower)
        
        if correct_matches > 0 and incorrect_matches == 0:
            context_score = 1.0
            analysis = f"Correct context for '{word}'"
        elif incorrect_matches > 0 and correct_matches == 0:
            context_score = 0.0
            analysis = f"Incorrect context for '{word}' - suggests confusion"
        elif correct_matches > incorrect_matches:
            context_score = 0.7
            analysis = f"Mostly correct context for '{word}'"
        elif incorrect_matches > correct_matches:
            context_score = 0.3
            analysis = f"Mostly incorrect context for '{word}'"
        else:
            context_score = 0.5
            analysis = f"Ambiguous context for '{word}'"
        
        return {
            'context_score': context_score,
            'correct_matches': correct_matches,
            'incorrect_matches': incorrect_matches,
            'analysis': analysis
        }
    
    def detect_sound_pattern_errors(self, statement: str) -> List[Dict]:
        """Detect patterns that suggest audio-based errors or confusion."""
        errors = []
        
        # Look for phonetically similar but semantically wrong patterns
        phonetic_error_patterns = [
            (r'\brein\b', 'rein', 'Did you mean "rain" or "reign"?'),
            (r'\bspane\b', 'spane', 'Did you mean "Spain"?'),
            (r'\bmanely\b', 'manely', 'Did you mean "mainly"?'),
            (r'\bthere\s+car\b', 'there car', 'Did you mean "their car"?'),
            (r'\byour\s+right\b', 'your right', 'Did you mean "you\'re right"?'),
            (r'\bits\s+time\b', 'its time', 'Did you mean "it\'s time"?')
        ]
        
        for pattern, error_text, suggestion in phonetic_error_patterns:
            matches = re.findall(pattern, statement, re.IGNORECASE)
            if matches:
                errors.append({
                    'error_type': 'phonetic_confusion',
                    'detected_text': error_text,
                    'suggestion': suggestion,
                    'confidence': 0.8
                })
        
        return errors
    
    def calculate_homophone_accuracy(self, statement: str) -> Dict:
        """Calculate overall homophone usage accuracy."""
        potential_homophones = self.extract_potential_homophones(statement)
        
        if not potential_homophones:
            return {
                'accuracy_score': 1.0,
                'analysis': 'No homophones detected',
                'homophone_count': 0
            }
        
        total_score = 0
        detailed_analysis = []
        
        for word in potential_homophones:
            context_result = self.analyze_homophone_context(word, statement)
            total_score += context_result['context_score']
            detailed_analysis.append({
                'word': word,
                'context_score': context_result['context_score'],
                'analysis': context_result['analysis']
            })
        
        accuracy_score = total_score / len(potential_homophones)
        
        # Detect sound pattern errors
        sound_errors = self.detect_sound_pattern_errors(statement)
        
        # Penalize for sound pattern errors
        if sound_errors:
            error_penalty = len(sound_errors) * 0.2
            accuracy_score = max(0, accuracy_score - error_penalty)
        
        return {
            'accuracy_score': accuracy_score,
            'homophone_count': len(potential_homophones),
            'detailed_analysis': detailed_analysis,
            'sound_errors': sound_errors,
            'analysis': f"Homophone accuracy: {accuracy_score:.1%}"
        }
    
    def analyze_homophone_truth_score(self, statement: str) -> Dict:
        """Main method to analyze homophone patterns for truth scoring."""
        print(f"\n🔤 HOMOPHONE PATTERN ANALYSIS")
        print(f"Statement: '{statement}'")
        print("=" * 50)
        
        # Calculate homophone accuracy
        accuracy_result = self.calculate_homophone_accuracy(statement)
        
        print(f"Homophones detected: {accuracy_result['homophone_count']}")
        
        if accuracy_result['detailed_analysis']:
            for analysis in accuracy_result['detailed_analysis']:
                print(f"  '{analysis['word']}': {analysis['context_score']:.1f} - {analysis['analysis']}")
        
        if accuracy_result['sound_errors']:
            print("Sound pattern errors detected:")
            for error in accuracy_result['sound_errors']:
                print(f"  {error['suggestion']}")
        
        # Convert to percentage
        homophone_score = accuracy_result['accuracy_score'] * 100
        
        print(f"Homophone Truth Score: {homophone_score:.1f}%")
        
        return {
            'homophone_score': homophone_score,
            'accuracy_analysis': accuracy_result,
            'analysis': f"Homophone accuracy: {homophone_score:.1f}%"
        }

def test_homophone_patterns():
    """Test the homophone pattern analyzer."""
    analyzer = HomophonePatternAnalyzer()
    
    test_statements = [
        "The rain in Spain falls mainly on the plain",
        "The reign in Spane falls manely on the plane",
        "Their going to there house to get they're books",
        "They're going to their house to get their books",
        "The king's reign lasted many years during the storm",
        "I need to brake my car before the right turn",
        "I need to break my car before the right turn"
    ]
    
    for statement in test_statements:
        result = analyzer.analyze_homophone_truth_score(statement)
        print()

if __name__ == "__main__":
    test_homophone_patterns()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
