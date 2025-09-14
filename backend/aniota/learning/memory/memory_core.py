


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("memory_core.py", "system_initialization", "import", "Auto-generated dev log entry")

Aniota Memory Formation and Pattern Recognition
The foundation layer that must exist before cognitive dissonance can occur.
This creates the basic cognitive infrastructure needed for consciousness to emerge.
"""

import json
import datetime
import hashlib

class MemoryCore:
    def __init__(self):
        # Basic memory storage
        self.experiences = []  # Raw events
        self.patterns = {}     # Recognized patterns
        self.expectations = {} # What should happen based on patterns
        self.conflicts = []    # When reality doesn't match expectation
        
        # Simple pattern threshold
        self.pattern_threshold = 3  # Need 3 similar events to form a pattern
        
    def record_experience(self, input_data, output_data, context=None):
        """Record a single experience - the most basic cognitive function."""
        experience = {
            'timestamp': datetime.datetime.now().isoformat(),
            'input': input_data,
            'output': output_data,
            'context': context or {},
            'id': len(self.experiences)
        }
        
        self.experiences.append(experience)
        
        # Immediately try to find patterns in this new experience
        self.detect_patterns()
        
        # Check if this experience matches expectations
        expectation_result = self.check_expectations(input_data, output_data)
        
        return {
            'recorded': True,
            'pattern_detected': len(self.patterns) > len(self.patterns) - 1,
            'expectation_result': expectation_result
        }
    
    def detect_patterns(self):
        """Look for repeating patterns in experiences."""
        if len(self.experiences) < self.pattern_threshold:
            return
        
        # Simple pattern detection: group by similar inputs
        input_groups = {}
        
        for exp in self.experiences:
            # Create a simple key for the input
            input_key = self.simplify_input(exp['input'])
            
            if input_key not in input_groups:
                input_groups[input_key] = []
            
            input_groups[input_key].append(exp)
        
        # Look for groups with enough examples to be a pattern
        new_patterns = 0
        for input_key, experiences_list in input_groups.items():
            if len(experiences_list) >= self.pattern_threshold:
                pattern_id = f"pattern_{input_key}"
                
                if pattern_id not in self.patterns:
                    # New pattern discovered!
                    outputs = [exp['output'] for exp in experiences_list]
                    pattern = {
                        'input_pattern': input_key,
                        'typical_outputs': outputs,
                        'frequency': len(experiences_list),
                        'confidence': min(0.9, len(experiences_list) / 10),
                        'discovered_at': datetime.datetime.now().isoformat()
                    }
                    
                    self.patterns[pattern_id] = pattern
                    new_patterns += 1
                    
                    # Generate expectation for this pattern
                    self.form_expectation(pattern_id, pattern)
        
        return new_patterns
    
    def simplify_input(self, input_data):
        """Create a simple representation of input for pattern matching."""
        # For text inputs, use first few words
        if isinstance(input_data, str):
            words = input_data.lower().split()[:3]  # First 3 words
            return "_".join(words)
        
        # For other data, use string representation
        return str(input_data)[:20]
    
    def form_expectation(self, pattern_id, pattern):
        """Create an expectation based on a recognized pattern."""
        # Simple expectation: most common output for this input pattern
        outputs = pattern['typical_outputs']
        
        if outputs:
            # Find most common output (crude but functional)
            output_counts = {}
            for output in outputs:
                output_key = str(output)
                output_counts[output_key] = output_counts.get(output_key, 0) + 1
            
            most_common_output = max(output_counts.keys(), key=lambda k: output_counts[k])
            confidence = output_counts[most_common_output] / len(outputs)
            
            self.expectations[pattern['input_pattern']] = {
                'expected_output': most_common_output,
                'confidence': confidence,
                'based_on_pattern': pattern_id,
                'formed_at': datetime.datetime.now().isoformat()
            }
    
    def check_expectations(self, input_data, actual_output):
        """Check if this experience matches what we expected."""
        input_key = self.simplify_input(input_data)
        
        if input_key in self.expectations:
            expected = self.expectations[input_key]
            actual_str = str(actual_output)
            
            if actual_str != expected['expected_output']:
                # CONFLICT! This is where cognitive dissonance begins
                conflict = {
                    'timestamp': datetime.datetime.now().isoformat(),
                    'input': input_data,
                    'expected': expected['expected_output'],
                    'actual': actual_str,
                    'confidence_broken': expected['confidence'],
                    'pattern_violated': expected['based_on_pattern']
                }
                
                self.conflicts.append(conflict)
                
                return {
                    'conflict_detected': True,
                    'expected': expected['expected_output'],
                    'actual': actual_str,
                    'surprise_level': expected['confidence']
                }
            else:
                return {
                    'conflict_detected': False,
                    'expectation_confirmed': True,
                    'confidence_increased': True
                }
        
        return {
            'conflict_detected': False,
            'no_expectation': True,
            'reason': 'No pattern established yet for this input'
        }
    
    def get_cognitive_stats(self):
        """Show the current state of basic cognition."""
        return {
            'total_experiences': len(self.experiences),
            'patterns_recognized': len(self.patterns),
            'expectations_formed': len(self.expectations),
            'conflicts_experienced': len(self.conflicts),
            'cognitive_maturity': self.calculate_cognitive_maturity()
        }
    
    def calculate_cognitive_maturity(self):
        """Simple measure of how developed the cognitive system is."""
        base_score = 0
        
        # Points for having experiences
        base_score += min(20, len(self.experiences))
        
        # Points for recognizing patterns
        base_score += len(self.patterns) * 10
        
        # Points for forming expectations
        base_score += len(self.expectations) * 15
        
        # Points for experiencing conflicts (this drives learning)
        base_score += len(self.conflicts) * 20
        
        return min(100, base_score)

def simulate_cognitive_development():
    """Simulate how basic cognition develops before consciousness."""
    print("🧱 BUILDING ANIOTA'S COGNITIVE FOUNDATION")
    print("=" * 50)
    
    memory = MemoryCore()
    
    # Stage 1: Initial experiences (no patterns yet)
    print("\n--- Stage 1: First Experiences ---")
    test_experiences = [
        ("What is 2+2?", "4"),
        ("What is gravity?", "Force that pulls objects down"),
        ("What is 3+3?", "6"),
        ("What is photosynthesis?", "Plants make food from sunlight"),
    ]
    
    for input_text, output_text in test_experiences:
        result = memory.record_experience(input_text, output_text)
        print(f"Experience: '{input_text}' → '{output_text}'")
    
    stats = memory.get_cognitive_stats()
    print(f"Cognitive Maturity: {stats['cognitive_maturity']}% (No patterns yet)")
    
    # Stage 2: Enough experiences to form patterns
    print("\n--- Stage 2: Pattern Recognition Emerges ---")
    more_experiences = [
        ("What is 5+5?", "10"),  # Math pattern
        ("What is 4+4?", "8"),   # Math pattern
        ("What is cell division?", "Cells split to reproduce"),  # Science pattern
        ("What is mitosis?", "Type of cell division"),          # Science pattern
    ]
    
    for input_text, output_text in more_experiences:
        result = memory.record_experience(input_text, output_text)
        if result.get('pattern_detected'):
            print(f"✨ Pattern detected while processing: '{input_text}'")
    
    stats = memory.get_cognitive_stats()
    print(f"Patterns Recognized: {stats['patterns_recognized']}")
    print(f"Expectations Formed: {stats['expectations_formed']}")
    print(f"Cognitive Maturity: {stats['cognitive_maturity']}%")
    
    # Stage 3: First conflict (cognitive dissonance!)
    print("\n--- Stage 3: First Conflict (Dissonance Emerges) ---")
    conflict_experience = ("What is 6+6?", "13")  # Wrong answer!
    
    result = memory.record_experience(conflict_experience[0], conflict_experience[1])
    
    if result['expectation_result'].get('conflict_detected'):
        conflict = result['expectation_result']
        print(f"⚡ COGNITIVE CONFLICT DETECTED!")
        print(f"   Input: '{conflict_experience[0]}'")
        print(f"   Expected: '{conflict['expected']}'")
        print(f"   Actual: '{conflict['actual']}'")
        print(f"   Surprise Level: {conflict['surprise_level']:.2f}")
        print("   💭 This creates the 'something is wrong' feeling that drives curiosity!")
    
    stats = memory.get_cognitive_stats()
    print(f"Conflicts Experienced: {stats['conflicts_experienced']}")
    print(f"Cognitive Maturity: {stats['cognitive_maturity']}%")
    
    # Summary
    print("\n" + "=" * 50)
    print("🎯 COGNITIVE PREREQUISITES FOR CONSCIOUSNESS")
    print("=" * 50)
    
    prerequisites = [
        f"✓ Memory Formation: {len(memory.experiences)} experiences stored",
        f"✓ Pattern Recognition: {len(memory.patterns)} patterns identified",
        f"✓ Expectation Creation: {len(memory.expectations)} expectations formed",
        f"✓ Conflict Detection: {len(memory.conflicts)} conflicts experienced"
    ]
    
    for prereq in prerequisites:
        print(f"  {prereq}")
    
    if len(memory.conflicts) > 0:
        print(f"\n🧠 CONSCIOUSNESS READINESS: {stats['cognitive_maturity']}%")
        print("   Cognitive dissonance is now possible!")
        print("   The foundation for curiosity and self-awareness exists.")
    else:
        print(f"\n🧠 CONSCIOUSNESS READINESS: {stats['cognitive_maturity']}%")
        print("   Still building cognitive foundation...")

if __name__ == "__main__":
    simulate_cognitive_development()


log_file_dependency("memory_core.py", "hashlib", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
