/**
 * Comprehensive Test Suite for GC Monitor Component
 * Tests dynamic metrics, GC triggering, and off-heap memory optimization
 */

import { JavaInterpreter } from '../interpreter/core/JavaInterpreter';

export interface GCTestCase {
  name: string;
  code: string;
  expectedMetrics?: {
    minHeapUsage: number;
    maxHeapUsage: number;
    minObjects: number;
    maxObjects: number;
    gcCollections: number;
  };
  expectedBehavior?: string;
}

export class GCMonitorTestSuite {

  /**
   * Test 1: Dynamic Metrics Tracking
   */
  static getDynamicMetricsTests(): GCTestCase[] {
    return [
      {
        name: "Object Allocation Loop - Small Objects",
        code: `// Test small object allocation
String[] smallObjects = new String[100];
int totalAllocated = 0;

for (int i = 0; i < 100; i++) {
    smallObjects[i] = "Small object " + i;
    totalAllocated++;
    
    if (i % 10 == 0) {
        System.out.println("Allocated " + totalAllocated + " objects");
    }
}

System.out.println("Total small objects: " + totalAllocated);`,
        expectedMetrics: {
          minHeapUsage: 5.0,
          maxHeapUsage: 25.0,
          minObjects: 100,
          maxObjects: 150,
          gcCollections: 0
        },
        expectedBehavior: "Should allocate 100 small objects without triggering GC"
      },
      {
        name: "Object Allocation Loop - Large Objects",
        code: `// Test large object allocation that triggers off-heap
String[] largeObjects = new String[50];
int totalSize = 0;

for (int i = 0; i < 50; i++) {
    // Create large strings (>1KB each)
    String largeData = "";
    for (int j = 0; j < 200; j++) {
        largeData = largeData + "Large data segment " + j + " ";
    }
    largeObjects[i] = largeData;
    totalSize = totalSize + largeData.length();
    
    if (i % 5 == 0) {
        System.out.println("Created large object " + i + ", total size: " + totalSize);
    }
}

System.out.println("Total large objects: " + largeObjects.length);`,
        expectedMetrics: {
          minHeapUsage: 15.0,
          maxHeapUsage: 75.0,
          minObjects: 50,
          maxObjects: 100,
          gcCollections: 1
        },
        expectedBehavior: "Should trigger off-heap allocation and at least one GC cycle"
      },
      {
        name: "Memory Pressure Test",
        code: `// Create memory pressure to force multiple GC cycles
int[][] matrices = new int[20][1000];
int totalElements = 0;

for (int i = 0; i < 20; i++) {
    for (int j = 0; j < 1000; j++) {
        matrices[i][j] = i * j;
        totalElements++;
    }
    
    // Create temporary objects that become garbage
    for (int k = 0; k < 100; k++) {
        String temp = "Temporary object " + i + "_" + k;
        int tempValue = temp.length() * k;
    }
    
    if (i % 5 == 0) {
        System.out.println("Matrix " + i + " completed, elements: " + totalElements);
    }
}

System.out.println("Memory pressure test completed");`,
        expectedMetrics: {
          minHeapUsage: 30.0,
          maxHeapUsage: 85.0,
          minObjects: 2000,
          maxObjects: 5000,
          gcCollections: 3
        },
        expectedBehavior: "Should trigger multiple GC cycles and demonstrate memory cleanup"
      }
    ];
  }

  /**
   * Test 2: Manual GC Trigger Testing
   */
  static getGCTriggerTests(): GCTestCase[] {
    return [
      {
        name: "Manual GC After Object Allocation",
        code: `// Allocate objects then manually trigger GC
String[] objects = new String[200];
for (int i = 0; i < 200; i++) {
    objects[i] = "Object " + i + " with some data";
}

System.out.println("Objects allocated: " + objects.length);
// Manual GC will be triggered by test framework
System.out.println("Manual GC triggered");`,
        expectedMetrics: {
          minHeapUsage: 20.0,
          maxHeapUsage: 40.0,
          minObjects: 200,
          maxObjects: 250,
          gcCollections: 1
        },
        expectedBehavior: "Should show heap usage reduction after manual GC"
      },
      {
        name: "GC Effectiveness Test",
        code: `// Create objects that will become garbage
for (int cycle = 0; cycle < 5; cycle++) {
    String[] tempObjects = new String[100];
    for (int i = 0; i < 100; i++) {
        tempObjects[i] = "Temporary " + cycle + "_" + i;
    }
    
    // Objects go out of scope here
    System.out.println("Cycle " + cycle + " completed");
}

System.out.println("All cycles completed - objects should be garbage");`,
        expectedMetrics: {
          minHeapUsage: 5.0,
          maxHeapUsage: 60.0,
          minObjects: 0,
          maxObjects: 500,
          gcCollections: 2
        },
        expectedBehavior: "Should demonstrate effective garbage collection of unreachable objects"
      }
    ];
  }

