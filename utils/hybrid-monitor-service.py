# BREADCRUMB: [Project/Module] > hybrid-monitor-service.py
# This file is the root entry point and orchestrator for the entire system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: hybrid-monitor-service.py
# Purpose: Central entry point and orchestrator for the system.
#
# Type: Main launcher script (not a class file, but acts as a system controller)
#
# Responsibilities:
#   - Loads configuration and resolves paths for all major dependencies ([List dependencies])
#   - Checks and manages the status of critical services (starts/stops as needed)
#   - Launches and monitors all core services:
#       * [Service 1] ([Tech/Port])
#       * [Service 2] ([Tech/Port])
#       * [Service 3] ([Tech/Port])
#       * [Service 4] ([Tech/Port])
#   - Provides command-line flags for status reporting and service termination ([flags])
#   - Handles process cleanup and error reporting
#
# Key Functions:
#   - main(): Orchestrates the full launch sequence and handles CLI flags
#   - launch_service(): Starts a subprocess for a given service
#   - stream_logs(): Streams and truncates logs from subprocesses
#   - run_static_server(): Runs the static file server (if applicable)
#   - is_port_in_use(): Checks if a TCP port is active
#   - get_service_status(): Returns a dict of service statuses
#   - check_service(): Ensures a service is running, starts if not
#   - resolve_path(): Finds the first valid path for a dependency from config
#   - find_dependency_path(): Locates the executable for a dependency
#
# Relationships:
#   - Reads from configuration files for dependency paths
#   - Launches and monitors other scripts and processes
#   - Interacts with the OS for process and port management
#
# Usefulness & Execution Path:
#   - main() is the required entry point and is always used.
#   - [List of essential functions] are all actively used and essential for orchestrating the system.
#   - [Legacy/optional functions] may become obsolete as the system evolves.
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
#   - This file is essential, well-placed, and mostly clean.
#   - All major functions are used and support the requirements for modularity, orchestration, and portability.
#   - Minor cleanup (removing redundant code, legacy functions) is recommended to enhance maintainability.
#   - Overall, it effectively serves as the central controller for the system.
#
# CHANGE MANAGEMENT LOG
# Date        | Initials | Description of Change                | Reason for Change
# -----------------------------------------------------------------------------
# 2025-09-05 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

"""
Hybrid System Monitor - Bridge between PWA and System-Level Monitoring

This service provides always-on system monitoring capabilities that complement
the web-based monitoring in the PWA. It can run as a separate service or
be integrated with the FastAPI backend.

Key Features:
- Processor temperature and fan speed monitoring
- Always-on background monitoring
- Privacy-compliant anonymous data collection
- Learning context generation from hardware metrics
- WebSocket communication with PWA frontend
"""

import asyncio
import websockets
import json
import psutil
import time
import logging
import threading
import argparse
import sys

