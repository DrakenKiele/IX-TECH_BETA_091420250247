




import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("test_microvibration.py", "system_initialization", "import", "Auto-generated dev log entry")

import random
import time
import math
from microvibration_auth import MicrovibrationAnalyzer, MicrovibrationVector


def simulate_user_mouse_movement(user_id: str, session_length: int = 100):
    """
    Simulate realistic mouse movement patterns for a specific user.
    Each user has unique mathematical characteristics:
    - Tremor frequency
    - Overshoot tendency  
    - Correction speed
    - Movement smoothness
    """
    movements = []
    
    # User-specific characteristics (these would be unique per person)
    if user_id == "user_A":
        tremor_freq = 0.15      # Slight hand tremor
        overshoot = 1.08        # Tends to overshoot by 8%
        correction_speed = 0.7  # Moderate correction speed
    elif user_id == "user_B":
        tremor_freq = 0.05      # Very steady hand
        overshoot = 0.95        # Tends to undershoot by 5%
        correction_speed = 1.2  # Quick corrections
    else:  # Imposter
        tremor_freq = 0.25      # Different tremor pattern
        overshoot = 1.15        # Different overshoot pattern
        correction_speed = 0.9  # Different correction speed
    
    # Simulate mouse movements during gameplay
    current_x, current_y = 400, 300  # Start position
    base_time = time.time()
    
    for i in range(session_length):
        # Target position (simulating UI interaction)
        target_x = random.uniform(100, 700)
        target_y = random.uniform(100, 500)
        
        # Calculate ideal movement
        ideal_dx = target_x - current_x
        ideal_dy = target_y - current_y
        
        # Apply user-specific characteristics
        # 1. Overshoot/undershoot tendency
        actual_dx = ideal_dx * overshoot
        actual_dy = ideal_dy * overshoot
        
        # 2. Add tremor (micro-oscillations)
        tremor_x = math.sin(i * tremor_freq) * random.uniform(1, 3)
        tremor_y = math.cos(i * tremor_freq) * random.uniform(1, 3)
        
        # 3. Add correction movement
        correction_x = (ideal_dx - actual_dx) * correction_speed
        correction_y = (ideal_dy - actual_dy) * correction_speed
        
        # Final position with user characteristics
        final_x = current_x + actual_dx + tremor_x + correction_x
        final_y = current_y + actual_dy + tremor_y + correction_y
        
        movements.append({
            'x': final_x,
            'y': final_y,
            'timestamp': base_time + i * 0.016  # ~60fps
        })
        
        current_x, current_y = final_x, final_y
    
    return movements


def test_microvibration_authentication():
    """Test the mathematical authentication system"""
    print("=" * 60)
    print("MICROVIBRATION AUTHENTICATION - MATHEMATICAL TEST")
    print("=" * 60)
    
    analyzer = MicrovibrationAnalyzer()
    
    # Phase 1: Learning phase with User A
    print("\n1. LEARNING PHASE - Establishing User A baseline")
    print("-" * 50)
    
    user_a_learning = simulate_user_mouse_movement("user_A", 150)
    learning_vectors = []
    
    for movement in user_a_learning:
        vector = analyzer.process_mouse_event(
            movement['x'], 
            movement['y']
        )
        if vector:
            learning_vectors.append(vector)
            analyzer.update_baseline_patterns(vector)
    
    print(f"Collected {len(learning_vectors)} microvibration vectors")
    print(f"Signature established: {analyzer.signature_established}")
    print(f"Signature strength: {analyzer.get_signature_strength():.4f}")
    
    # Phase 2: Authentication test with same user
    print("\n2. AUTHENTICATION TEST - User A returns")
    print("-" * 50)
    
    user_a_return = simulate_user_mouse_movement("user_A", 80)
    test_vectors = []
    
    for movement in user_a_return:
        vector = analyzer.process_mouse_event(
            movement['x'], 
            movement['y']
        )
        if vector:
            test_vectors.append(vector)
    
    is_auth, confidence = analyzer.authenticate_user(test_vectors)
    print(f"User A authentication: {is_auth}")
    print(f"Confidence score: {confidence:.4f}")
    print(f"Threshold: {analyzer.authentication_threshold}")
    
    # Phase 3: Test with different user (should fail)
    print("\n3. IMPOSTOR TEST - User B attempts access")
    print("-" * 50)
    
    user_b_attempt = simulate_user_mouse_movement("user_B", 80)
    impostor_vectors = []
    
    for movement in user_b_attempt:
        vector = analyzer.process_mouse_event(
            movement['x'], 
            movement['y']
        )
        if vector:
            impostor_vectors.append(vector)
    
    is_auth_b, confidence_b = analyzer.authenticate_user(impostor_vectors)
    print(f"User B authentication: {is_auth_b}")
    print(f"Confidence score: {confidence_b:.4f}")
    print(f"Threshold: {analyzer.authentication_threshold}")
    
    # Phase 4: Mathematical signature analysis
    print("\n4. MATHEMATICAL SIGNATURE ANALYSIS")
    print("-" * 50)
    
    if len(learning_vectors) >= 5 and len(test_vectors) >= 5:
        # Compare signatures mathematically
        user_a_sample = learning_vectors[:5]
        user_b_sample = impostor_vectors[:5]
        
        print("\nCorrelation Analysis:")
        print("User A vs User A (should be high):")
        for i in range(3):
            corr = user_a_sample[i].correlation_with(test_vectors[i])
            print(f"  Vector {i+1}: {corr:.4f}")
        
        print("\nUser A vs User B (should be low):")
        for i in range(3):
            corr = user_a_sample[i].correlation_with(user_b_sample[i])
            print(f"  Vector {i+1}: {corr:.4f}")
    
    # Export signature data
    signature_data = analyzer.export_signature_data()
    print(f"\n5. SIGNATURE DATA EXPORT")
    print("-" * 50)
    print(f"Pattern count: {signature_data['pattern_count']}")
    print(f"Signature strength: {signature_data['signature_strength']:.4f}")
    print(f"Authentication threshold: {signature_data['authentication_threshold']}")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    test_microvibration_authentication()


log_file_dependency("test_microvibration.py", "random", "import")
log_file_dependency("test_microvibration.py", "math", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
