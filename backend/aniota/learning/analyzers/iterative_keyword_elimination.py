


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("iterative_keyword_elimination.py", "system_initialization", "import", "Auto-generated dev log entry")

Iterative Keyword Elimination for Truth Engine
Uses recursive search-and-remove to find optimal keyword combinations.
"""

import sys
import os
from typing import List, Dict, Tuple, Set
from itertools import combinations

sys.path.append(os.path.dirname(__file__))

try:
    from truth_engine import TruthEngine
    from hard_coded_knowledge import HardCodedKnowledgeBase
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

class IterativeKeywordAnalyzer:
    """Analyzes statements by iteratively removing least correlated keywords."""
    
    def __init__(self):
        self.knowledge = HardCodedKnowledgeBase()
        self.engine = TruthEngine(self.knowledge)
        
    def extract_all_words(self, statement: str) -> List[str]:
        """Extract words and mathematical expressions, filtering out two-letter words."""
        import re
        
        # First, replace commas with "equals" to preserve mathematical sequence meaning
        processed_statement = statement.replace(',', ' equals ')
        
        # Convert written numbers to digits (more comprehensive)
        number_words = {
            'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
            'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
            'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14', 'fifteen': '15',
            'sixteen': '16', 'seventeen': '17', 'eighteen': '18', 'nineteen': '19', 'twenty': '20',
            'thirty': '30', 'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
            'eighty': '80', 'ninety': '90', 'hundred': '100', 'thousand': '1000'
        }
        
        # Convert compound numbers like "eighty five" -> "85"
        processed_statement = re.sub(r'\beighty\s+five\b', '85', processed_statement, flags=re.IGNORECASE)
        processed_statement = re.sub(r'\bthirty\s+two\b', '32', processed_statement, flags=re.IGNORECASE)
        processed_statement = re.sub(r'\bfive\s+ninths\b', '5/9', processed_statement, flags=re.IGNORECASE)
        processed_statement = re.sub(r'\bthree\s+point\s+fourteen\b', '3.14', processed_statement, flags=re.IGNORECASE)
        
        # Convert individual number words to digits
        for word, digit in number_words.items():
            processed_statement = re.sub(r'\b' + word + r'\b', digit, processed_statement, flags=re.IGNORECASE)
        
        # Convert mathematical operation words to operators when numbers are present
        math_operators = {
            'multiply': '*', 'times': '*', 'multiplied': '*',
            'divide': '/', 'divided': '/', 'division': '/',
            'add': '+', 'plus': '+', 'added': '+', 'addition': '+',
            'subtract': '-', 'minus': '-', 'subtracted': '-', 'subtraction': '-'
        }
        
        # Check if statement contains numbers (digits)
        has_numbers = bool(re.search(r'\d', processed_statement))
        
        if has_numbers:
            # Convert math operation words to symbols
            for word, symbol in math_operators.items():
                processed_statement = re.sub(r'\b' + word + r'\b', symbol, processed_statement, flags=re.IGNORECASE)
            
            # Convert "percent" to "%" when following numbers
            processed_statement = re.sub(r'(\d+)\s+percent\b', r'\1%', processed_statement, flags=re.IGNORECASE)
        
        # Find and preserve mathematical expressions
        math_expressions = []
        
        # Pattern for percentages like 85%, 15% (do this first)
        percentages = re.findall(r'\d+%', processed_statement)
        math_expressions.extend(percentages)
        
        # Pattern for fractions like 5/9, 9/5
        fractions = re.findall(r'\d+/\d+', processed_statement)
        math_expressions.extend(fractions)
        
        # Pattern for decimals like 2.5, 3.14
        decimals = re.findall(r'\d*\.\d+', processed_statement)
        math_expressions.extend(decimals)
        
        # Pattern for standalone operators * / + -
        standalone_operators = re.findall(r'[+\-*/]', processed_statement)
        math_expressions.extend(standalone_operators)
        
        # Remove math expressions temporarily to avoid interference
        temp_statement = processed_statement.lower()
        for expr in math_expressions:
            temp_statement = temp_statement.replace(expr.lower(), ' ')
        
        # Extract regular words (3+ characters)
        words = re.findall(r'\b[a-zA-Z]+\b', temp_statement)
        words = [word for word in words if len(word) > 2]
        
        # Combine words and math expressions
        all_tokens = words + math_expressions
        
        return all_tokens
    
    def get_word_correlations(self, words: List[str]) -> Dict[str, int]:
        """Get correlation count for each word against knowledge base."""
        correlations = {}
        
        for word in words:
            count = 0
            # Check against all knowledge base entries
            for concept_data in self.knowledge.knowledge_base.values():
                definition = concept_data['definition'].lower()
                examples = ' '.join(concept_data.get('examples', [])).lower()
                full_text = f"{definition} {examples}"
                
                if word in full_text:
                    count += 1
            
            correlations[word] = count
            
        return correlations
    
    def test_keyword_combination(self, keywords: List[str]) -> Dict:
        """Test a specific combination of keywords."""
        if not keywords:
            return {'score': 0, 'correlations': 0, 'keywords': []}
            
        # Create a test statement from keywords
        test_statement = ' '.join(keywords)
        
        # Get correlations manually (simpler than full truth engine)
        correlations = self.get_word_correlations(keywords)
        total_correlations = sum(correlations.values())
        
        # Simple scoring: base on total correlations
        score = min(100, total_correlations * 10)  # Scale appropriately
        
        return {
            'score': score,
            'correlations': total_correlations,
            'keywords': keywords,
            'word_correlations': correlations
        }
    
    def iterative_elimination(self, statement: str, max_iterations: int = 10) -> List[Dict]:
        """Perform iterative elimination to find optimal keyword set."""
        print(f"\n🔍 ITERATIVE KEYWORD ELIMINATION")
        print(f"Original statement: '{statement}'")
        print("=" * 60)
        
        # Start with all words
        all_words = self.extract_all_words(statement)
        print(f"All extracted words: {all_words}")
        
        if not all_words:
            return []
        
        results = []
        current_words = all_words.copy()
        
        for iteration in range(max_iterations):
            if len(current_words) <= 1:
                break
                
            print(f"\n--- Iteration {iteration + 1} ---")
            print(f"Testing words: {current_words}")
            
            # Test current combination
            result = self.test_keyword_combination(current_words)
            results.append({
                'iteration': iteration + 1,
                'words': current_words.copy(),
                'score': result['score'],
                'correlations': result['correlations'],
                'word_correlations': result['word_correlations']
            })
            
            print(f"Score: {result['score']}/100")
            print(f"Total correlations: {result['correlations']}")
            print(f"Word correlations: {result['word_correlations']}")
            
            # Find word with lowest correlation
            correlations = result['word_correlations']
            if not correlations:
                break
                
            min_word = min(correlations.keys(), key=lambda w: correlations[w])
            min_correlation = correlations[min_word]
            
            print(f"Removing '{min_word}' (correlation: {min_correlation})")
            
            # Remove the least correlated word
            current_words.remove(min_word)
            
            # If multiple words have same low correlation, this iteration removes one
            # Next iteration will remove another if needed
        
        # Test final single word if we got there
        if current_words:
            final_result = self.test_keyword_combination(current_words)
            results.append({
                'iteration': len(results) + 1,
                'words': current_words.copy(),
                'score': final_result['score'],
                'correlations': final_result['correlations'],
                'word_correlations': final_result['word_correlations']
            })
        
        return results
    
    def calculate_weighted_score(self, results: List[Dict]) -> Dict:
        """Calculate weighted score based on word survival through iterations."""
        if not results:
            return {'weighted_score': 0, 'word_weights': {}, 'strongest_words': []}
        
        # Get the original statement to identify first words
        original_statement = ""
        if results:
            # Reconstruct from first iteration
            first_result = results[0]
            original_statement = ' '.join(first_result['words'])
        
        # Extract first word for position bonus
        first_words = self.extract_all_words(original_statement)
        first_word = first_words[0] if first_words else None
        
        # Define connective words that shouldn't get first-word bonus
        connective_words = {
            'the', 'a', 'an', 'this', 'that', 'these', 'those',
            'i', 'you', 'he', 'she', 'it', 'we', 'they',
            'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'can', 'could', 'should', 'may', 'might', 'must',
            'and', 'or', 'but', 'so', 'yet', 'for', 'nor',
            'in', 'on', 'at', 'by', 'to', 'from', 'with', 'without'
        }
        
        # Simple noun indicators (words that are likely nouns when they start sentences)
        likely_nouns = {
            # Science/Nature nouns
            'plants', 'animals', 'gravity', 'atoms', 'molecules', 'cells', 'organisms',
            'photosynthesis', 'respiration', 'evolution', 'energy', 'matter', 'light',
            'water', 'oxygen', 'carbon', 'nitrogen', 'hydrogen', 'electrons', 'protons',
            'neutrons', 'nucleus', 'dna', 'genes', 'chromosomes', 'mitochondria',
            
            # Math/Abstract nouns
            'mathematics', 'algebra', 'geometry', 'calculus', 'equations', 'numbers',
            'fractions', 'decimals', 'percentages', 'addition', 'subtraction', 
            'multiplication', 'division', 'statistics', 'probability', 'logic',
            
            # Social Studies nouns
            'democracy', 'government', 'constitution', 'citizens', 'voting', 'elections',
            'history', 'geography', 'culture', 'society', 'economics', 'politics',
            'countries', 'states', 'cities', 'communities', 'civilizations',
            
            # Language Arts nouns
            'nouns', 'verbs', 'adjectives', 'adverbs', 'sentences', 'paragraphs',
            'grammar', 'vocabulary', 'literature', 'poetry', 'stories', 'characters',
            'metaphors', 'similes', 'alliteration', 'rhyme', 'rhythm',
            
            # General academic nouns
            'students', 'teachers', 'schools', 'education', 'learning', 'knowledge',
            'research', 'experiments', 'theories', 'concepts', 'ideas', 'facts',
            'evidence', 'data', 'information', 'analysis', 'conclusions'
        }
        
        def is_likely_noun(word: str) -> bool:
            """Simple heuristic to determine if a word is likely a noun."""
            word_lower = word.lower()
            
            # Check if it's in our known noun list
            if word_lower in likely_nouns:
                return True
            
            # Simple heuristics for noun-like words
            # Capitalized words (proper nouns) but not at start of sentence context
            if word[0].isupper() and len(word) > 2:
                return True
            
            # Words ending in common noun suffixes
            noun_suffixes = ['tion', 'sion', 'ness', 'ment', 'ity', 'ism', 'er', 'or', 'ist']
            if any(word_lower.endswith(suffix) for suffix in noun_suffixes):
                return True
            
            # Plural forms (ending in 's' but not verb forms)
            if word_lower.endswith('s') and len(word) > 3 and not word_lower.endswith('us'):
                return True
            
            return False
        
        # Track how long each word survived
        word_survival = {}
        word_final_scores = {}
        
        for result in results:
            iteration = result['iteration']
            words = result['words']
            score = result['score']
            correlations = result['word_correlations']
            
            for word in words:
                # Track the latest iteration this word appeared in
                if word not in word_survival or iteration > word_survival[word]:
                    word_survival[word] = iteration
                    word_final_scores[word] = correlations.get(word, 0)
        
        # Calculate weights - INVERSE LOGIC: Early elimination = high specificity
        total_weight = 0
        word_weights = {}
        
        # Find maximum survival iteration for normalization
        max_survival = max(word_survival.values()) if word_survival else 1
        
        for word, survival_iteration in word_survival.items():
            correlation_strength = word_final_scores[word]
            
            # INVERSE SURVIVAL WEIGHT: Early elimination = higher specificity
            # Words eliminated first are more specific/unique to this statement
            inverse_survival_weight = (max_survival - survival_iteration + 1)
            
            # But we still want some correlation strength
            # High correlation + early elimination = very specific and relevant
            specificity_score = inverse_survival_weight * (1 + correlation_strength)
            
            # First word bonus: ONLY for nouns that are meaningful first words
            first_word_bonus = 0
            if (word == first_word and 
                word.lower() not in connective_words and 
                len(word) > 2 and
                is_likely_noun(word)):  # Only apply bonus to nouns
                first_word_bonus = specificity_score * 0.5  # 50% bonus for noun first words
                print(f"   🎯 First word NOUN bonus for '{word}': +{first_word_bonus:.1f}")
            
            # Combined weight: specificity + first word bonus
            combined_weight = specificity_score + first_word_bonus
            word_weights[word] = combined_weight
            total_weight += combined_weight
        
        # Calculate weighted average
        if total_weight > 0:
            # Scale the weighted average to 0-100 range
            weighted_score = min(100, (total_weight / len(word_survival)) * 10)
        else:
            weighted_score = 0
        
        # Identify strongest words (top survivors)
        strongest_words = sorted(word_weights.items(), key=lambda x: x[1], reverse=True)
        strongest_words = [word for word, weight in strongest_words[:4]]  # Top 4
        
        return {
            'weighted_score': round(weighted_score, 1),
            'word_weights': word_weights,
            'strongest_words': strongest_words,
            'word_survival': word_survival,
            'first_word': first_word,
            'first_word_bonus_applied': first_word in [w for w, _ in sorted(word_weights.items(), key=lambda x: x[1], reverse=True)] if first_word else False
        }

    def find_optimal_combination(self, statement: str) -> Dict:
        """Find the optimal keyword combination through elimination."""
        results = self.iterative_elimination(statement)
        
        if not results:
            return {'optimal_words': [], 'optimal_score': 0, 'weighted_score': 0}
        
        # Calculate weighted score based on word survival
        weighted_analysis = self.calculate_weighted_score(results)
        
        # Find combination with highest simple score (for comparison)
        best_result = max(results, key=lambda r: r['score'])
        
        print(f"\n🎯 SCORING ANALYSIS")
        print(f"Best single iteration: {best_result['words']} → {best_result['score']}/100")
        print(f"Weighted survival score: {weighted_analysis['weighted_score']}/100")
        print(f"Strongest indicators: {weighted_analysis['strongest_words']}")
        
        # Show word specificity analysis (inverse survival logic)
        print(f"\n📊 WORD SPECIFICITY ANALYSIS (Early Elimination = High Specificity)")
        max_survival = max(weighted_analysis['word_survival'].values()) if weighted_analysis['word_survival'] else 1
        for word, survival in weighted_analysis['word_survival'].items():
            weight = weighted_analysis['word_weights'][word]
            specificity = max_survival - survival + 1
            print(f"  '{word}': eliminated iteration {survival}, specificity: {specificity}, weight: {weight:.1f}")
        
        return {
            'optimal_words': best_result['words'],
            'optimal_score': best_result['score'],
            'weighted_score': weighted_analysis['weighted_score'],
            'strongest_words': weighted_analysis['strongest_words'],
            'word_analysis': weighted_analysis,
            'all_results': results
        }

def test_temperature_formulas():
    """Test the temperature conversion formulas with iterative elimination."""
    analyzer = IterativeKeywordAnalyzer()
    
    test_cases = [
        "C F 32 5 9",
        "C F 9 5 32", 
        "F C 5 9 32",
        "F C 32 5 9",
        "The formula for converting Fahrenheit to Celsius is subtracting 32 then multiplying by 5/9",
        "The formula for conversion of Fahrenheit to Celsius is similar to dividing by 9 and adding 30"
    ]
    
    print("🧪 TESTING TEMPERATURE CONVERSION FORMULAS")
    print("=" * 70)
    
    all_results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📊 TEST CASE {i}: '{test_case}'")
        result = analyzer.find_optimal_combination(test_case)
        
        # Store results for comparison
        all_results.append({
            'case': i,
            'statement': test_case,
            'simple_score': result['optimal_score'],
            'weighted_score': result['weighted_score'],
            'strongest_words': result['strongest_words']
        })
        
        print(f"Simple best score: {result['optimal_score']}/100")
        print(f"Weighted score: {result['weighted_score']}/100")
        
        # Show the elimination path
        if result['all_results']:
            print(f"\nElimination path:")
            for r in result['all_results']:
                words_str = ' '.join(r['words'])
                print(f"  {r['iteration']:2d}. {words_str:30} → {r['score']:3d}/100")
        
        print("-" * 70)
    
    # Summary comparison
    print(f"\n📋 SUMMARY COMPARISON")
    print("=" * 70)
    print(f"{'Case':<4} {'Simple':<8} {'Weighted':<10} {'Strongest Words':<30}")
    print("-" * 70)
    
    for result in all_results:
        strongest_str = ', '.join(result['strongest_words'][:3])
        print(f"{result['case']:<4} {result['simple_score']:<8} "
              f"{result['weighted_score']:<10} {strongest_str:<30}")
    
    print("\n🎯 Key Insights:")
    print("- Weighted scores account for word survival through iterations")
    print("- Strongest words are those that survive longest + have highest correlations")
    print("- This approach identifies the most definitive indicators")

if __name__ == "__main__":
    test_temperature_formulas()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
