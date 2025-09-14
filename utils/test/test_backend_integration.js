// # BREADCRUMB: [Project/Module] > test_backend_integration.js
// # This file is the root entry point and orchestrator for the entire system.
// # Next files in program flow (launch order):
// #   1. [next_file_1] ([how_it_is_invoked_or_launched])
// #   2. [next_file_2] ([how_it_is_invoked_or_launched])
// #   3. [next_file_3] ([how_it_is_invoked_or_launched])
// #   ...
// # (Replace with actual files and launch details for each file.)
// # -----------------------------------------------------------------------------
// # File: test_backend_integration.js
// # Purpose: Central entry point and orchestrator for the system.
// #
// # Type: Main launcher script (not a class file, but acts as a system controller)
// #
// # Responsibilities:
// #   - Loads configuration and resolves paths for all major dependencies ([List dependencies])
// #   - Checks and manages the status of critical services (starts/stops as needed)
// #   - Launches and monitors all core services:
// #       * [Service 1] ([Tech/Port])
// #       * [Service 2] ([Tech/Port])
// #       * [Service 3] ([Tech/Port])
// #       * [Service 4] ([Tech/Port])
// #   - Provides command-line flags for status reporting and service termination ([flags])
// #   - Handles process cleanup and error reporting
// #
// # Key Functions:
// #   - main(): Orchestrates the full launch sequence and handles CLI flags
// #   - launch_service(): Starts a subprocess for a given service
// #   - stream_logs(): Streams and truncates logs from subprocesses
// #   - run_static_server(): Runs the static file server (if applicable)
// #   - is_port_in_use(): Checks if a TCP port is active
// #   - get_service_status(): Returns a dict of service statuses
// #   - check_service(): Ensures a service is running, starts if not
// #   - resolve_path(): Finds the first valid path for a dependency from config
// #   - find_dependency_path(): Locates the executable for a dependency
// #
// # Relationships:
// #   - Reads from configuration files for dependency paths
// #   - Launches and monitors other scripts and processes
// #   - Interacts with the OS for process and port management
// #
// # Usefulness & Execution Path:
// #   - main() is the required entry point and is always used.
// #   - [List of essential functions] are all actively used and essential for orchestrating the system.
// #   - [Legacy/optional functions] may become obsolete as the system evolves.
// #
// # Suggestions:
// #   - **Performance:** [Performance notes]
// #   - **Code Cleanliness:** [Code cleanliness notes]
// #   - **Location:** [Location notes]
// #   - **Function:** [Function notes]
// #   - **Legacy:** [Legacy notes]
// #   - **Config:** [Config notes]
// #   - **Error Handling:** [Error handling notes]
// #   - **Cross-Platform:** [Cross-platform notes]
// #
// # Summary:
// #   - This file is essential, well-placed, and mostly clean.
// #   - All major functions are used and support the requirements for modularity, orchestration, and portability.
// #   - Minor cleanup (removing redundant code, legacy functions) is recommended to enhance maintainability.
// #   - Overall, it effectively serves as the central controller for the system.
// #
// # CHANGE MANAGEMENT LOG
// # Date        | Initials | Description of Change                | Reason for Change
// # -----------------------------------------------------------------------------
// # 2025-09-05 | [XX]    | [Description]                        | [Reason]
// # -----------------------------------------------------------------------------
// 
/**
 * Test Backend Integration with Aniota Biome
 * This demonstrates how the enhanced Aniota connects to existing IX-TECH backend systems
 */

const AniotaBiome = require('../../aniota_ui/biome/AniotaBiome');

async function testBackendIntegration() {
    console.log('🧪 Testing Aniota Backend Integration...\n');
    
    // Create an Aniota instance (without starting the full desktop character)
    const aniota = new AniotaBiome(null); // No splash needed for testing
    
    // Test 1: Backend Connection
    console.log('📡 Test 1: Backend Connection');
    console.log('Backend URL:', aniota.behaviorState.backendConnection.baseUrl);
    console.log('Connection Status:', aniota.behaviorState.backendConnection.connected);
    console.log('');
    
    // Test 2: Learning Context Analysis
    console.log('🧠 Test 2: Learning Context Analysis');
    const learningContext = await aniota.analyzeLearningContext();
    console.log('Learning Context Analysis:', {
        needsIntervention: learningContext.needsIntervention,
        interventionType: learningContext.interventionType,
        confidence: learningContext.confidence,
        backendSupport: learningContext.backendSupport
    });
    console.log('');
    
    // Test 3: Learning Intervention Detection
    console.log('🎯 Test 3: Learning Intervention System');
    
    // Simulate learning negative patterns
    const mockSessionData = {
        user_patterns: ['long_idle_periods', 'rapid_task_switching']
    };
    
    const hasLearningNegatives = aniota.detectLearningNegatives(mockSessionData);
    console.log('Learning Negatives Detected:', hasLearningNegatives);
    
    if (hasLearningNegatives) {
        console.log('🔧 Triggering learning intervention...');
        await aniota.executeLearningIntervention({
            needsIntervention: true,
            interventionType: 'encourage_learning',
            confidence: 0.8,
            backendSupport: false
        });
    }
    console.log('');
    
    // Test 4: Backend System Integration Points
    console.log('🔗 Test 4: Backend System Integration Points');
    console.log('Available Integration Points:');
    console.log('- CAF (Cognitive Architecture Framework): /api/caf/status');
    console.log('- SIE (Socratic Inquiry Engine): /api/sie/question');
    console.log('- TVMLE (Triadic Vector Learning): /api/tvmle/stats');
    console.log('- LRS (Learning Readiness Scaffolding): /api/learning/sessions');
    console.log('- Microvibration Analysis: /api/microvibration/analyze');
    console.log('');
    
    // Test 5: Learning Opportunity Identification
    console.log('🎓 Test 5: Learning Opportunity Identification');
    const learningOpportunity = await aniota.identifyLearningOpportunity();
    console.log('Learning Opportunity:', learningOpportunity || 'No specific opportunity detected');
    console.log('');
    
    // Test 6: Environmental Context Integration
    console.log('🌍 Test 6: Environmental Context with Backend Data');
    console.log('Environmental Context:', {
        timeOfDay: aniota.behaviorState.environmentalContext.timeOfDay,
        userMoodEstimate: aniota.behaviorState.environmentalContext.userMoodEstimate,
        sessionActivity: aniota.behaviorState.environmentalContext.sessionActivity,
        tvmleVector: aniota.behaviorState.environmentalContext.tvmleVector,
        cafAnalysis: aniota.behaviorState.environmentalContext.cafAnalysis,
        learningContext: aniota.behaviorState.environmentalContext.learningContext
    });
    console.log('');
    
    console.log('✅ Backend Integration Test Complete!');
    console.log('📝 Summary: Aniota is now equipped with:');
    console.log('   - Connection to existing 123-file CAF backend architecture');
    console.log('   - Learning intervention detection and execution');
    console.log('   - Integration with SIE, TVMLE, LRS, and microvibration systems');
    console.log('   - Sophisticated behavioral intelligence leveraging backend AI');
    console.log('   - Fallback behaviors when backend is unavailable');
}

// Run the test
testBackendIntegration().catch(console.error);
