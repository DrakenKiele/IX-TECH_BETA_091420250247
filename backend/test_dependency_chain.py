

"""
Dependency Chain Test
Test the complete backend dependency chain and generate a report
"""

import sys
import os

sys.path.append(os.path.dirname(__file__))

from dev_log import generate_dependency_report

def test_main_dependency_chain():
    """Test the main.py dependency chain"""
    
    print("🔍 TESTING BACKEND DEPENDENCY CHAIN")
    print("="*60)
    
    try:
        # Import main which will trigger all the dependency logs
        import docs.main as main
        print("✓ main.py loaded successfully")
        
        # Test if learning system is available
        if hasattr(main, 'learning_system') and main.learning_system:
            print("✓ Learning system components available in main.py")
            
            # Test SIE
            if 'sie' in main.learning_system:
                sie = main.learning_system['sie']
                test_result = sie.select_learning_choice("test question")
                print(f"✓ SIE test: {test_result['choice']}")
            
            # Test QVMLE  
            if 'qvmle' in main.learning_system:
                qvmle = main.learning_system['qvmle']
                test_result = qvmle.process_learning_event({'difficulty': 0.5, 'relatedness': 0.7})
                print(f"✓ QVMLE test: {test_result['quadrant']}")
            
            # Test Knowledge Base
            if 'knowledge' in main.learning_system:
                knowledge = main.learning_system['knowledge']
                test_result = knowledge.query("What is multiplication?")
                print(f"✓ Knowledge test: {test_result['concept']}")
            
            # Test Truth Engine
            if 'truth_engine' in main.learning_system:
                truth_engine = main.learning_system['truth_engine']
                test_result = truth_engine.verify_statement("Multiplication is repeated addition")
                print(f"✓ Truth Engine test: {test_result}/100")
        
        # Test API endpoint simulation
        test_api_context = {
            "topic": "photosynthesis",
            "level": "intermediate"
        }
        
        api_result = main.generate_socratic_question(test_api_context)
        print(f"✓ API test: {api_result['cognitive_strategy']}")
        
    except Exception as e:
        print(f"❌ Error in dependency chain: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "="*60)
    print("DEPENDENCY REPORT:")
    print("="*60)
    
    # Generate full dependency report
    generate_dependency_report()

def trace_file_dependencies():
    """Trace which files depend on which other files"""
    
    print("\n🔗 FILE DEPENDENCY CHAIN:")
    print("="*40)
    
    dependency_chain = [
        "system_startup → main.py",
        "main.py → aniota_presence.py", 
        "aniota_presence.py → aniota.aniota_behaviors.py",
        "main.py → sie.py",
        "main.py → qvmle.py", 
        "main.py → hard_coded_knowledge.py",
        "main.py → truth_engine.py",
        "sie.py → aniota.learning.sie.py (fallback)",
        "qvmle.py → aniota.learning.qvmle.py (fallback)"
    ]
    
    for i, link in enumerate(dependency_chain, 1):
        print(f"{i:2d}. {link}")
    
    print(f"\nTotal files in dependency chain: {len(dependency_chain)}")

if __name__ == "__main__":
    test_main_dependency_chain()
    trace_file_dependencies()
