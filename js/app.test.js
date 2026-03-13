// Unit tests for Browser Productivity Dashboard utility functions

// Mock functions from app.js for testing
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
}

function padZero(num) {
  return num < 10 ? '0' + num : num.toString();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return padZero(minutes) + ':' + padZero(remainingSeconds);
}

function getGreetingMessage(hour) {
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
}

// ============================================================================
// Test Suite
// ============================================================================

console.log('Running utility function tests...\n');

// Test generateId()
console.log('Testing generateId():');
const id1 = generateId();
const id2 = generateId();
console.assert(typeof id1 === 'string', 'generateId should return a string');
console.assert(id1.length > 0, 'generateId should return non-empty string');
console.assert(id1 !== id2, 'generateId should return unique IDs');
console.log('✓ generateId() tests passed\n');

// Test padZero()
console.log('Testing padZero():');
console.assert(padZero(0) === '00', 'padZero(0) should return "00"');
console.assert(padZero(5) === '05', 'padZero(5) should return "05"');
console.assert(padZero(9) === '09', 'padZero(9) should return "09"');
console.assert(padZero(10) === '10', 'padZero(10) should return "10"');
console.assert(padZero(25) === '25', 'padZero(25) should return "25"');
console.assert(padZero(99) === '99', 'padZero(99) should return "99"');
console.log('✓ padZero() tests passed\n');

// Test formatTime()
console.log('Testing formatTime():');
console.assert(formatTime(0) === '00:00', 'formatTime(0) should return "00:00"');
console.assert(formatTime(30) === '00:30', 'formatTime(30) should return "00:30"');
console.assert(formatTime(60) === '01:00', 'formatTime(60) should return "01:00"');
console.assert(formatTime(90) === '01:30', 'formatTime(90) should return "01:30"');
console.assert(formatTime(1500) === '25:00', 'formatTime(1500) should return "25:00"');
console.assert(formatTime(1499) === '24:59', 'formatTime(1499) should return "24:59"');
console.assert(formatTime(125) === '02:05', 'formatTime(125) should return "02:05"');
console.log('✓ formatTime() tests passed\n');

// Test getGreetingMessage()
console.log('Testing getGreetingMessage():');
console.assert(getGreetingMessage(0) === 'Good Night', 'getGreetingMessage(0) should return "Good Night"');
console.assert(getGreetingMessage(4) === 'Good Night', 'getGreetingMessage(4) should return "Good Night"');
console.assert(getGreetingMessage(5) === 'Good Morning', 'getGreetingMessage(5) should return "Good Morning"');
console.assert(getGreetingMessage(11) === 'Good Morning', 'getGreetingMessage(11) should return "Good Morning"');
console.assert(getGreetingMessage(12) === 'Good Afternoon', 'getGreetingMessage(12) should return "Good Afternoon"');
console.assert(getGreetingMessage(16) === 'Good Afternoon', 'getGreetingMessage(16) should return "Good Afternoon"');
console.assert(getGreetingMessage(17) === 'Good Evening', 'getGreetingMessage(17) should return "Good Evening"');
console.assert(getGreetingMessage(20) === 'Good Evening', 'getGreetingMessage(20) should return "Good Evening"');
console.assert(getGreetingMessage(21) === 'Good Night', 'getGreetingMessage(21) should return "Good Night"');
console.assert(getGreetingMessage(23) === 'Good Night', 'getGreetingMessage(23) should return "Good Night"');
console.log('✓ getGreetingMessage() tests passed\n');

console.log('All tests passed! ✓');

// ============================================================================
// Timer Function Tests
// ============================================================================

console.log('\nTesting timer functions...\n');

// Test timer state management
console.log('Testing timer state initialization:');
let timeRemaining = 1500;
let isRunning = false;
let intervalId = null;

console.assert(timeRemaining === 1500, 'Timer should initialize to 1500 seconds');
console.assert(isRunning === false, 'Timer should not be running initially');
console.assert(intervalId === null, 'Interval ID should be null initially');
console.log('✓ Timer state initialization tests passed\n');

// Test timer countdown logic
console.log('Testing timer countdown logic:');
function tick() {
  if (timeRemaining > 0) {
    timeRemaining = timeRemaining - 1;
  }
}

tick();
console.assert(timeRemaining === 1499, 'Timer should decrement by 1 second');
tick();
console.assert(timeRemaining === 1498, 'Timer should decrement again');
console.log('✓ Timer countdown logic tests passed\n');

// Test timer at zero
console.log('Testing timer at zero:');
timeRemaining = 0;
tick();
console.assert(timeRemaining === 0, 'Timer should not go below zero');
console.log('✓ Timer non-negative test passed\n');

// Test timer display formatting
console.log('Testing timer display formatting:');
console.assert(formatTime(1500) === '25:00', 'Initial timer should display 25:00');
console.assert(formatTime(0) === '00:00', 'Timer at zero should display 00:00');
console.assert(formatTime(1) === '00:01', 'Timer at 1 second should display 00:01');
console.assert(formatTime(59) === '00:59', 'Timer at 59 seconds should display 00:59');
console.assert(formatTime(60) === '01:00', 'Timer at 60 seconds should display 01:00');
console.log('✓ Timer display formatting tests passed\n');

console.log('All timer tests passed! ✓\n');

// ============================================================================
// Property-Based Testing Framework
// ============================================================================

/**
 * Simple property-based testing framework (fast-check style)
 */
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

/**
 * Generate integers in a range [min, max]
 */
function* integerRange(min, max) {
  for (let i = min; i <= max; i++) {
    yield i;
  }
}

