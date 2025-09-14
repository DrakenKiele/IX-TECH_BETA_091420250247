# BREADCRUMB: [Project/Module] > system_sensors.py
# This file is part of the Aniota system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: system_sensors.py
# Purpose: # Import development logging system

System Sensors Module for ANIOTA Learning Context
Captures system metrics for anonymous learner profiling and context awareness

This module extends the CHRYSALIX backend to provide hardware monitoring
capabilities that complement behavioral data for comprehensive learning insights.
#
# Type: Class Module
#
# Responsibilities:
#   - [Responsibility 1]
#   - [Responsibility 2]
#   - [Responsibility 3]
#
# Key Functions:
#   - to_learning_context
#   - _categorize_cpu_load
#   - _categorize_thermal_state
#   - _categorize_memory_pressure
#   - _categorize_io_activity
#   - _categorize_network_activity
#   - __init__
#   - initialize
#   - start_monitoring
#   - stop_monitoring
#   - get_current_learning_context
#   - get_system_recommendations
#   - _monitoring_loop
#   - _capture_snapshot
#   - _get_cpu_temperature
#   - _get_fan_speeds
#   - _get_gpu_temperature
#   - _detect_thermal_sensors
#   - _detect_fan_sensors
#   - _establish_baseline
#   - _context_changed_significantly
#   - _notify_context_change
#   - _recommend_learning_intensity
#   - _should_suggest_break
#   - _recommend_modalities
#   - _recommend_timing
#   - get_status
#   - shutdown
#
# Key Classes:
#   - SystemSnapshot
#   - SystemSensorModule
#
# Relationships:
#   - Imports: asyncio, base_module, dataclasses, datetime, logging, psutil, threading, time, typing
#
# Usefulness & Execution Path:
#   - [Execution notes]
#
# Suggestions:
#   - **Performance:** [Performance notes]
#   - **Code Cleanliness:** [Code cleanliness notes]
#   - **Location:** [Location notes]
#   - **Function:** [Function notes]
#   - **Legacy:** [Legacy notes]
#   - **Config:** [Config notes]
#   - **Error Handling:** [Error handling notes]
#   - **Cross-Platform:** [Cross-platform notes]
#
# Summary:
#   - [Summary notes]
#
# CHANGE MANAGEMENT LOG
# Date        | Initials | Description of Change                | Reason for Change
# -----------------------------------------------------------------------------
# 2025-09-11 | [XX]    | Header auto-generated                   | Initial automation
# -----------------------------------------------------------------------------


"""

# Import development logging system
import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

# Log this file being traversed
log_file_traversal("system_sensors.py", "system_initialization", "import", "Auto-generated dev log entry")

System Sensors Module for ANIOTA Learning Context
Captures system metrics for anonymous learner profiling and context awareness

This module extends the CHRYSALIX backend to provide hardware monitoring
capabilities that complement behavioral data for comprehensive learning insights.
"""

import psutil
import time
import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
import threading
from ..base_module import CoreSystemModule


@dataclass
class SystemSnapshot:
    """Single point-in-time system metrics snapshot"""

    timestamp: datetime
    cpu_percent: float
    cpu_temp: Optional[float]
    memory_percent: float
    disk_io_read: int
    disk_io_write: int
    network_sent: int
    network_recv: int
    fan_speeds: Dict[str, int]
    gpu_temp: Optional[float]

    def to_learning_context(self) -> Dict[str, Any]:
        """Convert to anonymous learning context data"""
        return {
            "system_load": self._categorize_cpu_load(self.cpu_percent),
            "thermal_stress": self._categorize_thermal_state(),
            "memory_pressure": self._categorize_memory_pressure(self.memory_percent),
            "io_activity": self._categorize_io_activity(),
            "connectivity_state": self._categorize_network_activity(),
            "timestamp": self.timestamp.isoformat(),
        }

    def _categorize_cpu_load(self, cpu_percent: float) -> str:
        """Categorize CPU load for learning context"""
        if cpu_percent < 20:
            return "low"
        elif cpu_percent < 50:
            return "moderate"
        elif cpu_percent < 80:
            return "high"
        else:
            return "critical"

    def _categorize_thermal_state(self) -> str:
        """Categorize thermal state based on temperatures"""
        max_temp = max(
            [t for t in [self.cpu_temp, self.gpu_temp] if t is not None], default=0
        )
        if max_temp < 50:
            return "cool"
        elif max_temp < 70:
            return "warm"
        elif max_temp < 85:
            return "hot"
        else:
            return "critical"

    def _categorize_memory_pressure(self, memory_percent: float) -> str:
        """Categorize memory pressure for learning context"""
        if memory_percent < 50:
            return "comfortable"
        elif memory_percent < 75:
            return "moderate"
        elif memory_percent < 90:
            return "high"
        else:
            return "critical"

    def _categorize_io_activity(self) -> str:
        """Categorize disk I/O activity (requires baseline comparison)"""
        # This would need historical baseline for meaningful categorization
        return "unknown"  # Placeholder

    def _categorize_network_activity(self) -> str:
        """Categorize network activity (requires baseline comparison)"""
        # This would need historical baseline for meaningful categorization
        return "unknown"  # Placeholder


