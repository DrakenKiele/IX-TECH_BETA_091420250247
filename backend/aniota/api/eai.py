

"""
BREADCRUMB: backend > aniota > api > eai.py
FILE: eai.py
MODULE: EAI - External API Integrator
ANIOTA FLOW CHART:
    - Parent: CLS (Core Logic Services)
    - Intended Consumer: LRS (Learning Readiness & Scaffolding)
    - Current Link Status: INACTIVE (as of 2025-09-05)
    - Reason: LRS is not yet calling EAI; placeholder and TODO present in LRS for future integration.
    - When active, LRS.request_ai_question() will call EAI for third-party AI question generation.
    - Technical Debt: EAI is not referenced by any functional code; integration and testing required before activation.

SUMMARY:
    Manages external API communication, particularly for third-party AI services
    that provide level-appropriate question generation and content.

NOTES:
    - This file is fully documented and ready for integration.
    - See LRS (aniota/learning/lrs.py) for the integration point and TODO.
    - Update the flow chart and this header when the link is activated.
"""

from typing import Dict, List, Any, Optional
import logging
from datetime import datetime
import json
import asyncio
import aiohttp
from ..base_module import BaseModule

class ExternalAPIIntegrator(BaseModule):
    """
    EAI - External API Integrator
    
    Core Responsibilities:
    1. Manages communication with third-party AI services
    2. Handles API authentication and rate limiting
    3. Provides level-appropriate question generation
    4. Manages API response caching and error handling
    5. Supports multiple AI service providers
    """
    
    def __init__(self, parent=None):
        super().__init__("EAI", parent)
        
        # API service configurations
        self.api_services = {
            "openai": {
                "base_url": "https://api.openai.com/v1",
                "enabled": False,
                "rate_limit": 60,  # requests per minute
                "model": "gpt-4"
            },
            "anthropic": {
                "base_url": "https://api.anthropic.com/v1",
                "enabled": False,
                "rate_limit": 50,
                "model": "claude-3-sonnet"
            },
            "local_ai": {
                "base_url": "http://localhost:8080/v1",
                "enabled": True,  # Default to local for development
                "rate_limit": 100,
                "model": "local-model"
            }
        }
        
        # Request tracking for rate limiting
        self.request_history = {}
        self.response_cache = {}
        self.cache_expiry = 3600  # 1 hour cache
        
        # Error handling and retry configuration
        self.retry_config = {
            "max_retries": 3,
            "base_delay": 1.0,
            "max_delay": 30.0,
            "backoff_factor": 2.0
        }
        
        # Learning level to prompt mapping
        self.level_prompts = {
            0: {  # Primary
                "system_prompt": "You are a friendly elementary school teacher. Create questions appropriate for grades K-5. Use simple language, visual concepts, and encourage exploration.",
                "complexity": "very_simple",
                "vocabulary": "elementary",
                "sentence_length": "short"
            },
            1: {  # Middle
                "system_prompt": "You are a middle school teacher. Create questions for grades 6-8. Use age-appropriate language and concepts that challenge without overwhelming.",
                "complexity": "moderate",
                "vocabulary": "middle_grade",
                "sentence_length": "medium"
            },
            2: {  # Secondary
                "system_prompt": "You are a high school teacher. Create questions for grades 9-12. Use academic language and concepts appropriate for teenagers.",
                "complexity": "standard",
                "vocabulary": "high_school",
                "sentence_length": "standard"
            },
            3: {  # PostSecondary
                "system_prompt": "You are a college professor. Create questions for undergraduate level. Use academic rigor and encourage critical thinking.",
                "complexity": "advanced",
                "vocabulary": "college",
                "sentence_length": "complex"
            },
            4: {  # Adult
                "system_prompt": "You are facilitating professional development. Create questions for adult learners in professional contexts.",
                "complexity": "professional",
                "vocabulary": "professional",
                "sentence_length": "comprehensive"
            }
        }
        
    def initialize(self) -> bool:
        """Initialize the EAI module"""
        try:
            self.logger.info("Initializing External API Integrator module")
            
            # Initialize request tracking
            self._initialize_request_tracking()
            
            # Load API configurations from storage
            self._load_api_configurations()
            
            # Test available services
            self._test_service_availability()
            
            self.is_initialized = True
            self.logger.info("EAI module initialized successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to initialize EAI module: {e}")
            return False
    
    async def generate_question(self, request_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a level-appropriate question using third-party AI
        
        Args:
            request_params: Parameters including learning level, topic, context
            
        Returns:
            Generated question with metadata
        """
        try:
            # Extract parameters
            learning_level = request_params.get("learning_level", 2)
            topic = request_params.get("topic", "general")
            context = request_params.get("context", {})
            scaffolding_strategy = request_params.get("scaffolding_strategy", {})
            
            # Check cache first
            cache_key = self._generate_cache_key(request_params)
            cached_response = self._get_cached_response(cache_key)
            
            if cached_response:
                self.logger.debug(f"Returning cached question for {topic}")
                return cached_response
            
            # Build prompt
            prompt_data = self._build_question_prompt(
                learning_level, topic, context, scaffolding_strategy
            )
            
            # Select best available service
            service_name = self._select_best_service()
            if not service_name:
                return self._generate_fallback_question(request_params)
            
            # Make API request
            response = await self._make_api_request(service_name, prompt_data)
            
            # Process and format response
            formatted_response = self._format_question_response(response, request_params)
            
            # Cache the response
            self._cache_response(cache_key, formatted_response)
            
            # Log usage
            self._log_api_usage(service_name, "question_generation", True)
            
            self.logger.info(f"Generated question for level {learning_level}, topic {topic}")
            return formatted_response
            
        except Exception as e:
            self.logger.error(f"Error generating question: {e}")
            return self._generate_fallback_question(request_params)
    
    async def validate_response(self, learner_response: str, question_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and analyze a learner's response using AI
        
        Args:
            learner_response: The learner's answer
            question_data: Original question and expected answer info
            
        Returns:
            Response validation and analysis
        """
        try:
            # Build validation prompt
            validation_prompt = self._build_validation_prompt(learner_response, question_data)
            
            # Select service
            service_name = self._select_best_service()
            if not service_name:
                return self._generate_fallback_validation(learner_response, question_data)
            
            # Make API request
            response = await self._make_api_request(service_name, validation_prompt)
            
            # Process validation response
            validation_result = self._format_validation_response(response, learner_response)
            
            self.logger.debug(f"Validated response for question {question_data.get('id', 'unknown')}")
            return validation_result
            
        except Exception as e:
            self.logger.error(f"Error validating response: {e}")
            return self._generate_fallback_validation(learner_response, question_data)
    
    async def generate_hint(self, question_data: Dict[str, Any], learner_context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a hint for a struggling learner
        
        Args:
            question_data: Original question information
            learner_context: Learner's current state and history
            
        Returns:
            Generated hint with appropriate scaffolding
        """
        try:
            learning_level = learner_context.get("learning_level", 2)
            struggle_indicators = learner_context.get("struggle_indicators", {})
            
            # Build hint prompt
            hint_prompt = self._build_hint_prompt(question_data, learning_level, struggle_indicators)
            
            # Select service
            service_name = self._select_best_service()
            if not service_name:
                return self._generate_fallback_hint(question_data, learner_context)
            
            # Make API request
            response = await self._make_api_request(service_name, hint_prompt)
            
            # Format hint response
            hint_result = self._format_hint_response(response, question_data)
            
            self.logger.debug(f"Generated hint for level {learning_level}")
            return hint_result
            
        except Exception as e:
            self.logger.error(f"Error generating hint: {e}")
            return self._generate_fallback_hint(question_data, learner_context)
    
    def configure_api_service(self, service_name: str, configuration: Dict[str, Any]) -> bool:
        """
        Configure an API service with authentication and settings
        
        Args:
            service_name: Name of the service to configure
            configuration: Service configuration including API keys
            
        Returns:
            Configuration success status
        """
        try:
            if service_name not in self.api_services:
                self.logger.error(f"Unknown service: {service_name}")
                return False
            
            # Update service configuration
            self.api_services[service_name].update(configuration)
            
            # Validate configuration
            if self._validate_service_config(service_name):
                self.logger.info(f"Configured API service: {service_name}")
                return True
            else:
                self.logger.error(f"Invalid configuration for service: {service_name}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error configuring API service {service_name}: {e}")
            return False
    
    def get_service_status(self) -> Dict[str, Any]:
        """
        Get status of all configured API services
        
        Returns:
            Status information for each service
        """
        try:
            status = {}
            
            for service_name, config in self.api_services.items():
                service_status = {
                    "enabled": config.get("enabled", False),
                    "available": self._check_service_availability(service_name),
                    "rate_limit": config.get("rate_limit", 0),
                    "requests_made": len(self.request_history.get(service_name, [])),
                    "last_request": self._get_last_request_time(service_name)
                }
                status[service_name] = service_status
            
            return status
            
        except Exception as e:
            self.logger.error(f"Error getting service status: {e}")
            return {"error": str(e)}
    
    # Private helper methods
    
    def _initialize_request_tracking(self):
        """Initialize request tracking for rate limiting"""
        for service_name in self.api_services.keys():
            self.request_history[service_name] = []
    
    def _load_api_configurations(self):
        """Load API configurations from storage"""
        # In production, this would load from Chrome storage
        # For now, use environment variables or defaults
        pass
    
    def _test_service_availability(self):
        """Test availability of configured services"""
        for service_name, config in self.api_services.items():
            if config.get("enabled", False):
                available = self._check_service_availability(service_name)
                self.logger.info(f"Service {service_name}: {'available' if available else 'unavailable'}")
    
    def _check_service_availability(self, service_name: str) -> bool:
        """Check if a service is currently available"""
        # Simplified availability check
        # In production, this would make a test request
        config = self.api_services.get(service_name, {})
        return config.get("enabled", False)
    
    def _select_best_service(self) -> Optional[str]:
        """Select the best available service based on availability and rate limits"""
        available_services = []
        
        for service_name, config in self.api_services.items():
            if not config.get("enabled", False):
                continue
                
            # Check rate limit
            if self._is_rate_limited(service_name):
                continue
                
            # Check availability
            if not self._check_service_availability(service_name):
                continue
                
            available_services.append(service_name)
        
        # Return first available service (could implement prioritization)
        return available_services[0] if available_services else None
    
    def _is_rate_limited(self, service_name: str) -> bool:
        """Check if service is currently rate limited"""
        config = self.api_services.get(service_name, {})
        rate_limit = config.get("rate_limit", 60)
        
        # Count requests in last minute
        current_time = datetime.now().timestamp()
        recent_requests = [
            req_time for req_time in self.request_history.get(service_name, [])
            if current_time - req_time < 60
        ]
        
        return len(recent_requests) >= rate_limit
    
    def _generate_cache_key(self, request_params: Dict[str, Any]) -> str:
        """Generate cache key for request parameters"""
        key_parts = [
            str(request_params.get("learning_level", 2)),
            request_params.get("topic", "general"),
            str(hash(str(request_params.get("context", {}))))
        ]
        return "_".join(key_parts)
    
    def _get_cached_response(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """Get cached response if valid"""
        if cache_key not in self.response_cache:
            return None
        
        cached_item = self.response_cache[cache_key]
        
        # Check if cache is expired
        if datetime.now().timestamp() - cached_item["timestamp"] > self.cache_expiry:
            del self.response_cache[cache_key]
            return None
        
        return cached_item["response"]
    
    def _cache_response(self, cache_key: str, response: Dict[str, Any]):
        """Cache API response"""
        self.response_cache[cache_key] = {
            "response": response,
            "timestamp": datetime.now().timestamp()
        }
        
        # Clean old cache entries
        self._clean_cache()
    
    def _clean_cache(self):
        """Remove expired cache entries"""
        current_time = datetime.now().timestamp()
        expired_keys = [
            key for key, item in self.response_cache.items()
            if current_time - item["timestamp"] > self.cache_expiry
        ]
        
        for key in expired_keys:
            del self.response_cache[key]
    
    def _build_question_prompt(self, learning_level: int, topic: str, 
                             context: Dict[str, Any], scaffolding_strategy: Dict[str, Any]) -> Dict[str, Any]:
        """Build prompt for question generation"""
        level_config = self.level_prompts.get(learning_level, self.level_prompts[2])
        
        prompt = {
            "system": level_config["system_prompt"],
            "user": f"""
Generate a {level_config['complexity']} question about {topic}.

Context: {json.dumps(context, indent=2)}
Scaffolding Strategy: {json.dumps(scaffolding_strategy, indent=2)}

Requirements:
- Use {level_config['vocabulary']} vocabulary
- Keep sentences {level_config['sentence_length']}
- Include clear learning objective
- Provide expected answer format
- Suggest appropriate hints if needed

Format the response as JSON with these fields:
- question: The main question text
- learning_objective: What the learner should demonstrate
- expected_format: How the learner should respond
- difficulty_level: Estimated difficulty (1-10)
- hints: Array of progressive hints
- metadata: Additional context about the question
            """.strip(),
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        return prompt
    
    def _build_validation_prompt(self, learner_response: str, question_data: Dict[str, Any]) -> Dict[str, Any]:
        """Build prompt for response validation"""
        prompt = {
            "system": "You are an expert educator evaluating student responses. Provide fair, constructive assessment.",
            "user": f"""
Question: {question_data.get('question', 'Unknown question')}
Expected Learning Objective: {question_data.get('learning_objective', 'Not specified')}
Student Response: {learner_response}

Please evaluate this response and provide:
1. Correctness score (0-1)
2. Understanding level demonstrated
3. Areas of strength in the response
4. Areas for improvement
5. Specific feedback for the learner
6. Suggested next steps

Format as JSON with fields: correctness_score, understanding_level, strengths, improvements, feedback, next_steps
            """.strip(),
            "temperature": 0.3,
            "max_tokens": 400
        }
        
        return prompt
    
    def _build_hint_prompt(self, question_data: Dict[str, Any], learning_level: int, 
                          struggle_indicators: Dict[str, Any]) -> Dict[str, Any]:
        """Build prompt for hint generation"""
        level_config = self.level_prompts.get(learning_level, self.level_prompts[2])
        
        prompt = {
            "system": level_config["system_prompt"] + " Focus on providing helpful hints without giving away the answer.",
            "user": f"""
Question: {question_data.get('question', 'Unknown question')}
Learning Level: {learning_level}
Struggle Indicators: {json.dumps(struggle_indicators)}

Generate a helpful hint that:
- Guides thinking without giving the answer
- Uses {level_config['vocabulary']} vocabulary
- Addresses apparent areas of confusion
- Encourages continued effort
- Builds confidence

Format as JSON with: hint_text, hint_type, confidence_building_message
            """.strip(),
            "temperature": 0.6,
            "max_tokens": 200
        }
        
        return prompt
    
    async def _make_api_request(self, service_name: str, prompt_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make actual API request to service"""
        try:
            config = self.api_services[service_name]
            
            # Record request time for rate limiting
            self.request_history[service_name].append(datetime.now().timestamp())
            
            # For now, return a mock response since we don't have real API keys
            # In production, this would make actual HTTP requests
            mock_response = self._generate_mock_response(prompt_data, service_name)
            
            return mock_response
            
        except Exception as e:
            self.logger.error(f"API request failed for {service_name}: {e}")
            raise
    
    def _generate_mock_response(self, prompt_data: Dict[str, Any], service_name: str) -> Dict[str, Any]:
        """Generate mock response for development/testing"""
        user_prompt = prompt_data.get("user", "")
        
        if "Generate a" in user_prompt and "question" in user_prompt:
            return {
                "question": "What is the main idea of this topic?",
                "learning_objective": "Demonstrate understanding of key concepts",
                "expected_format": "1-2 sentence explanation",
                "difficulty_level": 5,
                "hints": [
                    "Think about the most important point",
                    "What would you tell someone who knows nothing about this?",
                    "Look for the central theme or message"
                ],
                "metadata": {
                    "generated_by": service_name,
                    "timestamp": datetime.now().isoformat(),
                    "mock_response": True
                }
            }
        elif "evaluate this response" in user_prompt.lower():
            return {
                "correctness_score": 0.75,
                "understanding_level": "developing",
                "strengths": ["Shows basic understanding", "Used relevant examples"],
                "improvements": ["Could provide more detail", "Consider alternative perspectives"],
                "feedback": "Good start! Try to expand on your main points.",
                "next_steps": ["Review key concepts", "Practice with similar questions"]
            }
        elif "hint" in user_prompt.lower():
            return {
                "hint_text": "Think about what you already know about this topic.",
                "hint_type": "guiding_question",
                "confidence_building_message": "You're on the right track!"
            }
        
        return {"response": "Mock response generated", "service": service_name}
    
    def _format_question_response(self, api_response: Dict[str, Any], 
                                request_params: Dict[str, Any]) -> Dict[str, Any]:
        """Format API response into standard question format"""
        return {
            "status": "success",
            "question_data": api_response,
            "request_id": f"q_{datetime.now().timestamp()}",
            "learning_level": request_params.get("learning_level", 2),
            "topic": request_params.get("topic", "general"),
            "generated_at": datetime.now().isoformat(),
            "service_used": "mock_service"  # Would be actual service name
        }
    
    def _format_validation_response(self, api_response: Dict[str, Any], 
                                  learner_response: str) -> Dict[str, Any]:
        """Format API response into standard validation format"""
        return {
            "status": "success",
            "validation_data": api_response,
            "learner_response": learner_response,
            "validated_at": datetime.now().isoformat()
        }
    
    def _format_hint_response(self, api_response: Dict[str, Any], 
                            question_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format API response into standard hint format"""
        return {
            "status": "success",
            "hint_data": api_response,
            "question_id": question_data.get("id", "unknown"),
            "generated_at": datetime.now().isoformat()
        }
    
    def _generate_fallback_question(self, request_params: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback question when API services are unavailable"""
        learning_level = request_params.get("learning_level", 2)
        topic = request_params.get("topic", "general")
        
        fallback_questions = {
            0: f"What do you like most about {topic}?",
            1: f"Can you explain what {topic} means to you?",
            2: f"How would you describe {topic} to a friend?",
            3: f"What are the key concepts in {topic}?",
            4: f"How does {topic} relate to your professional experience?"
        }
        
        return {
            "status": "fallback",
            "question_data": {
                "question": fallback_questions.get(learning_level, fallback_questions[2]),
                "learning_objective": f"Express understanding of {topic}",
                "expected_format": "Open response",
                "difficulty_level": learning_level + 3,
                "hints": ["Take your time", "Share what you know", "There's no wrong answer"],
                "metadata": {
                    "fallback_response": True,
                    "reason": "API services unavailable"
                }
            },
            "generated_at": datetime.now().isoformat()
        }
    
    def _generate_fallback_validation(self, learner_response: str, 
                                    question_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback validation when API services are unavailable"""
        # Simple keyword-based validation
        response_length = len(learner_response.split())
        
        if response_length < 3:
            correctness_score = 0.3
            feedback = "Try to provide a more detailed response."
        elif response_length > 20:
            correctness_score = 0.8
            feedback = "Great detail! Consider summarizing your main points."
        else:
            correctness_score = 0.6
            feedback = "Good response! Can you add more examples?"
        
        return {
            "status": "fallback",
            "validation_data": {
                "correctness_score": correctness_score,
                "understanding_level": "developing",
                "feedback": feedback,
                "fallback_validation": True
            },
            "validated_at": datetime.now().isoformat()
        }
    
    def _generate_fallback_hint(self, question_data: Dict[str, Any], 
                              learner_context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback hint when API services are unavailable"""
        generic_hints = [
            "Break down the question into smaller parts.",
            "Think about what you already know about this topic.",
            "Consider examples you've seen before.",
            "What would you tell a friend about this?"
        ]
        
        import random
        selected_hint = random.choice(generic_hints)
        
        return {
            "status": "fallback",
            "hint_data": {
                "hint_text": selected_hint,
                "hint_type": "generic",
                "confidence_building_message": "You can do this!",
                "fallback_hint": True
            },
            "generated_at": datetime.now().isoformat()
        }
    
    def _validate_service_config(self, service_name: str) -> bool:
        """Validate service configuration"""
        config = self.api_services.get(service_name, {})
        
        required_fields = ["base_url", "enabled", "rate_limit"]
        return all(field in config for field in required_fields)
    
    def _get_last_request_time(self, service_name: str) -> Optional[str]:
        """Get timestamp of last request to service"""
        history = self.request_history.get(service_name, [])
        if not history:
            return None
        
        last_timestamp = max(history)
        return datetime.fromtimestamp(last_timestamp).isoformat()
    
    def _log_api_usage(self, service_name: str, operation: str, success: bool):
        """Log API usage for monitoring and billing"""
        usage_log = {
            "service": service_name,
            "operation": operation,
            "success": success,
            "timestamp": datetime.now().isoformat()
        }
        
        # In production, this would write to monitoring system
        self.logger.debug(f"API usage logged: {usage_log}")


log_file_dependency("eai.py", "logging", "import")
log_file_dependency("eai.py", "asyncio", "import")
log_file_dependency("eai.py", "aiohttp", "import")
log_file_dependency("eai.py", "random", "import")
