# =============================================
# Unified Launcher for IX-TECH
# This script orchestrates the startup sequence:
#   1. Starts PostgreSQL
#   2. Launches backend/main.py (FastAPI backend)
#   3. Launches frontend static server
#   4. Launches main.py (root)
#   5. Optionally launches aniota_ui/main.js via Electron
# Use --killall to terminate all related services.
# =============================================

import platform
import json
import os
import subprocess
import sys
import time
import threading
import socket

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


def launch_service(name, cmd, cwd=None, env=None):
    """Launch a subprocess for a given service and return the process object."""
    print(f"Launching {name}...")
    try:
        creationflags = 0
        if platform.system() == "Windows":
            creationflags = subprocess.DETACHED_PROCESS
        proc = subprocess.Popen(
            cmd,
            cwd=cwd,
            env=env,
            
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            creationflags=creationflags
        )
        return proc
    except (FileNotFoundError, PermissionError, OSError) as e:
        print(f"Failed to launch {name}: {e}")
        return None


def stream_logs(proc, name):
    print(f"--- Live log for {name} ---")
    try:
        count = 0
        for line in proc.stdout:
            print(f"[{name}] {line}", end="")
            count += 1
            if count >= 10:
                print(f"[{name}] ... (log truncated) ...")
                break
    except Exception as e:
        print(f"Error streaming logs for {name}: {e}")


def run_static_server():
    app = FastAPI(title="IX-TECH Static Server")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.mount("/", StaticFiles(directory=".", html=True), name="static")
    uvicorn.run(app, host="0.0.0.0", port=8002)


def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("localhost", port)) == 0


def get_service_status():
    """Return a dict with the status of all services."""
    status = {}
    status["Backend"] = "Running" if is_port_in_use(8001) else "Stopped"
    status["Frontend"] = "Running" if is_port_in_use(8002) else "Stopped"
    status["RootMain"] = "Running" if is_port_in_use(8003) else "Stopped"
    # Electron: check if process is running (optional, here just port check placeholder)
    # If Electron exposes a port, check it; otherwise, mark as Unknown
    status["ElectronApp"] = (
        "Unknown"  # Could be improved if Electron exposes a port or PID
    )
    return status


def resolve_path(options, base_dir):
    """Return the first existing path from options, relative to base_dir."""
    for opt in options:
        abs_path = os.path.abspath(os.path.join(base_dir, opt))
        if os.path.exists(abs_path):
            return abs_path
    # If none exist, return the first as default
    return os.path.abspath(os.path.join(base_dir, options[0]))


PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(PROJECT_DIR, "fallback_config.json")
try:
    with open(CONFIG_PATH, "r") as f:
        fallback_config = json.load(f)
    # Validate required keys
    required_keys = [
        "portable_postgresql",
        "aniota_presence_electron",
        "node",
        "python",
        "git",
        "vscode",
    ]
    for key in required_keys:
        if key not in fallback_config:
            print(f"[ERROR] Missing key '{key}' in fallback_config.json. Exiting.")
            sys.exit(1)
    BASE_DIR = resolve_path(fallback_config["portable_postgresql"], PROJECT_DIR)
    ELECTRON_DIR = resolve_path(
        fallback_config["aniota_presence_electron"], PROJECT_DIR
    )
    NODE_DIR = resolve_path(fallback_config["node"], PROJECT_DIR)
    PYTHON_PATH = resolve_path(fallback_config["python"], PROJECT_DIR)
    GIT_PATH = resolve_path(fallback_config["git"], PROJECT_DIR)
    VSCODE_PATH = resolve_path(fallback_config["vscode"], PROJECT_DIR)
except FileNotFoundError:
    print(f"[ERROR] Config file '{CONFIG_PATH}' not found. Exiting.")
    sys.exit(1)
except json.JSONDecodeError as e:
    print(f"[ERROR] Config file '{CONFIG_PATH}' is not valid JSON: {e}. Exiting.")
    sys.exit(1)


def find_npm_path(electron_dir):
    # Try common locations for npm executable
    # Also check project root node_modules/.bin/npm.cmd
    project_root = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(electron_dir, "node_modules", "npm", "bin", "npm.cmd"),
        os.path.join(electron_dir, "node_modules", "npm", "bin", "npm.exe"),
        os.path.join(electron_dir, "node_modules", ".bin", "npm.cmd"),
        os.path.join(electron_dir, "node_modules", ".bin", "npm.exe"),
        os.path.join(project_root, "node_modules", ".bin", "npm.cmd"),
        os.path.join(project_root, "node_modules", ".bin", "npm.exe"),
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    # Fallback: try just 'npm' in system PATH
    return "npm"