  /**
   * Test 3: Off-Heap Memory Optimization
   */
  static getOffHeapTests(): GCTestCase[] {
    return [
      {
        name: "Large Object Off-Heap Allocation",
        code: `// Create objects large enough to trigger off-heap allocation
String[] hugeObjects = new String[10];

for (int i = 0; i < 10; i++) {
    // Create very large strings (>5KB each)
    String hugeData = "";
    for (int j = 0; j < 1000; j++) {
        hugeData = hugeData + "This is a very large data segment number " + j + " ";
    }
    hugeObjects[i] = hugeData;
    
    System.out.println("Created huge object " + i + ", size: " + hugeData.length());
}

System.out.println("All huge objects created");`,
        expectedMetrics: {
          minHeapUsage: 10.0,
          maxHeapUsage: 30.0, // Should be low due to off-heap allocation
          minObjects: 10,
          maxObjects: 20,
          gcCollections: 1
        },
        expectedBehavior: "Should allocate large objects off-heap, keeping heap usage low"
      },
      {
        name: "Off-Heap Memory Exhaustion Test",
        code: `// Try to exhaust off-heap memory
String[] massiveObjects = new String[100];
boolean outOfMemory = false;

for (int i = 0; i < 100; i++) {
    try {
        // Create extremely large strings
        String massiveData = "";
        for (int j = 0; j < 2000; j++) {
            massiveData = massiveData + "Massive data chunk " + j + " with lots of content ";
        }
        massiveObjects[i] = massiveData;
        System.out.println("Created massive object " + i);
    } catch (Exception e) {
        System.out.println("Out of memory at object " + i);
        outOfMemory = true;
        break;
    }
}

if (outOfMemory) {
    System.out.println("Off-heap memory exhausted gracefully");
} else {
    System.out.println("All massive objects created");
}`,
        expectedMetrics: {
          minHeapUsage: 5.0,
          maxHeapUsage: 95.0,
          minObjects: 10,
          maxObjects: 100,
          gcCollections: 5
        },
        expectedBehavior: "Should handle off-heap memory exhaustion gracefully"
      }
    ];
  }

  /**
   * Test 4: Real-time GC Performance
   */
  static getPerformanceTests(): GCTestCase[] {
    return [
      {
        name: "GC Pause Time Measurement",
        code: `// Test that measures actual GC pause times
long startTime = System.currentTimeMillis();
String[] objects = new String[1000];

for (int i = 0; i < 1000; i++) {
    objects[i] = "Performance test object " + i;
    
    // Force GC every 100 objects
    if (i % 100 == 0) {
        System.out.println("Checkpoint " + i + " - forcing GC");
        // GC will be triggered
    }
}

long endTime = System.currentTimeMillis();
System.out.println("Total time: " + (endTime - startTime) + "ms");`,
        expectedMetrics: {
          minHeapUsage: 25.0,
          maxHeapUsage: 70.0,
          minObjects: 1000,
          maxObjects: 1200,
          gcCollections: 10
        },
        expectedBehavior: "Should demonstrate sub-millisecond GC pause times"
      }
    ];
  }

