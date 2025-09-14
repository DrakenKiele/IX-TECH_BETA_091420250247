
import { generateInterface } from './interfaceGenerator.js';
import { packInterface, calculateFidelity, compareShapeArrays } from './packer.js';

/**
 * Comprehensive zero-loss conversion test
 * Tests the complete pipeline: MAQNETIX shapes → Web Interface → MAQNETIX shapes
 */
export async function runZeroLossTest(originalShapes, testName = "Zero-Loss Test") {
  console.log(`🧪 Starting ${testName}`);
  console.log(`📊 Original shapes: ${originalShapes.length}`);
  
  const results = {
    testName,
    timestamp: new Date().toISOString(),
    originalShapeCount: originalShapes.length,
    success: false,
    fidelityScore: 0,
    stages: {},
    errors: []
  };

  try {
    // STAGE 1: Generate Interface (Analog → Digital)
    console.log("🔄 Stage 1: Generating web interface from shapes...");
    const startTime1 = performance.now();
    
    const generatedInterface = generateInterface(originalShapes, {
      title: `${testName} Generated Interface`,
      theme: "default",
      responsive: true,
      pwa: true
    });
    
    const stage1Time = performance.now() - startTime1;
    results.stages.generation = {
      duration: stage1Time,
      success: true,
      componentCount: Object.values(generatedInterface.layout).flat().length,
      functionsFound: generatedInterface.layout.functions.size
    };
    
    console.log(`✅ Stage 1 complete (${stage1Time.toFixed(2)}ms)`);
    console.log(`📦 Generated ${results.stages.generation.componentCount} components`);
    console.log(`⚡ Found ${results.stages.generation.functionsFound} functions`);

    // STAGE 2: Pack Interface Back (Digital → Analog)
    console.log("🔄 Stage 2: Packing web interface back to shapes...");
    const startTime2 = performance.now();
    
    // Create temporary DOM from generated HTML for packing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedInterface.html;
    
    const packedShapes = packInterface(tempDiv, {
      viewport: { width: 1920, height: 1080 },
      preserveIds: true,
      inferFunctions: true
    });
    
    const stage2Time = performance.now() - startTime2;
    results.stages.packing = {
      duration: stage2Time,
      success: true,
      packedShapeCount: packedShapes.length
    };
    
    console.log(`✅ Stage 2 complete (${stage2Time.toFixed(2)}ms)`);
    console.log(`📦 Packed ${packedShapes.length} shapes`);

    // STAGE 3: Fidelity Analysis
    console.log("🔄 Stage 3: Analyzing fidelity...");
    const startTime3 = performance.now();
    
    const comparison = compareShapeArrays(originalShapes, packedShapes);
    const fidelityScore = calculateFidelity(originalShapes, packedShapes);
    
    const stage3Time = performance.now() - startTime3;
    results.stages.analysis = {
      duration: stage3Time,
      success: true,
      fidelityScore,
      unchanged: comparison.unchanged.length,
      modified: comparison.modified.length,
      added: comparison.added.length,
      removed: comparison.removed.length
    };
    
    console.log(`✅ Stage 3 complete (${stage3Time.toFixed(2)}ms)`);
    
    // Final Results
    results.success = true;
    results.fidelityScore = fidelityScore;
    results.totalDuration = stage1Time + stage2Time + stage3Time;
    
    // Log detailed results
    console.log(`\n🎯 ${testName} RESULTS:`);
    console.log(`   Fidelity Score: ${(fidelityScore * 100).toFixed(1)}%`);
    console.log(`   Total Duration: ${results.totalDuration.toFixed(2)}ms`);
    console.log(`   Unchanged: ${comparison.unchanged.length}`);
    console.log(`   Modified: ${comparison.modified.length}`);
    console.log(`   Added: ${comparison.added.length}`);
    console.log(`   Removed: ${comparison.removed.length}`);
    
    if (fidelityScore === 1.0) {
      console.log(`🏆 PERFECT ZERO-LOSS CONVERSION ACHIEVED!`);
    } else if (fidelityScore > 0.9) {
      console.log(`🟢 EXCELLENT fidelity (${(fidelityScore * 100).toFixed(1)}%)`);
    } else if (fidelityScore > 0.7) {
      console.log(`🟡 GOOD fidelity (${(fidelityScore * 100).toFixed(1)}%)`);
    } else {
      console.log(`🔴 LOW fidelity (${(fidelityScore * 100).toFixed(1)}%) - needs improvement`);
    }
    
    return {
      ...results,
      generatedInterface,
      packedShapes,
      comparison,
      originalShapes
    };
    
  } catch (error) {
    console.error(`❌ ${testName} failed:`, error);
    results.errors.push(error.message);
    return results;
  }
}

/**
 * Run battery of tests with different shape configurations
 */