from dataclasses import dataclass
from typing import Optional, Dict, Any, List
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@dataclass
class SystemMetrics:
    """System metrics snapshot for learning context"""

    timestamp: str
    cpu_percent: float
    cpu_temp: Optional[float]
    memory_percent: float
    disk_io_read_mb: float
    disk_io_write_mb: float
    network_sent_mb: float
    network_recv_mb: float
    fan_speeds: Dict[str, int]
    gpu_temp: Optional[float]
    battery_percent: Optional[float]
    battery_plugged: Optional[bool]

    def to_learning_context(self) -> Dict[str, Any]:
        """Convert to anonymous learning context"""
        return {
            "system_load": self._categorize_cpu_load(self.cpu_percent),
            "thermal_state": self._categorize_thermal_state(),
            "memory_pressure": self._categorize_memory_pressure(self.memory_percent),
            "io_activity": self._categorize_io_activity(),
            "power_state": self._categorize_power_state(),
            "cooling_state": self._categorize_cooling_state(),
            "learning_readiness": self._assess_learning_readiness(),
            "timestamp": self.timestamp,
        }

    def _categorize_cpu_load(self, cpu_percent: float) -> str:
        if cpu_percent < 20:
            return "low"
        elif cpu_percent < 50:
            return "moderate"
        elif cpu_percent < 80:
            return "high"
        else:
            return "critical"

    def _categorize_thermal_state(self) -> str:
        temps = [t for t in [self.cpu_temp, self.gpu_temp] if t is not None]
        if not temps:
            return "unknown"

        max_temp = max(temps)
        if max_temp < 50:
            return "cool"
        elif max_temp < 70:
            return "warm"
        elif max_temp < 85:
            return "hot"
        else:
            return "critical"

    def _categorize_memory_pressure(self, memory_percent: float) -> str:
        if memory_percent < 50:
            return "comfortable"
        elif memory_percent < 75:
            return "moderate"
        elif memory_percent < 90:
            return "high"
        else:
            return "critical"

    def _categorize_io_activity(self) -> str:
        # This is a simplified categorization
        # In practice, you'd compare against baseline
        total_io = self.disk_io_read_mb + self.disk_io_write_mb
        if total_io < 10:
            return "low"
        elif total_io < 50:
            return "moderate"
        else:
            return "high"

    def _categorize_power_state(self) -> str:
        if self.battery_percent is None:
            return "ac_powered"

        if self.battery_plugged:
            return "charging"
        elif self.battery_percent > 50:
            return "battery_good"
        elif self.battery_percent > 20:
            return "battery_moderate"
        else:
            return "battery_low"

    def _categorize_cooling_state(self) -> str:
        if not self.fan_speeds:
            return "passive"

        avg_fan_speed = sum(self.fan_speeds.values()) / len(self.fan_speeds)
        if avg_fan_speed < 1000:
            return "quiet"
        elif avg_fan_speed < 2000:
            return "moderate"
        else:
            return "active"

    def _assess_learning_readiness(self) -> str:
        """Overall assessment for learning optimization"""
        cpu_load = self._categorize_cpu_load(self.cpu_percent)
        thermal = self._categorize_thermal_state()
        memory = self._categorize_memory_pressure(self.memory_percent)
        power = self._categorize_power_state()

        # Critical conditions
        if (
            cpu_load == "critical"
            or thermal == "critical"
            or memory == "critical"
            or power == "battery_low"
        ):
            return "break_recommended"

        # High stress conditions
        if cpu_load == "high" or thermal == "hot" or memory == "high":
            return "light_learning"

        # Optimal conditions
        if (
            cpu_load == "low"
            and thermal in ["cool", "warm"]
            and memory in ["comfortable", "moderate"]
        ):
            return "optimal"

        return "moderate"


