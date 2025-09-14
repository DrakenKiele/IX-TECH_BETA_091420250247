


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("ai_detection_analyzer.py", "system_initialization", "import", "Auto-generated dev log entry")

AI-Generated Text Detection for Truth Engine
Analyzes linguistic patterns that indicate AI-generated vs. human-generated content.
"""

import re
from typing import List, Dict, Tuple, Set
from collections import Counter

class AIDetectionAnalyzer:
    """Analyzes text patterns to detect AI-generated content vs. human writing."""
    
    def __init__(self):
        # Phrases commonly used by AI systems
        self.ai_signatures = {
            'formal_openings': [
                'i would be happy to', 'i am happy to', 'i\'d be glad to', 'i would like to',
                'it is important to note', 'it should be noted', 'it is worth noting',
                'i understand that', 'i appreciate that', 'thank you for'
            ],
            'hedge_phrases': [
                'it appears that', 'it seems that', 'it would seem', 'one might say',
                'it could be argued', 'it is possible that', 'there is a possibility',
                'it may be the case', 'one could consider', 'it is likely that'
            ],
            'structured_language': [
                'there are several', 'here are some', 'consider the following',
                'in summary', 'to summarize', 'in conclusion', 'furthermore',
                'additionally', 'moreover', 'however', 'nevertheless'
            ],
            'diplomatic_phrases': [
                'while it is true', 'on the other hand', 'it is understandable',
                'from one perspective', 'alternatively', 'it depends on',
                'there are various factors', 'it is a complex issue'
            ],
            'assistance_language': [
                'i can help', 'i am here to help', 'feel free to', 'please let me know',
                'if you have any questions', 'i hope this helps', 'i aim to provide'
            ]
        }
        
        # Patterns that indicate human vs. AI writing
        self.human_indicators = {
            'contractions': [
                "don't", "won't", "can't", "isn't", "aren't", "wasn't", "weren't",
                "haven't", "hasn't", "hadn't", "wouldn't", "couldn't", "shouldn't",
                "i'm", "you're", "he's", "she's", "it's", "we're", "they're",
                "i'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll"
            ],
            'informal_language': [
                'yeah', 'nah', 'yep', 'nope', 'ok', 'okay', 'sure', 'whatever',
                'anyway', 'kinda', 'sorta', 'gonna', 'wanna', 'gotta'
            ],
            'personal_expressions': [
                'i think', 'i feel', 'i believe', 'in my opinion', 'personally',
                'i guess', 'i suppose', 'i reckon', 'if you ask me'
            ],
            'emotional_language': [
                'amazing', 'awesome', 'terrible', 'horrible', 'fantastic',
                'ridiculous', 'stupid', 'crazy', 'weird', 'funny'
            ]
        }
        
        # AI tends to avoid these human patterns
        self.ai_avoidance_patterns = {
            'strong_opinions': ['definitely', 'absolutely', 'never', 'always', 'completely'],
            'slang': ['cool', 'sweet', 'dude', 'bro', 'sick', 'lit', 'fire'],
            'interruptions': ['um', 'uh', 'er', 'well', 'so', 'like'],
            'abbreviations': ['etc', 'vs', 'ie', 'eg', 'aka', 'fyi', 'btw']
        }
        
        # Sentence structure patterns
        self.ai_structure_patterns = {
            'balanced_sentences': r'(\w+),\s*(\w+),\s*and\s*(\w+)',  # Lists of three
            'qualification_heavy': r'(it\s+(?:appears|seems|may|might|could))',
            'formal_transitions': r'(furthermore|moreover|additionally|however|nevertheless)',
            'numbered_lists': r'^\s*\d+\.',  # Starts with numbers
            'bullet_points': r'^\s*[-•*]',  # Starts with bullets
        }
    
    def count_ai_signatures(self, text: str) -> Dict:
        """Count occurrences of AI-specific phrase patterns."""
        text_lower = text.lower()
        signature_counts = {}
        total_ai_phrases = 0
        
        for category, phrases in self.ai_signatures.items():
            count = 0
            found_phrases = []
            for phrase in phrases:
                phrase_count = len(re.findall(r'\b' + re.escape(phrase) + r'\b', text_lower))
                if phrase_count > 0:
                    count += phrase_count
                    found_phrases.append(phrase)
            
            signature_counts[category] = {
                'count': count,
                'phrases': found_phrases
            }
            total_ai_phrases += count
        
        return {
            'signature_counts': signature_counts,
            'total_ai_phrases': total_ai_phrases
        }
    
    def count_human_indicators(self, text: str) -> Dict:
        """Count occurrences of human-specific language patterns."""
        text_lower = text.lower()
        human_counts = {}
        total_human_indicators = 0
        
        for category, words in self.human_indicators.items():
            count = 0
            found_words = []
            for word in words:
                word_count = len(re.findall(r'\b' + re.escape(word) + r'\b', text_lower))
                if word_count > 0:
                    count += word_count
                    found_words.append(word)
            
            human_counts[category] = {
                'count': count,
                'words': found_words
            }
            total_human_indicators += count
        
        return {
            'human_counts': human_counts,
            'total_human_indicators': total_human_indicators
        }
    
    def analyze_sentence_structure(self, text: str) -> Dict:
        """Analyze sentence structure patterns typical of AI."""
        structure_analysis = {}
        
        for pattern_name, regex in self.ai_structure_patterns.items():
            matches = re.findall(regex, text, re.MULTILINE | re.IGNORECASE)
            structure_analysis[pattern_name] = len(matches)
        
        # Check for overly uniform sentence lengths (AI tendency)
        sentences = re.split(r'[.!?]+', text)
        sentence_lengths = [len(s.split()) for s in sentences if s.strip()]
        
        if len(sentence_lengths) > 1:
            avg_length = sum(sentence_lengths) / len(sentence_lengths)
            # Calculate coefficient of variation (std dev / mean)
            variance = sum((x - avg_length) ** 2 for x in sentence_lengths) / len(sentence_lengths)
            std_dev = variance ** 0.5
            uniformity = std_dev / avg_length if avg_length > 0 else 0
        else:
            uniformity = 0
        
        structure_analysis['sentence_uniformity'] = uniformity
        structure_analysis['avg_sentence_length'] = avg_length if 'avg_length' in locals() else 0
        
        return structure_analysis
    
    def calculate_ai_probability(self, text: str) -> Dict:
        """Calculate the probability that text is AI-generated."""
        word_count = len(re.findall(r'\b\w+\b', text))
        
        if word_count == 0:
            return {'ai_probability': 0.5, 'analysis': 'No words to analyze'}
        
        # Count AI signatures
        ai_analysis = self.count_ai_signatures(text)
        ai_signature_ratio = ai_analysis['total_ai_phrases'] / word_count
        
        # Count human indicators
        human_analysis = self.count_human_indicators(text)
        human_indicator_ratio = human_analysis['total_human_indicators'] / word_count
        
        # Analyze structure
        structure_analysis = self.analyze_sentence_structure(text)
        
        # Calculate base AI probability
        ai_probability = 0.5  # Start neutral
        
        # Increase probability for AI signatures
        ai_probability += min(0.3, ai_signature_ratio * 10)  # Cap at 30% boost
        
        # Decrease probability for human indicators
        ai_probability -= min(0.3, human_indicator_ratio * 5)  # Cap at 30% reduction
        
        # Structural indicators
        formal_transitions = structure_analysis.get('formal_transitions', 0)
        if formal_transitions > 0:
            ai_probability += min(0.1, formal_transitions * 0.05)
        
        numbered_lists = structure_analysis.get('numbered_lists', 0)
        if numbered_lists > 0:
            ai_probability += min(0.1, numbered_lists * 0.03)
        
        # Sentence uniformity (AI tends to be more uniform)
        uniformity = structure_analysis.get('sentence_uniformity', 0)
        if uniformity < 0.3:  # Very uniform sentences
            ai_probability += 0.1
        
        # Normalize to 0-1 range
        ai_probability = max(0, min(1, ai_probability))
        
        return {
            'ai_probability': ai_probability,
            'ai_signature_ratio': ai_signature_ratio,
            'human_indicator_ratio': human_indicator_ratio,
            'ai_analysis': ai_analysis,
            'human_analysis': human_analysis,
            'structure_analysis': structure_analysis,
            'word_count': word_count
        }
    
    def analyze_ai_detection_score(self, text: str) -> Dict:
        """Main method to analyze AI detection patterns."""
        print(f"\n🤖 AI DETECTION ANALYSIS")
        print(f"Text: '{text[:100]}{'...' if len(text) > 100 else ''}'")
        print("=" * 50)
        
        # Calculate AI probability
        result = self.calculate_ai_probability(text)
        
        print(f"Word count: {result['word_count']}")
        print(f"AI signature ratio: {result['ai_signature_ratio']:.3f}")
        print(f"Human indicator ratio: {result['human_indicator_ratio']:.3f}")
        
        # Show specific AI signatures found
        ai_sigs = result['ai_analysis']['signature_counts']
        human_inds = result['human_analysis']['human_counts']
        
        print("\nAI signatures found:")
        for category, data in ai_sigs.items():
            if data['count'] > 0:
                print(f"  {category}: {data['count']} ({', '.join(data['phrases'][:3])})")
        
        print("\nHuman indicators found:")
        for category, data in human_inds.items():
            if data['count'] > 0:
                print(f"  {category}: {data['count']} ({', '.join(data['words'][:3])})")
        
        # Show structural patterns
        struct = result['structure_analysis']
        print(f"\nStructural analysis:")
        print(f"  Formal transitions: {struct.get('formal_transitions', 0)}")
        print(f"  Numbered lists: {struct.get('numbered_lists', 0)}")
        print(f"  Sentence uniformity: {struct.get('sentence_uniformity', 0):.2f}")
        
        # Convert to percentage and classification
        ai_percentage = result['ai_probability'] * 100
        
        if ai_percentage >= 70:
            classification = "Likely AI-generated"
        elif ai_percentage >= 50:
            classification = "Possibly AI-generated"
        elif ai_percentage >= 30:
            classification = "Possibly human-written"
        else:
            classification = "Likely human-written"
        
        print(f"\nAI Detection Score: {ai_percentage:.1f}%")
        print(f"Classification: {classification}")
        
        return {
            'ai_score': ai_percentage,
            'classification': classification,
            'detailed_analysis': result,
            'analysis': f"AI likelihood: {ai_percentage:.1f}% - {classification}"
        }

def test_ai_detection_patterns():
    """Test the AI detection analyzer."""
    analyzer = AIDetectionAnalyzer()
    
    test_texts = [
        # Likely AI-generated
        "I would be happy to assist you with that. It is important to note that there are several factors to consider. Furthermore, it appears that the situation is quite complex and requires careful analysis.",
        
        # Likely human-written
        "Yeah, I can help with that. It's kinda complicated though - there's a bunch of stuff we gotta think about first.",
        
        # Mixed/uncertain
        "The weather today is quite pleasant. However, there might be some rain later in the afternoon.",
        
        # Very AI-like
        "Thank you for your question. I understand that you are seeking information about this topic. It should be noted that there are various perspectives to consider. In summary, the answer depends on several factors.",
        
        # Very human-like
        "Dude, that's crazy! I can't believe it happened. Whatever, I guess we'll figure it out somehow.",
        
        # Professional human writing
        "The quarterly results exceeded expectations. Sales increased by 15% compared to last year, primarily due to improved market conditions."
    ]
    
    for text in test_texts:
        result = analyzer.analyze_ai_detection_score(text)
        print()

if __name__ == "__main__":
    test_ai_detection_patterns()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
