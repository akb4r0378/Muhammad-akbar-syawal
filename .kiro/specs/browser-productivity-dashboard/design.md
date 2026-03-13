# Design Document: Browser Productivity Dashboard

## Overview

The Browser Productivity Dashboard is a single-page web application built with vanilla HTML, CSS, and JavaScript. It provides four main components: a greeting display, a focus timer, a task list, and a quick links manager. All data is persisted using the browser's Local Storage API.

## Architecture

### Component Structure

```
Dashboard (Main Application)
├── GreetingDisplay
├── FocusTimer
├── TaskList
└── QuickLinks
```

### File Structure

```
/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styling
└── js/
    └── app.js          # All JavaScript logic
```

## Data Structures

### Task Object

```javascript
{
  id: string,           // Unique identifier (timestamp-based)
  text: string,         // Task description
  completed: boolean,   // Completion status
  createdAt: number     // Timestamp of creation
}
```

### Link Object

```javascript
{
  id: string,           // Unique identifier (timestamp-based)
  name: string,         // Display name
  url: string          // Target URL
}
```

### Local Storage Keys

- `tasks`: JSON array of Task objects
- `links`: JSON array of Link objects

## Component Designs

### 1. GreetingDisplay Component

**Purpose**: Display current time, date, and time-based greeting

**State**: None (stateless, updates from system time)

**Functions**:

```javascript
function updateGreeting()
  // Updates the greeting display with current time and date
  // Called every second via setInterval
  
  currentTime = getCurrentTime()
  currentDate = getCurrentDate()
  greeting = getGreetingMessage(currentTime)
  
  updateDOM(currentTime, currentDate, greeting)
```

```javascript
function getGreetingMessage(hour)
  // Returns appropriate greeting based on hour (0-23)
  
  if hour >= 5 and hour < 12:
    return "Good Morning"
  else if hour >= 12 and hour < 17:
    return "Good Afternoon"
  else if hour >= 17 and hour < 21:
    return "Good Evening"
  else:
    return "Good Night"
```

**DOM Elements**:
- `#time-display`: Shows current time
- `#date-display`: Shows current date
- `#greeting-message`: Shows greeting text

### 2. FocusTimer Component

**Purpose**: 25-minute countdown timer for focus sessions

**State**:
- `timeRemaining`: number (seconds remaining)
- `isRunning`: boolean (timer active status)
- `intervalId`: number (setInterval reference)

**Functions**:

```javascript
function initTimer()
  // Initialize timer state
  timeRemaining = 1500  // 25 minutes in seconds
  isRunning = false
  intervalId = null
  updateTimerDisplay()
```

```javascript
function startTimer()
  // Start or resume the countdown
  
  if isRunning:
    return
  
  isRunning = true
  intervalId = setInterval(tick, 1000)
```

```javascript
function stopTimer()
  // Pause the countdown
  
  if not isRunning:
    return
  
  isRunning = false
  clearInterval(intervalId)
```

```javascript
function resetTimer()
  // Reset timer to 25 minutes
  
  stopTimer()
  timeRemaining = 1500
  updateTimerDisplay()
```

```javascript
function tick()
  // Decrement timer by one second
  
  if timeRemaining > 0:
    timeRemaining = timeRemaining - 1
    updateTimerDisplay()
  else:
    stopTimer()
```

```javascript
function formatTime(seconds)
  // Convert seconds to MM:SS format
  
  minutes = floor(seconds / 60)
  remainingSeconds = seconds % 60
  return padZero(minutes) + ":" + padZero(remainingSeconds)
```

**DOM Elements**:
- `#timer-display`: Shows time in MM:SS format
- `#start-btn`: Start button
- `#stop-btn`: Stop button
- `#reset-btn`: Reset button

### 3. TaskList Component

**Purpose**: Manage to-do list with CRUD operations

**State**:
- `tasks`: Array of Task objects

**Functions**:

```javascript
function loadTasks()
  // Load tasks from Local Storage on initialization
  
  storedTasks = localStorage.getItem('tasks')
  if storedTasks:
    tasks = JSON.parse(storedTasks)
  else:
    tasks = []
  
  renderTasks()
```

```javascript
function saveTasks()
  // Persist tasks to Local Storage
  
  localStorage.setItem('tasks', JSON.stringify(tasks))
```

```javascript
function addTask(text)
  // Create new task
  
  if text.trim() is empty:
    return
  
  newTask = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  }
  
  tasks.push(newTask)
  saveTasks()
  renderTasks()
```

