# Design Document: Dashboard Enhancements

## Overview

The Dashboard Enhancements feature extends the existing Browser Productivity Dashboard with five key improvements that enhance user experience and customization. These enhancements maintain the vanilla HTML/CSS/JavaScript approach with no external dependencies, building upon the existing codebase architecture.

The five enhancements are:
1. **Light/Dark Mode Toggle**: Theme switching with persistence
2. **Custom Name in Greeting**: Personalized greeting messages
3. **Customizable Timer Duration**: Configurable Pomodoro intervals (1-120 minutes)
4. **Duplicate Task Prevention**: Case-insensitive duplicate detection
5. **Task Sorting**: Manual task reordering with move up/down controls

All new settings are persisted to Local Storage and integrate seamlessly with the existing dashboard components.

## Architecture

### Enhanced Component Structure

```
Dashboard (Main Application)
├── ThemeToggle (NEW)
├── GreetingDisplay (ENHANCED)
├── FocusTimer (ENHANCED)
├── TaskList (ENHANCED)
├── QuickLinks (UNCHANGED)
└── SettingsPanel (NEW)
    ├── NameSettings
    └── TimerSettings
```

### File Structure

```
/
├── index.html          # Enhanced HTML with new UI controls
├── css/
│   └── styles.css      # Enhanced with dark mode and new component styles
└── js/
    └── app.js          # Enhanced with new features and settings management
```

### Integration Strategy

The enhancements integrate with existing code by:
- Extending existing functions rather than replacing them
- Adding new state variables for settings
- Enhancing existing components with new capabilities
- Maintaining backward compatibility with existing Local Storage data

## Components and Interfaces

### 1. ThemeToggle Component (NEW)

**Purpose**: Switch between light and dark color themes

**State**:
- `currentTheme`: string ('light' or 'dark')

**Functions**:

```javascript
function loadTheme()
  // Load theme preference from Local Storage
  // Default to 'light' if not set
  
  try:
    storedTheme = localStorage.getItem('theme')
    if storedTheme in ['light', 'dark']:
      currentTheme = storedTheme
    else:
      currentTheme = 'light'
  catch error:
    currentTheme = 'light'
  
  applyTheme(currentTheme)
```

```javascript
function toggleTheme()
  // Switch between light and dark themes
  
  currentTheme = (currentTheme === 'light') ? 'dark' : 'light'
  applyTheme(currentTheme)
  saveTheme()
```

```javascript
function applyTheme(theme)
  // Apply theme by setting data attribute on body element
  // CSS will handle styling based on this attribute
  
  document.body.setAttribute('data-theme', theme)
```

```javascript
function saveTheme()
  // Persist theme preference to Local Storage
  
  try:
    localStorage.setItem('theme', currentTheme)
  catch error:
    console.error('Failed to save theme preference')
```

**DOM Elements**:
- `#theme-toggle`: Button to switch themes
- `body[data-theme]`: Attribute for CSS theme targeting

**CSS Strategy**:
- Use CSS custom properties (variables) for colors
- Define light theme colors as defaults
- Override with dark theme colors using `[data-theme="dark"]` selector
- Ensure WCAG AA contrast ratios (4.5:1 minimum)

### 2. Enhanced GreetingDisplay Component

**Purpose**: Display time, date, and personalized greeting with optional user name

