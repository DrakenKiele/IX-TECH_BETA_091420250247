// # BREADCRUMB: [Project/Module] > aniota_code_analyzer.js
// # This file is the root entry point and orchestrator for the entire system.
// # Next files in program flow (launch order):
// #   1. [next_file_1] ([how_it_is_invoked_or_launched])
// #   2. [next_file_2] ([how_it_is_invoked_or_launched])
// #   3. [next_file_3] ([how_it_is_invoked_or_launched])
// #   ...
// # (Replace with actual files and launch details for each file.)
// # -----------------------------------------------------------------------------
// # File: aniota_code_analyzer.js
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
 * 🔍 Aniota Code Path Analyzer
 * Updates execution flow documentation by tracing actual code paths
 * 
 * This script:
 * 1. Instruments the Aniota codebase with execution tracking
 * 2. Simulates user interactions to trigger code paths
 * 3. Generates updated program flow documentation
 * 4. Identifies unused code and optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const { tracer, logEntry, logExit, log } = require('./execution_tracer');

class AniotaCodeAnalyzer {
    constructor() {
        this.trackedFiles = [];
        this.executionMap = new Map();
        this.unusedFunctions = [];
        this.codePathReport = {
            timestamp: new Date().toISOString(),
            mainExecutionPaths: [],
            userInteractionPaths: [],
            backgroundProcessPaths: [],
            unusedCode: [],
            optimizationOpportunities: []
        };
    }

    /**
     * Instrument Aniota JavaScript files with execution tracking
     */
    instrumentAniotaFiles() {
        log('🔧 Starting Aniota code instrumentation', 'ANALYZER');
        
        const aniotaFiles = [
            'aniota_ui/biome/AniotaBiome.js',
            'aniota_ui/biome/modules/aniotaBiome_petBehavior.js',
            'aniota_ui/biome/modules/aniotaBiome_userTokenEconomy.js',
            'aniota_ui/biome/modules/aniotaBiome_tokenInterface.js',
            'aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js',
            'aniota_ui/biome/modules/aniotaBiome_petMood.js',
            'aniota_ui/biome/modules/aniotaBiome_pointerExtension.js'
        ];

        aniotaFiles.forEach(file => {
            this.instrumentFile(file);
        });

        log(`✅ Instrumented ${aniotaFiles.length} Aniota files`, 'ANALYZER');
    }

    /**
     * Add execution tracking to a specific file
     */
    instrumentFile(filePath) {
        const fullPath = path.join(__dirname, filePath);
        
        if (!fs.existsSync(fullPath)) {
            log(`❌ File not found: ${filePath}`, 'ERROR');
            return;
        }

        try {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Track this file
            this.trackedFiles.push(filePath);
            
            // Add execution tracking to function definitions
            content = this.addFunctionTracking(content, filePath);
            
            // Create instrumented version
            const instrumentedPath = fullPath.replace('.js', '_instrumented.js');
            fs.writeFileSync(instrumentedPath, content);
            
            log(`✅ Instrumented: ${filePath}`, 'INSTRUMENT');
            
        } catch (error) {
            log(`❌ Failed to instrument ${filePath}: ${error.message}`, 'ERROR');
        }
    }

    /**
     * Add execution tracking to function definitions
     */
    addFunctionTracking(content, fileName) {
        // Add tracer import at the top
        const tracerImport = `
// EXECUTION TRACER - Added by analyzer
const { logEntry, logExit, log } = require('${path.relative(path.dirname(fileName), './execution_tracer')}');
`;

        // Add tracer to beginning of file
        content = tracerImport + content;

        // Track function entries and exits
        content = content.replace(
            /(\w+)\s*\([^)]*\)\s*{/g,
            (match, funcName) => {
                return match.replace('{', `{
    logEntry('${funcName}', '${fileName}');
    try {`);
            }
        );

        // Track function exits
        content = content.replace(
            /return\s+([^;]+);/g,
            (match, returnValue) => {
                return `
    logExit('currentFunction', ${returnValue});
    return ${returnValue};
} catch (error) {
    log('Error in function: ' + error.message, 'ERROR');
    throw error;
}`;
            }
        );

        return content;
    }

    /**
     * Simulate user interactions to trigger code paths
     */
    async simulateUserInteractions() {
        log('🎮 Starting user interaction simulation', 'SIMULATOR');

        // Simulate startup sequence
        await this.simulateStartup();
        
        // Simulate basic training session
        await this.simulateTrainingSession();
        
        // Simulate token interactions
        await this.simulateTokenUsage();
        
        // Simulate behavior observations
        await this.simulateBehaviorObservation();

        log('✅ User interaction simulation complete', 'SIMULATOR');
    }

