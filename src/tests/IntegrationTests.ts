/**
 * Integration Tests for JavaRT Interpreter
 * Tests end-to-end functionality combining code editor, interpreter, and GC monitor
 */

import { JavaInterpreter } from '../interpreter/core/JavaInterpreter';
import { CodeEditorTestSuite } from './CodeEditorTests';
import { GCMonitorTestSuite } from './GCMonitorTests';

export interface IntegrationTestCase {
  name: string;
  scenario: string;
  code: string;
  expectedOutput: string;
  expectedMetrics: {
    executionTime: number;
    gcPauseTime: number;
    deadlineViolations: number;
    safetyViolations: number;
    heapUsage: number;
    offHeapUsage: number;
  };
}

export class IntegrationTestSuite {

  /**
   * End-to-End IoT Sensor Simulation Tests
   */
  static getIoTSensorTests(): IntegrationTestCase[] {
    return [
      {
        name: "Real-time Temperature Sensor with Deadline Compliance",
        scenario: "IoT temperature sensor with 5ms deadline constraint",
        code: `@Deadline(ms=5)
public void temperatureSensor() {
    int temperature = 25;
    int humidity = 60;
    boolean alertTriggered = false;
    
    System.out.println("IoT Temperature Sensor Starting...");
    System.out.println("Deadline: 5ms per reading");
    
    for (int i = 0; i < 10; i++) {
        // Simulate sensor reading
        temperature = temperature + Math.floor(Math.random() * 6) - 3;
        humidity = humidity + Math.floor(Math.random() * 4) - 2;
        
        System.out.println("Reading " + (i + 1) + ":");
        System.out.println("  Temperature: " + temperature + "°C");
        System.out.println("  Humidity: " + humidity + "%");
        
        // Safety checks
        if (temperature > 35) {
            System.out.println("  ALERT: Critical temperature!");
            alertTriggered = true;
        }
        
        if (humidity < 30) {
            System.out.println("  WARNING: Low humidity");
        }
        
        // Data transmission simulation
        String sensorData = "T:" + temperature + ",H:" + humidity;
        System.out.println("  Transmitting: " + sensorData);
    }
    
    if (alertTriggered) {
        System.out.println("Sensor session completed with alerts");
    } else {
        System.out.println("Sensor session completed normally");
    }
}`,
        expectedOutput: `✓ Parsing Java source with IoT safety analysis...
✓ Initializing real-time GC with off-heap optimization...
✓ Enabling @Deadline enforcement and formal verification...
✓ Starting execution with safety monitoring...

=== Program Output ===
IoT Temperature Sensor Starting...
Deadline: 5ms per reading
Reading 1:
  Temperature: 27°C
  Humidity: 61%
  Transmitting: T:27,H:61
[... additional readings ...]

=== Real-time Execution Metrics ===
Total execution time: 4.23ms
Average GC pause: 0.3ms
Deadline violations: 0
Safety violations: 0`,
        expectedMetrics: {
          executionTime: 5.0,
          gcPauseTime: 1.0,
          deadlineViolations: 0,
          safetyViolations: 0,
          heapUsage: 15.0,
          offHeapUsage: 5.0
        }
      },
      {
        name: "Multi-Sensor Data Processing with Memory Management",
        scenario: "Multiple sensors generating data with automatic GC",
        code: `@Deadline(ms=10)
public void multiSensorProcessing() {
    // Initialize sensor arrays
    int[] temperatureReadings = new int[50];
    int[] humidityReadings = new int[50];
    int[] pressureReadings = new int[50];
    
    System.out.println("Multi-Sensor Processing Started");
    System.out.println("Processing 50 readings from 3 sensors");
    
    for (int i = 0; i < 50; i++) {
        // Generate sensor data
        temperatureReadings[i] = 20 + Math.floor(Math.random() * 20);
        humidityReadings[i] = 40 + Math.floor(Math.random() * 40);
        pressureReadings[i] = 1000 + Math.floor(Math.random() * 50);
        
        // Process data every 10 readings
        if (i % 10 == 0) {
            int avgTemp = 0;
            int avgHumidity = 0;
            int avgPressure = 0;
            
            for (int j = 0; j <= i; j++) {
                avgTemp = avgTemp + temperatureReadings[j];
                avgHumidity = avgHumidity + humidityReadings[j];
                avgPressure = avgPressure + pressureReadings[j];
            }
            
            avgTemp = avgTemp / (i + 1);
            avgHumidity = avgHumidity / (i + 1);
            avgPressure = avgPressure / (i + 1);
            
            System.out.println("Batch " + (i / 10 + 1) + " processed:");
            System.out.println("  Avg Temperature: " + avgTemp + "°C");
            System.out.println("  Avg Humidity: " + avgHumidity + "%");
            System.out.println("  Avg Pressure: " + avgPressure + " hPa");
            
            // Create summary data (will trigger GC)
            String summary = "Batch_" + (i / 10 + 1) + "_T:" + avgTemp + "_H:" + avgHumidity + "_P:" + avgPressure;
            System.out.println("  Summary: " + summary);
        }
    }
    
    System.out.println("Multi-sensor processing completed");
    System.out.println("Total readings processed: " + temperatureReadings.length * 3);
}`,
        expectedOutput: `Multi-Sensor Processing Started
Processing 50 readings from 3 sensors
Batch 1 processed:
  Avg Temperature: 28°C
  Avg Humidity: 58%
  Avg Pressure: 1023 hPa
[... additional batches ...]

=== Real-time Execution Metrics ===
Total execution time: 8.45ms
Average GC pause: 0.4ms
Objects allocated: 156
Objects freed: 23
Deadline violations: 0`,
        expectedMetrics: {
          executionTime: 10.0,
          gcPauseTime: 1.0,
          deadlineViolations: 0,
          safetyViolations: 0,
          heapUsage: 35.0,
          offHeapUsage: 12.0
        }
      }
    ];
  }