**State** (NEW):
- `userName`: string (user's custom name, may be empty)

**Functions**:

```javascript
function loadUserName()
  // Load user name from Local Storage
  
  try:
    storedName = localStorage.getItem('userName')
    userName = storedName || ''
  catch error:
    userName = ''
```

```javascript
function saveUserName(name)
  // Save user name to Local Storage
  
  try:
    localStorage.setItem('userName', name)
    userName = name
  catch error:
    console.error('Failed to save user name')
```

```javascript
function updateGreeting() // ENHANCED
  // Existing function enhanced to include user name
  
  currentTime = getCurrentTime()
  currentDate = getCurrentDate()
  greeting = getGreetingMessage(currentTime)
  
  // NEW: Append user name if configured
  if userName and userName.trim().length > 0:
    fullGreeting = greeting + ', ' + userName
  else:
    fullGreeting = greeting
  
  updateDOM(currentTime, currentDate, fullGreeting)
```

**DOM Elements**:
- Existing: `#time-display`, `#date-display`, `#greeting-message`
- NEW: Settings panel inputs for name configuration

### 3. Enhanced FocusTimer Component

**Purpose**: Countdown timer with customizable duration

**State** (ENHANCED):
- `timeRemaining`: number (seconds remaining)
- `isRunning`: boolean (timer active status)
- `intervalId`: number (setInterval reference)
- `timerDuration`: number (NEW - configured duration in minutes, default 25)

**Functions**:

```javascript
function loadTimerDuration()
  // Load timer duration from Local Storage
  
  try:
    storedDuration = localStorage.getItem('timerDuration')
    if storedDuration:
      parsed = parseInt(storedDuration, 10)
      if parsed >= 1 and parsed <= 120:
        timerDuration = parsed
      else:
        timerDuration = 25
    else:
      timerDuration = 25
  catch error:
    timerDuration = 25
```

```javascript
function saveTimerDuration(minutes)
  // Save timer duration to Local Storage
  // Validate range: 1-120 minutes
  
  if minutes < 1 or minutes > 120:
    return false  // Invalid
  
  try:
    localStorage.setItem('timerDuration', minutes.toString())
    timerDuration = minutes
    return true
  catch error:
    console.error('Failed to save timer duration')
    return false
```

```javascript
function initTimer() // ENHANCED
  // Initialize timer with configured duration
  
  timeRemaining = timerDuration * 60  // Convert minutes to seconds
  isRunning = false
  intervalId = null
  updateTimerDisplay()
```

```javascript
function resetTimer() // ENHANCED
  // Reset timer to configured duration
  
  stopTimer()
  timeRemaining = timerDuration * 60
  updateTimerDisplay()
```

**DOM Elements**:
- Existing: `#timer-display`, `#start-btn`, `#stop-btn`, `#reset-btn`
- NEW: Settings panel inputs for duration configuration

### 4. Enhanced TaskList Component

**Purpose**: Manage tasks with duplicate prevention and sorting

**State** (UNCHANGED):
- `tasks`: Array of Task objects

**New Functions**:

```javascript
function isDuplicateTask(text, excludeId = null)
  // Check if task text already exists (case-insensitive)
  // excludeId: optional task ID to exclude from check (for edits)
  
  normalizedText = text.trim().toLowerCase()
  
  for each task in tasks:
    if task.id !== excludeId:
      if task.text.trim().toLowerCase() === normalizedText:
        return true
  
  return false
```

```javascript
function showDuplicateNotification()
  // Display temporary notification about duplicate task
  
  // Create notification element
  notification = createElement('div')
  notification.className = 'duplicate-notification'
  notification.textContent = 'This task already exists!'
  
  // Add to DOM
  document.body.appendChild(notification)
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.remove()
  }, 2000)
```

```javascript
function addTask(text) // ENHANCED
  // Create new task with duplicate check
  
  if text.trim() is empty:
    return
  
  // NEW: Check for duplicates
  if isDuplicateTask(text):
    showDuplicateNotification()
    return
  
  newTask = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  }
  
  tasks.push(newTask)
  saveTasks()
```

```javascript
function editTask(taskId, newText) // ENHANCED
  // Update task text with duplicate check
  
  if newText.trim() is empty:
    return
  
  // NEW: Check for duplicates (excluding current task)
  if isDuplicateTask(newText, taskId):
    showDuplicateNotification()
    return
  
  task = findTaskById(taskId)
  if task:
    task.text = newText.trim()
    saveTasks()
```

```javascript
function moveTaskUp(taskId)
  // Move task one position earlier in the list
  
  index = tasks.findIndex(task => task.id === taskId)
  
  if index <= 0:
    return  // Already at top or not found
  
  // Swap with previous task
  [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]]
  
  saveTasks()
  renderTasks()
```

```javascript
function moveTaskDown(taskId)
  // Move task one position later in the list
  
  index = tasks.findIndex(task => task.id === taskId)
  
  if index < 0 or index >= tasks.length - 1:
    return  // Already at bottom or not found
  
  // Swap with next task
  [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]]
  
  saveTasks()
  renderTasks()
```

```javascript
function createTaskElement(task) // ENHANCED
  // Create DOM element with new move up/down buttons
  
  // ... existing code for task element creation ...
  
  // NEW: Add move up button
  moveUpBtn = createElement('button')
  moveUpBtn.textContent = '↑'
  moveUpBtn.addEventListener('click', () => moveTaskUp(task.id))
  
  // NEW: Add move down button
  moveDownBtn = createElement('button')
  moveDownBtn.textContent = '↓'
  moveDownBtn.addEventListener('click', () => moveTaskDown(task.id))
  
  // Add to button container
  buttonContainer.appendChild(moveUpBtn)
  buttonContainer.appendChild(moveDownBtn)
  
  // ... rest of existing code ...
```

**DOM Elements**:
- Existing: `#task-input`, `#add-task-btn`, `#task-list`
- NEW: Move up/down buttons on each task item
- NEW: Duplicate notification overlay

### 5. SettingsPanel Component (NEW)

**Purpose**: Centralized UI for configuring user preferences

**Functions**:

```javascript
function initSettingsPanel()
  // Initialize settings panel with current values
  
  // Load current settings
  loadUserName()
  loadTimerDuration()
  
  // Populate input fields
  document.getElementById('name-input').value = userName
  document.getElementById('timer-duration-input').value = timerDuration
  
  // Attach event listeners
  attachSettingsEventListeners()
```

```javascript
function attachSettingsEventListeners()
  // Attach event listeners to settings controls
  
  // Name settings
  document.getElementById('save-name-btn').addEventListener('click', () => {
    newName = document.getElementById('name-input').value
    saveUserName(newName)
    showSettingsSavedFeedback('name')
  })
  
  // Timer duration settings
  document.getElementById('save-timer-btn').addEventListener('click', () => {
    newDuration = parseInt(document.getElementById('timer-duration-input').value, 10)
    
    if isNaN(newDuration) or newDuration < 1 or newDuration > 120:
      showSettingsError('timer', 'Duration must be between 1 and 120 minutes')
      return
    
    success = saveTimerDuration(newDuration)
    if success:
      resetTimer()  // Apply new duration
      showSettingsSavedFeedback('timer')
    else:
      showSettingsError('timer', 'Failed to save timer duration')
  })
```

```javascript
function showSettingsSavedFeedback(settingType)
  // Display success indicator for saved setting
  
  indicator = document.getElementById(settingType + '-saved-indicator')
  indicator.style.display = 'inline'
  
  setTimeout(() => {
    indicator.style.display = 'none'
  }, 2000)
```

```javascript
function showSettingsError(settingType, message)
  // Display error message for invalid setting
  
  errorElement = document.getElementById(settingType + '-error')
  errorElement.textContent = message
  errorElement.style.display = 'block'
  
  // Highlight input field
  inputElement = document.getElementById(settingType + '-input')
  inputElement.classList.add('error')
  
  setTimeout(() => {
    errorElement.style.display = 'none'
    inputElement.classList.remove('error')
  }, 3000)
```

**DOM Elements**:
- `#settings-panel`: Container section
- `#name-input`: Input field for user name
- `#save-name-btn`: Button to save name
- `#name-saved-indicator`: Success feedback for name
- `#timer-duration-input`: Input field for timer duration
- `#save-timer-btn`: Button to save duration
- `#timer-saved-indicator`: Success feedback for timer
- `#timer-error`: Error message display for timer

## Data Models

### Enhanced Local Storage Schema

```javascript
// Existing keys (unchanged)
'tasks': JSON array of Task objects
'links': JSON array of Link objects

// New keys
'theme': string ('light' or 'dark')
'userName': string (user's custom name, may be empty)
'timerDuration': string (number as string, '1' to '120')
```

### Task Object (UNCHANGED)

```javascript
{
  id: string,           // Unique identifier
  text: string,         // Task description
  completed: boolean,   // Completion status
  createdAt: number     // Timestamp of creation
}
```

### Settings Validation Rules

```javascript
// Theme validation
theme ∈ {'light', 'dark'}

// User name validation
userName: any string (including empty)
// Empty or whitespace-only names result in no name displayed

// Timer duration validation
timerDuration: integer
1 ≤ timerDuration ≤ 120
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Theme Toggle Alternation

*For any* current theme state, clicking the theme toggle should switch to the opposite theme (light ↔ dark).

**Validates: Requirements 1.2**

### Property 2: Theme Persistence Round-Trip

*For any* valid theme value ('light' or 'dark'), saving the theme to Local Storage and then loading it should produce the same theme value.

**Validates: Requirements 1.6, 1.7**

### Property 3: Greeting Format with Name

*For any* non-empty, non-whitespace user name and any valid greeting message, the displayed greeting should be in the format "[Greeting], [Name]".

**Validates: Requirements 2.2, 2.3**

### Property 4: User Name Persistence Round-Trip

*For any* user name string, saving the name to Local Storage and then loading it should produce the same name value.

**Validates: Requirements 2.5, 2.6**

### Property 5: Timer Duration Validation

*For any* integer value, the timer duration validation should accept values in the range [1, 120] and reject all values outside this range.

**Validates: Requirements 3.2, 3.8**

### Property 6: Timer Uses Configured Duration

*For any* valid timer duration in minutes, both timer initialization and timer reset should set the time remaining to exactly that duration in seconds (duration × 60).

**Validates: Requirements 3.3, 3.4**

### Property 7: Timer Duration Persistence Round-Trip

*For any* valid timer duration (1-120 minutes), saving the duration to Local Storage and then loading it should produce the same numeric value.

**Validates: Requirements 3.5, 3.6, 8.1, 8.2, 8.5**

### Property 8: Duplicate Task Detection

*For any* task list and any new task text, the duplicate detection should return true if and only if there exists a task in the list whose text matches the new text after both are trimmed and converted to lowercase.

**Validates: Requirements 4.1, 4.2, 4.4**

### Property 9: Duplicate Prevention on Add

*For any* task list containing a task with text T, attempting to add a new task with text that matches T (case-insensitive, whitespace-trimmed) should not increase the task list length.

**Validates: Requirements 4.1, 4.2**

### Property 10: Duplicate Prevention on Edit

*For any* task being edited, the edit should be allowed if the new text is unique (case-insensitive, whitespace-trimmed) or matches the task's own current text, and should be prevented if it matches any other task's text.

**Validates: Requirements 4.6, 4.7**

### Property 11: Move Up Position Change

*For any* task list and any task at index i where i > 0, moving the task up should result in the task being at index i-1 and the task previously at i-1 being at index i.

**Validates: Requirements 5.3**

### Property 12: Move Down Position Change

*For any* task list and any task at index i where i < length-1, moving the task down should result in the task being at index i+1 and the task previously at i+1 being at index i.

**Validates: Requirements 5.4**

### Property 13: Task Order Persistence Round-Trip

*For any* ordered task list, saving the tasks to Local Storage and then loading them should produce a task list with the same order (same task IDs in the same sequence).

**Validates: Requirements 5.7, 5.8**

### Property 14: Settings Persistence Round-Trip

*For any* valid settings object containing theme, userName, and timerDuration, saving all settings to Local Storage and then loading them should produce an equivalent settings object.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 15: Timer Duration Parsing Validation

*For any* string value loaded from Local Storage for timer duration, the parser should validate that the parsed number is in the range [1, 120], and if not, should return the default value of 25.

**Validates: Requirements 8.3, 8.6**

### Property 16: Initialization Preserves Existing Data

*For any* existing Local Storage state containing tasks and links, initializing the dashboard with new settings should not modify or delete the existing tasks and links data.

**Validates: Requirements 9.4**

### Property 17: Default Values for Missing Settings

*For any* missing setting key in Local Storage (theme, userName, or timerDuration), loading the settings should use the appropriate default value (light, empty string, or 25 respectively).

**Validates: Requirements 1.8, 2.4, 3.7, 7.6**


## Error Handling

### Local Storage Errors

**Strategy**: Wrap all localStorage operations in try-catch blocks with graceful degradation

```javascript
function safeLocalStorageGet(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
    } else if (error.name === 'SecurityError') {
      console.error('localStorage access denied');
    } else {
      console.error(`Failed to write ${key} to localStorage:`, error);
    }
    return false;
  }
}
```

**Error Scenarios**:
- **QuotaExceededError**: Continue with in-memory state, warn user
- **SecurityError**: Continue with in-memory state, warn user
- **Corrupted data**: Reset to defaults, log error

### Input Validation Errors

**Timer Duration Validation**:
```javascript
function validateTimerDuration(value) {
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    return { valid: false, error: 'Duration must be a number' };
  }
  
  if (parsed < 1 || parsed > 120) {
    return { valid: false, error: 'Duration must be between 1 and 120 minutes' };
  }
  
  return { valid: true, value: parsed };
}
```

**User Name Validation**:
- Accept any string (including empty)
- Trim whitespace before display
- Empty or whitespace-only names result in no name displayed

**Theme Validation**:
```javascript
function validateTheme(value) {
  return ['light', 'dark'].includes(value) ? value : 'light';
}
```

### Duplicate Task Handling

**Strategy**: Prevent duplicate creation and provide user feedback

```javascript
function handleDuplicateTask() {
  // Show notification
  showDuplicateNotification();
  
  // Do not modify task list
  // Do not save to localStorage
  
  // Clear input field (optional - UX decision)
  // Keep input field (allows user to modify)
}
```

### Parsing Errors

**Timer Duration Parsing**:
```javascript
function parseTimerDuration(stored) {
  try {
    const parsed = parseInt(stored, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 120) {
      console.warn('Invalid timer duration in storage, using default');
      return 25;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to parse timer duration:', error);
    return 25;
  }
}
```

**JSON Parsing**:
```javascript
function parseStoredData(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return defaultValue;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error(`Failed to parse ${key}:`, error);
    return defaultValue;
  }
}
```

### Edge Cases

**Move Up/Down at Boundaries**:
- Moving up at index 0: No-op, return early
- Moving down at last index: No-op, return early
- Single task list: Both operations are no-ops

**Empty States**:
- Empty user name: Display greeting without name
- No saved theme: Default to light mode
- No saved timer duration: Default to 25 minutes
- Empty task list: Move operations have no effect

**Whitespace Handling**:
- User names: Trim before display, empty after trim = no name
- Task text: Trim before comparison for duplicates
- Timer duration: Parse numeric value, ignore whitespace

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library Selection**: Use **fast-check** for JavaScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: dashboard-enhancements, Property {number}: {property_text}`

