

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("phonemix_test_suite.py", "system_initialization", "import", "Auto-generated dev log entry")

REFLEX Framework - Test Suite
=============================

This comprehensive test suite validates all aspects of the REFLEX Framework.
Run these tests to verify the framework works correctly in your environment.

Usage:
    python reflex_test_suite.py

The test suite covers:
- Core functionality validation
- Grammar enforcement testing
- Project generation workflow
- Configuration system validation
"""

import json
import os
import sys
import unittest
import tempfile
import shutil

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pet_behavior_handler import Pet
from reflex_grammar_enforcer import (
    enforce_filename_grammar,
    enforce_function_grammar,
    enforce_variable_grammar,
    validate_grammar_tree
)


class TestReflexCore(unittest.TestCase):
    """Test core REFLEX framework functionality."""

    def setUp(self):
        """Set up test fixtures."""
        self.pet = Pet("TestPet")

    def test_pet_initialization(self):
        """Test that sample projects initialize correctly."""
        self.assertEqual(self.pet.name, "TestPet")
        self.assertEqual(self.pet.hunger, 50)
        self.assertEqual(self.pet.happiness, 50)

    def test_pet_feeding_mechanics(self):
        """Test sample project state management."""
        initial_hunger = self.pet.hunger
        self.pet.feed_pet_by_user(20)
        self.assertEqual(self.pet.hunger, initial_hunger - 20)

        # Test boundaries
        self.pet.feed_pet_by_user(100)
        self.assertEqual(self.pet.hunger, 0)

    def test_pet_interaction_system(self):
        """Test sample project interaction patterns."""
        initial_happiness = self.pet.happiness
        self.pet.play_with_pet_by_user(30)
        self.assertEqual(self.pet.happiness, initial_happiness + 30)

        # Test boundaries
        self.pet.play_with_pet_by_user(100)
        self.assertEqual(self.pet.happiness, 100)

    def test_time_decay_mechanics(self):
        """Test sample project time-based systems."""
        initial_hunger = self.pet.hunger
        initial_happiness = self.pet.happiness

        self.pet.decay_status_from_time()

        self.assertEqual(self.pet.hunger, initial_hunger + 1)
        self.assertEqual(self.pet.happiness, initial_happiness - 1)


class TestReflexGrammar(unittest.TestCase):
    """Test REFLEX grammar enforcement system."""

    def test_filename_validation(self):
        """Test filename grammar enforcement."""
        # Valid filenames
        valid_files = [
            "py/pet_behavior_handler.py",
            "py/user_interface_manager.py",
            "py/data_storage_connector.py"
        ]

        for filename in valid_files:
            with self.subTest(filename=filename):
                self.assertTrue(enforce_filename_grammar(filename))

        # Invalid filenames
        invalid_files = [
            "py/PetBehavior.py",  # CamelCase
            "py/pet-behavior.py",  # Hyphens
            "py/pet.py",  # Too short
            "py/petbehaviorhandler.py"  # No underscores
        ]

        for filename in invalid_files:
            with self.subTest(filename=filename):
                self.assertFalse(enforce_filename_grammar(filename))

    def test_function_naming_validation(self):
        """Test function naming grammar enforcement."""
        # Valid function names
        valid_functions = [
            "feed_pet_by_user",
            "update_status_from_timer",
            "load_data_from_file"
        ]

        for func_name in valid_functions:
            with self.subTest(function=func_name):
                self.assertTrue(enforce_function_grammar(func_name))

        # Invalid function names
        invalid_functions = [
            "feedPet",  # CamelCase
            "feed_pet",  # Missing preposition
            "feed-pet-by-user"  # Hyphens
        ]

        for func_name in invalid_functions:
            with self.subTest(function=func_name):
                self.assertFalse(enforce_function_grammar(func_name))

    def test_variable_naming_validation(self):
        """Test variable naming grammar enforcement."""
        # Valid variable names
        valid_variables = ["pet_name", "user_input", "max_hunger_level"]

        for var_name in valid_variables:
            with self.subTest(variable=var_name):
                self.assertTrue(enforce_variable_grammar(var_name))

        # Invalid variable names
        invalid_variables = ["petName", "_private_var", "pet", "PET_NAME"]

        for var_name in invalid_variables:
            with self.subTest(variable=var_name):
                self.assertFalse(enforce_variable_grammar(var_name))


class TestReflexConfiguration(unittest.TestCase):
    """Test REFLEX configuration system."""

    def setUp(self):
        """Set up configuration test fixtures."""
        self.config_dir = "config"

    def test_configuration_files_exist(self):
        """Test that all required configuration files are present."""
        required_configs = [
            "json/config_doug_rubric.json",
            "json/config_reflex_template.json",
            "json/config_module_form_template.json",
            "json/config_reflex_project.json"
        ]

        for config_file in required_configs:
            config_path = os.path.join(self.config_dir, config_file)
            with self.subTest(config=config_file):
                self.assertTrue(os.path.exists(config_path))

    def test_configuration_structure(self):
        """Test that configuration files have valid JSON structure."""
        config_files = [
            "json/config_doug_rubric.json",
            "json/config_reflex_template.json"
        ]

        for config_file in config_files:
            config_path = os.path.join(self.config_dir, config_file)
            with self.subTest(config=config_file):
                with open(config_path, 'r') as f:
                    config_data = json.load(f)
                self.assertIsInstance(config_data, dict)

    def test_template_required_fields(self):
        """Test that project templates have required fields."""
        template_path = os.path.join(self.config_dir, "json/config_reflex_template.json")

        with open(template_path, 'r') as f:
            template = json.load(f)

        required_fields = [
            "projectName", "author", "version", "who", "what", "why",
            "inputTypes", "outputTypes", "coreLogic", "modulesNeeded",
            "dependencies", "language"
        ]

        for field in required_fields:
            with self.subTest(field=field):
                self.assertIn(field, template)


class TestReflexProjectGeneration(unittest.TestCase):
    """Test REFLEX project generation capabilities."""

    def setUp(self):
        """Set up project generation test fixtures."""
        self.test_dir = tempfile.mkdtemp()

    def tearDown(self):
        """Clean up test fixtures."""
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_project_structure_validation(self):
        """Test that project generation follows expected patterns."""
        # Test that the framework can validate project structures
        good_structure = [
            "py/pet_behavior_handler.py",
            "py/pet_interaction_manager.py"
        ]

        validation_report = validate_grammar_tree(good_structure)
        self.assertEqual(len(validation_report["files"]), 0)

    def test_rubric_system_integration(self):
        """Test that coding rubric integrates with generation system."""
        rubric_path = os.path.join("config", "json/config_doug_rubric.json")

        with open(rubric_path, 'r') as f:
            rubric = json.load(f)

        # Verify rubric has essential styling directives
        essential_fields = ["commentStyle", "structure", "namingConvention"]

        for field in essential_fields:
            with self.subTest(field=field):
                self.assertIn(field, rubric)


def run_reflex_tests():
    """Run the complete REFLEX test suite."""
    print("🔥 REFLEX Framework Test Suite")
    print("=" * 40)
    print("Testing framework components...\n")

    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    # Add test classes
    suite.addTests(loader.loadTestsFromTestCase(TestReflexCore))
    suite.addTests(loader.loadTestsFromTestCase(TestReflexGrammar))
    suite.addTests(loader.loadTestsFromTestCase(TestReflexConfiguration))
    suite.addTests(loader.loadTestsFromTestCase(TestReflexProjectGeneration))

    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # Print summary
    print("\n" + "=" * 40)
    print("🎯 REFLEX TEST SUMMARY")
    print("=" * 40)

    total_tests = result.testsRun
    failures = len(result.failures)
    errors = len(result.errors)
    successes = total_tests - failures - errors

    print(f"Tests Run: {total_tests}")
    print(f"Successes: {successes}")
    print(f"Failures: {failures}")
    print(f"Errors: {errors}")
    print(f"Success Rate: {(successes/total_tests)*100:.1f}%")

    if failures == 0 and errors == 0:
        print("\n✅ All tests passed! REFLEX Framework is working correctly.")
    else:
        print("\n❌ Some tests failed. Check the output above for details.")

    return result


if __name__ == "__main__":
    run_reflex_tests()


# Log dependencies
log_file_dependency("phonemix_test_suite.py", "unittest", "import")
log_file_dependency("phonemix_test_suite.py", "tempfile", "import")
log_file_dependency("phonemix_test_suite.py", "shutil", "import")
