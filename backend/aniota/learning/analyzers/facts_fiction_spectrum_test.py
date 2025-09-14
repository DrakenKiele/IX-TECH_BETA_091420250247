


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("facts_fiction_spectrum_test.py", "system_initialization", "import", "Auto-generated dev log entry")

Facts to Fiction Spectrum Test
Tests the Truth Engine across a wide range of statements from clear facts to obvious fiction.
Includes strange attractors and fuzzy logic cases to calibrate system sensitivity.
"""

from pattern_proximity_analyzer import PatternProximityAnalyzer
from iterative_keyword_elimination import IterativeKeywordAnalyzer

class FactsFictionTester:
    """Test the system across facts-to-fiction spectrum."""
    
    def __init__(self):
        self.pattern_analyzer = PatternProximityAnalyzer()
        self.keyword_analyzer = IterativeKeywordAnalyzer()
        
        # Test cases organized by truth level
        self.test_cases = {
            'clear_facts': [
                "Plants use photosynthesis to make food from sunlight",
                "Gravity makes objects fall toward Earth",
                "Water freezes at 32 degrees Fahrenheit", 
                "Addition combines two numbers to get a sum",
                "Democracy involves citizens voting for leaders"
            ],
            
            'scientific_facts': [
                "Atoms contain protons neutrons and electrons",
                "Photosynthesis converts carbon dioxide and water into glucose",
                "Earth rotates on its axis once every 24 hours",
                "DNA contains genetic information in living organisms"
            ],
            
            'fuzzy_partial_truths': [
                "Plants need sunlight to grow",  # Mostly true but simplified
                "Math involves numbers and calculations",  # Very general but true
                "Gravity pulls things down",  # Simplified but directionally correct
                "Voting is part of democracy",  # True but incomplete
                "Temperature affects water"  # True but vague
            ],
            
            'strange_attractors': [
                "Celsius Fahrenheit 32 subtract multiply 5 9",  # Scrambled formula
                "Photosynthesis plants sunlight carbon dioxide oxygen",  # Keyword soup
                "Democracy voting citizens government elections choose",  # Related terms
                "Mathematics algebra geometry numbers equations solve",  # Math domain
                "Gravity objects mass force acceleration motion"  # Physics terms
            ],
            
            'misleading_statements': [
                "Plants use moonlight for photosynthesis",  # Wrong light source
                "Gravity makes objects float upward",  # Direction wrong
                "Water boils at 32 degrees Fahrenheit",  # Wrong temperature
                "Subtraction adds numbers together",  # Wrong operation
                "Dictatorships involve citizen voting"  # Contradictory concepts
            ],
            
            'nonsense_fiction': [
                "Purple elephants do calculus on Thursdays",
                "Gravity flows backwards through time",
                "Mathematics eats vegetables for breakfast", 
                "Democracy lives in underwater castles",
                "Photosynthesis drives cars to work"
            ],
            
            'edge_cases': [
                "The quick brown fox jumps over lazy dog",  # Unrelated content
                "A B C D E F G H I J K L M N O P",  # Pure alphabet
                "1 2 3 4 5 6 7 8 9 10 11 12 13",  # Pure numbers
                "",  # Empty string
                "Colorless green ideas sleep furiously"  # Chomsky's famous nonsense
            ]
        }
    
    def run_comprehensive_test(self):
        """Run the complete facts-to-fiction spectrum test."""
        print("🌈 FACTS TO FICTION SPECTRUM TEST")
        print("=" * 80)
        print("Testing system sensitivity across truth spectrum...")
        print("This will help calibrate 'volume' settings for strange attractors and fuzzy logic")
        print()
        
        all_results = []
        
        for category, statements in self.test_cases.items():
            print(f"\n📊 CATEGORY: {category.upper().replace('_', ' ')}")
            print("-" * 60)
            
            category_results = []
            
            for i, statement in enumerate(statements, 1):
                print(f"\n{i}. '{statement}'")
                
                # Run pattern proximity analysis
                result = self.pattern_analyzer.analyze_statement_pattern(statement)
                
                # Store results for analysis
                test_result = {
                    'category': category,
                    'statement': statement,
                    'final_score': result['final_score'],
                    'elimination_score': result['elimination_score'],
                    'proximity_score': result['proximity_score'],
                    'pattern_score': result['pattern_score'],
                    'strongest_words': result['strongest_words']
                }
                
                category_results.append(test_result)
                all_results.append(test_result)
                
                # Quick summary
                print(f"   Final Score: {result['final_score']}/100")
                print(f"   Strongest: {', '.join(result['strongest_words'][:3])}")
            
            # Category summary
            avg_score = sum(r['final_score'] for r in category_results) / len(category_results)
            print(f"\n📈 Category Average: {avg_score:.1f}/100")
        
        # Overall analysis
        self.analyze_spectrum_results(all_results)
        
        return all_results
    
    def analyze_spectrum_results(self, results):
        """Analyze results across the truth spectrum."""
        print(f"\n🔍 SPECTRUM ANALYSIS")
        print("=" * 80)
        
        # Calculate category averages
        category_averages = {}
        for category in self.test_cases.keys():
            category_results = [r for r in results if r['category'] == category]
            if category_results:
                avg = sum(r['final_score'] for r in category_results) / len(category_results)
                category_averages[category] = avg
        
        # Sort by average score
        sorted_categories = sorted(category_averages.items(), key=lambda x: x[1], reverse=True)
        
        print("📊 CATEGORY RANKINGS (by average score):")
        for i, (category, avg_score) in enumerate(sorted_categories, 1):
            category_name = category.replace('_', ' ').title()
            print(f"{i:2d}. {category_name:<20} {avg_score:6.1f}/100")
        
        # Identify score ranges
        all_scores = [r['final_score'] for r in results]
        min_score = min(all_scores)
        max_score = max(all_scores)
        avg_score = sum(all_scores) / len(all_scores)
        
        print(f"\n📈 SCORE DISTRIBUTION:")
        print(f"   Highest Score: {max_score}/100")
        print(f"   Lowest Score:  {min_score}/100")
        print(f"   Average Score: {avg_score:.1f}/100")
        print(f"   Score Range:   {max_score - min_score} points")
        
        # Identify problematic cases
        print(f"\n⚠️  CALIBRATION INSIGHTS:")
        
        # High-scoring nonsense (false positives)
        high_nonsense = [r for r in results if r['category'] in ['nonsense_fiction', 'edge_cases'] and r['final_score'] > 50]
        if high_nonsense:
            print(f"   🔴 HIGH-SCORING NONSENSE (turn volume DOWN):")
            for r in high_nonsense:
                print(f"      '{r['statement'][:50]}...' → {r['final_score']}/100")
        
        # Low-scoring facts (false negatives)
        low_facts = [r for r in results if r['category'] in ['clear_facts', 'scientific_facts'] and r['final_score'] < 70]
        if low_facts:
            print(f"   🔴 LOW-SCORING FACTS (turn volume UP):")
            for r in low_facts:
                print(f"      '{r['statement'][:50]}...' → {r['final_score']}/100")
        
        # Well-performing strange attractors
        good_attractors = [r for r in results if r['category'] == 'strange_attractors' and 40 <= r['final_score'] <= 80]
        if good_attractors:
            print(f"   🟢 WELL-CALIBRATED STRANGE ATTRACTORS:")
            for r in good_attractors:
                print(f"      '{r['statement'][:50]}...' → {r['final_score']}/100")
        
        # Recommend volume adjustments
        print(f"\n🎛️  VOLUME RECOMMENDATIONS:")
        
        if any(r['final_score'] > 60 for r in results if r['category'] == 'nonsense_fiction'):
            print("   📉 REDUCE pattern matching weight (too many false positives)")
        
        if any(r['final_score'] < 70 for r in results if r['category'] == 'clear_facts'):
            print("   📈 INCREASE correlation sensitivity (missing clear facts)")
        
        fuzzy_scores = [r['final_score'] for r in results if r['category'] == 'fuzzy_partial_truths']
        if fuzzy_scores and (max(fuzzy_scores) - min(fuzzy_scores)) > 40:
            print("   🎯 FUZZY LOGIC needs better discrimination")
        
        attractor_scores = [r['final_score'] for r in results if r['category'] == 'strange_attractors']
        if attractor_scores and sum(attractor_scores) / len(attractor_scores) > 80:
            print("   ⚖️  STRANGE ATTRACTORS scoring too high - adjust keyword proximity")

def main():
    """Run the comprehensive facts-to-fiction test."""
    tester = FactsFictionTester()
    results = tester.run_comprehensive_test()
    
    print(f"\n🎯 TEST COMPLETE")
    print(f"Total statements tested: {len(results)}")
    print(f"Use insights above to calibrate system sensitivity")

if __name__ == "__main__":
    main()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
