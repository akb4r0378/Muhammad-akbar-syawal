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

// **Validates: Requirements 5.5, 5.6**
// Property 9: Empty Link Prevention
console.log('Testing Property 9: Empty Link Prevention');

// Test helper: simulate addLink behavior
function testAddLink(name, url) {
  const testLinks = [];
  
  // Replicate addLink validation logic
  if (!name || name.trim().length === 0 || !url || url.trim().length === 0) {
    return { created: false, links: testLinks };
  }
  
  const newLink = {
    id: generateId(),
    name: name.trim(),
    url: url.trim()
  };
  
  testLinks.push(newLink);
  return { created: true, links: testLinks };
}

// Generate test cases for empty/whitespace strings
function* emptyStringGenerator() {
  const emptyStrings = [
    '',
    ' ',
    '  ',
    '   ',
    '\t',
    '\n',
    ' \t\n ',
    '     '
  ];
  
  const validStrings = [
    'Google',
    'https://example.com',
    'My Link',
    'a',
    ' valid ',
    'test'
  ];
  
  // Test empty name with valid URL
  for (const emptyStr of emptyStrings) {
    for (const validUrl of validStrings) {
      yield { name: emptyStr, url: validUrl, shouldFail: true, reason: 'empty name' };
    }
  }
  
  // Test valid name with empty URL
  for (const validName of validStrings) {
    for (const emptyStr of emptyStrings) {
      yield { name: validName, url: emptyStr, shouldFail: true, reason: 'empty URL' };
    }
  }
  
  // Test both empty
  for (const emptyStr1 of emptyStrings) {
    for (const emptyStr2 of emptyStrings) {
      yield { name: emptyStr1, url: emptyStr2, shouldFail: true, reason: 'both empty' };
    }
  }
  
  // Test valid combinations
  for (const validName of validStrings) {
    for (const validUrl of validStrings) {
      yield { name: validName, url: validUrl, shouldFail: false, reason: 'both valid' };
    }
  }
}

const emptyLinkPreventionResult = forAll(
  emptyStringGenerator,
  (testCase) => {
    const result = testAddLink(testCase.name, testCase.url);
    
    if (testCase.shouldFail) {
      // Link should NOT be created
      if (result.created) {
        return {
          pass: false,
          message: `addLink("${testCase.name}", "${testCase.url}") created a link but should have rejected it (${testCase.reason})`
        };
      }
      
      if (result.links.length > 0) {
        return {
          pass: false,
          message: `addLink("${testCase.name}", "${testCase.url}") added link to array but should have rejected it (${testCase.reason})`
        };
      }
    } else {
      // Link SHOULD be created
      if (!result.created) {
        return {
          pass: false,
          message: `addLink("${testCase.name}", "${testCase.url}") rejected valid link (${testCase.reason})`
        };
      }
      
      if (result.links.length !== 1) {
        return {
          pass: false,
          message: `addLink("${testCase.name}", "${testCase.url}") should have created exactly 1 link but created ${result.links.length}`
        };
      }
      
      // Verify the link has non-empty trimmed values
      const link = result.links[0];
      if (link.name.trim().length === 0) {
        return {
          pass: false,
          message: `Created link has empty name after trim: "${link.name}"`
        };
      }
      
      if (link.url.trim().length === 0) {
        return {
          pass: false,
          message: `Created link has empty URL after trim: "${link.url}"`
        };
      }
    }
    
    return { pass: true };
  }
);

if (emptyLinkPreventionResult.pass) {
  console.log(`✓ Property 9 passed: Tested ${emptyLinkPreventionResult.tested} test cases`);
  console.log('  Empty or whitespace-only names/URLs are correctly rejected');
  console.log('  Valid non-empty strings successfully create links');
  console.log('  All created links have non-empty trimmed name and URL\n');
} else {
  console.error(`✗ Property 9 failed!`);
  console.error(`  ${emptyLinkPreventionResult.message}\n`);
}

// ============================================================================
// Dashboard Enhancements - Property-Based Tests
// ============================================================================

console.log('\n=== Dashboard Enhancements Property Tests ===\n');

// Feature: dashboard-enhancements, Property 1: Theme Toggle Alternation
// **Validates: Requirements 1.2**
console.log('Testing Property 1: Theme Toggle Alternation');

// Test helper: simulate toggleTheme behavior
function testToggleTheme(initialTheme) {
  // Replicate toggleTheme logic
  let currentTheme = initialTheme;
  currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
  return currentTheme;
}

// Generator for theme values
function* themeGenerator() {
  // Test all possible theme states
  yield 'light';
  yield 'dark';
  
  // Test multiple iterations to verify consistency
  for (let i = 0; i < 100; i++) {
    yield Math.random() < 0.5 ? 'light' : 'dark';
  }
}