class SystemSensorModule(CoreSystemModule):
    """
    System Sensor Module - Captures hardware metrics for learning context

    Provides anonymized system metrics to help ANIOTA understand:
    - When learner might be distracted (high system load)
    - Environmental factors affecting focus (thermal stress, fan noise)
    - Device capabilities affecting learning modality preferences
    - Optimal timing for intensive learning activities
    """

    def __init__(self):
        super().__init__("SSM")
        self.monitoring_active = False
        self.monitoring_thread: Optional[threading.Thread] = None
        self.monitoring_stop_event = threading.Event()

        # Configuration
        self.sample_interval = 5.0  # seconds between samples
        self.max_history_length = 720  # 1 hour at 5-second intervals

        # Data storage
        self.system_history: List[SystemSnapshot] = []
        self.baseline_metrics: Optional[Dict[str, float]] = None
        self.current_context: Optional[Dict[str, Any]] = None

        # Thermal monitoring
        self.thermal_sources = []
        self.fan_sensors = []

        # Learning integration
        self.context_change_threshold = 0.3  # Threshold for significant context changes
        self.last_context_update = None

    def initialize(self) -> bool:
        """Initialize system sensor monitoring"""
        try:
            self.logger.info("Initializing System Sensor Module (SSM)")

            # Detect available sensors
            self._detect_thermal_sensors()
            self._detect_fan_sensors()

            # Establish baseline metrics
            self._establish_baseline()

            self.is_initialized = True
            self.logger.info("SSM initialization complete")
            return True

        except Exception as e:
            self.logger.error(f"SSM initialization failed: {e}")
            return False

    def start_monitoring(self) -> bool:
        """Start continuous system monitoring"""
        if self.monitoring_active:
            self.logger.warning("System monitoring already active")
            return True

        try:
            self.monitoring_stop_event.clear()
            self.monitoring_thread = threading.Thread(
                target=self._monitoring_loop, daemon=True, name="SystemSensorThread"
            )
            self.monitoring_thread.start()
            self.monitoring_active = True

            self.logger.info("System monitoring started")
            return True

        except Exception as e:
            self.logger.error(f"Failed to start system monitoring: {e}")
            return False

    def stop_monitoring(self) -> bool:
        """Stop system monitoring"""
        if not self.monitoring_active:
            return True

        try:
            self.monitoring_stop_event.set()
            if self.monitoring_thread:
                self.monitoring_thread.join(timeout=10.0)

            self.monitoring_active = False
            self.logger.info("System monitoring stopped")
            return True

        except Exception as e:
            self.logger.error(f"Error stopping system monitoring: {e}")
            return False

    def get_current_learning_context(self) -> Dict[str, Any]:
        """Get current system context for learning optimization"""
        if not self.current_context:
            # Generate context from latest snapshot
            latest_snapshot = self._capture_snapshot()
            self.current_context = latest_snapshot.to_learning_context()

        return self.current_context.copy()

    def get_system_recommendations(self) -> Dict[str, Any]:
        """Get system-based recommendations for learning optimization"""
        context = self.get_current_learning_context()

        recommendations = {
            "learning_intensity": self._recommend_learning_intensity(context),
            "break_suggestion": self._should_suggest_break(context),
            "modality_preferences": self._recommend_modalities(context),
            "timing_optimization": self._recommend_timing(context),
        }

        return recommendations

    def _monitoring_loop(self):
        """Main monitoring loop - runs in separate thread"""
        self.logger.debug("System monitoring loop started")

        while not self.monitoring_stop_event.is_set():
            try:
                # Capture system snapshot
                snapshot = self._capture_snapshot()

                # Add to history
                self.system_history.append(snapshot)

                # Maintain history length
                if len(self.system_history) > self.max_history_length:
                    self.system_history.pop(0)

                # Update current context
                new_context = snapshot.to_learning_context()

                # Check for significant context changes
                if self._context_changed_significantly(new_context):
                    self.current_context = new_context
                    self.last_context_update = datetime.now()

                    # Notify learning system of context change
                    self._notify_context_change(new_context)

                # Wait for next sample
                self.monitoring_stop_event.wait(self.sample_interval)

            except Exception as e:
                self.logger.error(f"Error in monitoring loop: {e}")
                time.sleep(self.sample_interval)

        self.logger.debug("System monitoring loop stopped")

    def _capture_snapshot(self) -> SystemSnapshot:
        """Capture single system metrics snapshot"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_temp = self._get_cpu_temperature()

            # Memory metrics
            memory = psutil.virtual_memory()
            memory_percent = memory.percent

            # Disk I/O
            disk_io = psutil.disk_io_counters()
            disk_io_read = disk_io.read_bytes if disk_io else 0
            disk_io_write = disk_io.write_bytes if disk_io else 0

            # Network I/O
            network_io = psutil.net_io_counters()
            network_sent = network_io.bytes_sent if network_io else 0
            network_recv = network_io.bytes_recv if network_io else 0

            # Fan speeds
            fan_speeds = self._get_fan_speeds()

            # GPU temperature (if available)
            gpu_temp = self._get_gpu_temperature()

            return SystemSnapshot(
                timestamp=datetime.now(),
                cpu_percent=cpu_percent,
                cpu_temp=cpu_temp,
                memory_percent=memory_percent,
                disk_io_read=disk_io_read,
                disk_io_write=disk_io_write,
                network_sent=network_sent,
                network_recv=network_recv,
                fan_speeds=fan_speeds,
                gpu_temp=gpu_temp,
            )

        except Exception as e:
            self.logger.error(f"Error capturing system snapshot: {e}")
            return SystemSnapshot(
                timestamp=datetime.now(),
                cpu_percent=0.0,
                cpu_temp=None,
                memory_percent=0.0,
                disk_io_read=0,
                disk_io_write=0,
                network_sent=0,
                network_recv=0,
                fan_speeds={},
                gpu_temp=None,
            )

    def _get_cpu_temperature(self) -> Optional[float]:
        """Get CPU temperature if available"""
        try:
            # Try to get temperature from sensors
            if hasattr(psutil, "sensors_temperatures"):
                temps = psutil.sensors_temperatures()

                # Look for CPU temperature sources
                for source_name, sensors in temps.items():
                    if "cpu" in source_name.lower() or "core" in source_name.lower():
                        if sensors:
                            return sensors[0].current

                # Fallback: use any available temperature
                for source_name, sensors in temps.items():
                    if sensors:
                        return sensors[0].current

            return None

        except Exception as e:
            self.logger.debug(f"Could not get CPU temperature: {e}")
            return None

    def _get_fan_speeds(self) -> Dict[str, int]:
        """Get fan speeds if available"""
        try:
            if hasattr(psutil, "sensors_fans"):
                fans = psutil.sensors_fans()
                fan_speeds = {}

                for fan_name, fan_list in fans.items():
                    for i, fan in enumerate(fan_list):
                        fan_speeds[f"{fan_name}_{i}"] = fan.current

                return fan_speeds

            return {}

        except Exception as e:
            self.logger.debug(f"Could not get fan speeds: {e}")
            return {}

    def _get_gpu_temperature(self) -> Optional[float]:
        """Get GPU temperature if available (placeholder - would need GPU-specific libraries)"""
        # This would require additional libraries like py3nvml for NVIDIA GPUs
        # or other GPU-specific monitoring tools
        return None

    def _detect_thermal_sensors(self):
        """Detect available thermal sensors"""
        try:
            if hasattr(psutil, "sensors_temperatures"):
                temps = psutil.sensors_temperatures()
                self.thermal_sources = list(temps.keys())
                self.logger.info(f"Detected thermal sensors: {self.thermal_sources}")
            else:
                self.logger.info("No thermal sensors available on this platform")
        except Exception as e:
            self.logger.warning(f"Error detecting thermal sensors: {e}")

    def _detect_fan_sensors(self):
        """Detect available fan sensors"""
        try:
            if hasattr(psutil, "sensors_fans"):
                fans = psutil.sensors_fans()
                self.fan_sensors = list(fans.keys())
                self.logger.info(f"Detected fan sensors: {self.fan_sensors}")
            else:
                self.logger.info("No fan sensors available on this platform")
        except Exception as e:
            self.logger.warning(f"Error detecting fan sensors: {e}")

    def _establish_baseline(self):
        """Establish baseline system metrics"""
        try:
            self.logger.info("Establishing system baseline metrics...")

            # Take several samples to establish baseline
            samples = []
            for _ in range(10):
                snapshot = self._capture_snapshot()
                samples.append(snapshot)
                time.sleep(1)

            # Calculate baseline averages
            self.baseline_metrics = {
                "cpu_percent": sum(s.cpu_percent for s in samples) / len(samples),
                "memory_percent": sum(s.memory_percent for s in samples) / len(samples),
                "cpu_temp": (
                    sum(s.cpu_temp for s in samples if s.cpu_temp)
                    / len([s for s in samples if s.cpu_temp])
                    if any(s.cpu_temp for s in samples)
                    else None
                ),
            }

            self.logger.info(f"Baseline established: {self.baseline_metrics}")

        except Exception as e:
            self.logger.error(f"Error establishing baseline: {e}")
            self.baseline_metrics = {}

    def _context_changed_significantly(self, new_context: Dict[str, Any]) -> bool:
        """Check if system context has changed significantly"""
        if not self.current_context:
            return True

        # Simple change detection - could be more sophisticated
        for key in ["system_load", "thermal_stress", "memory_pressure"]:
            if self.current_context.get(key) != new_context.get(key):
                return True

        return False

    def _notify_context_change(self, context: Dict[str, Any]):
        """Notify learning system of significant context changes"""
        # This would integrate with the CAF or other learning modules
        self.logger.debug(f"System context changed: {context}")

        # TODO: Integrate with CHRYSALIX learning system
        # - Send context update to CAF
        # - Trigger learning strategy adjustments
        # - Update user recommendations

    def _recommend_learning_intensity(self, context: Dict[str, Any]) -> str:
        """Recommend learning intensity based on system state"""
        system_load = context.get("system_load", "unknown")
        thermal_stress = context.get("thermal_stress", "unknown")

        if system_load == "critical" or thermal_stress == "critical":
            return "minimal"
        elif system_load == "high" or thermal_stress == "hot":
            return "light"
        elif system_load == "low" and thermal_stress == "cool":
            return "intensive"
        else:
            return "moderate"

    def _should_suggest_break(self, context: Dict[str, Any]) -> bool:
        """Determine if system suggests taking a break"""
        return (
            context.get("system_load") == "critical"
            or context.get("thermal_stress") == "critical"
            or context.get("memory_pressure") == "critical"
        )

    def _recommend_modalities(self, context: Dict[str, Any]) -> List[str]:
        """Recommend learning modalities based on system capabilities"""
        recommendations = []

        system_load = context.get("system_load", "moderate")

        # Always available
        recommendations.append("text")

        if system_load in ["low", "moderate"]:
            recommendations.extend(["interactive", "visual"])

        if system_load == "low":
            recommendations.extend(["multimedia", "simulation"])

        return recommendations

    def _recommend_timing(self, context: Dict[str, Any]) -> str:
        """Recommend optimal timing for different learning activities"""
        system_load = context.get("system_load", "moderate")

        if system_load == "low":
            return "optimal_for_intensive_learning"
        elif system_load == "moderate":
            return "good_for_regular_learning"
        elif system_load == "high":
            return "suitable_for_review"
        else:
            return "break_recommended"

    def get_status(self) -> Dict[str, Any]:
        """Get current module status"""
        return {
            "module_id": self.module_id,
            "monitoring_active": self.monitoring_active,
            "thermal_sensors": len(self.thermal_sources),
            "fan_sensors": len(self.fan_sensors),
            "history_length": len(self.system_history),
            "baseline_established": self.baseline_metrics is not None,
            "last_context_update": (
                self.last_context_update.isoformat()
                if self.last_context_update
                else None
            ),
        }

    def shutdown(self) -> None:
        """Gracefully shutdown system monitoring"""
        self.logger.info("Shutting down System Sensor Module")
        self.stop_monitoring()
        super().shutdown()


# Log dependencies
log_file_dependency("system_sensors.py", "psutil", "import")
log_file_dependency("system_sensors.py", "asyncio", "import")
log_file_dependency("system_sensors.py", "logging", "import")