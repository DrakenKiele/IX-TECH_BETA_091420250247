

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("phonemix_entry_main.py", "system_initialization", "import", "Auto-generated dev log entry")

Filename: phonemix_entry_main.py
Main entry point for the PHONEMIX Framework.

The PHONEMIX Framework is a recursive project generation system that creates
structured Python projects using templates and enforces coding standards.

Author: Douglas Keely
Company: DK Softworks LLC
Version: 0.1.0
"""

import os
import sys
import json
import argparse
from datetime import datetime

from phonemix_project_generator import ProjectGenerator
from phonemix_style_interpreter import StyleInterpreter
from phonemix_grammar_enforcer import validate_grammar_tree


class PhonemixFramework:
    """Main PHONEMIX Framework orchestrator."""

    def __init__(self):
        """Initialize PHONEMIX Framework."""
        self.project_generator = ProjectGenerator()
        self.style_interpreter = StyleInterpreter()
        self.config_dir = "config"

    def create_new_project_from_template(self, project_name, output_dir=".", custom_config=None):
        """Create a new project using PHONEMIX templates."""
        print(f"🚀 Creating new PHONEMIX project: {project_name}")
        print("=" * 50)

        # Load templates
        if not self.project_generator.load_template_from_file():
            print("❌ Failed to load project template")
            return False

        if not self.project_generator.load_style_rubric_from_file():
            print("❌ Failed to load style rubric")
            return False

        # Prepare project configuration
        project_config = {
            "projectName": project_name,
            "author": "PHONEMIX User",
            "version": "0.1.0",
            "who": "Developers and users",
            "what": f"A {project_name} application built with PHONEMIX",
            "why": "To demonstrate PHONEMIX framework capabilities",
            "inputTypes": ["user_input"],
            "outputTypes": ["processed_output"],
            "coreLogic": "Process input data and generate output",
            "modulesNeeded": ["processor", "validator", "formatter"],
            "dependencies": ["json", "os", "sys"],
            "language": "python",
            "testsRequired": True
        }

        # Apply custom configuration
        if custom_config:
            project_config.update(custom_config)

        # Create project structure
        project_path = os.path.join(output_dir, project_name)
        success = self.project_generator.create_project_structure_from_template(
            project_path, project_config
        )

        if success:
            print(f"✅ Project '{project_name}' created successfully!")
            print(f"📁 Location: {os.path.abspath(project_path)}")

            # Validate generated project
            self._validate_generated_project(project_path)

            return True
        else:
            print(f"❌ Failed to create project '{project_name}'")
            return False

    def validate_existing_project_by_standards(self, project_path):
        """Validate an existing project against PHONEMIX standards."""
        print(f"🔍 Validating project: {project_path}")
        print("=" * 50)

        if not os.path.exists(project_path):
            print(f"❌ Project path does not exist: {project_path}")
            return False

        # Find all Python files
        python_files = []
        for root, dirs, files in os.walk(project_path):
            for file in files:
                if file.endswith('.py'):
                    python_files.append(file)

        if not python_files:
            print("❌ No Python files found in project")
            return False

        print(f"📝 Found {len(python_files)} Python files")

        # Validate grammar/naming conventions
        grammar_report = validate_grammar_tree(python_files)

        if grammar_report["files"]:
            print("⚠️  Grammar violations found:")
            for file in grammar_report["files"]:
                print(f"   - {file}")
        else:
            print("✅ All files follow naming conventions")

        # Validate style compliance
        style_results = {}
        for root, dirs, files in os.walk(project_path):
            for file in files:
                if file.endswith('.py'):
                    file_path = os.path.join(root, file)
                    validation = self.style_interpreter.validate_code_against_rubric(
                        open(file_path, 'r').read()
                    )
                    style_results[file] = validation

        style_issues = sum(1 for result in style_results.values() if not result["valid"])

        if style_issues > 0:
            print(f"⚠️  Style issues found in {style_issues} files")
        else:
            print("✅ All files pass style validation")

        # Summary
        total_issues = len(grammar_report["files"]) + style_issues
        if total_issues == 0:
            print("\n🎉 Project fully complies with PHONEMIX standards!")
        else:
            print(f"\n📊 Total issues found: {total_issues}")

        return total_issues == 0

    def generate_project_from_interactive_prompt(self):
        """Interactive project creation with user prompts."""
        print("🎯 PHONEMIX Interactive Project Creator")
        print("=" * 40)

        # Gather project information
        project_name = input("Project name: ").strip()
        if not project_name:
            print("❌ Project name is required")
            return False

        author = input("Author name (default: PHONEMIX User): ").strip() or "PHONEMIX User"

        print("\nProject description:")
        who = input("  Who is this for? ").strip()
        what = input("  What does it do? ").strip()
        why = input("  Why are you building it? ").strip()

        # Optional advanced configuration
        advanced = input("\nConfigure advanced options? (y/N): ").strip().lower()

        custom_config = {
            "projectName": project_name,
            "author": author,
            "who": who or "Users and developers",
            "what": what or f"A {project_name} application",
            "why": why or "To solve a specific problem"
        }

        if advanced == 'y':
            modules = input("Required modules (comma-separated): ").strip()
            if modules:
                custom_config["modulesNeeded"] = [m.strip() for m in modules.split(',')]

            deps = input("Dependencies (comma-separated): ").strip()
            if deps:
                custom_config["dependencies"] = [d.strip() for d in deps.split(',')]

        # Create the project
        return self.create_new_project_from_template(project_name, ".", custom_config)

    def _validate_generated_project(self, project_path):
        """Internal validation of newly generated project."""
        print("\n🔍 Validating generated project...")

        # Check required directories
        required_dirs = ["config", "docs", "tests"]
        for dir_name in required_dirs:
            dir_path = os.path.join(project_path, dir_name)
            if os.path.exists(dir_path):
                print(f"   ✅ {dir_name}/ directory created")
            else:
                print(f"   ⚠️  {dir_name}/ directory missing")

        # Check for main file
        main_files = [f for f in os.listdir(project_path) if f.endswith('py/_entry_main.py')]
        if main_files:
            print(f"   ✅ Main entry point: {main_files[0]}")
        else:
            print("   ⚠️  Main entry point missing")


def parse_command_line_arguments():
    """Parse command line arguments for PHONEMIX."""
    parser = argparse.ArgumentParser(
        description="PHONEMIX Framework - Recursive Project Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s create MyProject              # Create project with defaults
  %(prog)s interactive                   # Interactive project creation
  %(prog)s validate ./MyProject         # Validate existing project
  %(prog)s demo                          # Create demo project
        """
    )

    parser.add_argument('command',
                       choices=['create', 'validate', 'interactive', 'demo'],
                       help='Command to execute')

    parser.add_argument('target', nargs='?',
                       help='Project name (for create) or path (for validate)')

    parser.add_argument('--output', '-o', default='.',
                       help='Output directory (default: current directory)')

    parser.add_argument('--config', '-c',
                       help='Custom configuration file')

    return parser.parse_args()


