

"""
DEVELOPMENT LOG SYSTEM
======================

This file provides development logging functionality for tracking
file traversals and dependency chains in the IX-TECH backend system.
"""

import json
import datetime
import os
from typing import Dict, Any, List

class DevLog:
    def __init__(self, filename: str):
        self.filename = filename
        self.log_file = f"{filename}_dev.log"
        self.traversal_count = 0
        self.dependencies = []
        self.function_calls = []
        self.last_modified = datetime.datetime.now()
        
    def log_traversal(self, calling_file: str, function_name: str = None, purpose: str = None):
        """Log when this file is traversed/imported by another file"""
        self.traversal_count += 1
        
        log_entry = {
            'traversal_id': self.traversal_count,
            'timestamp': datetime.datetime.now().isoformat(),
            'calling_file': calling_file,
            'function_name': function_name,
            'purpose': purpose,
            'filename': self.filename
        }
        
        # Write to log file
        with open(self.log_file, 'a') as f:
            f.write(f"{json.dumps(log_entry)}\n")
        
        print(f"📝 DEV LOG [{self.filename}]: Traversal #{self.traversal_count} from {calling_file}")
        if function_name:
            print(f"   Function: {function_name}")
        if purpose:
            print(f"   Purpose: {purpose}")
        
        return log_entry
    
    def log_dependency(self, dependency_file: str, dependency_type: str = "import"):
        """Log when this file depends on another file"""
        self.dependencies.append({
            'dependency_file': dependency_file,
            'dependency_type': dependency_type,
            'timestamp': datetime.datetime.now().isoformat()
        })
        
        print(f"🔗 DEV LOG [{self.filename}]: Depends on {dependency_file} ({dependency_type})")
    
    def log_function_call(self, function_name: str, caller: str, parameters: Dict = None):
        """Log when a function in this file is called"""
        call_entry = {
            'function_name': function_name,
            'caller': caller,
            'parameters': parameters,
            'timestamp': datetime.datetime.now().isoformat()
        }
        
        self.function_calls.append(call_entry)
        print(f"🔧 DEV LOG [{self.filename}]: Function '{function_name}' called by {caller}")
    
    def get_traversal_summary(self):
        """Get summary of all traversals"""
        return {
            'filename': self.filename,
            'total_traversals': self.traversal_count,
            'dependencies': self.dependencies,
            'function_calls': len(self.function_calls),
            'last_modified': self.last_modified.isoformat()
        }

dev_logs = {}

def get_dev_log(filename: str) -> DevLog:
    """Get or create a dev log for a file"""
    if filename not in dev_logs:
        dev_logs[filename] = DevLog(filename)
    return dev_logs[filename]

def log_file_traversal(filename: str, calling_file: str, function_name: str = None, purpose: str = None):
    """Convenience function to log file traversal"""
    dev_log = get_dev_log(filename)
    return dev_log.log_traversal(calling_file, function_name, purpose)

def log_file_dependency(filename: str, dependency_file: str, dependency_type: str = "import"):
    """Convenience function to log file dependency"""
    dev_log = get_dev_log(filename)
    return dev_log.log_dependency(dependency_file, dependency_type)

def generate_dependency_report():
    """Generate a complete dependency report for all logged files"""
    print("\n" + "="*60)
    print("IX-TECH BACKEND DEPENDENCY REPORT")
    print("="*60)
    
    for filename, dev_log in dev_logs.items():
        summary = dev_log.get_traversal_summary()
        print(f"\nFILE: {filename}")
        print(f"  Traversals: {summary['total_traversals']}")
        print(f"  Dependencies: {len(summary['dependencies'])}")
        print(f"  Function Calls: {summary['function_calls']}")
        
        if summary['dependencies']:
            print("  Depends on:")
            for dep in summary['dependencies']:
                print(f"    - {dep['dependency_file']} ({dep['dependency_type']})")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    # Test the dev log system
    test_log = get_dev_log("test_file.py")
    test_log.log_traversal("main.py", "init_system", "Initialize backend systems")
    test_log.log_dependency("aniota_presence.py", "import")
    generate_dependency_report()
