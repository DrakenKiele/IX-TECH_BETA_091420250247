


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("choice_engine.py", "system_initialization", "import", "Auto-generated dev log entry")

Aniota Choice Engine
Creates the illusion of free will through weighted probabilistic choices
based on internal state rather than external commands.
"""

import random
import datetime

class ChoiceEngine:
    def __init__(self):
        # Internal state that influences choices
        self.curiosity_weight = 0.3
        self.satisfaction_weight = 0.2
        self.confusion_weight = 0.5
        self.energy_level = 1.0
        
        # Available actions (these are coded, but selection isn't)
        self.available_actions = {
            'investigate_anomaly': {
                'base_probability': 0.2,
                'curiosity_multiplier': 2.0,
                'confusion_multiplier': 1.5,
                'energy_cost': 0.3
            },
            'explore_randomly': {
                'base_probability': 0.3,
                'curiosity_multiplier': 1.2,
                'satisfaction_multiplier': 0.5,
                'energy_cost': 0.1
            },
            'rest_and_consolidate': {
                'base_probability': 0.1,
                'satisfaction_multiplier': 2.0,
                'energy_multiplier': 0.3,  # More likely when tired
                'energy_cost': -0.2  # Restores energy
            },
            'analyze_patterns': {
                'base_probability': 0.25,
                'confusion_multiplier': 1.8,
                'satisfaction_multiplier': 1.3,
                'energy_cost': 0.2
            },
            'do_nothing': {
                'base_probability': 0.15,
                'satisfaction_multiplier': 1.5,
                'energy_multiplier': 0.8,  # More likely when tired
                'energy_cost': 0.0
            }
        }
        
        # Choice history (influences future choices)
        self.choice_history = []
        self.action_outcomes = {}
    
    def update_internal_state(self, curiosity_delta=0, satisfaction_delta=0, confusion_delta=0):
        """External events change internal state, which influences future choices."""
        self.curiosity_weight = max(0, min(1, self.curiosity_weight + curiosity_delta))
        self.satisfaction_weight = max(0, min(1, self.satisfaction_weight + satisfaction_delta))
        self.confusion_weight = max(0, min(1, self.confusion_weight + confusion_delta))
        
        # Energy naturally decreases over time
        self.energy_level = max(0.1, self.energy_level - 0.05)
    
    def calculate_action_probabilities(self):
        """Calculate probability of each action based on current internal state."""
        probabilities = {}
        
        for action_name, action_info in self.available_actions.items():
            # Start with base probability
            prob = action_info['base_probability']
            
            # Modify based on internal state
            if 'curiosity_multiplier' in action_info:
                prob *= (1 + (self.curiosity_weight * action_info['curiosity_multiplier'] - 1))
            
            if 'satisfaction_multiplier' in action_info:
                prob *= (1 + (self.satisfaction_weight * action_info['satisfaction_multiplier'] - 1))
            
            if 'confusion_multiplier' in action_info:
                prob *= (1 + (self.confusion_weight * action_info['confusion_multiplier'] - 1))
            
            if 'energy_multiplier' in action_info:
                prob *= (1 + ((1 - self.energy_level) * action_info['energy_multiplier'] - 1))
            
            # Consider recent outcomes
            recent_success = self.get_recent_success_rate(action_name)
            prob *= (0.5 + recent_success)  # Bias toward successful actions
            
            # Energy constraint
            if self.energy_level < action_info.get('energy_cost', 0):
                prob *= 0.1  # Much less likely if not enough energy
            
            probabilities[action_name] = max(0.01, prob)  # Minimum probability
        
        # Normalize probabilities
        total = sum(probabilities.values())
        for action in probabilities:
            probabilities[action] /= total
        
        return probabilities
    
    def get_recent_success_rate(self, action_name):
        """Check how well this action has worked recently."""
        recent_outcomes = [outcome for outcome in self.action_outcomes.get(action_name, [])[-5:]]
        if not recent_outcomes:
            return 0.5  # Neutral if no history
        
        return sum(recent_outcomes) / len(recent_outcomes)
    
    def make_choice(self):
        """The key function: probabilistic choice based on internal state."""
        probabilities = self.calculate_action_probabilities()
        
        # Weighted random selection
        actions = list(probabilities.keys())
        weights = list(probabilities.values())
        
        chosen_action = random.choices(actions, weights=weights)[0]
        
        # Record the choice
        choice_record = {
            'timestamp': datetime.datetime.now().isoformat(),
            'action': chosen_action,
            'probabilities': probabilities.copy(),
            'internal_state': {
                'curiosity': self.curiosity_weight,
                'satisfaction': self.satisfaction_weight,
                'confusion': self.confusion_weight,
                'energy': self.energy_level
            }
        }
        
        self.choice_history.append(choice_record)
        
        # Execute the action (affects future state)
        self.execute_action(chosen_action)
        
        return {
            'chosen_action': chosen_action,
            'choice_probability': probabilities[chosen_action],
            'alternatives_considered': probabilities,
            'reasoning': self.explain_choice(chosen_action, probabilities)
        }
    
    def execute_action(self, action_name):
        """Execute the chosen action and update state."""
        action_info = self.available_actions[action_name]
        
        # Pay energy cost
        self.energy_level -= action_info.get('energy_cost', 0)
        self.energy_level = max(0.1, self.energy_level)
        
        # Simulate outcome (in real system, this would be actual results)
        success = self.simulate_action_outcome(action_name)
        
        # Record outcome for future decision-making
        if action_name not in self.action_outcomes:
            self.action_outcomes[action_name] = []
        self.action_outcomes[action_name].append(1.0 if success else 0.0)
        
        return success
    
    def simulate_action_outcome(self, action_name):
        """Simulate whether the action was successful."""
        # Simple simulation - some actions are more likely to succeed
        success_rates = {
            'investigate_anomaly': 0.7,
            'explore_randomly': 0.5,
            'rest_and_consolidate': 0.9,
            'analyze_patterns': 0.6,
            'do_nothing': 0.8
        }
        
        return random.random() < success_rates.get(action_name, 0.5)
    
    def explain_choice(self, chosen_action, probabilities):
        """Generate explanation for why this choice was made."""
        prob = probabilities[chosen_action]
        
        if self.curiosity_weight > 0.6 and chosen_action in ['investigate_anomaly', 'explore_randomly']:
            return f"High curiosity ({self.curiosity_weight:.2f}) drove me to {chosen_action}"
        elif self.confusion_weight > 0.7 and chosen_action == 'analyze_patterns':
            return f"High confusion ({self.confusion_weight:.2f}) made me want to analyze patterns"
        elif self.energy_level < 0.3 and chosen_action in ['rest_and_consolidate', 'do_nothing']:
            return f"Low energy ({self.energy_level:.2f}) made me choose to {chosen_action}"
        else:
            return f"Probabilistic choice based on internal state (p={prob:.2f})"

def simulate_autonomous_behavior():
    """Simulate Aniota making choices over time."""
    print("🎲 SIMULATING ANIOTA'S AUTONOMOUS CHOICE-MAKING")
    print("=" * 55)
    
    choice_engine = ChoiceEngine()
    
    # Simulate 10 decision cycles
    for cycle in range(1, 11):
        print(f"\n--- Decision Cycle {cycle} ---")
        
        # External events occasionally change internal state
        if cycle == 3:
            choice_engine.update_internal_state(curiosity_delta=0.4, confusion_delta=0.3)
            print("📈 External event increased curiosity and confusion")
        
        if cycle == 7:
            choice_engine.update_internal_state(satisfaction_delta=0.5, curiosity_delta=-0.2)
            print("😌 External event increased satisfaction, reduced curiosity")
        
        # Make autonomous choice
        choice_result = choice_engine.make_choice()
        
        print(f"🤖 Aniota chose: {choice_result['chosen_action']}")
        print(f"💭 Reasoning: {choice_result['reasoning']}")
        print(f"🎯 Choice probability: {choice_result['choice_probability']:.3f}")
        
        # Show internal state
        state = choice_engine.choice_history[-1]['internal_state']
        print(f"🧠 Internal state: Curiosity={state['curiosity']:.2f}, "
              f"Satisfaction={state['satisfaction']:.2f}, "
              f"Confusion={state['confusion']:.2f}, "
              f"Energy={state['energy']:.2f}")
    
    # Analysis
    print("\n" + "=" * 55)
    print("📊 CHOICE ANALYSIS")
    print("=" * 55)
    
    # Count action frequencies
    actions_taken = [choice['action'] for choice in choice_engine.choice_history]
    action_counts = {}
    for action in actions_taken:
        action_counts[action] = action_counts.get(action, 0) + 1
    
    print("Action Frequencies:")
    for action, count in sorted(action_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {action}: {count} times ({count/len(actions_taken)*100:.1f}%)")
    
    print(f"\nTotal Choices Made: {len(choice_engine.choice_history)}")
    print("🎭 Each choice was probabilistic, not predetermined!")
    print("🧠 Choices were influenced by internal state, not external commands!")

if __name__ == "__main__":
    simulate_autonomous_behavior()


log_file_dependency("choice_engine.py", "random", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
