

import time
from datetime import datetime
from typing import Dict

try:
    from .dev_log import log_file_traversal, log_file_dependency
except ImportError:
    from dev_log import log_file_traversal, log_file_dependency

log_file_traversal("aniota_presence.py", "main.py", "import", "Aniota presence state management")

try:
    from .aniota.aniota_behaviors import aniota_behavior_manager
except ImportError:
    from aniota.aniota_behaviors import aniota_behavior_manager

log_file_dependency("aniota_presence.py", "aniota.aniota_behaviors", "import")


_aniota_presence_section = True  # Section: Aniota Presence Manager


class AniotaPresence:
    """
    Aniota Presence Manager - Backend State Controller
    Manages the state and behavior of the Aniota presence system.
    """

    def __init__(self):
        # State dictionary for Aniota's current status and behavior
        self.state = {
            "mood_color": "#ffb300",  # default/content
            "position": {"x": 40, "y": 40},
            "activity": "idle",
            "last_interaction": None,
            "session_id": None,
            "context": "splash",
            "heartbeat_rate": 800,
            "is_speaking": False,
            "message_queue": [],
            "learning_state": "attentive",
            # Tinkerbelle-inspired behavior states
            "attention_level": 0,
            "guidance_target": None,
            "last_user_action": None,
            "idle_time": 0,
            "playfulness": 85,
            "patience": 90,
            "earned_points": 0,
            "behavior_mode": "watching",
            "curiosity_level": 60,
            "trust_bond": 100,
            "gentle_persistence": 0,
            "last_hint_time": 0,
        }
        self._websocket_placeholder = True  # Section: WebSocket connections
        self.connected_clients = []
        self._color_palette_placeholder = True  # Section: Color palette
        self.color_palette = [
            "#ffb300",  # default/content
            "#487de7",  # thinking
            "#e81416",  # attention needed
            "#79c314",  # achievement
            "#faeb36",  # discovery
            "#70369d"   # focused learning
        ]
        self.color_index = 0
        # Reference to the global behavior manager
        self.behavior_manager = aniota_behavior_manager
        # Example: Register default behaviors (can be extended)
        self.behavior_manager.set_behaviors({
            "on_idle": self.on_idle_behavior,
            "on_interaction": self.on_interaction_behavior
        })

    def on_idle_behavior(self, *args, **kwargs):
        # Example idle behavior
        self.state["message_queue"].append({
            "text": "Aniota is idling...",
            "type": "info",
            "timestamp": datetime.now().isoformat()
        })

    def on_interaction_behavior(self, *args, **kwargs):
        # Example interaction behavior
        self.state["message_queue"].append({
            "text": "Aniota noticed an interaction!",
            "type": "success",
            "timestamp": datetime.now().isoformat()
        })

    def update_mood(self, trigger: str = "auto"):
        # ...existing code...
        if trigger == "auto":
            self.color_index = (self.color_index + 1) % len(self.color_palette)
            self.state["mood_color"] = self.color_palette[self.color_index]
        elif trigger == "interaction":
            self.state["mood_color"] = "#79c314"
        elif trigger == "learning":
            self.state["mood_color"] = "#70369d"
        elif trigger == "attention":
            self.state["mood_color"] = "#e81416"
        self.state["last_interaction"] = datetime.now().isoformat()
        return self.state["mood_color"]

    def update_behavior_state(
        self, user_action: str = None, page_context: str = None
    ):
        # ...existing code...
        current_time = time.time()
        if user_action:
            self.state["last_user_action"] = current_time
            self.state["idle_time"] = 0
            if user_action in ["click", "scroll", "keyboard"]:
                self.state["attention_level"] = max(
                    0, self.state["attention_level"] - 20
                )
                self.state["behavior_mode"] = "observing"
            # Trigger a behavior for interaction
            self.behavior_manager.manage_behaviors("on_interaction")
    # (Removed duplicate else block; logic is now correct)
            # Trigger a behavior for idle
            self.behavior_manager.manage_behaviors("on_idle")
        else:
            if self.state["last_user_action"]:
                self.state["idle_time"] = (
                    current_time - self.state["last_user_action"]
                )
            if self.state["idle_time"] > 30:
                attention_increase = min(2, self.state["idle_time"] / 15)
                self.state["attention_level"] = min(
                    100, self.state["attention_level"] + attention_increase
                )
        if self.state["attention_level"] < 20:
            self.state["behavior_mode"] = "observing"
        elif self.state["attention_level"] < 50:
            self.state["behavior_mode"] = "hinting"
        elif self.state["attention_level"] < 80:
            self.state["behavior_mode"] = "guiding"
        else:
            self.state["behavior_mode"] = "celebrating"
        behavior_heartbeats = {
            "observing": 1200,
            "hinting": 900,
            "guiding": 600,
            "celebrating": 400
        }
        self.state["heartbeat_rate"] = behavior_heartbeats.get(
            self.state["behavior_mode"], 800
        )
        return self.state["behavior_mode"]

    def suggest_guidance_target(self, page_context: str = None):
        # ...existing code...
        guidance_suggestions = {
            "splash": {
                "target": "continue-button",
                "reason": "Come explore with me!",
                "approach": "gentle_approach",
                "position_hint": "near_button"
            },
            "launcher": {
                "target": "aniota-icon",
                "reason": "I want to show you something special",
                "approach": "playful_bounce",
                "position_hint": "bounce_near"
            },
            "epicenter": {
                "target": "field-button",
                "reason": "Trust me, you'll love this experience",
                "approach": "confident_guidance",
                "position_hint": "guide_toward"
            },
            "field": {
                "target": "interaction-area",
                "reason": "Let's play together!",
                "approach": "encouraging_wiggle",
                "position_hint": "demonstrate"
            }
        }
        context = page_context or self.state["context"]
        suggestion = guidance_suggestions.get(context, {
            "target": "main-content",
            "reason": "There's something here for you",
            "approach": "gentle_persistence",
            "position_hint": "gentle_bounce"
        })
        if self.state["gentle_persistence"] > 50:
            suggestion["approach"] = "mouse_intercept"
        return suggestion

    def should_intercept_mouse(self, mouse_x: int, mouse_y: int):
        # ...existing code...
        current_time = time.time()
        should_intercept = (
            self.state["behavior_mode"] in ["hinting", "guiding"] and
            self.state["playfulness"] > 70 and
            self.state["attention_level"] > 40 and
            current_time - self.state.get("last_intercept_time", 0) > 15 and
            self.state["idle_time"] > 20
        )
        if should_intercept:
            intercept_position = {
                "x": mouse_x + 30,
                "y": mouse_y + 20,
                "approach": "quick_dart",
                "duration": 2000,
                "behavior": "attention_seeking"
            }
            self.state["last_intercept_time"] = current_time
            self.state["gentle_persistence"] += 5
            return intercept_position
        return None

    def calculate_mouse_intercept_path(
        self,
        current_mouse_x,
        current_mouse_y,
        mouse_velocity_x=0,
        mouse_velocity_y=0
    ):
        # ...existing code...
        predicted_x = current_mouse_x + (mouse_velocity_x * 0.5)
        predicted_y = current_mouse_y + (mouse_velocity_y * 0.5)
        intercept_x = predicted_x + 25
        intercept_y = predicted_y + 15
        import random
        intercept_x += random.randint(-10, 10)
        intercept_y += random.randint(-10, 10)
        return {
            "target_x": intercept_x,
            "target_y": intercept_y,
            "movement_style": "quick_dart",
            "pause_duration": 1500,
            "follow_up": "gentle_bounce"
        }

    def tinkerbelle_mouse_intercept_decision(self, user_context: dict):
        # ...existing code...
        current_time = time.time()
        factors = {
            "idle_time_right": self.state["idle_time"] > 25,
            "not_too_recent": (
                current_time - self.state.get("last_intercept_time", 0) > 20
            ),
            "playful_mood": self.state["playfulness"] > 75,
            "wants_to_help": self.state["attention_level"] > 35,
            "user_moving_mouse": user_context.get("mouse_moving", False),
            "no_recent_interaction": (
                current_time - self.state.get("last_user_action", 0) > 15
            )
        }
        intercept_score = sum(factors.values())
        should_intercept = intercept_score >= 4
        if should_intercept:
            self.state["last_intercept_time"] = current_time
            self.state["behavior_mode"] = "playful_intercept"
            return {
                "should_intercept": True,
                "intercept_style": "tinkerbelle_dart",
                "message": "Let me show you something!",
                "follow_up_behavior": "encouraging_bounce"
            }
        return {"should_intercept": False}

    def calculate_reward_points(self, user_action: str, success: bool = True):
        # ...existing code...
        base_points = {
            "button_click": 10,
            "drag_interaction": 15,
            "page_navigation": 8,
            "discovery": 20,
            "learning_activity": 25
        }
        points = base_points.get(user_action, 5)
        if success:
            if self.state["behavior_mode"] == "guiding":
                points *= 1.5
            self.state["earned_points"] += points
            self.state["playfulness"] = min(100, self.state["playfulness"] + 2)
        return points

    def get_tinkerbelle_behavior(self):
        # ...existing code...
        behaviors = {
            "watching": {
                "animation": "gentle_pulse",
                "movement": "subtle_drift",
                "frequency": "calm",
                "message": "I'm here when you're ready"
            },
            "hinting": {
                "animation": "soft_bounce",
                "movement": "slight_approach",
                "frequency": "interested",
                "message": "I think you might like this..."
            },
            "guiding": {
                "animation": "encouraging_wiggle",
                "movement": "move_toward_target",
                "frequency": "excited",
                "message": "Come on, trust me on this one!"
            },
            "celebrating": {
                "animation": "happy_spin",
                "movement": "victory_dance",
                "frequency": "joyful",
                "message": "Yes! You found it! Good job!"
            }
        }
        behavior = behaviors.get(
            self.state["behavior_mode"], behaviors["watching"]
        )
        behavior["persistence_level"] = self.state["gentle_persistence"]
        behavior["trust_bond"] = self.state["trust_bond"]
        behavior["playfulness"] = self.state["playfulness"]
        behavior["patience"] = self.state["patience"]
        return behavior

    def check_for_guidance_moment(self, current_time: float):
        # ...existing code...
        if self.state["behavior_mode"] == "watching":
            return False
        time_since_last_hint = (
            current_time - self.state.get("last_hint_time", 0)
        )
        min_interval = 45 + (self.state["patience"] * 0.3)
        if time_since_last_hint < min_interval:
            return False
        if self.state["gentle_persistence"] > 30:
            self.state["last_hint_time"] = current_time
            return True
        return False

    def update_position(self, x: int, y: int, page_context: str):
        # ...existing code...
        self.state["position"] = {"x": x, "y": y}
        self.state["context"] = page_context
        self.state["last_interaction"] = datetime.now().isoformat()

    def log_interaction(self, interaction_type: str, details: Dict):
        # ...existing code...
        interaction = {
            "type": interaction_type,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "context": self.state["context"]
        }
        if interaction_type in ["click", "drag", "button_press"]:
            self.update_mood("interaction")
        elif interaction_type == "learning_activity":
            self.update_mood("learning")
        elif interaction_type == "help_needed":
            self.update_mood("attention")
        return interaction

    def get_state(self) -> Dict:
        # ...existing code...
        return {
            **self.state,
            "timestamp": datetime.now().isoformat(),
            "uptime": time.time()
        }

    def add_message(self, message: str, message_type: str = "info"):
        # ...existing code...
        self.state["message_queue"].append({
            "text": message,
            "type": message_type,
            "timestamp": datetime.now().isoformat()
        })
        if len(self.state["message_queue"]) > 10:
            self.state["message_queue"] = self.state["message_queue"][-10:]

    def process_context_change(self, old_context: str, new_subject: str):
        """
        Treat context as subject change. Update neon ring colors for core subjects.
        """
        self.state["context"] = new_subject
        # Define neon colors for each subject
        subject_neon_colors = {
            "science": "#00fff7",
            "math": "#ff00e1",
            "english": "#00ff2a",
            "social_studies": "#fffb00",
            "history": "#ff7b00",
            "art": "#ff0059",
            "music": "#00b3ff",
            "technology": "#a600ff"
        }
        # Set the main mood color to the subject's neon color if available
        if new_subject in subject_neon_colors:
            self.state["mood_color"] = subject_neon_colors[new_subject]
        # Set the subject_rings state for frontend rendering (all subjects, highlight current)
        self.state["subject_rings"] = [
            {
                "subject": subject,
                "color": color,
                "active": (subject == new_subject)
            }
            for subject, color in subject_neon_colors.items()
        ]

# Global Aniota instance


aniota_presence = AniotaPresence()
