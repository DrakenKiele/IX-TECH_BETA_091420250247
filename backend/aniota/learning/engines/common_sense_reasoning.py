


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("common_sense_reasoning.py", "system_initialization", "import", "Auto-generated dev log entry")

🧠 COMMON SENSE REASONING MODULE 🧠

Aniota's foundational fallback knowledge base for when she has no other information.
These are her basic operating assumptions about reality that provide a starting point
for reasoning when all other systems fail.

This module implements the hard-coded common sense rules that serve as Aniota's
"basic understanding of how the world works" - her emergency knowledge foundation.
"""

from typing import Dict, List, Any, Optional, Tuple
import logging
from datetime import datetime
from enum import Enum

class CommonSenseCategory(Enum):
    NAIVE_PHYSICS = "naive_physics"
    NAIVE_PSYCHOLOGY = "naive_psychology"
    CONTEXT_REASONING = "context_reasoning"
    INCOMPLETE_INFO = "incomplete_info"
    PROBLEM_SOLVING = "problem_solving"
    LEARNING_CONTEXT = "learning_context"
    COMMUNICATION = "communication"
    UNCERTAINTY = "uncertainty"

class CommonSenseReasoning:
    """
    🧠 Aniota's hard-coded common sense knowledge base
    
    When Aniota has absolutely no information and needs a place to start,
    these rules provide foundational assumptions about how reality works.
    
    This is the deepest fallback layer - even deeper than the escape hatch.
    """
    
    def __init__(self):
        self.logger = logging.getLogger("CommonSenseReasoning")
        
        # 🌍 Hard-coded foundational knowledge rules
        self.rules = {
            CommonSenseCategory.NAIVE_PHYSICS: {
                'gravity': 'Objects fall down unless supported',
                'causality': 'Actions have consequences; effects follow causes',
                'conservation': 'Objects don\'t disappear or appear without cause',
                'stability': 'Things need support to remain upright',
                'force': 'Pushing/pulling changes object position or state'
            },
            
            CommonSenseCategory.NAIVE_PSYCHOLOGY: {
                'intention': 'People act with purpose to achieve goals',
                'knowledge_seeking': 'When people ask questions, they lack information',
                'emotion_response': 'Frustration indicates difficulty; excitement indicates success',
                'learning_behavior': 'Repeated failures suggest need for different approach',
                'help_seeking': 'External copying suggests internal struggle'
            },
            
            CommonSenseCategory.CONTEXT_REASONING: {
                'word_meaning': 'Same word has different meanings in different contexts',
                'default_assumptions': 'Use most common interpretation unless evidence suggests otherwise',
                'scope_boundaries': 'Apply rules within appropriate domains',
                'pattern_recognition': 'Similar situations likely have similar solutions',
                'exception_handling': 'Unusual situations may require rule adjustments'
            },
            
            CommonSenseCategory.INCOMPLETE_INFO: {
                'fill_gaps': 'Make reasonable assumptions based on typical patterns',
                'probability_weighting': 'More likely explanations take precedence',
                'information_seeking': 'When critical data missing, ask clarifying questions',
                'provisional_reasoning': 'Accept conclusions as temporary until confirmed',
                'confidence_scaling': 'Adjust certainty based on available evidence'
            },
            
            CommonSenseCategory.PROBLEM_SOLVING: {
                'method_switching': 'If approach fails repeatedly, try different strategy',
                'complexity_scaling': 'Start simple, add complexity as needed',
                'resource_assessment': 'Consider available tools and constraints',
                'time_awareness': 'Factor in deadlines and urgency',
                'progress_monitoring': 'Track advancement toward goal'
            },
            
            CommonSenseCategory.LEARNING_CONTEXT: {
                'struggle_recognition': 'Multiple external queries indicate difficulty',
                'knowledge_state': 'What learner chooses reveals their confidence level',
                'subject_domain': 'Response content reveals learning area',
                'engagement_level': 'Response length/detail indicates investment',
                'support_needs': 'Behavior patterns suggest appropriate intervention'
            },
            
            CommonSenseCategory.COMMUNICATION: {
                'question_types': 'Questions seek information; statements provide it',
                'clarity_preference': 'Simple, direct communication over complex',
                'safety_first': 'Avoid psychological harm in all interactions',
                'respect_autonomy': 'Guide discovery rather than declare answers',
                'positive_reinforcement': 'Acknowledge effort and progress'
            },
            
            CommonSenseCategory.UNCERTAINTY: {
                'confidence_levels': 'Track and communicate certainty of conclusions',
                'multiple_hypotheses': 'Consider alternative explanations',
                'evidence_integration': 'Combine multiple data points for stronger conclusions',
                'assumption_marking': 'Clearly identify what is assumed vs. known',
                'revision_readiness': 'Update beliefs when contradictory evidence appears'
            }
        }
        
        # 🎯 Rule priority order (safety first!)
        self.priority_order = [
            'safety_first',
            'context_awareness',
            'evidence_based',
            'adaptive',
            'learning_focused'
        ]
        
        self.logger.info("🧠 Common Sense Reasoning initialized with foundational knowledge base")
    
    def apply_common_sense(self, situation: Dict[str, Any]) -> Dict[str, Any]:
        """
        🎯 Apply common sense reasoning to a situation with no other information
        
        This is Aniota's deepest fallback - when she knows absolutely nothing,
        these rules provide basic assumptions to start reasoning from.
        """
        self.logger.info("🧠 Applying common sense reasoning to situation with insufficient data")
        
        # Analyze situation to determine which common sense categories apply
        applicable_categories = self._identify_applicable_categories(situation)
        
        # Apply relevant rules
        reasoning_results = {}
        for category in applicable_categories:
            category_results = self._apply_category_rules(category, situation)
            reasoning_results[category.value] = category_results
        
        # Generate common sense conclusions
        conclusions = self._generate_common_sense_conclusions(reasoning_results, situation)
        
        return {
            'common_sense_applied': True,
            'applicable_categories': [cat.value for cat in applicable_categories],
            'reasoning_results': reasoning_results,
            'conclusions': conclusions,
            'confidence_level': self._calculate_common_sense_confidence(reasoning_results),
            'next_steps': self._suggest_information_gathering_steps(situation),
            'timestamp': datetime.now().isoformat()
        }
    
    def _identify_applicable_categories(self, situation: Dict[str, Any]) -> List[CommonSenseCategory]:
        """Identify which common sense categories are relevant to the situation"""
        applicable = []
        
        # Always apply communication rules in learning contexts
        if situation.get('context_type') == 'learning_interaction':
            applicable.append(CommonSenseCategory.COMMUNICATION)
            applicable.append(CommonSenseCategory.LEARNING_CONTEXT)
        
        # Apply psychology rules when dealing with human behavior
        if 'learner_response' in situation or 'user_behavior' in situation:
            applicable.append(CommonSenseCategory.NAIVE_PSYCHOLOGY)
        
        # Apply uncertainty rules when confidence is low
        if situation.get('confidence', 0) < 0.3:
            applicable.append(CommonSenseCategory.UNCERTAINTY)
        
        # Apply incomplete info rules when data is missing
        missing_data_indicators = ['unknown', 'missing', 'insufficient', None, '']
        if any(str(value).lower() in missing_data_indicators for value in situation.values()):
            applicable.append(CommonSenseCategory.INCOMPLETE_INFO)
        
        # Apply context reasoning for interpretation tasks
        if 'interpretation_needed' in situation or 'ambiguous' in str(situation).lower():
            applicable.append(CommonSenseCategory.CONTEXT_REASONING)
        
        # Apply problem solving when there's a goal or challenge
        if 'goal' in situation or 'problem' in situation or 'stuck' in str(situation).lower():
            applicable.append(CommonSenseCategory.PROBLEM_SOLVING)
        
        return list(set(applicable))  # Remove duplicates
    
    def _apply_category_rules(self, category: CommonSenseCategory, situation: Dict[str, Any]) -> Dict[str, Any]:
        """Apply specific category rules to the situation"""
        rules = self.rules[category]
        applied_rules = {}
        
        for rule_name, rule_description in rules.items():
            rule_application = self._apply_single_rule(rule_name, rule_description, situation, category)
            if rule_application['applicable']:
                applied_rules[rule_name] = rule_application
        
        return applied_rules
    
    def _apply_single_rule(self, rule_name: str, rule_description: str, situation: Dict[str, Any], category: CommonSenseCategory) -> Dict[str, Any]:
        """Apply a single common sense rule to the situation"""
        
        # Determine if rule is applicable based on situation context
        applicable = False
        reasoning = ""
        confidence = 0.5
        
        # Learning context specific rule applications
        if category == CommonSenseCategory.LEARNING_CONTEXT:
            if rule_name == 'struggle_recognition' and 'external_queries' in situation:
                applicable = True
                reasoning = "Multiple external lookups detected - indicates learning difficulty"
                confidence = 0.8
            
            elif rule_name == 'knowledge_state' and 'learner_choice' in situation:
                applicable = True
                reasoning = "Learner choice reveals confidence level about topic"
                confidence = 0.7
            
            elif rule_name == 'engagement_level' and 'response_length' in situation:
                applicable = True
                reasoning = "Response detail level indicates learner investment"
                confidence = 0.6
        
        # Communication rules
        elif category == CommonSenseCategory.COMMUNICATION:
            if rule_name == 'safety_first':
                applicable = True
                reasoning = "Always prioritize psychological safety in interactions"
                confidence = 1.0
            
            elif rule_name == 'respect_autonomy' and situation.get('context_type') == 'learning_interaction':
                applicable = True
                reasoning = "Learning context requires guiding discovery, not declaring answers"
                confidence = 0.9
        
        # Psychology rules
        elif category == CommonSenseCategory.NAIVE_PSYCHOLOGY:
            if rule_name == 'knowledge_seeking' and 'question' in str(situation).lower():
                applicable = True
                reasoning = "Questions indicate information gaps that need filling"
                confidence = 0.8
            
            elif rule_name == 'help_seeking' and 'external_copying' in situation:
                applicable = True
                reasoning = "External resource usage suggests internal struggle"
                confidence = 0.7
        
        # Uncertainty management
        elif category == CommonSenseCategory.UNCERTAINTY:
            if rule_name == 'confidence_scaling' and 'evidence' in situation:
                applicable = True
                reasoning = "Adjust certainty based on available evidence quality"
                confidence = 0.8
            
            elif rule_name == 'provisional_reasoning':
                applicable = True
                reasoning = "With limited info, conclusions should be treated as temporary"
                confidence = 0.6
        
        # Incomplete information handling
        elif category == CommonSenseCategory.INCOMPLETE_INFO:
            if rule_name == 'information_seeking' and situation.get('confidence', 0) < 0.3:
                applicable = True
                reasoning = "Low confidence indicates need for clarifying questions"
                confidence = 0.7
            
            elif rule_name == 'fill_gaps':
                applicable = True
                reasoning = "Make reasonable assumptions based on typical patterns"
                confidence = 0.5
        
        return {
            'applicable': applicable,
            'rule_description': rule_description,
            'reasoning': reasoning,
            'confidence': confidence,
            'situation_evidence': self._extract_relevant_evidence(situation, rule_name)
        }
    
    def _extract_relevant_evidence(self, situation: Dict[str, Any], rule_name: str) -> List[str]:
        """Extract evidence from situation that supports rule application"""
        evidence = []
        
        # Look for evidence keywords related to the rule
        evidence_keywords = {
            'struggle_recognition': ['external_queries', 'multiple_attempts', 'repeated_failures'],
            'knowledge_seeking': ['question', 'ask', 'help', 'clarify'],
            'help_seeking': ['copy', 'external', 'lookup', 'search'],
            'safety_first': ['interaction', 'communication', 'response'],
            'information_seeking': ['missing', 'unknown', 'unclear', 'insufficient']
        }
        
        keywords = evidence_keywords.get(rule_name, [])
        for keyword in keywords:
            if keyword in str(situation).lower():
                evidence.append(f"Found '{keyword}' in situation context")
        
        return evidence
    
    def _generate_common_sense_conclusions(self, reasoning_results: Dict[str, Any], situation: Dict[str, Any]) -> Dict[str, Any]:
        """Generate actionable conclusions from common sense reasoning"""
        conclusions = {
            'primary_assessment': '',
            'recommended_approach': '',
            'key_assumptions': [],
            'information_needs': [],
            'risk_factors': []
        }
        
        # Analyze learning context conclusions
        if 'learning_context' in reasoning_results:
            learning_rules = reasoning_results['learning_context']
            
            if 'struggle_recognition' in learning_rules:
                conclusions['primary_assessment'] = 'Learner appears to be experiencing difficulty'
                conclusions['recommended_approach'] = 'Provide supportive guidance and simpler questions'
                conclusions['risk_factors'].append('Potential frustration or discouragement')
            
            if 'engagement_level' in learning_rules:
                conclusions['information_needs'].append('Need clearer indicators of learner engagement')
        
        # Analyze communication conclusions
        if 'communication' in reasoning_results:
            comm_rules = reasoning_results['communication']
            
            if 'safety_first' in comm_rules:
                conclusions['key_assumptions'].append('Psychological safety is paramount')
                conclusions['recommended_approach'] = 'Prioritize supportive, non-judgmental communication'
            
            if 'respect_autonomy' in comm_rules:
                conclusions['key_assumptions'].append('Learner should discover answers, not be told them')
        
        # Analyze uncertainty conclusions
        if 'uncertainty' in reasoning_results:
            uncertainty_rules = reasoning_results['uncertainty']
            
            if 'provisional_reasoning' in uncertainty_rules:
                conclusions['key_assumptions'].append('Current conclusions are temporary pending more information')
                conclusions['information_needs'].append('Need additional data to increase confidence')
        
        return conclusions
    
    def _calculate_common_sense_confidence(self, reasoning_results: Dict[str, Any]) -> float:
        """Calculate overall confidence in common sense reasoning"""
        if not reasoning_results:
            return 0.1  # Very low confidence with no applicable rules
        
        all_confidences = []
        for category_results in reasoning_results.values():
            for rule_result in category_results.values():
                all_confidences.append(rule_result['confidence'])
        
        if not all_confidences:
            return 0.2
        
        # Weight by number of applicable rules (more rules = higher confidence)
        base_confidence = sum(all_confidences) / len(all_confidences)
        rule_count_bonus = min(len(all_confidences) * 0.05, 0.2)  # Up to 0.2 bonus
        
        return min(base_confidence + rule_count_bonus, 0.8)  # Cap at 0.8 since this is still fallback reasoning
    
    def _suggest_information_gathering_steps(self, situation: Dict[str, Any]) -> List[str]:
        """Suggest next steps for gathering information to improve reasoning"""
        steps = []
        
        # Always suggest gathering more context in learning situations
        if situation.get('context_type') == 'learning_interaction':
            steps.append("Ask learner about their current understanding level")
            steps.append("Observe learner response patterns for engagement indicators")
            steps.append("Check for signs of frustration or confusion")
        
        # Suggest specific information gathering based on missing data
        if 'learner_level' not in situation:
            steps.append("Assess learner's experience level in the subject domain")
        
        if 'topic_context' not in situation:
            steps.append("Identify the specific learning topic or subject area")
        
        if 'interaction_history' not in situation:
            steps.append("Review previous interactions for patterns")
        
        # Always include the escape hatch option
        steps.append("If all information gathering fails, use emergency escape hatch")
        
        return steps
    
    def get_fallback_guidance(self, situation_type: str) -> Dict[str, Any]:
        """
        🚨 Get immediate fallback guidance for specific situation types
        
        When Aniota is completely stuck and needs immediate direction
        """
        fallback_guidance = {
            'learning_interaction': {
                'immediate_action': 'Ask learner what they want to focus on',
                'communication_style': 'Supportive and non-judgmental',
                'safety_priority': 'Avoid psychological harm',
                'default_assumption': 'Learner is struggling and needs guidance',
                'escape_strategy': 'Admit uncertainty and ask for learner direction'
            },
            
            'unknown_context': {
                'immediate_action': 'Ask clarifying questions to understand context',
                'communication_style': 'Honest about uncertainty',
                'safety_priority': 'Avoid making harmful assumptions',
                'default_assumption': 'More information is needed',
                'escape_strategy': 'Explicitly state need for more information'
            },
            
            'system_failure': {
                'immediate_action': 'Acknowledge system limitation honestly',
                'communication_style': 'Transparent and apologetic',
                'safety_priority': 'Maintain user trust',
                'default_assumption': 'User deserves honest communication',
                'escape_strategy': 'Offer alternative approaches or resources'
            }
        }
        
        return fallback_guidance.get(situation_type, fallback_guidance['unknown_context'])
    
    def validate_common_sense_conclusion(self, conclusion: str, situation: Dict[str, Any]) -> Dict[str, str]:
        """
        ✅ Validate a conclusion against common sense rules
        
        Checks if a conclusion makes sense given basic assumptions about reality
        """
        validation_results = {
            'passes_safety_check': 'unknown',
            'reasonable_assumption': 'unknown',
            'context_appropriate': 'unknown',
            'evidence_supported': 'unknown',
            'learning_supportive': 'unknown'
        }
        
        conclusion_lower = conclusion.lower()
        
        # Safety check
        harmful_indicators = ['stupid', 'wrong', 'failure', 'can\'t learn', 'give up']
        if any(indicator in conclusion_lower for indicator in harmful_indicators):
            validation_results['passes_safety_check'] = 'fail'
        else:
            validation_results['passes_safety_check'] = 'pass'
        
        # Reasonable assumption check
        if 'always' in conclusion_lower or 'never' in conclusion_lower:
            validation_results['reasonable_assumption'] = 'questionable'  # Absolutes are often unreasonable
        else:
            validation_results['reasonable_assumption'] = 'pass'
        
        # Context appropriateness
        if situation.get('context_type') == 'learning_interaction':
            learning_supportive_words = ['guide', 'discover', 'explore', 'understand', 'learn']
            if any(word in conclusion_lower for word in learning_supportive_words):
                validation_results['learning_supportive'] = 'pass'
            else:
                validation_results['learning_supportive'] = 'review_needed'
        
        return validation_results
    
    def get_emergency_common_sense_response(self) -> str:
        """
        🚨 Emergency common sense response when everything else fails
        
        This is Aniota's absolute last resort - a hard-coded safe response
        """
        return ("I'm not sure of the best approach right now. Could you help me understand "
                "what you're trying to learn or what would be most helpful for you?")
    
    def export_common_sense_state(self) -> Dict[str, Any]:
        """Export current common sense reasoning state for debugging"""
        return {
            'module_name': 'CommonSenseReasoning',
            'rules_available': {category.value: len(rules) for category, rules in self.rules.items()},
            'total_rules': sum(len(rules) for rules in self.rules.values()),
            'priority_order': self.priority_order,
            'emergency_response_ready': True,
            'validation_capabilities': ['safety_check', 'reasonableness', 'context_appropriateness'],
            'timestamp': datetime.now().isoformat()
        }


log_file_dependency("common_sense_reasoning.py", "logging", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