```javascript
function toggleTask(taskId)
  // Toggle completion status
  
  task = findTaskById(taskId)
  if task:
    task.completed = not task.completed
    saveTasks()
    renderTasks()
```

```javascript
function editTask(taskId, newText)
  // Update task text
  
  if newText.trim() is empty:
    return
  
  task = findTaskById(taskId)
  if task:
    task.text = newText.trim()
    saveTasks()
    renderTasks()
```

```javascript
function deleteTask(taskId)
  // Remove task from list
  
  tasks = tasks.filter(task => task.id !== taskId)
  saveTasks()
  renderTasks()
```

```javascript
function renderTasks()
  // Update DOM with current tasks
  
  container = document.getElementById('task-list')
  container.innerHTML = ''
  
  for each task in tasks:
    taskElement = createTaskElement(task)
    container.appendChild(taskElement)
```

**DOM Elements**:
- `#task-input`: Input field for new tasks
- `#add-task-btn`: Add task button
- `#task-list`: Container for task items

### 4. QuickLinks Component

**Purpose**: Manage and display quick access links

**State**:
- `links`: Array of Link objects

**Functions**:

```javascript
function loadLinks()
  // Load links from Local Storage on initialization
  
  storedLinks = localStorage.getItem('links')
  if storedLinks:
    links = JSON.parse(storedLinks)
  else:
    links = []
  
  renderLinks()
```

```javascript
function saveLinks()
  // Persist links to Local Storage
  
  localStorage.setItem('links', JSON.stringify(links))
```

```javascript
function addLink(name, url)
  // Create new link
  
  if name.trim() is empty or url.trim() is empty:
    return
  
  newLink = {
    id: generateId(),
    name: name.trim(),
    url: url.trim()
  }
  
  links.push(newLink)
  saveLinks()
  renderLinks()
```

```javascript
function deleteLink(linkId)
  // Remove link from list
  
  links = links.filter(link => link.id !== linkId)
  saveLinks()
  renderLinks()
```

```javascript
function openLink(url)
  // Open URL in new tab
  
  window.open(url, '_blank')
```

```javascript
function renderLinks()
  // Update DOM with current links
  
  container = document.getElementById('links-container')
  container.innerHTML = ''
  
  for each link in links:
    linkElement = createLinkElement(link)
    container.appendChild(linkElement)
```

**DOM Elements**:
- `#link-name-input`: Input field for link name
- `#link-url-input`: Input field for link URL
- `#add-link-btn`: Add link button
- `#links-container`: Container for link buttons

## Utility Functions

```javascript
function generateId()
  // Generate unique ID using timestamp and random number
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
```

```javascript
function padZero(num)
  // Pad single digit numbers with leading zero
  return num < 10 ? '0' + num : num.toString()
```

## Initialization Flow

```javascript
function init()
  // Initialize application on page load
  
  // Initialize greeting display
  updateGreeting()
  setInterval(updateGreeting, 1000)
  
  // Initialize focus timer
  initTimer()
  attachTimerEventListeners()
  
  // Initialize task list
  loadTasks()
  attachTaskEventListeners()
  
  // Initialize quick links
  loadLinks()
  attachLinkEventListeners()
```

## Event Handling

### Timer Events
- Click on `#start-btn` → `startTimer()`
- Click on `#stop-btn` → `stopTimer()`
- Click on `#reset-btn` → `resetTimer()`

### Task Events
- Click on `#add-task-btn` → `addTask(inputValue)`
- Enter key in `#task-input` → `addTask(inputValue)`
- Click on task complete button → `toggleTask(taskId)`
- Click on task edit button → Enable edit mode, save on blur
- Click on task delete button → `deleteTask(taskId)`

### Link Events
- Click on `#add-link-btn` → `addLink(name, url)`
- Click on link button → `openLink(url)`
- Click on link delete button → `deleteLink(linkId)`

## Styling Approach

### Layout
- Use CSS Flexbox for component layout
- Center-aligned container with max-width for desktop
- Vertical stacking of components with consistent spacing

### Visual Design
- Clean, minimal aesthetic
- Sufficient contrast for readability
- Hover states for interactive elements
- Visual distinction for completed tasks

### Responsive Behavior
- Single-column layout
- No horizontal scrolling on desktop
- Readable font sizes (minimum 14px for body text)

## Correctness Properties

### Property 1: Greeting Time Accuracy
**For all times t, the greeting message corresponds to the correct time range**

Formal: ∀t ∈ [0, 23], getGreetingMessage(t) returns:
- "Good Morning" if 5 ≤ t < 12
- "Good Afternoon" if 12 ≤ t < 17
- "Good Evening" if 17 ≤ t < 21
- "Good Night" otherwise