  /**
   * Execute comprehensive GC monitor tests
   */
  static async runAllTests(): Promise<{ passed: number; failed: number; results: any[] }> {
    const results: any[] = [];
    let passed = 0;
    let failed = 0;

    console.log("🧪 Running GC Monitor Test Suite...\n");

    const interpreter = new JavaInterpreter();

    // Test dynamic metrics
    const dynamicTests = this.getDynamicMetricsTests();
    for (const test of dynamicTests) {
      try {
        console.log(`Testing: ${test.name}`);
        const result = await this.testDynamicMetrics(interpreter, test);
        if (result.success) {
          console.log("✅ PASSED");
          console.log(`   Heap Usage: ${result.metrics.heapUsage}%`);
          console.log(`   Objects: ${result.metrics.allocatedObjects}`);
          console.log(`   GC Collections: ${result.metrics.gcCollections}`);
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

    // Test GC triggering
    const gcTriggerTests = this.getGCTriggerTests();
    for (const test of gcTriggerTests) {
      try {
        console.log(`Testing: ${test.name}`);
        const result = await this.testGCTrigger(interpreter, test);
        if (result.success) {
          console.log("✅ PASSED");
          console.log(`   GC Pause: ${result.metrics.gcPauseTime}ms`);
          console.log(`   Objects Freed: ${result.metrics.freedObjects}`);
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

    // Test off-heap optimization
    const offHeapTests = this.getOffHeapTests();
    for (const test of offHeapTests) {
      try {
        console.log(`Testing: ${test.name}`);
        const result = await this.testOffHeapOptimization(interpreter, test);
        if (result.success) {
          console.log("✅ PASSED");
          console.log(`   Off-heap Usage: ${result.metrics.offHeapUsage}%`);
          console.log(`   Compaction Time: ${result.metrics.compactionTime}ms`);
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

    console.log(`\n📊 GC Monitor Test Results: ${passed} passed, ${failed} failed`);
    return { passed, failed, results };
  }

  private static async testDynamicMetrics(interpreter: JavaInterpreter, test: GCTestCase): Promise<any> {
    // Execute the test code
    const result = interpreter.interpret(test.code);
    const gcMetrics = interpreter.getGCMetrics();
    const heapStatus = interpreter.getHeapStatus();

    // Get latest metrics
    const latestGC = gcMetrics.length > 0 ? gcMetrics[gcMetrics.length - 1] : null;
    
    if (!latestGC) {
      return { success: false, error: "No GC metrics generated" };
    }

    // Validate metrics against expected values
    const metrics = {
      heapUsage: latestGC.heapUsage,
      allocatedObjects: latestGC.allocatedObjects,
      gcCollections: gcMetrics.length,
      offHeapUsage: latestGC.offHeapUsage
    };

    const expected = test.expectedMetrics!;
    const success = 
      metrics.heapUsage >= expected.minHeapUsage &&
      metrics.heapUsage <= expected.maxHeapUsage &&
      metrics.allocatedObjects >= expected.minObjects &&
      metrics.allocatedObjects <= expected.maxObjects &&
      metrics.gcCollections >= expected.gcCollections;

    return { success, metrics, expected };
  }

  private static async testGCTrigger(interpreter: JavaInterpreter, test: GCTestCase): Promise<any> {
    // Execute code and capture initial state
    interpreter.interpret(test.code);
    const initialMetrics = interpreter.getGCMetrics();
    const initialHeap = interpreter.getHeapStatus();

    // Trigger manual GC
    interpreter.triggerGC();
    
    // Capture post-GC state
    const finalMetrics = interpreter.getGCMetrics();
    const finalHeap = interpreter.getHeapStatus();

    const latestGC = finalMetrics[finalMetrics.length - 1];
    
    const metrics = {
      gcPauseTime: latestGC.pauseTime,
      freedObjects: latestGC.freedObjects,
      heapReduction: initialHeap.percentage - finalHeap.percentage,
      gcTriggered: finalMetrics.length > initialMetrics.length
    };

    const success = metrics.gcTriggered && metrics.gcPauseTime < 5.0; // Sub-5ms pause time

    return { success, metrics };
  }

  private static async testOffHeapOptimization(interpreter: JavaInterpreter, test: GCTestCase): Promise<any> {
    // Execute the test code
    const result = interpreter.interpret(test.code);
    const gcMetrics = interpreter.getGCMetrics();
    const heapStatus = interpreter.getHeapStatus();
    const offHeapStatus = interpreter.getOffHeapStatus();

    const latestGC = gcMetrics[gcMetrics.length - 1];
    
    const metrics = {
      offHeapUsage: latestGC ? latestGC.offHeapUsage : 0,
      compactionTime: latestGC ? latestGC.compactionTime : 0,
      heapUsage: heapStatus.percentage,
      offHeapAllocated: offHeapStatus.allocated,
      offHeapTotal: offHeapStatus.total
    };

    // Success if off-heap is being used and heap usage is reasonable
    const success = metrics.offHeapUsage > 0 && metrics.heapUsage < 50;

    return { success, metrics };
  }
}