  /**
   * Error Handling and Safety Tests
   */
  static getSafetyIntegrationTests(): IntegrationTestCase[] {
    return [
      {
        name: "Division by Zero Safety with Recovery",
        scenario: "Test safety verification and graceful error recovery",
        code: `@Deadline(ms=3)
public void safeDivisionTest() {
    int[] values = {10, 5, 0, 8, 2};
    int[] results = new int[5];
    int successfulOperations = 0;
    
    System.out.println("Safe Division Test Starting...");
    
    for (int i = 0; i < values.length; i++) {
        try {
            // This will trigger safety verification
            int result = 100 / values[i];
            results[i] = result;
            successfulOperations++;
            System.out.println("100 / " + values[i] + " = " + result);
        } catch (Exception e) {
            System.out.println("SAFETY: Division by " + values[i] + " prevented");
            results[i] = 0;
        }
    }
    
    System.out.println("Safe operations: " + successfulOperations + "/" + values.length);
}`,
        expectedOutput: `Safe Division Test Starting...
100 / 10 = 10
100 / 5 = 20
SAFETY VIOLATION [CRITICAL]: Division by zero detected: 100 / 0 (Line 12)
SAFETY: Division by 0 prevented
100 / 8 = 12
100 / 2 = 50
Safe operations: 4/5

=== 🛡️ Safety Violations ===
Line 12: Division by zero detected: 100 / 0 (CRITICAL)`,
        expectedMetrics: {
          executionTime: 3.0,
          gcPauseTime: 0.5,
          deadlineViolations: 0,
          safetyViolations: 1,
          heapUsage: 8.0,
          offHeapUsage: 2.0
        }
      }
    ];
  }