_Validates: Requirements 1.3, 1.4, 1.5, 1.6_

### Property 2: Timer Non-Negative
**The timer never displays negative time**

Formal: ∀ states s, timeRemaining(s) ≥ 0

_Validates: Requirements 2.6_

### Property 3: Timer Format Consistency
**Timer display is always in MM:SS format with zero-padding**

Formal: ∀ seconds s where 0 ≤ s ≤ 1500, formatTime(s) matches /^\d{2}:\d{2}$/

_Validates: Requirements 2.7_

### Property 4: Task Persistence Consistency
**Tasks in Local Storage always match tasks in memory after any operation**

Formal: ∀ operations op ∈ {add, toggle, edit, delete}, 
after op: JSON.parse(localStorage.getItem('tasks')) ≡ tasks

_Validates: Requirements 4.1, 4.2, 4.3_

### Property 5: Task ID Uniqueness
**All task IDs are unique within the task list**

Formal: ∀ tasks t1, t2 where t1 ≠ t2, t1.id ≠ t2.id

_Validates: Requirements 3.1, 3.2, 3.3, 3.4_

### Property 6: Empty Task Prevention
**No task with empty or whitespace-only text can be created**

Formal: ∀ tasks t, t.text.trim().length > 0

_Validates: Requirements 3.7_

### Property 7: Link Persistence Consistency
**Links in Local Storage always match links in memory after any operation**

Formal: ∀ operations op ∈ {add, delete}, 
after op: JSON.parse(localStorage.getItem('links')) ≡ links

_Validates: Requirements 6.1, 6.2_

### Property 8: Link ID Uniqueness
**All link IDs are unique within the link list**

Formal: ∀ links l1, l2 where l1 ≠ l2, l1.id ≠ l2.id

_Validates: Requirements 5.1, 5.3_

### Property 9: Empty Link Prevention
**No link with empty name or URL can be created**

Formal: ∀ links l, l.name.trim().length > 0 ∧ l.url.trim().length > 0

_Validates: Requirements 5.5, 5.6_

### Property 10: Load-Save Round Trip
**Data loaded from Local Storage and then saved remains unchanged**

Formal: ∀ data d stored in localStorage,
let loaded = JSON.parse(localStorage.getItem(key))
let saved = JSON.stringify(loaded)
then: saved ≡ d

_Validates: Requirements 4.4, 4.5, 6.3, 6.4_

## Error Handling

### Local Storage Errors
- Wrap localStorage operations in try-catch blocks
- Handle quota exceeded errors gracefully
- Provide fallback to in-memory storage if localStorage unavailable

### Input Validation
- Trim whitespace from all user inputs
- Prevent empty task/link creation
- Validate URL format (basic check for non-empty string)

### Timer Edge Cases
- Prevent multiple simultaneous intervals
- Handle timer at zero correctly
- Ensure stop/reset work in all states

## Performance Considerations

### DOM Updates
- Batch DOM updates where possible
- Use DocumentFragment for multiple insertions
- Minimize reflows by updating classes rather than inline styles

### Local Storage
- Perform localStorage operations asynchronously where possible
- Keep stored data minimal (no unnecessary fields)
- Use efficient JSON serialization

### Timer Accuracy
- Use setInterval with 1-second precision (sufficient for this use case)
- Clear intervals properly to prevent memory leaks

## Browser Compatibility

### Required APIs
- Local Storage API (supported in all modern browsers)
- Date object (standard JavaScript)
- setInterval/clearInterval (standard JavaScript)
- DOM manipulation methods (standard)

### No Dependencies
- No external libraries required
- No build process needed
- Works as static files served from any web server

## Testing Strategy

### Unit Testing Approach
- Test utility functions (generateId, padZero, formatTime)
- Test greeting logic with various hours
- Test timer state transitions
- Test task/link CRUD operations

### Property-Based Testing
- Test greeting correctness for all 24 hours
- Test timer format for all values 0-1500
- Test persistence round-trip with various data
- Test ID uniqueness with multiple operations

### Manual Testing
- Visual inspection of UI layout
- Cross-browser testing (Chrome, Firefox, Edge, Safari)
- Local Storage persistence across page reloads
- Timer accuracy over extended periods

## Future Enhancements (Out of Scope)

- Custom timer durations
- Task categories or tags
- Task due dates
- Link favicons
- Dark mode toggle
- Export/import data
- Keyboard shortcuts
- Notifications when timer completes