def main():
    """Main entry point for PHONEMIX Framework."""
    print("🔥 PHONEMIX Framework v0.1.0")
    print("Recursive Project Generation with Style")
    print("Built with fire and recursion at DK Softworks LLC")
    print("© 2025 Douglas Keely - Stroud, OK")
    print()

    # Parse arguments
    args = parse_command_line_arguments()

    # Initialize framework
    phonemix = PhonemixFramework()

    try:
        if args.command == 'create':
            if not args.target:
                print("❌ Project name required for create command")
                return 1

            custom_config = None
            if args.config:
                with open(args.config, 'r') as f:
                    custom_config = json.load(f)

            success = phonemix.create_new_project_from_template(
                args.target, args.output, custom_config
            )
            return 0 if success else 1

        elif args.command == 'validate':
            if not args.target:
                print("❌ Project path required for validate command")
                return 1

            success = phonemix.validate_existing_project_by_standards(args.target)
            return 0 if success else 1

        elif args.command == 'interactive':
            success = phonemix.generate_project_from_interactive_prompt()
            return 0 if success else 1

        elif args.command == 'demo':
            print("🎭 Creating PHONEMIX demo project...")
            demo_config = {
                "projectName": "PHONEMIXDemo",
                "author": "PHONEMIX Framework",
                "who": "Developers exploring PHONEMIX",
                "what": "A demonstration of PHONEMIX capabilities",
                "why": "To showcase recursive project generation",
                "modulesNeeded": ["data_processor", "file_manager", "report_generator"],
                "dependencies": ["json", "os", "sys", "datetime"]
            }

            success = phonemix.create_new_project_from_template(
                "PHONEMIXDemo", args.output, demo_config
            )
            return 0 if success else 1

    except KeyboardInterrupt:
        print("\n👋 Operation cancelled by user")
        return 1
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)


log_file_dependency("phonemix_entry_main.py", "argparse", "import")