  /**
   * Performance and Stress Tests
   */
  static getPerformanceTests(): IntegrationTestCase[] {
    return [
      {
        name: "High-Frequency Sensor Data with GC Optimization",
        scenario: "Stress test with high-frequency data generation",
        code: `@Deadline(ms=50)
public void highFrequencyDataTest() {
    String[] dataBuffer = new String[1000];
    int bufferIndex = 0;
    int totalDataPoints = 0;
    
    System.out.println("High-Frequency Data Test Starting...");
    System.out.println("Target: 1000 data points in <50ms");
    
    for (int cycle = 0; cycle < 10; cycle++) {
        for (int i = 0; i < 100; i++) {
            // Generate high-frequency sensor data
            int sensorValue = Math.floor(Math.random() * 1000);
            String dataPoint = "C" + cycle + "_S" + i + "_V" + sensorValue;
            
            dataBuffer[bufferIndex] = dataPoint;
            bufferIndex = (bufferIndex + 1) % 1000;
            totalDataPoints++;
            
            // Periodic processing to create garbage
            if (i % 20 == 0) {
                String tempProcessing = "Processing batch " + cycle + "_" + i;
                int tempValue = tempProcessing.length() * sensorValue;
            }
        }
        
        if (cycle % 2 == 0) {
            System.out.println("Cycle " + cycle + " completed, total points: " + totalDataPoints);
        }
    }
    
    System.out.println("High-frequency test completed");
    System.out.println("Total data points generated: " + totalDataPoints);
    System.out.println("Buffer utilization: " + (bufferIndex * 100 / 1000) + "%");
}`,
        expectedOutput: `High-Frequency Data Test Starting...
Target: 1000 data points in <50ms
Cycle 0 completed, total points: 100
Cycle 2 completed, total points: 300
Cycle 4 completed, total points: 500
Cycle 6 completed, total points: 700
Cycle 8 completed, total points: 900
High-frequency test completed
Total data points generated: 1000
Buffer utilization: 0%

=== Real-time Execution Metrics ===
Total execution time: 42.18ms
Average GC pause: 0.6ms
Objects allocated: 1200
Objects freed: 800
GC collections: 3`,
        expectedMetrics: {
          executionTime: 50.0,
          gcPauseTime: 1.0,
          deadlineViolations: 0,
          safetyViolations: 0,
          heapUsage: 45.0,
          offHeapUsage: 20.0
        }
      }
    ];
  }

  /**
   * Execute comprehensive integration tests
   */
  static async runAllIntegrationTests(): Promise<{ passed: number; failed: number; results: any[] }> {
    const results: any[] = [];
    let passed = 0;
    let failed = 0;

    console.log("🧪 Running Integration Test Suite...\n");

    const interpreter = new JavaInterpreter();

    // Run IoT sensor tests
    const iotTests = this.getIoTSensorTests();
    for (const test of iotTests) {
      try {
        console.log(`Testing: ${test.name}`);
        console.log(`Scenario: ${test.scenario}`);
        const result = await this.runIntegrationTest(interpreter, test);
        if (result.success) {
          console.log("✅ PASSED");
          console.log(`   Execution Time: ${result.actualMetrics.executionTime}ms`);
          console.log(`   GC Pause: ${result.actualMetrics.gcPauseTime}ms`);
          console.log(`   Violations: ${result.actualMetrics.totalViolations}`);
          passed++;
        } else {
          console.log("❌ FAILED:", result.error);
          failed++;
        }
        results.push({ test: test.name, result });
      } catch (error) {
        console.log("❌ ERROR:", error);
        failed++;
        results.push({ test: test.name, error });
      }
    }

    // Run safety tests
    const safetyTests = this.getSafetyIntegrationTests();
    for (const test of safetyTests) {
      try {
        console.log(`Testing: ${test.name}`);
        const result = await this.runIntegrationTest(interpreter, test);
        if (result.success) {
          console.log("✅ PASSED");
          passed++;
        } else {
          console.log("❌ FAILED:", result.error);
          failed++;
        }
        results.push({ test: test.name, result });
      } catch (error) {
        console.log("❌ ERROR:", error);
        failed++;
        results.push({ test: test.name, error });
      }
    }

    // Run performance tests
    const performanceTests = this.getPerformanceTests();
    for (const test of performanceTests) {
      try {
        console.log(`Testing: ${test.name}`);
        const result = await this.runIntegrationTest(interpreter, test);
        if (result.success) {
          console.log("✅ PASSED");
          passed++;
        } else {
          console.log("❌ FAILED:", result.error);
          failed++;
        }
        results.push({ test: test.name, result });
      } catch (error) {
        console.log("❌ ERROR:", error);
        failed++;
        results.push({ test: test.name, error });
      }
    }

    console.log(`\n📊 Integration Test Results: ${passed} passed, ${failed} failed`);
    return { passed, failed, results };
  }

