

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("tvmle_demo.py", "system_initialization", "import", "Auto-generated dev log entry")

Simple test to demonstrate ANIOTA's mathematical learning
Shows triadic vector generation and correlation-based pattern recognition
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from learning.tvmle import TriadicVector, TriadicVectorMathematicalLearningEngine

def demonstrate_mathematical_learning():
    """Show ANIOTA learning through mathematical correlation"""
    
    print("=== ANIOTA Mathematical Learning Demonstration ===\n")
    
    # Create the learning engine
    engine = TriadicVectorMathematicalLearningEngine()
    
    print("🧠 ANIOTA's Mathematical Learning Engine initialized")
    print("📊 Learning through triadic vector correlation analysis\n")
    
    # Simulate mouse events (user clicking after hesitation)
    print("1. MOUSE LEARNING - User clicking patterns:")
    
    mouse_events = [
        {'start_time': 0, 'end_time': 2.3, 'x': 400, 'y': 300, 'type': 'click'},
        {'start_time': 0, 'end_time': 2.1, 'x': 410, 'y': 305, 'type': 'click'},  # Similar
        {'start_time': 0, 'end_time': 5.7, 'x': 800, 'y': 600, 'type': 'click'},  # Different
        {'start_time': 0, 'end_time': 2.4, 'x': 405, 'y': 295, 'type': 'click'},  # Similar to first
    ]
    
    for i, event in enumerate(mouse_events):
        vector = engine.process_mouse_event(event)
        if vector:
            print(f"   Event {i+1}: Duration={vector.temporal[2]:.1f}s, "
                  f"Position=({vector.spatial[0]:.2f}, {vector.spatial[1]:.2f})")
    
    print(f"\n📈 Learning Stats: {engine.get_learning_stats()}")
    
    # Simulate keyboard events
    print("\n2. KEYBOARD LEARNING - Typing patterns:")
    
    keyboard_events = [
        {'interval': 150, 'key_type': 'letter', 'sequence': 'hello'},
        {'interval': 800, 'key_type': 'symbol', 'sequence': '?'},
        {'interval': 160, 'key_type': 'letter', 'sequence': 'world'},  # Similar to first
        {'interval': 2000, 'key_type': 'function', 'sequence': 'F1'},  # Very different
    ]
    
    for i, event in enumerate(keyboard_events):
        vector = engine.process_keyboard_event(event)
        if vector:
            print(f"   Event {i+1}: Interval={vector.temporal[2]}ms, "
                  f"Type={event['key_type']}, Complexity={vector.radial:.2f}")
    
    print(f"\n📈 Learning Stats: {engine.get_learning_stats()}")
    
    # Simulate clipboard events
    print("\n3. CLIPBOARD LEARNING - Copy/paste patterns:")
    
    clipboard_events = [
        {'action': 'copy', 'duration': 500, 'content_length': 20},
        {'action': 'paste', 'duration': 200, 'content_length': 20},
        {'action': 'copy', 'duration': 480, 'content_length': 18},  # Similar to first
        {'action': 'cut', 'duration': 1200, 'content_length': 150},  # Very different
    ]
    
    for i, event in enumerate(clipboard_events):
        vector = engine.process_clipboard_event(event)
        if vector:
            print(f"   Event {i+1}: Action={event['action']}, "
                  f"Duration={vector.temporal[2]}ms, Size={event['content_length']}")
    
    # Final learning statistics
    final_stats = engine.get_learning_stats()
    print(f"\n🎯 FINAL LEARNING RESULTS:")
    print(f"   Total Events Processed: {final_stats['total_events']}")
    print(f"   Patterns Recognized: {final_stats['recognized_patterns']}")
    print(f"   New Patterns Learned: {final_stats['new_patterns_learned']}")
    print(f"   Recognition Rate: {final_stats['recognition_rate']:.1%}")
    print(f"   Learning Rate: {final_stats['learning_rate']:.1%}")
    
    print(f"\n✨ ANIOTA has learned {final_stats['total_learned_vectors']} distinct mathematical patterns")
    print("🧮 Each pattern is a triadic vector with mathematical correlation analysis")
    print("🎲 No neural networks - pure computational mathematics!")
    
    # Demonstrate mathematical explanation
    if engine.learned_vectors:
        print(f"\n🔍 Mathematical Learning Analysis for Last Pattern:")
        explanation = engine.explain_learning(engine.learned_vectors[-1])
        print(explanation)

if __name__ == "__main__":
    demonstrate_mathematical_learning()
