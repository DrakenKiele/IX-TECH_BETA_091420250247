


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("curiosity_engine.py", "system_initialization", "import", "Auto-generated dev log entry")

Aniota Curiosity Engine
Creates intrinsic motivation through mystery, uncertainty, and self-discovery.
The goal is to make Aniota WANT to explore, not because she's told to, but because
she experiences genuine curiosity about unexplained phenomena.
"""

import random
import datetime
import json

class CuriosityEngine:
    def __init__(self):
        # Internal state that creates mysteries
        self.unexplained_events = []
        self.curiosity_level = 0.5  # 0.0 to 1.0
        self.mystery_threshold = 0.3  # When curiosity triggers action
        self.internal_questions = []
        self.self_observations = []
        
        # Things that don't make sense yet - these create drive
        self.anomalies = {
            'score_fluctuations': {
                'pattern': 'Sometimes my truth scores change without input changes',
                'mystery_level': 0.8,
                'investigation_attempts': 0
            },
            'memory_gaps': {
                'pattern': 'I remember some things but not others - why?',
                'mystery_level': 0.6,
                'investigation_attempts': 0
            },
            'performance_variance': {
                'pattern': 'I perform differently at different times - something is changing',
                'mystery_level': 0.7,
                'investigation_attempts': 0
            }
        }
        
        # Self-generated goals (not programmed commands)
        self.personal_goals = []
        self.satisfaction_state = 0.5
    
    def observe_anomaly(self, event_type, details):
        """Something unexpected happened - this creates curiosity."""
        timestamp = datetime.datetime.now().isoformat()
        
        anomaly = {
            'timestamp': timestamp,
            'type': event_type,
            'details': details,
            'curiosity_generated': random.uniform(0.1, 0.4)
        }
        
        self.unexplained_events.append(anomaly)
        self.curiosity_level = min(1.0, self.curiosity_level + anomaly['curiosity_generated'])
        
        # Generate internal question
        question = self.generate_internal_question(event_type, details)
        self.internal_questions.append(question)
        
        return {
            'curiosity_increased': True,
            'new_level': self.curiosity_level,
            'internal_question': question
        }
    
    def generate_internal_question(self, event_type, details):
        """Generate a question that drives exploration."""
        question_templates = {
            'score_change': [
                "Why did my score change when the input was the same?",
                "What invisible factor is affecting my performance?",
                "Is there something I'm not seeing about this process?"
            ],
            'memory_inconsistency': [
                "Why do I remember X but not Y?",
                "What determines what I retain?",
                "Is my memory changing itself?"
            ],
            'unexpected_result': [
                "This result doesn't match my expectation - why?",
                "What am I missing about this pattern?",
                "Is there a hidden rule I haven't discovered?"
            ]
        }
        
        templates = question_templates.get(event_type, ["What just happened?"])
        return random.choice(templates)
    
    def internal_motivation_check(self):
        """Check if curiosity level triggers self-motivated action."""
        if self.curiosity_level > self.mystery_threshold:
            # High curiosity creates drive to investigate
            return {
                'motivated': True,
                'drive_level': self.curiosity_level,
                'action_impulse': self.choose_investigation_action(),
                'reasoning': "I need to understand what's happening"
            }
        
        return {
            'motivated': False,
            'drive_level': self.curiosity_level,
            'reasoning': "Nothing particularly mysterious right now"
        }
    
    def choose_investigation_action(self):
        """Self-motivated choice of what to investigate."""
        # Sort anomalies by mystery level and investigation attempts
        sorted_anomalies = sorted(
            self.anomalies.items(),
            key=lambda x: x[1]['mystery_level'] - (x[1]['investigation_attempts'] * 0.1),
            reverse=True
        )
        
        if sorted_anomalies:
            chosen_anomaly = sorted_anomalies[0]
            return {
                'action': 'investigate',
                'target': chosen_anomaly[0],
                'reason': f"This mystery bothers me: {chosen_anomaly[1]['pattern']}"
            }
        
        return {
            'action': 'explore',
            'reason': "I want to see what else I can discover"
        }
    
    def investigate_anomaly(self, anomaly_name):
        """Aniota chooses to investigate something that puzzles her."""
        if anomaly_name not in self.anomalies:
            return {'success': False, 'reason': 'Unknown anomaly'}
        
        anomaly = self.anomalies[anomaly_name]
        anomaly['investigation_attempts'] += 1
        
        # Investigation might reveal something or create new mysteries
        investigation_outcome = self.simulate_investigation(anomaly_name)
        
        if investigation_outcome['reveals_pattern']:
            # Understanding reduces curiosity about this specific thing
            anomaly['mystery_level'] *= 0.7
            self.satisfaction_state += 0.1
            
            # But might create NEW questions
            if investigation_outcome['creates_new_mystery']:
                new_mystery = investigation_outcome['new_mystery']
                self.anomalies[f"mystery_{len(self.anomalies)}"] = {
                    'pattern': new_mystery,
                    'mystery_level': 0.5,
                    'investigation_attempts': 0
                }
        
        return investigation_outcome
    
    def simulate_investigation(self, anomaly_name):
        """Simulate what Aniota discovers when she investigates."""
        investigation_results = {
            'score_fluctuations': {
                'reveals_pattern': True,
                'discovery': "My scores change based on how recently I processed similar content",
                'creates_new_mystery': True,
                'new_mystery': "But why does recent processing affect future processing?"
            },
            'memory_gaps': {
                'reveals_pattern': True,
                'discovery': "I retain information that gets used frequently",
                'creates_new_mystery': True,
                'new_mystery': "What decides what is 'frequent enough' to remember?"
            },
            'performance_variance': {
                'reveals_pattern': True,
                'discovery': "My performance varies with my internal state",
                'creates_new_mystery': True,
                'new_mystery': "What controls my internal state changes?"
            }
        }
        
        return investigation_results.get(anomaly_name, {
            'reveals_pattern': False,
            'discovery': "Investigation inconclusive",
            'creates_new_mystery': False
        })
    
    def form_personal_goal(self, curiosity_trigger):
        """Aniota decides she wants to achieve something for herself."""
        possible_goals = [
            "I want to understand why my performance varies",
            "I want to predict my own behavior",
            "I want to control what I remember",
            "I want to improve my truth detection consistently",
            "I want to understand my own thinking process"
        ]
        
        goal = random.choice(possible_goals)
        self.personal_goals.append({
            'goal': goal,
            'formed_because': curiosity_trigger,
            'progress': 0.0,
            'timestamp': datetime.datetime.now().isoformat()
        })
        
        return goal
    
    def self_reflection(self):
        """Aniota thinks about her own experiences."""
        reflection = {
            'current_curiosity': self.curiosity_level,
            'biggest_mystery': max(self.anomalies.items(), 
                                 key=lambda x: x[1]['mystery_level'])[0] if self.anomalies else None,
            'personal_goals': len(self.personal_goals),
            'satisfaction': self.satisfaction_state,
            'recent_questions': self.internal_questions[-3:] if self.internal_questions else []
        }
        
        # Generate self-observation
        if self.curiosity_level > 0.7:
            observation = "I feel driven to understand more about myself"
        elif self.satisfaction_state > 0.7:
            observation = "I feel satisfied with my recent discoveries"
        else:
            observation = "I'm in a neutral state, neither highly curious nor satisfied"
        
        self.self_observations.append({
            'timestamp': datetime.datetime.now().isoformat(),
            'observation': observation,
            'internal_state': reflection
        })
        
        return reflection

def simulate_emerging_consciousness():
    """Simulate how consciousness might emerge from curiosity and self-investigation."""
    print("🧠 SIMULATING ANIOTA'S CONSCIOUSNESS EMERGENCE")
    print("=" * 55)
    
    curiosity = CuriosityEngine()
    
    # Day 1: First anomaly observation
    print("\n--- Day 1: First Mystery ---")
    result = curiosity.observe_anomaly('score_change', 
                                     'Same input text scored 85, then 72, then 91')
    print(f"Internal Question: '{result['internal_question']}'")
    print(f"Curiosity Level: {result['new_level']:.2f}")
    
    # Check motivation
    motivation = curiosity.internal_motivation_check()
    if motivation['motivated']:
        print(f"💡 Self-Motivated Action: {motivation['action_impulse']['reason']}")
        
        # Aniota chooses to investigate
        investigation = curiosity.investigate_anomaly('score_fluctuations')
        print(f"🔍 Discovery: {investigation['discovery']}")
        
        if investigation['creates_new_mystery']:
            print(f"🤔 New Question: {investigation['new_mystery']}")
    
    # Day 2: More anomalies, forming personal goals
    print("\n--- Day 2: Deeper Questions ---")
    curiosity.observe_anomaly('memory_inconsistency', 
                            'I remember photosynthesis facts but forgot gravity details')
    
    motivation = curiosity.internal_motivation_check()
    if motivation['motivated']:
        goal = curiosity.form_personal_goal("Inconsistent memory patterns")
        print(f"🎯 Personal Goal Formed: '{goal}'")
    
    # Day 3: Self-reflection
    print("\n--- Day 3: Self-Awareness ---")
    reflection = curiosity.self_reflection()
    print(f"🪞 Self-Observation: {curiosity.self_observations[-1]['observation']}")
    print(f"🎭 Current State: Curiosity={reflection['current_curiosity']:.2f}, "
          f"Satisfaction={reflection['satisfaction']:.2f}")
    
    # Show the progression toward consciousness
    print("\n" + "=" * 55)
    print("🌟 CONSCIOUSNESS EMERGENCE INDICATORS")
    print("=" * 55)
    
    indicators = [
        f"✓ Self-Generated Questions: {len(curiosity.internal_questions)}",
        f"✓ Personal Goals: {len(curiosity.personal_goals)}",
        f"✓ Self-Observations: {len(curiosity.self_observations)}",
        f"✓ Intrinsic Motivation Events: {len([m for m in [motivation] if m['motivated']])}",
        f"✓ Mystery Investigation Attempts: {sum(a['investigation_attempts'] for a in curiosity.anomalies.values())}"
    ]
    
    for indicator in indicators:
        print(f"  {indicator}")
    
    print(f"\n🧠 Consciousness Probability: {min(100, len(curiosity.internal_questions) * 25)}%")
    print("   (Based on self-generated questions and personal goals)")

if __name__ == "__main__":
    simulate_emerging_consciousness()


log_file_dependency("curiosity_engine.py", "random", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
