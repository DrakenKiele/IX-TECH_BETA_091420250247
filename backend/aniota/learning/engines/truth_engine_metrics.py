


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("truth_engine_metrics.py", "system_initialization", "import", "Auto-generated dev log entry")

Truth Engine Metrics and Progress Tracking System
Monitors accuracy improvements and system performance over time.
"""

import json
import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from pathlib import Path

@dataclass
class TestResult:
    """Individual test result data."""
    test_name: str
    statement: str
    expected_range: tuple
    actual_score: int
    passed: bool
    focus_area: str
    timestamp: datetime.datetime

@dataclass
class MetricsSnapshot:
    """System performance snapshot."""
    timestamp: datetime.datetime
    version: str
    total_tests: int
    passed_tests: int
    failed_tests: int
    success_rate: float
    test_results: List[TestResult]
    improvements: List[str]
    issues: List[str]

class TruthEngineMetrics:
    """Track Truth Engine performance and improvements over time."""
    
    def __init__(self, metrics_file: str = "truth_engine_progress.json"):
        self.metrics_file = Path(metrics_file)
        self.history: List[MetricsSnapshot] = []
        self.load_history()
    
    def load_history(self):
        """Load historical metrics data."""
        if self.metrics_file.exists():
            try:
                with open(self.metrics_file, 'r') as f:
                    data = json.load(f)
                    self.history = [self._dict_to_snapshot(snapshot) for snapshot in data]
                print(f"📊 Loaded {len(self.history)} historical snapshots")
            except Exception as e:
                print(f"⚠️ Error loading metrics history: {e}")
                self.history = []
        else:
            print("📊 Starting fresh metrics tracking")
    
    def save_history(self):
        """Save metrics history to file."""
        try:
            data = [self._snapshot_to_dict(snapshot) for snapshot in self.history]
            with open(self.metrics_file, 'w') as f:
                json.dump(data, f, indent=2, default=str)
            print(f"💾 Saved metrics history to {self.metrics_file}")
        except Exception as e:
            print(f"⚠️ Error saving metrics: {e}")
    
    def record_test_session(self, 
                          version: str,
                          test_results: List[Dict[str, Any]],
                          improvements: List[str] = None,
                          issues: List[str] = None):
        """Record a new test session."""
        
        # Convert test results
        results = []
        passed_count = 0
        
        for test_data in test_results:
            result = TestResult(
                test_name=test_data['name'],
                statement=test_data['statement'],
                expected_range=test_data['expected_range'],
                actual_score=test_data['actual_score'],
                passed=test_data['passed'],
                focus_area=test_data['focus_area'],
                timestamp=datetime.datetime.now()
            )
            results.append(result)
            if result.passed:
                passed_count += 1
        
        # Create snapshot
        snapshot = MetricsSnapshot(
            timestamp=datetime.datetime.now(),
            version=version,
            total_tests=len(results),
            passed_tests=passed_count,
            failed_tests=len(results) - passed_count,
            success_rate=round((passed_count / len(results)) * 100, 1),
            test_results=results,
            improvements=improvements or [],
            issues=issues or []
        )
        
        self.history.append(snapshot)
        self.save_history()
        return snapshot
    
    def get_progress_report(self) -> str:
        """Generate a comprehensive progress report."""
        if not self.history:
            return "📊 No metrics history available"
        
        report = []
        report.append("📊 TRUTH ENGINE PROGRESS REPORT")
        report.append("=" * 50)
        
        # Overall progress
        if len(self.history) >= 2:
            latest = self.history[-1]
            previous = self.history[-2]
            change = latest.success_rate - previous.success_rate
            trend = "📈" if change > 0 else "📉" if change < 0 else "➡️"
            report.append(f"Current Success Rate: {latest.success_rate}% {trend}")
            report.append(f"Change from Previous: {change:+.1f}%")
        else:
            report.append(f"Current Success Rate: {self.history[-1].success_rate}%")
        
        report.append("")
        
        # Historical overview
        report.append("📈 HISTORICAL PERFORMANCE")
        report.append("-" * 30)
        for i, snapshot in enumerate(self.history, 1):
            date_str = snapshot.timestamp.strftime("%Y-%m-%d %H:%M")
            report.append(f"{i:2d}. {date_str} | v{snapshot.version} | "
                         f"{snapshot.passed_tests}/{snapshot.total_tests} "
                         f"({snapshot.success_rate}%)")
        
        report.append("")
        
        # Latest test breakdown
        latest = self.history[-1]
        report.append("🔍 LATEST TEST BREAKDOWN")
        report.append("-" * 30)
        
        for result in latest.test_results:
            status = "✅ PASS" if result.passed else "❌ FAIL"
            report.append(f"{status} | {result.test_name}")
            report.append(f"      Statement: {result.statement[:50]}...")
            report.append(f"      Expected: {result.expected_range}, Got: {result.actual_score}")
            report.append(f"      Focus: {result.focus_area}")
            report.append("")
        
        # Recent improvements
        if latest.improvements:
            report.append("🚀 RECENT IMPROVEMENTS")
            report.append("-" * 30)
            for improvement in latest.improvements:
                report.append(f"• {improvement}")
            report.append("")
        
        # Current issues
        if latest.issues:
            report.append("⚠️ CURRENT ISSUES")
            report.append("-" * 30)
            for issue in latest.issues:
                report.append(f"• {issue}")
            report.append("")
        
        # Trend analysis
        if len(self.history) >= 3:
            report.append("📊 TREND ANALYSIS")
            report.append("-" * 30)
            recent_rates = [s.success_rate for s in self.history[-3:]]
            if all(recent_rates[i] <= recent_rates[i+1] for i in range(len(recent_rates)-1)):
                report.append("📈 Consistent improvement trend")
            elif all(recent_rates[i] >= recent_rates[i+1] for i in range(len(recent_rates)-1)):
                report.append("📉 Declining performance trend")
            else:
                report.append("📊 Mixed performance trend")
        
        return "\n".join(report)
    
    def add_historical_data(self, historical_snapshots: List[Dict]):
        """Add historical data from conversation backtrack."""
        print("📚 Adding historical data from conversation...")
        
        for data in historical_snapshots:
            # Convert dictionary to snapshot
            snapshot = self._dict_to_snapshot(data)
            
            # Check if we already have this timestamp
            existing = any(s.timestamp == snapshot.timestamp for s in self.history)
            if not existing:
                self.history.append(snapshot)
        
        # Sort by timestamp
        self.history.sort(key=lambda x: x.timestamp)
        self.save_history()
        print(f"✅ Added historical data. Total snapshots: {len(self.history)}")
    
    def _snapshot_to_dict(self, snapshot: MetricsSnapshot) -> Dict:
        """Convert snapshot to dictionary for JSON serialization."""
        return {
            'timestamp': snapshot.timestamp.isoformat(),
            'version': snapshot.version,
            'total_tests': snapshot.total_tests,
            'passed_tests': snapshot.passed_tests,
            'failed_tests': snapshot.failed_tests,
            'success_rate': snapshot.success_rate,
            'test_results': [
                {
                    'test_name': r.test_name,
                    'statement': r.statement,
                    'expected_range': r.expected_range,
                    'actual_score': r.actual_score,
                    'passed': r.passed,
                    'focus_area': r.focus_area,
                    'timestamp': r.timestamp.isoformat()
                } for r in snapshot.test_results
            ],
            'improvements': snapshot.improvements,
            'issues': snapshot.issues
        }
    
    def _dict_to_snapshot(self, data: Dict) -> MetricsSnapshot:
        """Convert dictionary to snapshot object."""
        test_results = []
        for result_data in data['test_results']:
            result = TestResult(
                test_name=result_data['test_name'],
                statement=result_data['statement'],
                expected_range=tuple(result_data['expected_range']),
                actual_score=result_data['actual_score'],
                passed=result_data['passed'],
                focus_area=result_data['focus_area'],
                timestamp=datetime.datetime.fromisoformat(result_data['timestamp'])
            )
            test_results.append(result)
        
        return MetricsSnapshot(
            timestamp=datetime.datetime.fromisoformat(data['timestamp']),
            version=data['version'],
            total_tests=data['total_tests'],
            passed_tests=data['passed_tests'],
            failed_tests=data['failed_tests'],
            success_rate=data['success_rate'],
            test_results=test_results,
            improvements=data['improvements'],
            issues=data['issues']
        )

def record_current_session():
    """Record the current test session results."""
    
    # Current test results (from the latest run)
    current_results = [
        {
            'name': 'Test 1: High truth, good proximity',
            'statement': 'Plants use photosynthesis to make food from sunlight',
            'expected_range': (85, 100),
            'actual_score': 100,
            'passed': True,
            'focus_area': 'Basic science accuracy'
        },
        {
            'name': 'Test 2: Major contradiction detection',
            'statement': 'Gravity makes objects fall upward into the sky',
            'expected_range': (0, 30),
            'actual_score': 0,
            'passed': True,
            'focus_area': 'Contradiction detection'
        },
        {
            'name': 'Test 3: Math terms proximity',
            'statement': 'Addition combines numbers to get a sum total',
            'expected_range': (80, 100),
            'actual_score': 79,
            'passed': False,
            'focus_area': 'Mathematics accuracy'
        },
        {
            'name': 'Test 4: Grammar contradiction',
            'statement': 'Nouns are action words that show movement',
            'expected_range': (10, 40),
            'actual_score': 15,
            'passed': True,
            'focus_area': 'Grammar contradiction detection'
        },
        {
            'name': 'Test 5: Social studies consistency',
            'statement': 'Democracy involves citizens voting to choose leaders',
            'expected_range': (75, 95),
            'actual_score': 92,
            'passed': True,
            'focus_area': 'Social studies accuracy'
        },
        {
            'name': 'Test 6: Mixed subject domains',
            'statement': 'Atoms have electrons but democracy uses votes',
            'expected_range': (30, 60),
            'actual_score': 46,
            'passed': True,
            'focus_area': 'Cross-domain consistency'
        },
        {
            'name': 'Test 7: Poor proximity detection',
            'statement': 'Plants photosynthesis sunlight water democracy',
            'expected_range': (20, 50),
            'actual_score': 69,
            'passed': False,
            'focus_area': 'Unrelated terms detection'
        }
    ]
    
    improvements = [
        "Added proximity analysis with word distance calculations",
        "Implemented subject consistency scoring",
        "Enhanced contradiction detection for physics and grammar",
        "Added structural analysis for sentence form",
        "Improved penalty system for contradictions"
    ]
    
    issues = [
        "Math statement just below threshold (79/100 vs 80+ needed)",
        "Unrelated terms scoring too high (69/100 vs 20-50 expected)",
        "Need to fine-tune proximity bonus calculations",
        "Subject consistency may need domain-specific weighting"
    ]
    
    metrics = TruthEngineMetrics()
    snapshot = metrics.record_test_session(
        version="1.1-enhanced",
        test_results=current_results,
        improvements=improvements,
        issues=issues
    )
    
    print(f"📊 Recorded session: {snapshot.success_rate}% success rate")
    return metrics

if __name__ == "__main__":
    metrics = record_current_session()
    print(metrics.get_progress_report())# 2025-09-11 | [XX]    | [Description]                        | [Reason]