export async function runZeroLossTestSuite(allShapes) {
  console.log("🧪 Starting Zero-Loss Conversion Test Suite");
  
  const testSuite = {
    startTime: new Date().toISOString(),
    tests: [],
    summary: {
      totalTests: 0,
      passed: 0,
      averageFidelity: 0,
      perfectConversions: 0
    }
  };
  
  // Test 1: All shapes
  if (allShapes.length > 0) {
    const test1 = await runZeroLossTest(allShapes, "Full Dataset Test");
    testSuite.tests.push(test1);
  }
  
  // Test 2: Single shape types
  const shapesByType = groupShapesByType(allShapes);
  for (const [type, shapes] of Object.entries(shapesByType)) {
    if (shapes.length > 0) {
      const test = await runZeroLossTest(shapes, `${type} Shapes Test`);
      testSuite.tests.push(test);
    }
  }
  
  // Test 3: Shapes with functions
  const shapesWithFunctions = allShapes.filter(s => s.function);
  if (shapesWithFunctions.length > 0) {
    const test = await runZeroLossTest(shapesWithFunctions, "Functional Shapes Test");
    testSuite.tests.push(test);
  }
  
  // Calculate summary statistics
  testSuite.summary.totalTests = testSuite.tests.length;
  testSuite.summary.passed = testSuite.tests.filter(t => t.success).length;
  
  const fidelityScores = testSuite.tests.filter(t => t.success).map(t => t.fidelityScore);
  testSuite.summary.averageFidelity = fidelityScores.length > 0 
    ? fidelityScores.reduce((a, b) => a + b, 0) / fidelityScores.length 
    : 0;
  
  testSuite.summary.perfectConversions = testSuite.tests.filter(t => t.fidelityScore === 1.0).length;
  
  // Final report
  console.log("\n📊 ZERO-LOSS CONVERSION TEST SUITE COMPLETE");
  console.log(`   Tests Run: ${testSuite.summary.totalTests}`);
  console.log(`   Tests Passed: ${testSuite.summary.passed}`);
  console.log(`   Average Fidelity: ${(testSuite.summary.averageFidelity * 100).toFixed(1)}%`);
  console.log(`   Perfect Conversions: ${testSuite.summary.perfectConversions}`);
  
  return testSuite;
}

/**
 * Group shapes by type for targeted testing
 */
function groupShapesByType(shapes) {
  return shapes.reduce((groups, shape) => {
    const type = shape.type || 'UNKNOWN';
    if (!groups[type]) groups[type] = [];
    groups[type].push(shape);
    return groups;
  }, {});
}

/**
 * Generate test report HTML
 */
export function generateTestReport(testSuite) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Zero-Loss Conversion Test Report</title>
    <style>
        body { font-family: 'Noto Sans Rounded', sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #e3f2fd; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        .test-result { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 4px; }
        .test-success { border-left: 4px solid #4CAF50; }
        .test-failure { border-left: 4px solid #F44336; }
        .fidelity-perfect { color: #4CAF50; font-weight: bold; }
        .fidelity-good { color: #FF9800; font-weight: bold; }
        .fidelity-poor { color: #F44336; font-weight: bold; }
        .stage-details { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 Zero-Loss Conversion Test Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <h2>📊 Test Suite Summary</h2>
            <p><strong>Total Tests:</strong> ${testSuite.summary.totalTests}</p>
            <p><strong>Tests Passed:</strong> ${testSuite.summary.passed}</p>
            <p><strong>Average Fidelity:</strong> ${(testSuite.summary.averageFidelity * 100).toFixed(1)}%</p>
            <p><strong>Perfect Conversions:</strong> ${testSuite.summary.perfectConversions}</p>
        </div>
        
        ${testSuite.tests.map(test => `
            <div class="test-result ${test.success ? 'test-success' : 'test-failure'}">
                <h3>${test.testName}</h3>
                <p><strong>Fidelity Score:</strong> 
                    <span class="${test.fidelityScore === 1.0 ? 'fidelity-perfect' : test.fidelityScore > 0.7 ? 'fidelity-good' : 'fidelity-poor'}">
                        ${(test.fidelityScore * 100).toFixed(1)}%
                    </span>
                </p>
                <p><strong>Original Shapes:</strong> ${test.originalShapeCount}</p>
                <p><strong>Duration:</strong> ${test.totalDuration?.toFixed(2) || 'N/A'}ms</p>
                
                ${test.stages.analysis ? `
                    <div class="stage-details">
                        <strong>Fidelity Analysis:</strong><br>
                        Unchanged: ${test.stages.analysis.unchanged} | 
                        Modified: ${test.stages.analysis.modified} | 
                        Added: ${test.stages.analysis.added} | 
                        Removed: ${test.stages.analysis.removed}
                    </div>
                ` : ''}
                
                ${test.errors.length > 0 ? `
                    <div style="color: red; margin-top: 10px;">
                        <strong>Errors:</strong><br>
                        ${test.errors.join('<br>')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  
  return html;
}

/**
 * Quick test function for console use
 */
export async function quickZeroLossTest() {
  if (window._aniotaAllShapes && window._aniotaAllShapes.length > 0) {
    return await runZeroLossTest(window._aniotaAllShapes, "Quick Console Test");
  } else {
    console.warn("No shapes found in window._aniotaAllShapes");
    return null;
  }
}

window.quickZeroLossTest = quickZeroLossTest;
window.runZeroLossTestSuite = runZeroLossTestSuite;