**Example Property Test Structure**:
```javascript
// Feature: dashboard-enhancements, Property 2: Theme Persistence Round-Trip
test('theme persistence round-trip', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('light', 'dark'),
      (theme) => {
        // Save theme
        saveTheme(theme);
        
        // Load theme
        const loaded = loadTheme();
        
        // Verify round-trip
        expect(loaded).toBe(theme);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Focus Areas

**Specific Examples**:
- Theme toggle from light to dark
- Theme toggle from dark to light
- Adding a task with a specific name
- Editing a task to a specific new text

**Edge Cases**:
- Moving up the first task (should not change position)
- Moving down the last task (should not change position)
- Empty user name (should display greeting without name)
- Whitespace-only user name (should display greeting without name)
- Timer duration of 1 minute (minimum boundary)
- Timer duration of 120 minutes (maximum boundary)
- Timer duration of 0 (invalid, should reject)
- Timer duration of 121 (invalid, should reject)

**Error Conditions**:
- localStorage unavailable (SecurityError)
- localStorage quota exceeded (QuotaExceededError)
- Corrupted JSON in localStorage
- Invalid timer duration string (non-numeric)
- Duplicate task creation attempt
- Duplicate task edit attempt

**Integration Points**:
- Settings panel updates trigger component updates
- Theme changes apply to all components
- Timer duration changes affect timer initialization and reset
- Task order changes persist correctly

### Property-Based Testing Focus Areas

**Round-Trip Properties**:
- Property 2: Theme persistence round-trip
- Property 4: User name persistence round-trip
- Property 7: Timer duration persistence round-trip
- Property 13: Task order persistence round-trip
- Property 14: Settings persistence round-trip

**Validation Properties**:
- Property 5: Timer duration validation (test with random integers)
- Property 8: Duplicate task detection (test with random task lists and text)
- Property 15: Timer duration parsing validation (test with random strings)

**State Transformation Properties**:
- Property 1: Theme toggle alternation (test with random initial states)
- Property 6: Timer uses configured duration (test with random valid durations)
- Property 11: Move up position change (test with random task lists)
- Property 12: Move down position change (test with random task lists)

**Invariant Properties**:
- Property 9: Duplicate prevention on add (task list length invariant)
- Property 10: Duplicate prevention on edit (uniqueness invariant)
- Property 16: Initialization preserves existing data (data preservation invariant)
- Property 17: Default values for missing settings (fallback invariant)

### Test Data Generators

**For Property-Based Tests**:

```javascript
// Theme generator
const themeGen = fc.constantFrom('light', 'dark');

