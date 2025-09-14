


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("rfm.py", "system_initialization", "import", "Auto-generated dev log entry")

RFM - Reflective Feedback Module
Module #8 in dependency order

Works with HTM to provide appropriate interventions when negative learning patterns are detected.
Implements the three-question intervention strategy: Review (easiest), Explore, Extend.

Parent: SIE
Children: None
"""

from typing import Dict, List, Any, Optional, Union, Tuple
import logging
from datetime import datetime, timedelta
import threading
import random
from ..base_module import CoreSystemModule

class ReflectiveFeedbackModule(CoreSystemModule):
    """
    RFM - Reflective Feedback Module
    
    Architectural Intent:
    - Works with HTM to detect negative learning patterns
    - Provides three intervention choices: Review, Explore, Extend
    - Review is easiest choice (most likely to be selected)
    - Follow-up questions reveal learner mindset and subject area
    - Guides learners back to internal learning processes
    """
    
    def __init__(self, parent_sie=None):
        super().__init__("RFM", parent_sie)
        
        # Intervention management
        self.active_interventions: Dict[str, Dict[str, Any]] = {}
        self.intervention_lock = threading.Lock()
        
        # Three-question intervention strategy
        self.intervention_choices = {
            'review': {
                'difficulty': 'easy',
                'description': 'Review and consolidate what you already know',
                'follow_up_question': 'What would you like to review?',
                'purpose': 'Consolidation and confidence building',
                'selection_weight': 0.6,  # Highest weight - easiest choice
                'reveals': 'current_knowledge_state'
            },
            'explore': {
                'difficulty': 'medium',
                'description': 'Explore a related but different subject area',
                'follow_up_question': 'What related area interests you?',
                'purpose': 'Broaden perspective and reduce fixation',
                'selection_weight': 0.25,
                'reveals': 'curiosity_patterns'
            },
            'extend': {
                'difficulty': 'hard',
                'description': 'Dive deeper into the current subject',
                'follow_up_question': 'What would you like to explore more deeply?',
                'purpose': 'Challenge and growth for motivated learners',
                'selection_weight': 0.15,
                'reveals': 'motivation_level_and_subject_focus'
            }
        }
        
        # Intervention configuration
        self.intervention_timeout_minutes = 15
        self.max_active_interventions = 5
        self.follow_up_strategies = ['gentle', 'encouraging', 'challenging']
        
        # Learning mindset analysis
        self.mindset_indicators = {
            'growth_oriented': ['learn', 'understand', 'improve', 'practice', 'challenge'],
            'help_seeking': ['help', 'stuck', 'confused', 'difficult', 'hard'],
            'avoidance': ['skip', 'later', 'boring', 'easy', 'quick'],
            'curiosity': ['why', 'how', 'what if', 'wonder', 'interesting']
        }
        
        # Response analysis patterns
        self.subject_area_patterns = {
            'mathematics': ['math', 'algebra', 'calculus', 'geometry', 'equation', 'formula'],
            'science': ['physics', 'chemistry', 'biology', 'experiment', 'hypothesis', 'theory'],
            'language': ['grammar', 'writing', 'reading', 'literature', 'vocabulary', 'essay'],
            'history': ['historical', 'timeline', 'event', 'civilization', 'culture', 'period'],
            'general': ['topic', 'subject', 'area', 'concept', 'idea', 'material']
        }
        
        # Initialize specifications
        self.specs = {
            'intervention_types': ['review', 'explore', 'extend'],
            'three_choice_strategy': True,
            'easiest_first_principle': True,
            'mindset_analysis': True,
            'subject_area_detection': True,
            'intervention_timeout_minutes': 15,
            'max_concurrent_interventions': 5,
            'follow_up_enabled': True
        }
    
    def initialize(self) -> bool:
        """
        Initialize the Reflective Feedback Module
        """
        try:
            self.logger.info("Initializing Reflective Feedback Module (RFM)")
            
            # Initialize intervention management
            self._setup_intervention_management()
            
            # Initialize mindset analysis
            self._setup_mindset_analysis()
            
            # Initialize subject area detection
            self._setup_subject_area_detection()
            
            # Initialize response processing
            self._setup_response_processing()
            
            self.is_initialized = True
            self.logger.info("RFM initialization complete")
            return True
            
        except Exception as e:
            self.logger.error(f"RFM initialization failed: {e}")
            return False
    
    def validate_integrity(self) -> bool:
        """
        Validate RFM module integrity
        """
        try:
            # Validate intervention system
            if not self._validate_intervention_system():
                return False
            
            # Validate choice strategy
            if not self._validate_choice_strategy():
                return False
            
            # Validate analysis systems
            if not self._validate_analysis_systems():
                return False
            
            return True
            
        except Exception as e:
            self.logger.error(f"RFM integrity validation failed: {e}")
            return False
    
    def trigger_intervention(self, htm_analysis: Dict[str, Any], learner_id: str) -> Dict[str, Any]:
        """
        Trigger intervention based on HTM analysis of negative learning pattern
        
        Parameters:
            htm_analysis: Analysis from HTM indicating negative pattern
            learner_id: Identifier for the learner
            
        Returns:
            Intervention details including three choices
        """
        try:
            intervention_id = f"intervention_{learner_id}_{datetime.now().timestamp()}"
            
            with self.intervention_lock:
                # Create intervention record
                intervention = {
                    'intervention_id': intervention_id,
                    'learner_id': learner_id,
                    'trigger_analysis': htm_analysis,
                    'start_time': datetime.now(),
                    'status': 'active',
                    'choices_presented': self._prepare_intervention_choices(),
                    'learner_choice': None,
                    'follow_up_response': None,
                    'analysis_results': None
                }
                
                # Store intervention
                self.active_interventions[intervention_id] = intervention
                
                # Generate intervention message
                intervention_message = self._generate_intervention_message(intervention)
                
                self.logger.info(f"Triggered intervention {intervention_id} for learner {learner_id}")
                
                return {
                    'intervention_id': intervention_id,
                    'message': intervention_message,
                    'choices': intervention['choices_presented'],
                    'urgency': htm_analysis.get('urgency', 'medium')
                }
                
        except Exception as e:
            self.logger.error(f"Intervention trigger failed: {e}")
            return {'error': str(e)}
    
    def process_learner_choice(self, intervention_id: str, choice: str) -> Dict[str, Any]:
        """
        Process learner's choice of intervention type
        
        Parameters:
            intervention_id: ID of the active intervention
            choice: Learner's choice ('review', 'explore', or 'extend')
            
        Returns:
            Follow-up question and analysis
        """
        try:
            if intervention_id not in self.active_interventions:
                self.logger.warning(f"Unknown intervention ID: {intervention_id}")
                return {'error': 'Invalid intervention ID'}
            
            if choice not in self.intervention_choices:
                self.logger.warning(f"Invalid choice: {choice}")
                return {'error': 'Invalid choice'}
            
            intervention = self.active_interventions[intervention_id]
            intervention['learner_choice'] = choice
            intervention['choice_timestamp'] = datetime.now()
            
            # Get choice configuration
            choice_config = self.intervention_choices[choice]
            
            # Analyze choice implications
            choice_analysis = self._analyze_choice_implications(choice, intervention)
            
            # Generate follow-up question
            follow_up_question = self._generate_follow_up_question(choice, choice_config, intervention)
            
            self.logger.info(f"Learner chose '{choice}' for intervention {intervention_id}")
            
            return {
                'choice_recorded': choice,
                'choice_analysis': choice_analysis,
                'follow_up_question': follow_up_question,
                'reveals': choice_config['reveals'],
                'intervention_status': 'awaiting_follow_up'
            }
            
        except Exception as e:
            self.logger.error(f"Choice processing failed: {e}")
            return {'error': str(e)}
    
    def process_follow_up_response(self, intervention_id: str, response: str) -> Dict[str, Any]:
        """
        Process learner's response to follow-up question
        
        Parameters:
            intervention_id: ID of the active intervention
            response: Learner's response to follow-up question
            
        Returns:
            Analysis of learner mindset and subject area
        """
        try:
            if intervention_id not in self.active_interventions:
                self.logger.warning(f"Unknown intervention ID: {intervention_id}")
                return {'error': 'Invalid intervention ID'}
            
            intervention = self.active_interventions[intervention_id]
            intervention['follow_up_response'] = response
            intervention['response_timestamp'] = datetime.now()
            
            # Analyze learner response
            response_analysis = self._analyze_learner_response(response, intervention)
            
            # Update intervention with analysis
            intervention['analysis_results'] = response_analysis
            intervention['status'] = 'completed'
            
            # Generate insights about learner
            learner_insights = self._generate_learner_insights(intervention, response_analysis)
            
            # Complete intervention
            completion_summary = self._complete_intervention(intervention_id, learner_insights)
            
            self.logger.info(f"Completed intervention {intervention_id} with insights: {learner_insights['primary_insight']}")
            
            return {
                'response_analysis': response_analysis,
                'learner_insights': learner_insights,
                'completion_summary': completion_summary,
                'intervention_status': 'completed'
            }
            
        except Exception as e:
            self.logger.error(f"Follow-up response processing failed: {e}")
            return {'error': str(e)}
    
    def get_intervention_status(self, intervention_id: str) -> Optional[Dict[str, Any]]:
        """
        Get status of an active intervention
        
        Parameters:
            intervention_id: ID of the intervention
            
        Returns:
            Current intervention status
        """
        try:
            if intervention_id not in self.active_interventions:
                return None
            
            intervention = self.active_interventions[intervention_id]
            
            # Calculate duration
            duration = datetime.now() - intervention['start_time']
            
            status = {
                'intervention_id': intervention_id,
                'learner_id': intervention['learner_id'],
                'status': intervention['status'],
                'duration_minutes': duration.total_seconds() / 60,
                'choice_made': intervention.get('learner_choice'),
                'follow_up_completed': intervention.get('follow_up_response') is not None,
                'analysis_available': intervention.get('analysis_results') is not None
            }
            
            return status
            
        except Exception as e:
            self.logger.error(f"Status retrieval failed: {e}")
            return None
    
    def analyze_learner_mindset(self, response: str) -> Dict[str, Any]:
        """
        Analyze learner mindset from their response
        
        Parameters:
            response: Learner's text response
            
        Returns:
            Mindset analysis results
        """
        try:
            response_lower = response.lower()
            mindset_scores = {}
            
            # Score each mindset category
            for mindset_type, indicators in self.mindset_indicators.items():
                score = 0
                matched_indicators = []
                
                for indicator in indicators:
                    if indicator in response_lower:
                        score += 1
                        matched_indicators.append(indicator)
                
                mindset_scores[mindset_type] = {
                    'score': score,
                    'matched_indicators': matched_indicators
                }
            
            # Determine dominant mindset
            dominant_mindset = max(mindset_scores.items(), key=lambda x: x[1]['score'])
            
            mindset_analysis = {
                'dominant_mindset': dominant_mindset[0] if dominant_mindset[1]['score'] > 0 else 'neutral',
                'confidence': min(1.0, dominant_mindset[1]['score'] / 3.0),  # Normalize to 0-1
                'all_scores': mindset_scores,
                'mixed_indicators': len([s for s in mindset_scores.values() if s['score'] > 0]) > 1
            }
            
            return mindset_analysis
            
        except Exception as e:
            self.logger.error(f"Mindset analysis failed: {e}")
            return {'error': str(e)}
    
    def detect_subject_area(self, response: str) -> Dict[str, Any]:
        """
        Detect subject area from learner response
        
        Parameters:
            response: Learner's text response
            
        Returns:
            Subject area detection results
        """
        try:
            response_lower = response.lower()
            subject_scores = {}
            
            # Score each subject area
            for subject, keywords in self.subject_area_patterns.items():
                score = 0
                matched_keywords = []
                
                for keyword in keywords:
                    if keyword in response_lower:
                        score += 1
                        matched_keywords.append(keyword)
                
                if score > 0:
                    subject_scores[subject] = {
                        'score': score,
                        'matched_keywords': matched_keywords
                    }
            
            # Determine most likely subject
            if subject_scores:
                primary_subject = max(subject_scores.items(), key=lambda x: x[1]['score'])
                subject_area = primary_subject[0]
                confidence = min(1.0, primary_subject[1]['score'] / 3.0)
            else:
                subject_area = 'unknown'
                confidence = 0.0
            
            detection_results = {
                'detected_subject': subject_area,
                'confidence': confidence,
                'all_matches': subject_scores,
                'specific_topic': self._extract_specific_topic(response)
            }
            
            return detection_results
            
        except Exception as e:
            self.logger.error(f"Subject area detection failed: {e}")
            return {'error': str(e)}
    
    def get_intervention_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about interventions
        
        Returns:
            Intervention statistics
        """
        try:
            total_interventions = len(self.active_interventions)
            completed_interventions = len([
                i for i in self.active_interventions.values()
                if i['status'] == 'completed'
            ])
            
            # Choice distribution
            choice_distribution = {}
            for intervention in self.active_interventions.values():
                choice = intervention.get('learner_choice')
                if choice:
                    choice_distribution[choice] = choice_distribution.get(choice, 0) + 1
            
            # Mindset analysis summary
            mindset_summary = self._summarize_mindset_patterns()
            
            statistics = {
                'total_interventions': total_interventions,
                'completed_interventions': completed_interventions,
                'completion_rate': completed_interventions / total_interventions if total_interventions > 0 else 0,
                'choice_distribution': choice_distribution,
                'mindset_patterns': mindset_summary,
                'active_interventions': total_interventions - completed_interventions
            }
            
            return statistics
            
        except Exception as e:
            self.logger.error(f"Statistics generation failed: {e}")
            return {'error': str(e)}
    
    # Private helper methods
    
    def _setup_intervention_management(self) -> None:
        """Set up intervention management systems"""
        self.active_interventions = {}
        self.logger.debug("Intervention management setup")
    
    def _setup_mindset_analysis(self) -> None:
        """Set up mindset analysis systems"""
        # TODO: Initialize advanced mindset analysis tools
        self.logger.debug("Mindset analysis setup")
    
    def _setup_subject_area_detection(self) -> None:
        """Set up subject area detection systems"""
        # TODO: Initialize advanced subject detection
        self.logger.debug("Subject area detection setup")
    
    def _setup_response_processing(self) -> None:
        """Set up response processing systems"""
        # TODO: Initialize response processing tools
        self.logger.debug("Response processing setup")
    
    def _validate_intervention_system(self) -> bool:
        """Validate intervention system integrity"""
        return True  # Placeholder
    
    def _validate_choice_strategy(self) -> bool:
        """Validate three-choice strategy"""
        required_choices = ['review', 'explore', 'extend']
        return all(choice in self.intervention_choices for choice in required_choices)
    
    def _validate_analysis_systems(self) -> bool:
        """Validate analysis systems"""
        return True  # Placeholder
    
    def _prepare_intervention_choices(self) -> List[Dict[str, Any]]:
        """Prepare the three intervention choices for presentation"""
        choices = []
        
        for choice_type, config in self.intervention_choices.items():
            choice_data = {
                'type': choice_type,
                'description': config['description'],
                'difficulty': config['difficulty'],
                'selection_weight': config['selection_weight']
            }
            choices.append(choice_data)
        
        # Sort by selection weight (easiest first)
        choices.sort(key=lambda x: x['selection_weight'], reverse=True)
        
        return choices
    
    def _generate_intervention_message(self, intervention: Dict[str, Any]) -> str:
        """Generate intervention message for learner"""
        trigger_confidence = intervention['trigger_analysis'].get('confidence', 0.5)
        
        if trigger_confidence > 0.8:
            tone = "I notice you might be struggling with something."
        else:
            tone = "Let's take a moment to reflect on your learning."
        
        message = f"{tone} I'd like to offer you three ways to move forward. Which appeals to you most?"
        
        return message
    
    def _analyze_choice_implications(self, choice: str, intervention: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze what the learner's choice reveals"""
        choice_config = self.intervention_choices[choice]
        
        implications = {
            'difficulty_preference': choice_config['difficulty'],
            'learning_confidence': 'high' if choice == 'extend' else 'medium' if choice == 'explore' else 'low',
            'risk_tolerance': 'high' if choice == 'extend' else 'medium' if choice == 'explore' else 'low',
            'current_state_inference': choice_config['reveals']
        }
        
        return implications
    
    def _generate_follow_up_question(self, choice: str, choice_config: Dict[str, Any], 
                                   intervention: Dict[str, Any]) -> str:
        """Generate appropriate follow-up question"""
        base_question = choice_config['follow_up_question']
        
        # Customize based on choice and context
        if choice == 'review':
            return f"{base_question} This will help us understand what you're comfortable with."
        elif choice == 'explore':
            return f"{base_question} Sometimes a fresh perspective helps clarify things."
        else:  # extend
            return f"{base_question} I can see you're ready for a challenge!"
    
    def _analyze_learner_response(self, response: str, intervention: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze learner's response to follow-up question"""
        
        # Analyze mindset
        mindset_analysis = self.analyze_learner_mindset(response)
        
        # Detect subject area
        subject_analysis = self.detect_subject_area(response)
        
        # Analyze response specificity
        specificity_analysis = self._analyze_response_specificity(response)
        
        # Combine analyses
        combined_analysis = {
            'mindset': mindset_analysis,
            'subject_area': subject_analysis,
            'specificity': specificity_analysis,
            'choice_type': intervention.get('learner_choice'),
            'reveals_level': self._determine_reveal_level(mindset_analysis, subject_analysis, specificity_analysis)
        }
        
        return combined_analysis
    
    def _generate_learner_insights(self, intervention: Dict[str, Any], response_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate insights about learner from intervention"""
        choice = intervention.get('learner_choice')
        mindset = response_analysis['mindset']['dominant_mindset']
        subject = response_analysis['subject_area']['detected_subject']
        
        # Primary insight based on choice and mindset
        if choice == 'extend' and mindset in ['growth_oriented', 'curiosity']:
            primary_insight = 'Highly motivated learner seeking challenge'
        elif choice == 'review' and mindset == 'help_seeking':
            primary_insight = 'Learner needs confidence building and support'
        elif choice == 'explore' and mindset == 'curiosity':
            primary_insight = 'Curious learner seeking broader understanding'
        else:
            primary_insight = f'Learner chose {choice} with {mindset} mindset'
        
        insights = {
            'primary_insight': primary_insight,
            'motivation_level': self._assess_motivation_level(choice, mindset),
            'support_needed': self._determine_support_needed(choice, mindset),
            'subject_focus': subject if subject != 'unknown' else 'unclear',
            'intervention_success': self._assess_intervention_success(intervention, response_analysis)
        }
        
        return insights
    
    def _complete_intervention(self, intervention_id: str, learner_insights: Dict[str, Any]) -> Dict[str, Any]:
        """Complete intervention and generate summary"""
        intervention = self.active_interventions[intervention_id]
        
        summary = {
            'intervention_id': intervention_id,
            'learner_id': intervention['learner_id'],
            'duration': datetime.now() - intervention['start_time'],
            'choice_made': intervention.get('learner_choice'),
            'insights_generated': learner_insights,
            'success_level': learner_insights['intervention_success']
        }
        
        return summary
    
    def _analyze_response_specificity(self, response: str) -> Dict[str, Any]:
        """Analyze how specific/detailed the response is"""
        word_count = len(response.split())
        
        specificity_level = 'low'
        if word_count > 10:
            specificity_level = 'medium'
        if word_count > 20:
            specificity_level = 'high'
        
        return {
            'word_count': word_count,
            'specificity_level': specificity_level,
            'contains_details': word_count > 15,
            'engagement_indicator': word_count > 5
        }
    
    def _determine_reveal_level(self, mindset_analysis: Dict[str, Any], 
                               subject_analysis: Dict[str, Any], 
                               specificity_analysis: Dict[str, Any]) -> str:
        """Determine how much the response reveals about the learner"""
        reveal_score = 0
        
        if mindset_analysis['confidence'] > 0.5:
            reveal_score += 1
        if subject_analysis['confidence'] > 0.5:
            reveal_score += 1
        if specificity_analysis['specificity_level'] in ['medium', 'high']:
            reveal_score += 1
        
        if reveal_score >= 2:
            return 'high'
        elif reveal_score == 1:
            return 'medium'
        else:
            return 'low'
    
    def _assess_motivation_level(self, choice: str, mindset: str) -> str:
        """Assess learner motivation level"""
        if choice == 'extend':
            return 'high'
        elif choice == 'explore' and mindset == 'curiosity':
            return 'medium-high'
        elif choice == 'review' and mindset == 'growth_oriented':
            return 'medium'
        else:
            return 'low-medium'
    
    def _determine_support_needed(self, choice: str, mindset: str) -> List[str]:
        """Determine what support the learner needs"""
        support_needed = []
        
        if choice == 'review':
            support_needed.extend(['confidence_building', 'concept_reinforcement'])
        
        if mindset == 'help_seeking':
            support_needed.extend(['guided_assistance', 'step_by_step_help'])
        
        if mindset == 'avoidance':
            support_needed.extend(['motivation_building', 'engagement_strategies'])
        
        if choice == 'extend' and mindset == 'curiosity':
            support_needed.extend(['advanced_challenges', 'independent_exploration'])
        
        return list(set(support_needed))  # Remove duplicates
    
    def _assess_intervention_success(self, intervention: Dict[str, Any], 
                                   response_analysis: Dict[str, Any]) -> str:
        """Assess how successful the intervention was"""
        
        # Check if learner engaged with follow-up
        if not intervention.get('follow_up_response'):
            return 'low'
        
        # Check response quality
        reveal_level = response_analysis['reveals_level']
        engagement = response_analysis['specificity']['engagement_indicator']
        
        if reveal_level == 'high' and engagement:
            return 'high'
        elif reveal_level == 'medium' or engagement:
            return 'medium'
        else:
            return 'low'
    
    def _extract_specific_topic(self, response: str) -> Optional[str]:
        """Extract specific topic mentioned in response"""
        # Simple topic extraction - could be enhanced with NLP
        words = response.lower().split()
        
        # Look for topic-like words (nouns, capitalized terms)
        potential_topics = []
        for word in words:
            if len(word) > 4 and word not in ['would', 'could', 'should', 'about', 'really']:
                potential_topics.append(word)
        
        return potential_topics[0] if potential_topics else None
    
    def _summarize_mindset_patterns(self) -> Dict[str, Any]:
        """Summarize mindset patterns from completed interventions"""
        mindsets = []
        
        for intervention in self.active_interventions.values():
            if intervention.get('analysis_results'):
                mindset = intervention['analysis_results']['mindset']['dominant_mindset']
                mindsets.append(mindset)
        
        # Count occurrences
        mindset_counts = {}
        for mindset in mindsets:
            mindset_counts[mindset] = mindset_counts.get(mindset, 0) + 1
        
        return {
            'total_analyzed': len(mindsets),
            'distribution': mindset_counts,
            'most_common': max(mindset_counts.items(), key=lambda x: x[1])[0] if mindset_counts else None
        }
    
    def shutdown(self) -> None:
        """Gracefully shutdown RFM"""
        self.logger.info("Shutting down Reflective Feedback Module")
        
        # Complete active interventions
        for intervention_id in list(self.active_interventions.keys()):
            intervention = self.active_interventions[intervention_id]
            if intervention['status'] == 'active':
                intervention['status'] = 'shutdown_incomplete'
        
        # TODO: Save intervention data and learner insights
        
        super().shutdown()


log_file_dependency("rfm.py", "logging", "import")
log_file_dependency("rfm.py", "random", "import")# 2025-09-11 | [XX]    | [Description]                        | [Reason]
