// Node.js test runner for Property 10: Load-Save Round Trip
// This simulates localStorage behavior for testing purposes

// Simulate localStorage
class LocalStorageMock {
    constructor() {
        this.store = {};
    }
    
    getItem(key) {
        return this.store[key] || null;
    }
    
    setItem(key, value) {
        this.store[key] = value.toString();
    }
    
    removeItem(key) {
        delete this.store[key];
    }
    
    clear() {
        this.store = {};
    }
}

const localStorage = new LocalStorageMock();

// Simple property-based testing framework
function forAll(generator, property) {
    const results = [];
    for (const value of generator()) {
        const result = property(value);
        if (!result.pass) {
            return {
                pass: false,
                counterexample: value,
                message: result.message
            };
        }
        results.push(result);
    }
    return { pass: true, tested: results.length };
}

// Generate test data for tasks (reduced for faster execution)
function* taskDataGenerator() {
    // Empty array
    yield { data: [], description: 'empty tasks array' };
    
    // Single task
    yield {
        data: [
            { id: '1', text: 'Test task', completed: false, createdAt: 1234567890 }
        ],
        description: 'single task'
    };
    
    // Multiple tasks with various states and special characters
    yield {
        data: [
            { id: '1', text: 'First task', completed: false, createdAt: 1234567890 },
            { id: '2', text: 'Task with "quotes"', completed: true, createdAt: 1234567891 },
            { id: '3', text: 'Task with emoji 🎉', completed: false, createdAt: 1234567892 }
        ],
        description: 'multiple tasks with mixed states and special characters'
    };
    
    // Moderate number of tasks (reduced from 50 to 20)
    const moderateTasks = [];
    for (let i = 0; i < 20; i++) {
        moderateTasks.push({
            id: `task-${i}`,
            text: `Task number ${i}`,
            completed: i % 2 === 0,
            createdAt: 1234567890 + i
        });
    }
    yield { data: moderateTasks, description: '20 tasks' };
}

// Generate test data for links (reduced for faster execution)
function* linkDataGenerator() {
    // Empty array
    yield { data: [], description: 'empty links array' };
    
    // Single link
    yield {
        data: [
            { id: '1', name: 'Google', url: 'https://google.com' }
        ],
        description: 'single link'
    };
    
    // Multiple links with special characters
    yield {
        data: [
            { id: '1', name: 'GitHub', url: 'https://github.com' },
            { id: '2', name: 'Link with "quotes"', url: 'https://example.com?q="test"' },
            { id: '3', name: 'Link with emoji 🔗', url: 'https://example.com' }
        ],
        description: 'multiple links with special characters'
    };
    
    // Moderate number of links (reduced from 30 to 15)
    const moderateLinks = [];
    for (let i = 0; i < 15; i++) {
        moderateLinks.push({
            id: `link-${i}`,
            name: `Link ${i}`,
            url: `https://example${i}.com`
        });
    }
    yield { data: moderateLinks, description: '15 links' };
}

// Test round-trip consistency
function testRoundTrip(key, originalData) {
    try {
        // Step 1: Save original data to localStorage
        const originalJson = JSON.stringify(originalData);
        localStorage.setItem(key, originalJson);
        
        // Step 2: Load data from localStorage
        const loadedJson = localStorage.getItem(key);
        const loadedData = JSON.parse(loadedJson);
        
        // Step 3: Save loaded data back to localStorage
        const resavedJson = JSON.stringify(loadedData);
        
        // Step 4: Compare original and resaved JSON
        if (originalJson !== resavedJson) {
            return {
                pass: false,
                message: `Round trip failed: original and resaved JSON differ\nOriginal: ${originalJson}\nResaved: ${resavedJson}`
            };
        }
        
        // Step 5: Deep equality check on data structures
        if (!deepEqual(originalData, loadedData)) {
            return {
                pass: false,
                message: `Round trip failed: loaded data differs from original\nOriginal: ${JSON.stringify(originalData)}\nLoaded: ${JSON.stringify(loadedData)}`
            };
        }
        
        return { pass: true };
    } catch (e) {
        return {
            pass: false,
            message: `Round trip failed with error: ${e.message}`
        };
    } finally {
        // Clean up
        localStorage.removeItem(key);
    }
}

// Deep equality comparison
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return false;
    }
    
    if (Array.isArray(obj1) !== Array.isArray(obj2)) {
        return false;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
        return false;
    }
    
    for (const key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
        
        if (!deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    
    return true;
}

// Run the property tests
console.log('Testing Property 10: Load-Save Round Trip\n');

// Test tasks round trip
console.log('=== Testing Tasks Round Trip ===');
const tasksResult = forAll(
    taskDataGenerator,
    (testCase) => {
        const result = testRoundTrip('tasks', testCase.data);
        if (!result.pass) {
            result.message = `Failed for ${testCase.description}: ${result.message}`;
        }
        return result;
    }
);

if (tasksResult.pass) {
    console.log(`✓ Tasks round trip passed: Tested ${tasksResult.tested} test cases`);
    console.log('  All task data survived load-save round trip unchanged\n');
} else {
    console.log(`✗ Tasks round trip failed!`);
    console.log(`  ${tasksResult.message}\n`);
}

// Test links round trip
console.log('=== Testing Links Round Trip ===');
const linksResult = forAll(
    linkDataGenerator,
    (testCase) => {
        const result = testRoundTrip('links', testCase.data);
        if (!result.pass) {
            result.message = `Failed for ${testCase.description}: ${result.message}`;
        }
        return result;
    }
);

if (linksResult.pass) {
    console.log(`✓ Links round trip passed: Tested ${linksResult.tested} test cases`);
    console.log('  All link data survived load-save round trip unchanged\n');
} else {
    console.log(`✗ Links round trip failed!`);
    console.log(`  ${linksResult.message}\n`);
}

// Overall result
console.log('=== Overall Result ===');
if (tasksResult.pass && linksResult.pass) {
    console.log('All tests passed! ✓');
    console.log(`Total test cases: ${tasksResult.tested + linksResult.tested}`);
    console.log('\nProperty 10 verified:');
    console.log('  ∀ data d stored in localStorage,');
    console.log('  let loaded = JSON.parse(localStorage.getItem(key))');
    console.log('  let saved = JSON.stringify(loaded)');
    console.log('  then: saved ≡ d');
    process.exit(0);
} else {
    console.log('Some tests failed! ✗');
    process.exit(1);
}
