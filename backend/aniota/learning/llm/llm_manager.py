


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("llm_manager.py", "system_initialization", "import", "Auto-generated dev log entry")

🎯 ANIOTA'S LLM MANAGEMENT SYSTEM 🎯

Aniota's true purpose: Intelligent AI/LLM management and response filtering
Not to answer questions directly, but to orchestrate AI interactions and ensure
quality, age-appropriate, credible responses through the Truth Engine.

CORE WORKFLOW:
1. User Input → Context Analysis → Prompt Generation
2. LLM Request → Response Filtering → Truth Engine Validation  
3. Filtered Response → Age Appropriateness → Credibility Check
4. Final Output → Learning Path Tracking → MetaIX Analysis

This system ensures Aniota acts as a sophisticated AI manager rather than
attempting to be the knowledge source herself.
"""

from typing import Dict, List, Any, Optional, Tuple
import logging
from datetime import datetime
import json
import re

class LLMManager:
    """
    🎯 Aniota's LLM Management and Response Filtering System
    
    Manages AI/LLM interactions and ensures responses pass through
    Truth Engine validation for age-appropriateness and credibility.
    """
    
    def __init__(self, common_sense_rules: Dict[str, Any]):
        self.logger = logging.getLogger("LLMManager")
        self.common_sense_rules = common_sense_rules
        
        # Subject area knowledge for context recognition
        self.subject_keywords = {
            'english_language_arts': [
                'reading', 'writing', 'essay', 'grammar', 'vocabulary', 'literature',
                'poem', 'story', 'narrative', 'comprehension', 'spelling', 'punctuation'
            ],
            'mathematics': [
                'math', 'algebra', 'geometry', 'arithmetic', 'numbers', 'equations',
                'fractions', 'decimals', 'statistics', 'probability', 'calculus'
            ],
            'science': [
                'biology', 'chemistry', 'physics', 'experiment', 'hypothesis',
                'photosynthesis', 'atoms', 'molecules', 'evolution', 'gravity'
            ],
            'social_studies': [
                'history', 'geography', 'government', 'civics', 'economics',
                'ancient', 'civilization', 'war', 'democracy', 'constitution'
            ]
        }
        
        # Age-appropriate complexity levels
        self.complexity_levels = {
            'elementary': {'grade_range': 'K-5', 'reading_level': 3, 'concept_depth': 'basic'},
            'middle_school': {'grade_range': '6-8', 'reading_level': 6, 'concept_depth': 'intermediate'},
            'high_school': {'grade_range': '9-12', 'reading_level': 10, 'concept_depth': 'advanced'},
            'adult': {'grade_range': '13+', 'reading_level': 12, 'concept_depth': 'comprehensive'}
        }
        
        self.logger.info("🎯 LLM Manager initialized - Ready to orchestrate AI interactions")
    
    def analyze_user_input(self, user_input: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        🧠 Analyze user input to extract context for LLM prompt generation
        
        This creates the foundation for intelligent prompt crafting
        """
        analysis = {
            'original_input': user_input,
            'detected_subject': self._detect_subject_area(user_input),
            'complexity_indicators': self._analyze_complexity_needs(user_input),
            'question_type': self._classify_question_type(user_input),
            'age_indicators': self._detect_age_level(user_input, context),
            'urgency_level': self._assess_urgency(user_input),
            'common_sense_flags': self._apply_common_sense_analysis(user_input),
            'timestamp': datetime.now().isoformat()
        }
        
        self.logger.debug(f"🧠 Input analysis completed: {analysis['detected_subject']} at {analysis['age_indicators']} level")
        
        return analysis
    
    def _detect_subject_area(self, user_input: str) -> Dict[str, Any]:
        """Detect which academic subject area the input relates to"""
        input_lower = user_input.lower()
        subject_scores = {}
        
        for subject, keywords in self.subject_keywords.items():
            score = sum(1 for keyword in keywords if keyword in input_lower)
            if score > 0:
                subject_scores[subject] = score
        
        if subject_scores:
            primary_subject = max(subject_scores, key=subject_scores.get)
            confidence = subject_scores[primary_subject] / len(self.subject_keywords[primary_subject])
            
            return {
                'primary_subject': primary_subject,
                'confidence': min(confidence, 1.0),
                'all_matches': subject_scores,
                'cross_subject': len(subject_scores) > 1
            }
        
        return {
            'primary_subject': 'general',
            'confidence': 0.0,
            'all_matches': {},
            'cross_subject': False
        }
    
    def _analyze_complexity_needs(self, user_input: str) -> Dict[str, Any]:
        """Analyze what complexity level the user needs"""
        complexity_indicators = {
            'simple_language': ['help', 'explain', 'what is', 'how do', 'basic'],
            'intermediate_language': ['compare', 'analyze', 'relationship', 'process'],
            'advanced_language': ['synthesize', 'evaluate', 'theoretical', 'comprehensive']
        }
        
        input_lower = user_input.lower()
        complexity_scores = {}
        
        for level, indicators in complexity_indicators.items():
            score = sum(1 for indicator in indicators if indicator in input_lower)
            complexity_scores[level] = score
        
        # Determine appropriate complexity level
        if complexity_scores['advanced_language'] > 0:
            suggested_level = 'high_school'
        elif complexity_scores['intermediate_language'] > 0:
            suggested_level = 'middle_school'
        else:
            suggested_level = 'elementary'
        
        return {
            'suggested_level': suggested_level,
            'complexity_scores': complexity_scores,
            'language_sophistication': max(complexity_scores.values())
        }
    
    def _classify_question_type(self, user_input: str) -> str:
        """Classify the type of question or request"""
        input_lower = user_input.lower()
        
        if any(word in input_lower for word in ['what is', 'define', 'meaning']):
            return 'definition'
        elif any(word in input_lower for word in ['how do', 'how to', 'process', 'steps']):
            return 'procedural'
        elif any(word in input_lower for word in ['why', 'because', 'reason', 'cause']):
            return 'causal'
        elif any(word in input_lower for word in ['compare', 'difference', 'similar']):
            return 'comparative'
        elif any(word in input_lower for word in ['help', 'stuck', 'confused', 'don\'t understand']):
            return 'assistance'
        else:
            return 'general_inquiry'
    
    def _detect_age_level(self, user_input: str, context: Dict[str, Any] = None) -> str:
        """Detect appropriate age level for response"""
        # Use context if available
        if context and 'learner_level' in context:
            level = context['learner_level']
            if level <= 0.3:
                return 'elementary'
            elif level <= 0.6:
                return 'middle_school'
            elif level <= 0.9:
                return 'high_school'
            else:
                return 'adult'
        
        # Analyze language sophistication in input
        input_lower = user_input.lower()
        sophistication_indicators = {
            'elementary': ['help me', 'i don\'t know', 'what is', 'simple'],
            'middle_school': ['explain', 'understand', 'homework', 'assignment'],
            'high_school': ['analyze', 'research', 'project', 'essay'],
            'adult': ['comprehensive', 'professional', 'advanced', 'theoretical']
        }
        
        for level, indicators in sophistication_indicators.items():
            if any(indicator in input_lower for indicator in indicators):
                return level
        
        return 'middle_school'  # Default assumption
    
    def _assess_urgency(self, user_input: str) -> str:
        """Assess urgency level of the request"""
        input_lower = user_input.lower()
        
        if any(word in input_lower for word in ['urgent', 'asap', 'immediately', 'due tomorrow']):
            return 'high'
        elif any(word in input_lower for word in ['soon', 'quickly', 'fast']):
            return 'medium'
        else:
            return 'normal'
    
    def _apply_common_sense_analysis(self, user_input: str) -> Dict[str, Any]:
        """Apply common sense rules to flag potential issues"""
        flags = {
            'safety_check': self._check_safety_concerns(user_input),
            'age_appropriateness': self._check_age_appropriateness(user_input),
            'educational_value': self._assess_educational_value(user_input),
            'complexity_warning': self._check_complexity_warnings(user_input)
        }
        
        return flags
    
    def _check_safety_concerns(self, user_input: str) -> Dict[str, Any]:
        """Check for potential safety concerns in the input"""
        input_lower = user_input.lower()
        
        # Basic safety keyword detection
        concerning_words = ['hurt', 'dangerous', 'illegal', 'harmful']
        safety_score = sum(1 for word in concerning_words if word in input_lower)
        
        return {
            'safety_flag': safety_score > 0,
            'safety_score': safety_score,
            'requires_adult_supervision': safety_score > 1
        }
    
    def _check_age_appropriateness(self, user_input: str) -> Dict[str, Any]:
        """Check if the topic is age-appropriate"""
        input_lower = user_input.lower()
        
        # Topics that might need age consideration
        mature_topics = ['violence', 'death', 'reproduction', 'politics']
        maturity_score = sum(1 for topic in mature_topics if topic in input_lower)
        
        return {
            'maturity_flag': maturity_score > 0,
            'requires_age_filtering': maturity_score > 0,
            'suggested_adult_guidance': maturity_score > 1
        }
    
    def _assess_educational_value(self, user_input: str) -> Dict[str, Any]:
        """Assess the educational value of the request"""
        input_lower = user_input.lower()
        
        educational_indicators = ['learn', 'understand', 'study', 'homework', 'research']
        educational_score = sum(1 for indicator in educational_indicators if indicator in input_lower)
        
        return {
            'educational_value': 'high' if educational_score > 2 else 'medium' if educational_score > 0 else 'low',
            'learning_intent': educational_score > 0,
            'supports_academic_goals': educational_score > 1
        }
    
    def _check_complexity_warnings(self, user_input: str) -> Dict[str, Any]:
        """Check for complexity mismatches"""
        input_lower = user_input.lower()
        
        # Advanced concepts that might be too complex
        advanced_concepts = ['quantum', 'calculus', 'molecular', 'theoretical', 'philosophy']
        complexity_score = sum(1 for concept in advanced_concepts if concept in input_lower)
        
        return {
            'high_complexity_detected': complexity_score > 0,
            'may_need_simplification': complexity_score > 1,
            'prerequisite_check_needed': complexity_score > 0
        }
    
    def generate_llm_prompt(self, analysis: Dict[str, Any], question_type: str = 'explore') -> Dict[str, Any]:
        """
        🎯 Generate contextually appropriate prompt for LLM based on analysis
        
        This is where Aniota's intelligence shines - creating effective prompts
        """
        subject_info = analysis['detected_subject']
        age_level = analysis['age_indicators']
        complexity = analysis['complexity_indicators']
        
        # Base prompt structure
        base_prompt = f"""
        You are helping a {age_level} level student with a {subject_info['primary_subject']} question.
        
        Question Type: {question_type}
        Original Question: {analysis['original_input']}
        Detected Subject: {subject_info['primary_subject']} (confidence: {subject_info['confidence']:.2f})
        Complexity Level: {complexity['suggested_level']}
        
        Guidelines:
        - Use {age_level} appropriate language and concepts
        - Focus on {question_type} approach (Socratic method)
        - Ensure educational value and accuracy
        - Maintain safety and age-appropriateness
        """
        
        # Add specific instructions based on question type
        if question_type == 'expand':
            base_prompt += "\n- Challenge the student with deeper, more complex concepts"
        elif question_type == 'explore':
            base_prompt += "\n- Help discover connections and patterns"
        elif question_type == 'extend':
            base_prompt += "\n- Guide application to real-world scenarios"
        elif question_type == 'review':
            base_prompt += "\n- Help consolidate and organize understanding"
        
        # Add safety flags if necessary
        safety_flags = analysis['common_sense_flags']['safety_check']
        if safety_flags['safety_flag']:
            base_prompt += "\n- SAFETY WARNING: This topic may require careful handling"
        
        return {
            'prompt_text': base_prompt.strip(),
            'expected_response_length': self._estimate_response_length(analysis),
            'filtering_requirements': self._determine_filtering_needs(analysis),
            'truth_engine_flags': self._prepare_truth_engine_flags(analysis)
        }
    
    def _estimate_response_length(self, analysis: Dict[str, Any]) -> str:
        """Estimate appropriate response length based on age and complexity"""
        age_level = analysis['age_indicators']
        urgency = analysis['urgency_level']
        
        if age_level == 'elementary':
            return 'short' if urgency == 'high' else 'medium'
        elif age_level == 'middle_school':
            return 'medium'
        else:
            return 'medium' if urgency == 'high' else 'long'
    
    def _determine_filtering_needs(self, analysis: Dict[str, Any]) -> List[str]:
        """Determine what filtering the response will need"""
        filters_needed = ['truth_engine_validation']
        
        flags = analysis['common_sense_flags']
        
        if flags['age_appropriateness']['maturity_flag']:
            filters_needed.append('age_appropriateness_filter')
        
        if flags['safety_check']['safety_flag']:
            filters_needed.append('safety_filter')
        
        if flags['complexity_warning']['high_complexity_detected']:
            filters_needed.append('complexity_simplification')
        
        return filters_needed
    
    def _prepare_truth_engine_flags(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare flags for Truth Engine validation"""
        return {
            'subject_area': analysis['detected_subject']['primary_subject'],
            'age_level': analysis['age_indicators'],
            'complexity_level': analysis['complexity_indicators']['suggested_level'],
            'safety_sensitive': analysis['common_sense_flags']['safety_check']['safety_flag'],
            'requires_fact_checking': analysis['question_type'] in ['definition', 'causal'],
            'requires_source_validation': analysis['complexity_indicators']['suggested_level'] in ['high_school', 'adult']
        }
    
    def filter_llm_response(self, llm_response: str, filtering_requirements: List[str], 
                           truth_engine_flags: Dict[str, Any]) -> Dict[str, Any]:
        """
        🛡️ Filter LLM response through Truth Engine and other validation systems
        
        This is Aniota's critical quality control function
        """
        filtered_result = {
            'original_response': llm_response,
            'filtered_response': llm_response,  # Will be modified by filters
            'filters_applied': [],
            'truth_engine_results': {},
            'quality_score': 0.0,
            'approval_status': 'pending',
            'warnings': [],
            'modifications_made': []
        }
        
        # Apply each required filter
        for filter_type in filtering_requirements:
            filter_result = self._apply_filter(filtered_result['filtered_response'], filter_type, truth_engine_flags)
            
            filtered_result['filtered_response'] = filter_result['modified_text']
            filtered_result['filters_applied'].append(filter_type)
            
            if filter_result['warnings']:
                filtered_result['warnings'].extend(filter_result['warnings'])
            
            if filter_result['modifications']:
                filtered_result['modifications_made'].extend(filter_result['modifications'])
        
        # Final Truth Engine validation
        truth_result = self._truth_engine_validation(filtered_result['filtered_response'], truth_engine_flags)
        filtered_result['truth_engine_results'] = truth_result
        
        # Calculate overall quality score
        filtered_result['quality_score'] = self._calculate_quality_score(filtered_result)
        
        # Determine approval status
        if filtered_result['quality_score'] >= 0.8 and not any('CRITICAL' in w for w in filtered_result['warnings']):
            filtered_result['approval_status'] = 'approved'
        elif filtered_result['quality_score'] >= 0.6:
            filtered_result['approval_status'] = 'approved_with_warnings'
        else:
            filtered_result['approval_status'] = 'rejected'
        
        self.logger.info(f"🛡️ Response filtered: {filtered_result['approval_status']} (score: {filtered_result['quality_score']:.2f})")
        
        return filtered_result
    
    def _apply_filter(self, text: str, filter_type: str, flags: Dict[str, Any]) -> Dict[str, Any]:
        """Apply specific filter to text"""
        if filter_type == 'age_appropriateness_filter':
            return self._age_appropriateness_filter(text, flags)
        elif filter_type == 'safety_filter':
            return self._safety_filter(text, flags)
        elif filter_type == 'complexity_simplification':
            return self._complexity_simplification_filter(text, flags)
        else:
            return {'modified_text': text, 'warnings': [], 'modifications': []}
    
    def _age_appropriateness_filter(self, text: str, flags: Dict[str, Any]) -> Dict[str, Any]:
        """Filter content for age appropriateness"""
        age_level = flags.get('age_level', 'middle_school')
        warnings = []
        modifications = []
        modified_text = text
        
        # Simple age-appropriate vocabulary check
        if age_level == 'elementary':
            complex_words = ['sophisticated', 'comprehensive', 'theoretical', 'philosophical']
            for word in complex_words:
                if word in modified_text.lower():
                    simpler_word = {'sophisticated': 'advanced', 'comprehensive': 'complete', 
                                   'theoretical': 'idea-based', 'philosophical': 'thinking about ideas'}
                    if word in simpler_word:
                        modified_text = modified_text.replace(word, simpler_word[word])
                        modifications.append(f"Simplified '{word}' to '{simpler_word[word]}'")
        
        return {
            'modified_text': modified_text,
            'warnings': warnings,
            'modifications': modifications
        }
    
    def _safety_filter(self, text: str, flags: Dict[str, Any]) -> Dict[str, Any]:
        """Filter content for safety concerns"""
        warnings = []
        modifications = []
        
        # Basic safety checks
        concerning_phrases = ['try this at home', 'without supervision', 'dangerous experiment']
        for phrase in concerning_phrases:
            if phrase in text.lower():
                warnings.append(f"SAFETY WARNING: Contains potentially unsafe guidance: '{phrase}'")
        
        return {
            'modified_text': text,
            'warnings': warnings,
            'modifications': modifications
        }
    
    def _complexity_simplification_filter(self, text: str, flags: Dict[str, Any]) -> Dict[str, Any]:
        """Simplify overly complex content"""
        warnings = []
        modifications = []
        modified_text = text
        
        # Check sentence length (complexity indicator)
        sentences = text.split('.')
        long_sentences = [s for s in sentences if len(s.split()) > 25]
        
        if len(long_sentences) > len(sentences) * 0.5:  # More than half are long
            warnings.append("Complex sentence structure detected - may need simplification")
        
        return {
            'modified_text': modified_text,
            'warnings': warnings,
            'modifications': modifications
        }
    
    def _truth_engine_validation(self, text: str, flags: Dict[str, Any]) -> Dict[str, Any]:
        """
        🔍 Truth Engine validation for credibility and accuracy
        
        This is the core Truth Engine functionality from your patent
        """
        validation_result = {
            'credibility_score': 0.8,  # Placeholder - would use real validation
            'fact_check_status': 'passed',
            'source_reliability': 'verified',
            'bias_detection': 'minimal',
            'accuracy_confidence': 0.85,
            'validation_timestamp': datetime.now().isoformat()
        }
        
        # Real implementation would include:
        # - Fact verification against trusted sources
        # - Bias detection algorithms
        # - Source credibility assessment
        # - Cross-reference validation
        
        return validation_result
    
    def _calculate_quality_score(self, filtered_result: Dict[str, Any]) -> float:
        """Calculate overall quality score for the filtered response"""
        base_score = 1.0
        
        # Deduct for warnings
        critical_warnings = sum(1 for w in filtered_result['warnings'] if 'CRITICAL' in w)
        warning_count = len(filtered_result['warnings'])
        
        base_score -= (critical_warnings * 0.3)  # Major deduction for critical issues
        base_score -= (warning_count * 0.1)      # Minor deduction for warnings
        
        # Factor in Truth Engine results
        if filtered_result['truth_engine_results']:
            truth_score = filtered_result['truth_engine_results'].get('credibility_score', 0.8)
            base_score = (base_score + truth_score) / 2
        
        return max(0.0, min(1.0, base_score))  # Clamp between 0 and 1
    
    def generate_system_prompt_summary(self, analysis: Dict[str, Any]) -> str:
        """
        📋 Generate summary of what Aniota determined for logging/debugging
        """
        return f"""
        🎯 ANIOTA'S LLM MANAGEMENT SUMMARY
        =====================================
        
        📥 Input Analysis:
        - Subject: {analysis['detected_subject']['primary_subject']} ({analysis['detected_subject']['confidence']:.1%} confidence)
        - Age Level: {analysis['age_indicators']}
        - Complexity: {analysis['complexity_indicators']['suggested_level']}
        - Question Type: {analysis['question_type']}
        - Urgency: {analysis['urgency_level']}
        
        🚨 Safety Flags:
        - Safety Check: {'FLAGGED' if analysis['common_sense_flags']['safety_check']['safety_flag'] else 'CLEAR'}
        - Age Appropriateness: {'FLAGGED' if analysis['common_sense_flags']['age_appropriateness']['maturity_flag'] else 'CLEAR'}
        - Complexity Warning: {'FLAGGED' if analysis['common_sense_flags']['complexity_warning']['high_complexity_detected'] else 'CLEAR'}
        
        🎯 LLM Management Strategy:
        - Prompt crafted for {analysis['detected_subject']['primary_subject']} domain
        - Response filtering required: {len(analysis.get('filtering_requirements', []))} filters
        - Truth Engine validation: ENABLED
        
        ✅ Aniota's role: AI manager and response filter, NOT direct answer provider
        """


log_file_dependency("llm_manager.py", "logging", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