// User name generator (including edge cases)
const userNameGen = fc.oneof(
  fc.string(),
  fc.constant(''),
  fc.stringOf(fc.constantFrom(' ', '\t', '\n')), // whitespace-only
  fc.string({ minLength: 1, maxLength: 50 })
);

// Timer duration generator (valid range)
const validDurationGen = fc.integer({ min: 1, max: 120 });

// Timer duration generator (including invalid)
const anyDurationGen = fc.integer({ min: -100, max: 200 });

// Task text generator
const taskTextGen = fc.string({ minLength: 1, maxLength: 100 });

// Task list generator
const taskListGen = fc.array(
  fc.record({
    id: fc.string(),
    text: taskTextGen,
    completed: fc.boolean(),
    createdAt: fc.integer()
  }),
  { minLength: 0, maxLength: 20 }
);
```

### Manual Testing Checklist

**Visual Verification**:
- [ ] Dark mode applies correct colors to all components
- [ ] Light mode applies correct colors to all components
- [ ] Theme toggle button is visible and accessible
- [ ] Settings panel is visually distinct
- [ ] Duplicate notification appears and disappears correctly
- [ ] Success indicators appear when settings are saved
- [ ] Error states highlight input fields correctly

**Cross-Browser Testing**:
- [ ] Chrome: All features work correctly
- [ ] Firefox: All features work correctly
- [ ] Edge: All features work correctly
- [ ] Safari: All features work correctly

**Persistence Testing**:
- [ ] Theme persists across page reloads
- [ ] User name persists across page reloads
- [ ] Timer duration persists across page reloads
- [ ] Task order persists across page reloads
- [ ] Existing tasks and links are preserved after enhancement

**Interaction Testing**:
- [ ] Theme toggle responds immediately
- [ ] Settings save with visual feedback
- [ ] Duplicate task shows notification
- [ ] Move up/down buttons work correctly
- [ ] Timer resets to configured duration
- [ ] Greeting updates with user name

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
- **Property Test Coverage**: All 17 correctness properties implemented
- **Edge Case Coverage**: All identified edge cases tested
- **Error Handling Coverage**: All error scenarios tested

### Continuous Testing

**During Development**:
- Run unit tests after each code change
- Run property tests before committing
- Verify no console errors in browser

**Before Deployment**:
- Full test suite passes (unit + property tests)
- Manual testing checklist completed
- Cross-browser testing completed
- No accessibility violations detected