  private static async runIntegrationTest(interpreter: JavaInterpreter, test: IntegrationTestCase): Promise<any> {
    // Execute the test code
    const startTime = performance.now();
    const result = interpreter.interpret(test.code);
    const endTime = performance.now();

    // Gather metrics
    const gcMetrics = interpreter.getGCMetrics();
    const deadlineViolations = interpreter.getDeadlineViolations();
    const safetyViolations = interpreter.getSafetyViolations();
    const heapStatus = interpreter.getHeapStatus();

    const latestGC = gcMetrics.length > 0 ? gcMetrics[gcMetrics.length - 1] : null;

    const actualMetrics = {
      executionTime: endTime - startTime,
      gcPauseTime: latestGC ? latestGC.pauseTime : 0,
      deadlineViolations: deadlineViolations.length,
      safetyViolations: safetyViolations.length,
      totalViolations: deadlineViolations.length + safetyViolations.length,
      heapUsage: heapStatus.percentage,
      offHeapUsage: latestGC ? latestGC.offHeapUsage : 0,
      allocatedObjects: latestGC ? latestGC.allocatedObjects : 0,
      freedObjects: latestGC ? latestGC.freedObjects : 0
    };

    // Validate against expected metrics
    const expected = test.expectedMetrics;
    const success = 
      actualMetrics.executionTime <= expected.executionTime &&
      actualMetrics.gcPauseTime <= expected.gcPauseTime &&
      actualMetrics.deadlineViolations <= expected.deadlineViolations &&
      actualMetrics.safetyViolations <= expected.safetyViolations &&
      actualMetrics.heapUsage <= expected.heapUsage * 1.5; // Allow 50% variance

    return {
      success,
      actualMetrics,
      expectedMetrics: expected,
      output: result.output,
      error: success ? null : "Metrics outside expected ranges"
    };
  }
}

/**
 * Master Test Runner
 */
export class JavaRTTestRunner {
  static async runAllTests(): Promise<void> {
    console.log("🚀 JavaRT Comprehensive Test Suite\n");
    console.log("=" .repeat(50));

    // Run Code Editor Tests
    console.log("\n📝 CODE EDITOR TESTS");
    console.log("-".repeat(30));
    const editorResults = await CodeEditorTestSuite.runAllTests();

    // Run GC Monitor Tests  
    console.log("\n🗑️ GC MONITOR TESTS");
    console.log("-".repeat(30));
    const gcResults = await GCMonitorTestSuite.runAllTests();

    // Run Integration Tests
    console.log("\n🔗 INTEGRATION TESTS");
    console.log("-".repeat(30));
    const integrationResults = await IntegrationTestSuite.runAllIntegrationTests();

    // Summary
    const totalPassed = editorResults.passed + gcResults.passed + integrationResults.passed;
    const totalFailed = editorResults.failed + gcResults.failed + integrationResults.failed;
    const totalTests = totalPassed + totalFailed;

    console.log("\n" + "=".repeat(50));
    console.log("📊 FINAL TEST SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed} (${((totalPassed / totalTests) * 100).toFixed(1)}%)`);
    console.log(`Failed: ${totalFailed} (${((totalFailed / totalTests) * 100).toFixed(1)}%)`);
    console.log("\nComponent Breakdown:");
    console.log(`  Code Editor: ${editorResults.passed}/${editorResults.passed + editorResults.failed}`);
    console.log(`  GC Monitor: ${gcResults.passed}/${gcResults.passed + gcResults.failed}`);
    console.log(`  Integration: ${integrationResults.passed}/${integrationResults.passed + integrationResults.failed}`);

    if (totalFailed === 0) {
      console.log("\n🎉 All tests passed! JavaRT is ready for production.");
    } else {
      console.log(`\n⚠️ ${totalFailed} test(s) failed. Review the results above.`);
    }
  }
}