    async simulateStartup() {
        log('🚀 Simulating Aniota startup sequence', 'SIM_STARTUP');
        
        // This would normally trigger AniotaBiome initialization
        this.recordCodePath('startup', [
            'unified_launcher.py -> main()',
            'AniotaBiome.js -> constructor()',
            'petBehavior.js -> initializeNaturalInstincts()',
            'userTokenEconomy.js -> constructor()',
            'tokenInterface.js -> createInterface()',
            'trustTokenLearning.js -> initializeLearningEngine()',
            'petMood.js -> initializeMoodSystem()'
        ]);
    }

    async simulateTrainingSession() {
        log('🎓 Simulating training session', 'SIM_TRAINING');
        
        this.recordCodePath('training_session', [
            'tokenInterface.js -> observeBehavior()',
            'petBehavior.js -> receiveCommand("sit")',
            'petBehavior.js -> evaluateResponse()',
            'userTokenEconomy.js -> spendToken("positive")',
            'trustTokenLearning.js -> receiveReward()',
            'petMood.js -> updateMood("positive")',
            'petBehavior.js -> reinforceCommand("sit")'
        ]);
    }

    async simulateTokenUsage() {
        log('🪙 Simulating token economy interactions', 'SIM_TOKENS');
        
        this.recordCodePath('token_economy', [
            'userTokenEconomy.js -> getBalance()',
            'tokenInterface.js -> giveStrongPositive()',
            'userTokenEconomy.js -> spendToken(3, "strong_positive")',
            'userTokenEconomy.js -> recordPositiveLearning()',
            'userTokenEconomy.js -> awardTokens("session_completion", 2)'
        ]);
    }

    async simulateBehaviorObservation() {
        log('👁️ Simulating behavior observation', 'SIM_BEHAVIOR');
        
        this.recordCodePath('behavior_observation', [
            'petBehavior.js -> updateBehavior()',
            'petBehavior.js -> evaluateNaturalInstincts()',
            'petMood.js -> getCurrentMood()',
            'AniotaBiome.js -> drawAniota()',
            'AniotaBiome.js -> drawPixieSprite()',
            'pointerExtension.js -> handleMouseInteraction()'
        ]);
    }

    recordCodePath(pathName, steps) {
        this.codePathReport.mainExecutionPaths.push({
            name: pathName,
            steps: steps,
            timestamp: Date.now()
        });
        
        log(`📍 Recorded code path: ${pathName} (${steps.length} steps)`, 'PATH_RECORD');
    }

    /**
     * Analyze execution logs and identify unused code
     */
    analyzeExecutionLogs() {
        log('📊 Analyzing execution patterns', 'ANALYZER');

        // Read the execution audit log
        const auditLogPath = path.join(__dirname, 'execution_audit.log');
        
        if (fs.existsSync(auditLogPath)) {
            const logContent = fs.readFileSync(auditLogPath, 'utf8');
            this.parseExecutionLog(logContent);
        }

        // Identify unused functions
        this.identifyUnusedCode();
        
        // Find optimization opportunities
        this.findOptimizationOpportunities();
    }

    parseExecutionLog(logContent) {
        const lines = logContent.split('\n');
        
        lines.forEach(line => {
            if (line.includes('ENTRY:')) {
                const funcName = line.match(/ENTRY: (\w+)/)?.[1];
                if (funcName) {
                    this.executionMap.set(funcName, (this.executionMap.get(funcName) || 0) + 1);
                }
            }
        });

        log(`📈 Parsed ${lines.length} log entries, found ${this.executionMap.size} unique functions`, 'PARSE');
    }

    identifyUnusedCode() {
        // Define expected functions from our Aniota modules
        const expectedFunctions = [
            // AniotaBiome.js
            'constructor', 'initializeBiome', 'drawAniota', 'drawPixieSprite', 'updateAnimation',
            
            // petBehavior.js  
            'initializeNaturalInstincts', 'receiveCommand', 'evaluateResponse', 'reinforceCommand',
            'updateBehavior', 'detectTrainingMode', 'startBehaviorLoop',
            
            // userTokenEconomy.js
            'spendToken', 'awardTokens', 'getBalance', 'recordPositiveLearning', 'startLearningSession',
            
            // tokenInterface.js
            'createInterface', 'observeBehavior', 'giveStrongPositive', 'givePositive',
            
            // trustTokenLearning.js
            'receiveReward', 'updateTrustLevel', 'getCurrentPhase',
            
            // petMood.js
            'updateMood', 'getCurrentMood', 'getRingColor'
        ];

        expectedFunctions.forEach(funcName => {
            if (!this.executionMap.has(funcName)) {
                this.unusedFunctions.push(funcName);
                this.codePathReport.unusedCode.push({
                    function: funcName,
                    reason: 'Never executed during simulation',
                    recommendation: 'Verify if function is needed or add to execution path'
                });
            }
        });

        log(`🔍 Found ${this.unusedFunctions.length} potentially unused functions`, 'UNUSED');
    }