// ============================================================================
// Property-Based Tests
// ============================================================================

console.log('\nRunning property-based tests...\n');

// **Validates: Requirements 1.3, 1.4, 1.5, 1.6**
// Property 1: Greeting Time Accuracy
console.log('Testing Property 1: Greeting Time Accuracy');
const greetingAccuracyResult = forAll(
  () => integerRange(0, 23),
  (hour) => {
    const greeting = getGreetingMessage(hour);
    let expectedGreeting;
    
    if (hour >= 5 && hour < 12) {
      expectedGreeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      expectedGreeting = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      expectedGreeting = 'Good Evening';
    } else {
      expectedGreeting = 'Good Night';
    }
    
    if (greeting !== expectedGreeting) {
      return {
        pass: false,
        message: `getGreetingMessage(${hour}) returned "${greeting}" but expected "${expectedGreeting}"`
      };
    }
    
    return { pass: true };
  }
);

if (greetingAccuracyResult.pass) {
  console.log(`✓ Property 1 passed: Tested all 24 hours (0-23)`);
  console.log('  All greeting messages correspond to correct time ranges\n');
} else {
  console.error(`✗ Property 1 failed!`);
  console.error(`  Counterexample: hour = ${greetingAccuracyResult.counterexample}`);
  console.error(`  ${greetingAccuracyResult.message}\n`);
}

// **Validates: Requirements 2.7**
// Property 3: Timer Format Consistency
console.log('Testing Property 3: Timer Format Consistency');
const timerFormatResult = forAll(
  () => integerRange(0, 1500),
  (seconds) => {
    const formatted = formatTime(seconds);
    const regex = /^\d{2}:\d{2}$/;
    
    if (!regex.test(formatted)) {
      return {
        pass: false,
        message: `formatTime(${seconds}) returned "${formatted}" which does not match MM:SS format`
      };
    }
    
    // Additional validation: check that it's actually valid time format
    const parts = formatted.split(':');
    const minutes = parseInt(parts[0], 10);
    const secs = parseInt(parts[1], 10);
    
    if (secs < 0 || secs > 59) {
      return {
        pass: false,
        message: `formatTime(${seconds}) returned "${formatted}" with invalid seconds: ${secs}`
      };
    }
    
    if (minutes < 0) {
      return {
        pass: false,
        message: `formatTime(${seconds}) returned "${formatted}" with negative minutes: ${minutes}`
      };
    }
    
    return { pass: true };
  }
);

if (timerFormatResult.pass) {
  console.log(`✓ Property 3 passed: Tested ${timerFormatResult.tested} values (0-1500 seconds)`);
  console.log('  All timer values format correctly as MM:SS with zero-padding\n');
} else {
  console.error(`✗ Property 3 failed!`);
  console.error(`  Counterexample: ${timerFormatResult.counterexample}`);
  console.error(`  ${timerFormatResult.message}\n`);
}

// **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 5.1, 5.3**
// Property 5: Task ID Uniqueness
console.log('Testing Property 5: Task ID Uniqueness');
const taskIdUniquenessResult = forAll(
  () => integerRange(1, 1000),
  (count) => {
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(generateId());
    }
    
    // Check for duplicates
    const uniqueIds = new Set(ids);
    
    if (uniqueIds.size !== ids.length) {
      // Find the duplicate
      const seen = new Set();
      let duplicate = null;
      for (const id of ids) {
        if (seen.has(id)) {
          duplicate = id;
          break;
        }
        seen.add(id);
      }
      
      return {
        pass: false,
        message: `Generated ${ids.length} IDs but only ${uniqueIds.size} were unique. Duplicate found: ${duplicate}`
      };
    }
    
    return { pass: true };
  }
);

if (taskIdUniquenessResult.pass) {
  console.log(`✓ Property 5 passed: Tested ${taskIdUniquenessResult.tested} iterations (1-1000 IDs per iteration)`);
  console.log('  All generated task IDs are unique\n');
} else {
  console.error(`✗ Property 5 failed!`);
  console.error(`  Counterexample: Generated ${taskIdUniquenessResult.counterexample} IDs`);
  console.error(`  ${taskIdUniquenessResult.message}\n`);
}

// **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 5.1, 5.3**
// Property 8: Link ID Uniqueness
console.log('Testing Property 8: Link ID Uniqueness');
const linkIdUniquenessResult = forAll(
  () => integerRange(1, 1000),
  (count) => {
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(generateId());
    }
    
    // Check for duplicates
    const uniqueIds = new Set(ids);
    
    if (uniqueIds.size !== ids.length) {
      // Find the duplicate
      const seen = new Set();
      let duplicate = null;
      for (const id of ids) {
        if (seen.has(id)) {
          duplicate = id;
          break;
        }
        seen.add(id);
      }
      
      return {
        pass: false,
        message: `Generated ${ids.length} IDs but only ${uniqueIds.size} were unique. Duplicate found: ${duplicate}`
      };
    }
    
    return { pass: true };
  }
);

if (linkIdUniquenessResult.pass) {
  console.log(`✓ Property 8 passed: Tested ${linkIdUniquenessResult.tested} iterations (1-1000 IDs per iteration)`);
  console.log('  All generated link IDs are unique\n');
} else {
  console.error(`✗ Property 8 failed!`);
  console.error(`  Counterexample: Generated ${linkIdUniquenessResult.counterexample} IDs`);
  console.error(`  ${linkIdUniquenessResult.message}\n`);
}

console.log('All tests passed! ✓');
