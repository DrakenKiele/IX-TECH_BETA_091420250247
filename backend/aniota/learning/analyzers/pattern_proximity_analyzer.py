


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("pattern_proximity_analyzer.py", "system_initialization", "import", "Auto-generated dev log entry")

Pattern Proximity Analysis for Truth Engine
Analyzes word patterns and proximity to score against known patterns.
"""

import re
from typing import List, Dict, Tuple, Optional
from iterative_keyword_elimination import IterativeKeywordAnalyzer

class PatternProximityAnalyzer:
    """Analyzes patterns based on word proximity and known pattern matching."""
    
    def __init__(self):
        self.elimination_analyzer = IterativeKeywordAnalyzer()
        
        # Known scientific/mathematical patterns (simulating internet corpus)
        self.known_patterns = {
            # Temperature conversion patterns
            'temperature_conversion': [
                ['fahrenheit', 'celsius', '32', '5', '9'],
                ['f', 'c', '32', '5', '9'],
                ['celsius', 'fahrenheit', '32', '9', '5'],
                ['c', 'f', '32', '9', '5'],
                ['temperature', 'conversion', '32', 'subtract', 'multiply'],
                ['convert', 'temperature', '32', '5/9', 'formula']
            ],
            # Basic math patterns
            'basic_math': [
                ['addition', 'numbers', 'sum'],
                ['multiply', 'times', 'product'],
                ['subtract', 'minus', 'difference'],
                ['divide', 'quotient', 'fraction']
            ],
            # Science patterns
            'science': [
                ['photosynthesis', 'plants', 'sunlight'],
                ['gravity', 'objects', 'fall'],
                ['atoms', 'electrons', 'protons']
            ]
        }
    
    def extract_word_positions(self, statement: str) -> Dict[str, int]:
        """Extract words and mathematical expressions with positions, filtering out two-letter words."""
        import re
        
        # First, replace commas with "equals" to preserve mathematical sequence meaning
        processed_statement = statement.replace(',', ' equals ')
        
        # Convert written numbers to digits
        number_words = {
            'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
            'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14', 'fifteen': '15',
            'sixteen': '16', 'seventeen': '17', 'eighteen': '18', 'nineteen': '19', 'twenty': '20',
            'thirty': '30', 'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
            'eighty': '80', 'ninety': '90', 'hundred': '100', 'thousand': '1000'
        }
        
        # Convert number words to digits
        for word, digit in number_words.items():
            processed_statement = re.sub(r'\b' + word + r'\b', digit, processed_statement, flags=re.IGNORECASE)
        
        # Convert mathematical operation words to operators when numbers are present
        math_operators = {
            'multiply': '*', 'times': '*', 'multiplied': '*',
            'divide': '/', 'divided': '/', 'division': '/',
            'add': '+', 'plus': '+', 'added': '+', 'addition': '+',
            'subtract': '-', 'minus': '-', 'subtracted': '-', 'subtraction': '-',
            'percent': '%', 'percentage': '%'
        }
        
        # Check if statement contains numbers (digits)
        has_numbers = bool(re.search(r'\d', processed_statement))
        
        if has_numbers:
            # Convert math operation words to symbols
            for word, symbol in math_operators.items():
                processed_statement = re.sub(r'\b' + word + r'\b', symbol, processed_statement, flags=re.IGNORECASE)
        
        # Handle special cases like "eighty five percent" -> "85%"
        processed_statement = re.sub(r'(\d+)\s+(\d+)\s*%', r'\1\2%', processed_statement)
        
        # Find and preserve mathematical expressions
        math_expressions = []
        
        # Pattern for fractions like 5/9, 9/5
        fractions = re.findall(r'\b\d+/\d+\b', processed_statement)
        math_expressions.extend(fractions)
        
        # Pattern for decimals like 2.5, 3.14
        decimals = re.findall(r'\b\d*\.\d+\b', processed_statement)
        math_expressions.extend(decimals)
        
        # Pattern for percentages like 85%, 15%
        percentages = re.findall(r'\b\d+%\b', processed_statement)
        math_expressions.extend(percentages)
        
        # Pattern for operators with numbers like *85, +32, -10
        operators_with_nums = re.findall(r'[+\-*/]\s*\d+%?', processed_statement)
        math_expressions.extend([op.replace(' ', '') for op in operators_with_nums])
        
        # Remove math expressions temporarily to avoid interference
        temp_statement = processed_statement.lower()
        for expr in math_expressions:
            temp_statement = temp_statement.replace(expr.lower(), ' ')
        
        # Extract regular words (3+ characters)
        words = re.findall(r'\b[a-zA-Z]+\b', temp_statement)
        words = [word for word in words if len(word) > 2]
        
        # Combine words and math expressions
        all_tokens = words + math_expressions
        
        # Create position mapping
        positions = {}
        for i, token in enumerate(all_tokens):
            positions[token] = i
            
        return positions
    
    def calculate_proximity_score(self, strongest_words: List[str], word_positions: Dict[str, int]) -> Dict:
        """Calculate proximity score based on word spacing in original statement."""
        if len(strongest_words) < 2:
            return {'proximity_score': 0, 'spacing_analysis': {}}
        
        # Get positions of strongest words
        positions = []
        for word in strongest_words:
            if word in word_positions:
                positions.append(word_positions[word])
        
        if len(positions) < 2:
            return {'proximity_score': 0, 'spacing_analysis': {}}
        
        positions.sort()
        
        # Calculate spacing between consecutive strong words
        spacings = []
        for i in range(len(positions) - 1):
            spacing = positions[i + 1] - positions[i]
            spacings.append(spacing)
        
        # Score based on spacing (closer = better, but not too close)
        # Ideal spacing is 1-3 words apart
        spacing_scores = []
        for spacing in spacings:
            if spacing == 1:  # Adjacent
                spacing_scores.append(1.0)
            elif spacing <= 3:  # Close
                spacing_scores.append(0.8)
            elif spacing <= 5:  # Moderate
                spacing_scores.append(0.5)
            else:  # Far apart
                spacing_scores.append(0.2)
        
        avg_proximity_score = sum(spacing_scores) / len(spacing_scores) if spacing_scores else 0
        
        return {
            'proximity_score': round(avg_proximity_score * 100, 1),
            'spacing_analysis': {
                'positions': dict(zip(strongest_words, [word_positions.get(w, -1) for w in strongest_words])),
                'spacings': spacings,
                'spacing_scores': spacing_scores
            }
        }
    
    def find_pattern_matches(self, strongest_words: List[str]) -> Dict:
        """Find how many known patterns match the strongest words."""
        matches = []
        total_pattern_score = 0
        
        for category, patterns in self.known_patterns.items():
            category_matches = 0
            
            for pattern in patterns:
                # Count how many strongest words appear in this pattern
                word_matches = sum(1 for word in strongest_words if word in pattern)
                
                if word_matches > 0:
                    # Calculate match percentage
                    match_percentage = word_matches / len(strongest_words)
                    
                    if match_percentage >= 0.5:  # At least 50% of strong words match
                        category_matches += 1
                        total_pattern_score += match_percentage
                        
                        matches.append({
                            'category': category,
                            'pattern': pattern,
                            'matching_words': [w for w in strongest_words if w in pattern],
                            'match_percentage': round(match_percentage * 100, 1)
                        })
        
        return {
            'pattern_matches': matches,
            'total_matches': len(matches),
            'pattern_score': round(min(100, total_pattern_score * 50), 1)  # Scale to 0-100
        }
    
    def analyze_statement_pattern(self, statement: str) -> Dict:
        """Complete pattern analysis combining elimination + proximity + pattern matching."""
        print(f"\n🔍 PATTERN PROXIMITY ANALYSIS")
        print(f"Statement: '{statement}'")
        print("=" * 60)
        
        # Step 1: Get strongest words from elimination
        elimination_result = self.elimination_analyzer.find_optimal_combination(statement)
        strongest_words = elimination_result['strongest_words']
        
        print(f"\n1️⃣ STRONGEST WORDS FROM ELIMINATION")
        print(f"Words: {strongest_words}")
        
        # Step 2: Analyze word positions and proximity
        word_positions = self.extract_word_positions(statement)
        proximity_analysis = self.calculate_proximity_score(strongest_words, word_positions)
        
        print(f"\n2️⃣ PROXIMITY ANALYSIS")
        print(f"Word positions: {proximity_analysis['spacing_analysis']['positions']}")
        print(f"Spacings: {proximity_analysis['spacing_analysis']['spacings']}")
        print(f"Proximity score: {proximity_analysis['proximity_score']}/100")
        
        # Step 3: Find pattern matches
        pattern_analysis = self.find_pattern_matches(strongest_words)
        
        print(f"\n3️⃣ PATTERN MATCHING")
        print(f"Total pattern matches: {pattern_analysis['total_matches']}")
        print(f"Pattern score: {pattern_analysis['pattern_score']}/100")
        
        if pattern_analysis['pattern_matches']:
            for match in pattern_analysis['pattern_matches']:
                print(f"  📋 {match['category']}: {match['matching_words']} "
                      f"({match['match_percentage']}% match)")
        
        # Step 4: Calculate final combined score
        elimination_score = elimination_result['weighted_score']
        proximity_score = proximity_analysis['proximity_score']
        pattern_score = pattern_analysis['pattern_score']
        
        # Weighted combination (you can adjust these weights)
        final_score = (
            elimination_score * 0.4 +  # 40% weight on word strength
            proximity_score * 0.3 +    # 30% weight on proximity
            pattern_score * 0.3         # 30% weight on pattern matching
        )
        
        print(f"\n🎯 FINAL SCORING")
        print(f"Elimination score: {elimination_score}/100 (40% weight)")
        print(f"Proximity score: {proximity_score}/100 (30% weight)")
        print(f"Pattern score: {pattern_score}/100 (30% weight)")
        print(f"Final combined score: {round(final_score, 1)}/100")
        
        return {
            'statement': statement,
            'strongest_words': strongest_words,
            'elimination_score': elimination_score,
            'proximity_score': proximity_score,
            'pattern_score': pattern_score,
            'final_score': round(final_score, 1),
            'word_positions': word_positions,
            'pattern_matches': pattern_analysis['pattern_matches']
        }

def test_pattern_analysis():
    """Test the pattern proximity analysis on temperature conversion examples."""
    analyzer = PatternProximityAnalyzer()
    
    test_cases = [
        "C F 32 5 9",
        "C F 9 5 32", 
        "F C 5 9 32",
        "F C 32 5 9",
        "Plants use photosynthesis to make food",
        "Gravity makes objects fall down"
    ]
    
    print("🧪 PATTERN PROXIMITY ANALYSIS TEST")
    print("=" * 70)
    
    results = []
    
    for test_case in test_cases:
        result = analyzer.analyze_statement_pattern(test_case)
        results.append(result)
        print("-" * 70)
    
    # Summary
    print(f"\n📊 RESULTS SUMMARY")
    print("=" * 70)
    print(f"{'Statement':<35} {'Final Score':<12} {'Strongest Words'}")
    print("-" * 70)
    
    for result in results:
        statement = result['statement'][:32] + "..." if len(result['statement']) > 32 else result['statement']
        words_str = ', '.join(result['strongest_words'][:4])  # Show top 4
        print(f"{statement:<35} {result['final_score']:<12} {words_str}")

if __name__ == "__main__":
    test_pattern_analysis()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