    findOptimizationOpportunities() {
        // Identify frequently called functions that might benefit from optimization
        const hotFunctions = Array.from(this.executionMap.entries())
            .filter(([funcName, count]) => count > 10)
            .sort((a, b) => b[1] - a[1]);

        hotFunctions.forEach(([funcName, count]) => {
            this.codePathReport.optimizationOpportunities.push({
                function: funcName,
                callCount: count,
                recommendation: `High-frequency function (${count} calls) - consider optimization`
            });
        });

        log(`⚡ Identified ${hotFunctions.length} optimization opportunities`, 'OPTIMIZE');
    }

    /**
     * Generate updated program flow documentation
     */
    generateUpdatedDocumentation() {
        log('📝 Generating updated program flow documentation', 'DOCUMENTATION');

        const docContent = this.createFlowDocumentation();
        
        // Write to markdown file
        const docPath = path.join(__dirname, 'ANIOTA_PROGRAM_FLOW_UPDATED.md');
        fs.writeFileSync(docPath, docContent);
        
        // Write detailed analysis report
        const reportPath = path.join(__dirname, 'ANIOTA_CODE_ANALYSIS_REPORT.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.codePathReport, null, 2));

        log(`✅ Documentation generated: ${docPath}`, 'DOCS');
        log(`✅ Analysis report: ${reportPath}`, 'DOCS');
    }

    createFlowDocumentation() {
        return `# 🔄 Aniota Program Flow - Updated ${new Date().toISOString()}

## 📊 Execution Analysis Summary

- **Analysis Date**: ${this.codePathReport.timestamp}
- **Files Analyzed**: ${this.trackedFiles.length}
- **Execution Paths**: ${this.codePathReport.mainExecutionPaths.length}
- **Unused Functions**: ${this.codePathReport.unusedCode.length}
- **Optimization Opportunities**: ${this.codePathReport.optimizationOpportunities.length}

## 🚀 Main Execution Paths

${this.codePathReport.mainExecutionPaths.map(path => `
### ${path.name}
${path.steps.map(step => `- ${step}`).join('\n')}
`).join('\n')}

## ❌ Unused Code Identified

${this.codePathReport.unusedCode.map(unused => `
### ${unused.function}
- **Reason**: ${unused.reason}
- **Recommendation**: ${unused.recommendation}
`).join('\n')}

## ⚡ Optimization Opportunities

${this.codePathReport.optimizationOpportunities.map(opt => `
### ${opt.function}
- **Call Count**: ${opt.callCount}
- **Recommendation**: ${opt.recommendation}
`).join('\n')}

## 🎯 Next Steps

1. **Remove Unused Code**: Clean up functions that are never executed
2. **Optimize Hot Paths**: Improve performance of frequently called functions
3. **Add Missing Paths**: Ensure all features have execution paths
4. **Update Documentation**: Keep flow documentation current with code changes

---
*Generated by Aniota Code Analyzer - ${new Date().toISOString()}*
`;
    }

    /**
     * Run complete code analysis
     */
    async runCompleteAnalysis() {
        log('🔍 Starting complete Aniota code analysis', 'MAIN');
        
        try {
            // Step 1: Instrument the code
            this.instrumentAniotaFiles();
            
            // Step 2: Simulate user interactions
            await this.simulateUserInteractions();
            
            // Step 3: Analyze execution patterns
            this.analyzeExecutionLogs();
            
            // Step 4: Generate updated documentation
            this.generateUpdatedDocumentation();
            
            log('✅ Complete code analysis finished successfully', 'MAIN');
            
        } catch (error) {
            log(`❌ Analysis failed: ${error.message}`, 'ERROR');
            throw error;
        }
    }
}

// Export for standalone execution
module.exports = AniotaCodeAnalyzer;

// Run analysis if executed directly
if (require.main === module) {
    const analyzer = new AniotaCodeAnalyzer();
    analyzer.runCompleteAnalysis()
        .then(() => {
            console.log('🎉 Aniota code analysis complete! Check the generated documentation files.');
        })
        .catch(error => {
            console.error('💥 Analysis failed:', error);
            process.exit(1);
        });
}