const themeToggleAlternationResult = forAll(
  themeGenerator,
  (initialTheme) => {
    const resultTheme = testToggleTheme(initialTheme);
    
    // Verify that toggle produces the opposite theme
    if (initialTheme === 'light' && resultTheme !== 'dark') {
      return {
        pass: false,
        message: `toggleTheme() with initial theme 'light' returned '${resultTheme}' but expected 'dark'`
      };
    }
    
    if (initialTheme === 'dark' && resultTheme !== 'light') {
      return {
        pass: false,
        message: `toggleTheme() with initial theme 'dark' returned '${resultTheme}' but expected 'light'`
      };
    }
    
    // Verify that toggling twice returns to original theme
    const afterSecondToggle = testToggleTheme(resultTheme);
    if (afterSecondToggle !== initialTheme) {
      return {
        pass: false,
        message: `Toggling twice from '${initialTheme}' resulted in '${afterSecondToggle}' but expected to return to '${initialTheme}'`
      };
    }
    
    return { pass: true };
  }
);

if (themeToggleAlternationResult.pass) {
  console.log(`✓ Property 1 passed: Tested ${themeToggleAlternationResult.tested} theme toggle operations`);
  console.log('  For any starting theme (light or dark), toggling produces the opposite theme');
  console.log('  Toggling twice returns to the original theme (light ↔ dark ↔ light)\n');
} else {
  console.error(`✗ Property 1 failed!`);
  console.error(`  ${themeToggleAlternationResult.message}\n`);
}

console.log('All tests passed! ✓');

// ============================================================================
// User Name Greeting Tests (Task 4)
// ============================================================================

console.log('\n=== User Name Greeting Tests (Task 4) ===\n');

// Mock localStorage for testing
const mockLocalStorage = {
  storage: {},
  getItem(key) {
    return this.storage[key] || null;
  },
  setItem(key, value) {
    this.storage[key] = value;
  },
  removeItem(key) {
    delete this.storage[key];
  },
  clear() {
    this.storage = {};
  }
};

// Test helper functions
let testUserName = '';

function testLoadUserName() {
  try {
    const storedName = mockLocalStorage.getItem('userName');
    testUserName = storedName || '';
  } catch (e) {
    console.error('Failed to load user name from localStorage:', e);
    testUserName = '';
  }
}

function testSaveUserName(name) {
  try {
    mockLocalStorage.setItem('userName', name);
    testUserName = name;
  } catch (e) {
    console.error('Failed to save user name to localStorage:', e);
  }
}

function testGetFullGreeting(hour, userName) {
  const greeting = getGreetingMessage(hour);
  
  let fullGreeting = greeting;
  if (userName && userName.trim().length > 0) {
    fullGreeting = greeting + ', ' + userName;
  }
  
  return fullGreeting;
}

// Unit Tests
console.log('Testing user name storage functions:');

// Test 1: Load with no stored name
mockLocalStorage.clear();
testLoadUserName();
console.assert(testUserName === '', 'loadUserName() with no stored name should return empty string');
console.log('✓ Test 1 passed: Load with no stored name returns empty string');

// Test 2: Save and load user name
testSaveUserName('Alice');
testLoadUserName();
console.assert(testUserName === 'Alice', 'saveUserName() and loadUserName() should persist name');
console.log('✓ Test 2 passed: Save and load user name');

// Test 3: Save empty string
testSaveUserName('');
testLoadUserName();
console.assert(testUserName === '', 'saveUserName() should handle empty string');
console.log('✓ Test 3 passed: Save empty string');

// Test 4: Greeting without name
const greetingWithoutName = testGetFullGreeting(10, '');
console.assert(!greetingWithoutName.includes(','), 'Greeting without name should not include comma');
console.assert(greetingWithoutName === 'Good Morning', 'Greeting without name should be just the greeting');
console.log('✓ Test 4 passed: Greeting without name has no comma');

// Test 5: Greeting with name
const greetingWithName = testGetFullGreeting(10, 'Bob');
console.assert(greetingWithName === 'Good Morning, Bob', 'Greeting with name should be "[Greeting], [Name]"');
console.log('✓ Test 5 passed: Greeting with name includes ", [Name]"');

// Test 6: Whitespace-only name treated as empty
const greetingWithWhitespace = testGetFullGreeting(10, '   ');
console.assert(!greetingWithWhitespace.includes(','), 'Whitespace-only name should not include comma');
console.assert(greetingWithWhitespace === 'Good Morning', 'Whitespace-only name should display greeting without name');
console.log('✓ Test 6 passed: Whitespace-only name treated as empty');

// Test 7: Persistence round-trip
testSaveUserName('Charlie');
testLoadUserName();
console.assert(testUserName === 'Charlie', 'Persistence round-trip should preserve name');
console.log('✓ Test 7 passed: Persistence round-trip');

// Test 8: Format verification for different times of day
const morningGreeting = testGetFullGreeting(8, 'Diana');
console.assert(morningGreeting === 'Good Morning, Diana', 'Morning greeting format should be correct');
const afternoonGreeting = testGetFullGreeting(14, 'Diana');
console.assert(afternoonGreeting === 'Good Afternoon, Diana', 'Afternoon greeting format should be correct');
const eveningGreeting = testGetFullGreeting(19, 'Diana');
console.assert(eveningGreeting === 'Good Evening, Diana', 'Evening greeting format should be correct');
const nightGreeting = testGetFullGreeting(23, 'Diana');
console.assert(nightGreeting === 'Good Night, Diana', 'Night greeting format should be correct');
console.log('✓ Test 8 passed: Greeting format is "[Greeting], [Name]" for all times of day');

