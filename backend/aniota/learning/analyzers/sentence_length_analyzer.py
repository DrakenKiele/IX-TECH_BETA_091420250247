


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("sentence_length_analyzer.py", "system_initialization", "import", "Auto-generated dev log entry")

Sentence Length Analysis for Truth Engine
Analyzes sentence length patterns that correlate with truthfulness vs. deception.
"""

import re
from typing import List, Dict, Tuple
from statistics import mean, median, stdev

class SentenceLengthAnalyzer:
    """Analyzes sentence length patterns to assess truthfulness likelihood."""
    
    def __init__(self):
        # Research-based thresholds for truthful vs. deceptive communication
        self.truth_indicators = {
            'optimal_length_range': (5, 15),  # Words per sentence for natural truth
            'conciseness_bonus_threshold': 8,  # Very concise statements often truthful
            'verbosity_penalty_threshold': 20,  # Overly long sentences suspicious
            'consistency_variance_max': 5.0,  # Low variance indicates natural flow
        }
        
        self.deception_indicators = {
            'over_elaboration_threshold': 25,  # Extremely long sentences
            'nervous_repetition_threshold': 0.3,  # >30% repeated words
            'qualifier_density_max': 0.2,  # Too many hedging words
            'filler_ratio_max': 0.15,  # Too many unnecessary words
        }
        
        # Common filler words that increase in deceptive statements
        self.filler_words = {
            'hedging': ['sort of', 'kind of', 'you know', 'i mean', 'like', 'basically', 'actually', 'really'],
            'qualifiers': ['maybe', 'perhaps', 'possibly', 'probably', 'allegedly', 'supposedly', 'apparently'],
            'intensifiers': ['very', 'really', 'extremely', 'absolutely', 'totally', 'completely', 'definitely'],
            'redundant': ['and stuff', 'and things', 'and all that', 'or whatever', 'and everything']
        }
    
    def split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences, handling various punctuation."""
        # Simple sentence splitting on periods, exclamation marks, question marks
        sentences = re.split(r'[.!?]+', text)
        # Clean up and remove empty sentences
        sentences = [s.strip() for s in sentences if s.strip()]
        return sentences
    
    def count_words_in_sentence(self, sentence: str) -> int:
        """Count meaningful words in a sentence."""
        # Remove punctuation and split on whitespace
        words = re.findall(r'\b\w+\b', sentence.lower())
        return len(words)
    
    def analyze_sentence_lengths(self, text: str) -> Dict:
        """Analyze the length distribution of sentences."""
        sentences = self.split_into_sentences(text)
        
        if not sentences:
            return {
                'sentence_count': 0,
                'analysis': 'No sentences found',
                'length_score': 0.5
            }
        
        # Calculate word counts for each sentence
        word_counts = [self.count_words_in_sentence(s) for s in sentences]
        
        # Calculate statistics
        total_words = sum(word_counts)
        avg_length = mean(word_counts)
        median_length = median(word_counts)
        
        # Calculate variance if we have multiple sentences
        length_variance = stdev(word_counts) if len(word_counts) > 1 else 0
        
        # Find longest and shortest sentences
        max_length = max(word_counts)
        min_length = min(word_counts)
        
        return {
            'sentence_count': len(sentences),
            'word_counts': word_counts,
            'total_words': total_words,
            'avg_length': avg_length,
            'median_length': median_length,
            'length_variance': length_variance,
            'max_length': max_length,
            'min_length': min_length,
            'sentences': sentences
        }
    
    def detect_filler_density(self, text: str) -> Dict:
        """Detect density of filler words that increase in deceptive statements."""
        text_lower = text.lower()
        total_words = len(re.findall(r'\b\w+\b', text_lower))
        
        if total_words == 0:
            return {'filler_ratio': 0, 'filler_analysis': 'No words found'}
        
        filler_count = 0
        filler_details = {}
        
        for category, words in self.filler_words.items():
            category_count = 0
            for filler in words:
                count = len(re.findall(r'\b' + re.escape(filler) + r'\b', text_lower))
                if count > 0:
                    category_count += count
            filler_count += category_count
            filler_details[category] = category_count
        
        filler_ratio = filler_count / total_words
        
        return {
            'filler_ratio': filler_ratio,
            'filler_count': filler_count,
            'total_words': total_words,
            'filler_details': filler_details,
            'filler_analysis': f"Filler ratio: {filler_ratio:.1%}"
        }
    
    def calculate_length_truthfulness_score(self, length_analysis: Dict, filler_analysis: Dict) -> Dict:
        """Calculate truthfulness score based on sentence length patterns."""
        if length_analysis['sentence_count'] == 0:
            return {'length_score': 0, 'analysis': 'No sentences to analyze'}
        
        score = 0.5  # Start with neutral score
        analysis_notes = []
        
        avg_length = length_analysis['avg_length']
        max_length = length_analysis['max_length']
        variance = length_analysis['length_variance']
        filler_ratio = filler_analysis['filler_ratio']
        
        # Bonus for optimal length range
        if self.truth_indicators['optimal_length_range'][0] <= avg_length <= self.truth_indicators['optimal_length_range'][1]:
            score += 0.2
            analysis_notes.append(f"Good average length ({avg_length:.1f} words)")
        
        # Bonus for conciseness
        if avg_length <= self.truth_indicators['conciseness_bonus_threshold']:
            score += 0.15
            analysis_notes.append("Conciseness bonus")
        
        # Penalty for over-elaboration
        if max_length >= self.deception_indicators['over_elaboration_threshold']:
            score -= 0.3
            analysis_notes.append(f"Over-elaboration penalty (max: {max_length} words)")
        
        # Penalty for excessive verbosity
        if avg_length >= self.truth_indicators['verbosity_penalty_threshold']:
            score -= 0.2
            analysis_notes.append(f"Verbosity penalty (avg: {avg_length:.1f} words)")
        
        # Bonus for consistent sentence lengths (natural flow)
        if variance <= self.truth_indicators['consistency_variance_max']:
            score += 0.1
            analysis_notes.append("Consistent sentence length")
        
        # Penalty for excessive filler words
        if filler_ratio >= self.deception_indicators['filler_ratio_max']:
            penalty = min(0.25, filler_ratio * 0.5)  # Scale penalty with filler ratio
            score -= penalty
            analysis_notes.append(f"Excessive filler words ({filler_ratio:.1%})")
        
        # Normalize score to 0-1 range
        score = max(0, min(1, score))
        
        return {
            'length_score': score,
            'avg_length': avg_length,
            'max_length': max_length,
            'variance': variance,
            'filler_ratio': filler_ratio,
            'analysis_notes': analysis_notes,
            'analysis': f"Length-based truthfulness: {score:.1%}"
        }
    
    def analyze_length_truth_score(self, text: str) -> Dict:
        """Main method to analyze sentence length patterns for truth scoring."""
        print(f"\n📏 SENTENCE LENGTH ANALYSIS")
        print(f"Text: '{text}'")
        print("=" * 50)
        
        # Analyze sentence lengths
        length_analysis = self.analyze_sentence_lengths(text)
        
        if length_analysis['sentence_count'] == 0:
            return {
                'length_score': 0,
                'analysis': 'No sentences found'
            }
        
        print(f"Sentences: {length_analysis['sentence_count']}")
        print(f"Word counts: {length_analysis['word_counts']}")
        print(f"Average length: {length_analysis['avg_length']:.1f} words")
        print(f"Median length: {length_analysis['median_length']:.1f} words")
        print(f"Length variance: {length_analysis['length_variance']:.1f}")
        print(f"Range: {length_analysis['min_length']}-{length_analysis['max_length']} words")
        
        # Analyze filler word density
        filler_analysis = self.detect_filler_density(text)
        print(f"Filler word ratio: {filler_analysis['filler_ratio']:.1%}")
        
        if filler_analysis['filler_details']:
            print("Filler breakdown:")
            for category, count in filler_analysis['filler_details'].items():
                if count > 0:
                    print(f"  {category}: {count}")
        
        # Calculate truthfulness score
        truth_result = self.calculate_length_truthfulness_score(length_analysis, filler_analysis)
        
        print(f"Analysis notes: {truth_result['analysis_notes']}")
        
        # Convert to percentage
        length_score = truth_result['length_score'] * 100
        
        print(f"Length Truth Score: {length_score:.1f}%")
        
        return {
            'length_score': length_score,
            'length_analysis': length_analysis,
            'filler_analysis': filler_analysis,
            'truth_result': truth_result,
            'analysis': f"Length-based truthfulness: {length_score:.1f}%"
        }

def test_sentence_length_patterns():
    """Test the sentence length analyzer."""
    analyzer = SentenceLengthAnalyzer()
    
    test_statements = [
        # Short, truthful statements
        "It's raining. The meeting is at 3pm.",
        
        # Longer, potentially deceptive statements
        "Well, you know, it's kind of raining out there, sort of heavily actually, which is really why I'm running a bit late to our very important meeting that's scheduled for 3pm sharp.",
        
        # Medium complexity
        "The weather report shows rain expected throughout the afternoon. Our meeting remains scheduled for 3pm in the conference room.",
        
        # Over-elaborated (suspicious)
        "I was definitely at home last night, just watching television like I always do on weekdays, you know, the usual routine stuff, basically just relaxing and taking it easy, nothing special or unusual happening at all.",
        
        # Concise truth
        "I was at home watching TV.",
        
        # Mixed length patterns
        "The experiment failed. We need to adjust the temperature settings and recalibrate the equipment. This will delay results by two days."
    ]
    
    for text in test_statements:
        result = analyzer.analyze_length_truth_score(text)
        print()

if __name__ == "__main__":
    test_sentence_length_patterns()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