class SystemMonitorService:
    """Always-on system monitoring service"""

    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.monitoring_active = False
        self.sample_interval = self.config.get("sample_interval", 5.0)
        self.max_history = self.config.get("max_history", 720)  # 1 hour

        # Data storage
        self.metrics_history: List[SystemMetrics] = []
        self.current_metrics: Optional[SystemMetrics] = None
        self.baseline_metrics: Optional[Dict[str, float]] = None

        # WebSocket server
        self.websocket_port = self.config.get("websocket_port", 8765)
        self.websocket_clients = set()
        self.websocket_server = None

        # Monitoring thread
        self.monitoring_thread: Optional[threading.Thread] = None
        self.stop_event = threading.Event()

        # Previous values for delta calculations
        self.prev_disk_io = None
        self.prev_network_io = None

    async def start_service(self):
        """Start the monitoring service"""
        logger.info("Starting System Monitor Service")

        try:
            # Establish baseline
            await self.establish_baseline()

            # Start monitoring thread
            self.start_monitoring_thread()

            # Start WebSocket server
            await self.start_websocket_server()

            logger.info(f"System Monitor Service started on port {self.websocket_port}")

        except Exception as e:
            logger.error(f"Failed to start System Monitor Service: {e}")
            raise

    async def establish_baseline(self):
        """Establish baseline system metrics"""
        logger.info("Establishing baseline metrics...")

        samples = []
        for i in range(10):
            metrics = await self.capture_metrics()
            if metrics:
                samples.append(metrics)
            await asyncio.sleep(1)

        if samples:
            self.baseline_metrics = {
                "cpu_percent": sum(m.cpu_percent for m in samples) / len(samples),
                "memory_percent": sum(m.memory_percent for m in samples) / len(samples),
                "cpu_temp": sum(m.cpu_temp for m in samples if m.cpu_temp)
                / len([m for m in samples if m.cpu_temp]),
            }
            logger.info(f"Baseline established: {self.baseline_metrics}")
        else:
            logger.warning("Could not establish baseline metrics")

    def start_monitoring_thread(self):
        """Start the monitoring thread"""
        self.stop_event.clear()
        self.monitoring_thread = threading.Thread(
            target=self.monitoring_loop, daemon=True, name="SystemMonitorThread"
        )
        self.monitoring_thread.start()
        self.monitoring_active = True
        logger.info("Monitoring thread started")

    def monitoring_loop(self):
        """Main monitoring loop (runs in separate thread)"""
        logger.info("Monitoring loop started")

        while not self.stop_event.is_set():
            try:
                # Capture metrics (synchronous in thread)
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

                metrics = loop.run_until_complete(self.capture_metrics())

                if metrics:
                    self.current_metrics = metrics
                    self.metrics_history.append(metrics)

                    # Maintain history size
                    if len(self.metrics_history) > self.max_history:
                        self.metrics_history.pop(0)

                    # Broadcast to WebSocket clients
                    if self.websocket_clients:
                        learning_context = metrics.to_learning_context()
                        loop.run_until_complete(
                            self.broadcast_to_clients(learning_context)
                        )

                loop.close()

                # Wait for next sample
                self.stop_event.wait(self.sample_interval)

            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                time.sleep(self.sample_interval)

        logger.info("Monitoring loop stopped")

    async def capture_metrics(self) -> Optional[SystemMetrics]:
        """Capture current system metrics"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1.0)
            cpu_temp = self.get_cpu_temperature()

            # Memory metrics
            memory = psutil.virtual_memory()
            memory_percent = memory.percent

            # Disk I/O metrics
            disk_io = psutil.disk_io_counters()
            disk_io_read_mb = 0
            disk_io_write_mb = 0

            if disk_io and self.prev_disk_io:
                disk_io_read_mb = (
                    (disk_io.read_bytes - self.prev_disk_io.read_bytes) / 1024 / 1024
                )
                disk_io_write_mb = (
                    (disk_io.write_bytes - self.prev_disk_io.write_bytes) / 1024 / 1024
                )

            self.prev_disk_io = disk_io

            # Network I/O metrics
            network_io = psutil.net_io_counters()
            network_sent_mb = 0
            network_recv_mb = 0

            if network_io and self.prev_network_io:
                network_sent_mb = (
                    (network_io.bytes_sent - self.prev_network_io.bytes_sent)
                    / 1024
                    / 1024
                )
                network_recv_mb = (
                    (network_io.bytes_recv - self.prev_network_io.bytes_recv)
                    / 1024
                    / 1024
                )

            self.prev_network_io = network_io

            # Fan speeds
            fan_speeds = self.get_fan_speeds()

            # GPU temperature (placeholder - would need GPU-specific libraries)
            gpu_temp = None

            # Battery info
            battery = psutil.sensors_battery()
            battery_percent = battery.percent if battery else None
            battery_plugged = battery.power_plugged if battery else None

            return SystemMetrics(
                timestamp=datetime.now().isoformat(),
                cpu_percent=cpu_percent,
                cpu_temp=cpu_temp,
                memory_percent=memory_percent,
                disk_io_read_mb=disk_io_read_mb,
                disk_io_write_mb=disk_io_write_mb,
                network_sent_mb=network_sent_mb,
                network_recv_mb=network_recv_mb,
                fan_speeds=fan_speeds,
                gpu_temp=gpu_temp,
                battery_percent=battery_percent,
                battery_plugged=battery_plugged,
            )

        except Exception as e:
            logger.error(f"Error capturing metrics: {e}")
            return None

    def get_cpu_temperature(self) -> Optional[float]:
        """Get CPU temperature if available"""
        try:
            if hasattr(psutil, "sensors_temperatures"):
                temps = psutil.sensors_temperatures()

                # Try common CPU temperature sources
                for source in ["coretemp", "cpu_thermal", "k10temp", "zenpower"]:
                    if source in temps and temps[source]:
                        return temps[source][0].current

                # Fallback to any available temperature
                for source_name, sensors in temps.items():
                    if sensors:
                        return sensors[0].current

            return None

        except Exception as e:
            logger.debug(f"Could not get CPU temperature: {e}")
            return None

    def get_fan_speeds(self) -> Dict[str, int]:
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
            logger.debug(f"Could not get fan speeds: {e}")
            return {}

    async def start_websocket_server(self):
        """Start WebSocket server for PWA communication"""
        try:
            self.websocket_server = await websockets.serve(
                self.handle_websocket_client, "localhost", self.websocket_port
            )
            logger.info(f"WebSocket server started on port {self.websocket_port}")

        except Exception as e:
            logger.error(f"Failed to start WebSocket server: {e}")
            raise

    async def handle_websocket_client(self, websocket, path):
        """Handle WebSocket client connections"""
        client_id = f"{websocket.remote_address[0]}:{websocket.remote_address[1]}"
        logger.info(f"WebSocket client connected: {client_id}")

        self.websocket_clients.add(websocket)

        try:
            # Send current context immediately
            if self.current_metrics:
                learning_context = self.current_metrics.to_learning_context()
                await websocket.send(
                    json.dumps({"type": "learning_context", "data": learning_context})
                )

            # Handle incoming messages
            async for message in websocket:
                try:
                    data = json.loads(message)
                    await self.handle_client_message(websocket, data)
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON from client {client_id}")

        except websockets.exceptions.ConnectionClosed:
            logger.info(f"WebSocket client disconnected: {client_id}")
        except Exception as e:
            logger.error(f"Error handling WebSocket client {client_id}: {e}")
        finally:
            self.websocket_clients.discard(websocket)

    async def handle_client_message(self, websocket, data: Dict[str, Any]):
        """Handle messages from WebSocket clients"""
        message_type = data.get("type")

        if message_type == "get_status":
            status = self.get_service_status()
            await websocket.send(
                json.dumps({"type": "status_response", "data": status})
            )

        elif message_type == "get_history":
            # Send recent history
            history_length = min(data.get("length", 60), 300)  # Max 5 minutes
            recent_history = self.metrics_history[-history_length:]

            history_data = [metrics.to_learning_context() for metrics in recent_history]

            await websocket.send(
                json.dumps({"type": "history_response", "data": history_data})
            )

        elif message_type == "configure":
            # Handle configuration updates
            config_updates = data.get("config", {})
            self.update_configuration(config_updates)

            await websocket.send(
                json.dumps({"type": "config_updated", "data": {"success": True}})
            )

    async def broadcast_to_clients(self, learning_context: Dict[str, Any]):
        """Broadcast learning context to all connected clients"""
        if not self.websocket_clients:
            return

        message = json.dumps({"type": "learning_context", "data": learning_context})

        # Send to all clients
        disconnected_clients = set()

        for client in self.websocket_clients:
            try:
                await client.send(message)
            except websockets.exceptions.ConnectionClosed:
                disconnected_clients.add(client)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")
                disconnected_clients.add(client)

        # Remove disconnected clients
        self.websocket_clients -= disconnected_clients

    def get_service_status(self) -> Dict[str, Any]:
        """Get current service status"""
        return {
            "monitoring_active": self.monitoring_active,
            "connected_clients": len(self.websocket_clients),
            "metrics_history_length": len(self.metrics_history),
            "sample_interval": self.sample_interval,
            "baseline_established": self.baseline_metrics is not None,
            "current_context": (
                self.current_metrics.to_learning_context()
                if self.current_metrics
                else None
            ),
            "hardware_capabilities": {
                "cpu_temp_available": self.get_cpu_temperature() is not None,
                "fan_speeds_available": len(self.get_fan_speeds()) > 0,
                "battery_available": psutil.sensors_battery() is not None,
            },
        }

    def update_configuration(self, config_updates: Dict[str, Any]):
        """Update service configuration"""
        if "sample_interval" in config_updates:
            self.sample_interval = max(1.0, config_updates["sample_interval"])
            logger.info(f"Sample interval updated to {self.sample_interval}s")

        if "max_history" in config_updates:
            self.max_history = max(60, config_updates["max_history"])
            logger.info(f"Max history updated to {self.max_history}")

    async def stop_service(self):
        """Stop the monitoring service"""
        logger.info("Stopping System Monitor Service")

        # Stop monitoring thread
        if self.monitoring_active:
            self.stop_event.set()
            if self.monitoring_thread:
                self.monitoring_thread.join(timeout=10.0)
            self.monitoring_active = False

        # Close WebSocket server
        if self.websocket_server:
            self.websocket_server.close()
            await self.websocket_server.wait_closed()

        # Close client connections
        if self.websocket_clients:
            await asyncio.gather(
                *[client.close() for client in self.websocket_clients],
                return_exceptions=True,
            )
            self.websocket_clients.clear()

        logger.info("System Monitor Service stopped")


async def main():
    """Main entry point for the service"""
    parser = argparse.ArgumentParser(description="System Monitor Service for ANIOTA")
    parser.add_argument("--port", type=int, default=8765, help="WebSocket server port")
    parser.add_argument(
        "--interval", type=float, default=5.0, help="Sampling interval in seconds"
    )
    parser.add_argument(
        "--history", type=int, default=720, help="Maximum history length"
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging level",
    )

    args = parser.parse_args()

    # Configure logging
    logging.getLogger().setLevel(args.log_level)

    # Service configuration
    config = {
        "websocket_port": args.port,
        "sample_interval": args.interval,
        "max_history": args.history,
    }

    # Create and start service
    service = SystemMonitorService(config)

    try:
        await service.start_service()

        # Keep service running
        logger.info("System Monitor Service is running. Press Ctrl+C to stop.")

        # Wait for interruption
        try:
            while True:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            logger.info("Received keyboard interrupt")

    except Exception as e:
        logger.error(f"Service error: {e}")
        return 1

    finally:
        await service.stop_service()

    return 0


if __name__ == "__main__":
    try:
        exit_code = asyncio.run(main())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        logger.info("Service interrupted by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)