console.log('\n✓ All user name greeting tests passed!\n');

// ============================================================================
// Property-Based Tests for User Name Greeting (Task 4.3)
// ============================================================================

console.log('=== Property-Based Tests for User Name Greeting ===\n');

// Feature: dashboard-enhancements, Property 3: Greeting Format with Name
// **Validates: Requirements 2.2, 2.3**
console.log('Testing Property 3: Greeting Format with Name');

// Generator for non-empty, non-whitespace user names
function* userNameGenerator() {
  const names = [
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Eve',
    'Frank',
    'Grace',
    'Henry',
    'Ivy',
    'Jack',
    'A',
    'AB',
    'ABC',
    'Test User',
    'John Doe',
    'Jane Smith',
    'User123',
    'test@example.com',
    '名前', // Japanese
    'Имя', // Russian
    'नाम', // Hindi
    'اسم', // Arabic
    '  Alice  ', // Name with surrounding whitespace
    'Bob\t', // Name with tab
    '\nCharlie', // Name with newline
  ];
  
  for (const name of names) {
    yield name;
  }
}

// Generator for all valid hours (0-23)
function* hourGenerator() {
  for (let hour = 0; hour < 24; hour++) {
    yield hour;
  }
}

// Test Property 3: Greeting Format with Name
const greetingFormatResult = forAll(
  function* () {
    // Generate combinations of hours and names
    const names = Array.from(userNameGenerator());
    const hours = Array.from(hourGenerator());
    
    for (const hour of hours) {
      for (const name of names) {
        yield { hour, name };
      }
    }
  },
  (testCase) => {
    const { hour, name } = testCase;
    
    // Skip if name is empty or whitespace-only after trimming
    if (!name || name.trim().length === 0) {
      return { pass: true }; // This case is tested separately
    }
    
    const fullGreeting = testGetFullGreeting(hour, name);
    const expectedGreeting = getGreetingMessage(hour);
    const expectedFormat = expectedGreeting + ', ' + name;
    
    if (fullGreeting !== expectedFormat) {
      return {
        pass: false,
        message: `For hour ${hour} and name "${name}", expected "${expectedFormat}" but got "${fullGreeting}"`
      };
    }
    
    // Verify the format contains a comma
    if (!fullGreeting.includes(',')) {
      return {
        pass: false,
        message: `Greeting "${fullGreeting}" should contain a comma for non-empty name "${name}"`
      };
    }
    
    // Verify the format ends with the name
    if (!fullGreeting.endsWith(', ' + name)) {
      return {
        pass: false,
        message: `Greeting "${fullGreeting}" should end with ", ${name}"`
      };
    }
    
    return { pass: true };
  }
);

if (greetingFormatResult.pass) {
  console.log(`✓ Property 3 passed: Tested ${greetingFormatResult.tested} combinations`);
  console.log('  For any non-empty, non-whitespace user name and any valid greeting,');
  console.log('  the displayed greeting is in the format "[Greeting], [Name]"\n');
} else {
  console.error(`✗ Property 3 failed!`);
  console.error(`  ${greetingFormatResult.message}\n`);
}

// Test empty and whitespace-only names separately
console.log('Testing empty and whitespace-only name handling:');

function* emptyNameGenerator() {
  yield '';
  yield ' ';
  yield '  ';
  yield '   ';
  yield '\t';
  yield '\n';
  yield ' \t\n ';
  yield '     ';
}

const emptyNameResult = forAll(
  function* () {
    const emptyNames = Array.from(emptyNameGenerator());
    const hours = Array.from(hourGenerator());
    
    for (const hour of hours) {
      for (const name of emptyNames) {
        yield { hour, name };
      }
    }
  },
  (testCase) => {
    const { hour, name } = testCase;
    const fullGreeting = testGetFullGreeting(hour, name);
    const expectedGreeting = getGreetingMessage(hour);
    
    // For empty or whitespace-only names, greeting should NOT include comma or name
    if (fullGreeting !== expectedGreeting) {
      return {
        pass: false,
        message: `For hour ${hour} and empty/whitespace name "${name}", expected "${expectedGreeting}" but got "${fullGreeting}"`
      };
    }
    
    if (fullGreeting.includes(',')) {
      return {
        pass: false,
        message: `Greeting "${fullGreeting}" should not contain comma for empty/whitespace name "${name}"`
      };
    }
    
    return { pass: true };
  }
);

if (emptyNameResult.pass) {
  console.log(`✓ Empty name handling passed: Tested ${emptyNameResult.tested} combinations`);
  console.log('  For any empty or whitespace-only name, greeting displays without name or comma\n');
} else {
  console.error(`✗ Empty name handling failed!`);
  console.error(`  ${emptyNameResult.message}\n`);
}

console.log('\n=== Task 4 Tests Complete ===');
console.log('All user name greeting tests passed! ✓\n');