NPM_PATH = find_npm_path(ELECTRON_DIR)

print("[FALLBACK] BASE_DIR:", BASE_DIR)
print("[FALLBACK] ELECTRON_DIR:", ELECTRON_DIR)
print("[FALLBACK] NODE_DIR:", NODE_DIR)
print("[FALLBACK] PYTHON_PATH:", PYTHON_PATH)
print("[FALLBACK] GIT_PATH:", GIT_PATH)
print("[FALLBACK] VSCODE_PATH:", VSCODE_PATH)
print(f"[DEBUG] find_npm_path(ELECTRON_DIR) returned: {NPM_PATH}")
print("[FALLBACK] NPM_PATH:", NPM_PATH)


def check_postgres():
    print("[DEBUG] Checking PostgreSQL status...")
    pg_ctl_path = os.path.join(BASE_DIR, "bin", "pg_ctl.exe")
    data_dir = os.path.join(BASE_DIR, "data")
    try:
        print(f"[DEBUG] Running status command: {[pg_ctl_path, '-D', data_dir, 'status']}")
        result = subprocess.run(
            [pg_ctl_path, "-D", data_dir, "status"],
            capture_output=True,
            text=True,
            timeout=10,
        )
        print(f"[DEBUG] Status command completed. stdout: {result.stdout}")
        if "server is running" in result.stdout:
            print("[DEBUG] PostgreSQL is running.")
            return True
        else:
            print("[DEBUG] PostgreSQL is NOT running. Attempting to start...")
            print(f"[DEBUG] Running start command: {[pg_ctl_path, '-D', data_dir, 'start']}")
            subprocess.Popen(
                [pg_ctl_path, "-D", data_dir, "start"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
            print("[DEBUG] Waiting up to 15 seconds for server to start...")
            for i in range(15):
                time.sleep(1)
                status_result = subprocess.run(
                    [pg_ctl_path, "-D", data_dir, "status"],
                    capture_output=True,
                    text=True,
                )
                if "server is running" in status_result.stdout:
                    print("[DEBUG] PostgreSQL started successfully.")
                    return True
            print("[ERROR] PostgreSQL did not start within 15 seconds.")
            return False
    except Exception as e:
        print(f"[DEBUG] Error checking/starting PostgreSQL: {e}")
        return False






def main():
    # Command-line status report
    if "--status" in sys.argv:
        print("Service Status Report:")
        status = get_service_status()
        for name, state in status.items():
            print(f"  {name}: {state}")
        return
    if "--killall" in sys.argv:
        print("[KILLALL] Terminating all Aniota/IX-TECH related services...")
        if platform.system() == "Windows":
            for proc_name in ["postgres.exe", "node.exe", "electron.exe", "npm.exe"]:
                try:
                    print(f"[KILLALL] Attempting to kill {proc_name} (including child processes)...")
                    kill_result = subprocess.run([
                        "taskkill", "/F", "/T", "/IM", proc_name
                    ], capture_output=True, text=True)
                    print(f"[KILLALL] taskkill output for {proc_name}: {kill_result.stdout}")
                except Exception as e:
                    print(f"[KILLALL] Error running taskkill for {proc_name}: {e}")
        print("[KILLALL] All relevant services terminated.")
        return
    # Automatic status report (run once before launching services)
    print("Service Status Report (pre-launch):")
    status = get_service_status()
    for name, state in status.items():
        print(f"  {name}: {state}")
    # Track processes for cleanup
    launched_procs = []
    # 0. Check for venv and create if missing
    venv_dir = os.path.join(PROJECT_DIR, ".venv")
    venv_python = os.path.join(venv_dir, "Scripts", "python.exe")
    if not os.path.exists(venv_dir):
        print("[DEBUG] .venv not found. Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)
        print("[DEBUG] .venv created.")
    else:
        print("[DEBUG] .venv found.")
    if not os.path.exists(venv_python):
        print(f"[ERROR] venv python executable not found at {venv_python}. Exiting.")
        sys.exit(1)
    print(f"[DEBUG] Using venv python: {venv_python}")

    # 1. Check/start PostgreSQL
    if not check_postgres():
        print("PostgreSQL could not be started. Attempting to kill any running service and retry...")
        pg_ctl_path = os.path.join(BASE_DIR, "bin", "pg_ctl.exe")
        data_dir = os.path.join(BASE_DIR, "data")
        # Try to stop the service gracefully
        try:
            print(f"[DEBUG] Running stop command: {[pg_ctl_path, '-D', data_dir, 'stop', '-m', 'fast']}")
            stop_result = subprocess.run(
                [pg_ctl_path, "-D", data_dir, "stop", "-m", "fast"],
                capture_output=True,
                text=True,
                timeout=10,
            )
            print(f"[DEBUG] Stop command completed. stdout: {stop_result.stdout}")
        except Exception as e:
            print(f"[DEBUG] Error stopping PostgreSQL: {e}")
        # Force kill any remaining postgres.exe processes (Windows only)
        if platform.system() == "Windows":
            try:
                print("[DEBUG] Forcibly killing all postgres.exe processes...")
                kill_result = subprocess.run(
                    ["taskkill", "/F", "/IM", "postgres.exe"],
                    capture_output=True,
                    text=True,
                )
                print(f"[DEBUG] taskkill output: {kill_result.stdout}")
            except Exception as e:
                print(f"[DEBUG] Error running taskkill: {e}")
        # Try again to start
        if not check_postgres():
            print("PostgreSQL could not be started after killing service. Exiting.")
            sys.exit(1)
        else:
            print("PostgreSQL started successfully after killing previous instance.")

    # 2. Launch backend (FastAPI)
    backend_port = 8001
    if is_port_in_use(backend_port):
        print(f"Backend already running on port {backend_port}. Skipping launch.")
        backend_proc = None
    else:
        backend_env = os.environ.copy()
        backend_env["DATABASE_URL"] = (
            "postgresql://postgres:postgres@localhost:5432/ix-tech"
        )
        print("Launching Backend (Aniota persona)...")
        backend_main_py = os.path.join(PROJECT_DIR, "backend", "main.py")
        backend_proc = launch_service(
            "Backend",
            [venv_python, backend_main_py],
            cwd=PROJECT_DIR,
            env=backend_env,
        )
        if backend_proc:
            print("Backend process started successfully.")
            launched_procs.append(backend_proc)
            time.sleep(0.5)
        else:
            print("[ERROR] Backend process failed to start.")

    # 3. Launch frontend (static server) as a thread
    frontend_port = 8002
    if is_port_in_use(frontend_port):
        print(f"Frontend already running on port {frontend_port}. Skipping launch.")
        frontend_thread = None
        frontend_proc = None
    else:
        print("Launching integrated FastAPI static server...")
        frontend_thread = threading.Thread(target=run_static_server, daemon=True)
        frontend_thread.start()
        print("Static server started on port 8002.")
        frontend_proc = None

    # 4. Launch root main.py
    root_port = 8003
    if is_port_in_use(root_port):
        print(f"RootMain already running on port {root_port}. Skipping launch.")
        root_proc = None
    else:
        root_proc = launch_service(
            "RootMain",
            [venv_python, "main.py"],
            cwd=PROJECT_DIR,
        )
        if root_proc:
            launched_procs.append(root_proc)
            time.sleep(0.3)

    # 5. Launch Electron app (Node.js/Electron)
    # Use project root node_modules/.bin/electron.cmd and aniota_ui/main.js
    project_root = os.path.dirname(os.path.abspath(__file__))
    electron_cmd = os.path.join(project_root, "node_modules", ".bin", "electron.cmd")
    main_js = os.path.join(project_root, "aniota_ui", "main.js")
    if os.path.exists(electron_cmd) and os.path.exists(main_js):
        print("Launching Electron app via project root electron.cmd...")
        try:
            electron_proc = launch_service(
                "ElectronApp", [electron_cmd, main_js], cwd=project_root
            )
            if electron_proc:
                launched_procs.append(electron_proc)
                time.sleep(0.5)
            else:
                print("[ERROR] Electron process failed to start.")
        except Exception as e:
            print(f"[ERROR] Exception while launching Electron: {e}")
            if "electron_proc" in locals() and electron_proc and electron_proc.stdout:
                print("--- Electron error log ---")
                for i in range(10):
                    line = electron_proc.stdout.readline()
                    if not line:
                        break
                    print(f"[ElectronApp] {line}", end="")
    else:
        print("[ERROR] electron.cmd or main.js not found. Electron app not started.")
        electron_proc = None
    time.sleep(1)  # Give threads time to print logs

    # Services will remain running after launcher exits. Use --killall to terminate them.

    print("All services launched. Monitor logs above and troubleshoot as needed.")
    # All services are running.


if __name__ == "__main__":
    main()
