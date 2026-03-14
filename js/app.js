// Browser Productivity Dashboard - Main Application Logic

// ============================================================================
// Theme Management
// ============================================================================

// Theme state
let currentTheme = 'light';

/**
 * Load theme preference from Local Storage
 */
function loadTheme() {
  try {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      currentTheme = storedTheme;
    } else {
      currentTheme = 'light';
    }
  } catch (e) {
    console.error('Failed to load theme from localStorage:', e);
    currentTheme = 'light';
  }
  
  applyTheme(currentTheme);
}

/**
 * Save theme preference to Local Storage
 */
function saveTheme() {
  try {
    localStorage.setItem('theme', currentTheme);
  } catch (e) {
    console.error('Failed to save theme to localStorage:', e);
  }
}

/**
 * Apply theme by setting data-theme attribute on body element
 * @param {string} theme - Theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
  applyTheme(currentTheme);
  saveTheme();
}

/**
 * Attach event listener to theme toggle button
 */
function attachThemeEventListener() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate unique ID using timestamp and random number
 * @returns {string} Unique identifier
 */
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 11);
}

/**
 * Pad single digit numbers with leading zero
 * @param {number} num - Number to pad
 * @returns {string} Zero-padded string
 */
function padZero(num) {
  return num < 10 ? '0' + num : num.toString();
}

/**
 * Convert seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return padZero(minutes) + ':' + padZero(remainingSeconds);
}

// ============================================================================
// GreetingDisplay Component
// ============================================================================

// User name state
let userName = '';

/**
 * Load user name from Local Storage
 */
function loadUserName() {
  try {
    const storedName = localStorage.getItem('userName');
    userName = storedName || '';
  } catch (e) {
    console.error('Failed to load user name from localStorage:', e);
    userName = '';
  }
}

/**
 * Save user name to Local Storage
 * @param {string} name - User's custom name
 */
function saveUserName(name) {
  try {
    localStorage.setItem('userName', name);
    userName = name;
  } catch (e) {
    console.error('Failed to save user name to localStorage:', e);
  }
}

/**
 * Get appropriate greeting message based on hour of day
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @returns {string} Greeting message
 */
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

/**
 * Update greeting display with current time, date, and greeting
 */
function updateGreeting() {
  const now = new Date();
  
  // Format time in 12-hour format with AM/PM
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  const timeString = hours + ':' + padZero(minutes) + ':' + padZero(seconds) + ' ' + ampm;
  
  // Format date in readable format
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString('en-US', options);
  
  // Get greeting message
  const greeting = getGreetingMessage(now.getHours());
  
  // Append user name if configured
  let fullGreeting = greeting;
  if (userName && userName.trim().length > 0) {
    fullGreeting = greeting + ', ' + userName;
  }
  
  // Update DOM
  document.getElementById('time-display').textContent = timeString;
  document.getElementById('date-display').textContent = dateString;
  document.getElementById('greeting-message').textContent = fullGreeting;
}

// ============================================================================
// FocusTimer Component
// ============================================================================

// Timer state
let timeRemaining = 1500; // 25 minutes in seconds
let isRunning = false;
let intervalId = null;
let timerDuration = 25; // Timer duration in minutes (default 25)

/**
 * Load timer duration from Local Storage
 */
function loadTimerDuration() {
  try {
    const storedDuration = localStorage.getItem('timerDuration');
    if (storedDuration) {
      const parsed = parseInt(storedDuration, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 120) {
        timerDuration = parsed;
      } else {
        timerDuration = 25;
      }
    } else {
      timerDuration = 25;
    }
  } catch (e) {
    console.error('Failed to load timer duration from localStorage:', e);
    timerDuration = 25;
  }
}

/**
 * Save timer duration to Local Storage
 * @param {number} minutes - Timer duration in minutes
 * @returns {boolean} True if saved successfully, false if validation fails
 */
function saveTimerDuration(minutes) {
  // Validate range: 1-120 minutes
  if (minutes < 1 || minutes > 120) {
    return false;
  }
  
  try {
    localStorage.setItem('timerDuration', minutes.toString());
    timerDuration = minutes;
    return true;
  } catch (e) {
    console.error('Failed to save timer duration to localStorage:', e);
    return false;
  }
}

/**
 * Initialize timer state and display
 */
function initTimer() {
  timeRemaining = timerDuration * 60; // Convert minutes to seconds
  isRunning = false;
  intervalId = null;
  updateTimerDisplay();
}

/**
 * Update timer display with current time remaining
 */
function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  display.textContent = formatTime(timeRemaining);
}

/**
 * Start or resume the countdown timer
 */
function startTimer() {
  if (isRunning) {
    return;
  }
  
  // If timer is at zero, don't start
  if (timeRemaining <= 0) {
    return;
  }
  
  isRunning = true;
  intervalId = setInterval(tick, 1000);
}

/**
 * Pause the countdown timer
 */
function stopTimer() {
  if (!isRunning) {
    return;
  }
  
  isRunning = false;
  clearInterval(intervalId);
  intervalId = null;
}

/**
 * Reset timer to configured duration
 */
function resetTimer() {
  stopTimer();
  timeRemaining = timerDuration * 60; // Convert minutes to seconds
  updateTimerDisplay();
}

/**
 * Decrement timer by one second
 */
function tick() {
  if (timeRemaining > 0) {
    timeRemaining = timeRemaining - 1;
    updateTimerDisplay();
  }
  
  // Stop timer when it reaches zero
  if (timeRemaining <= 0) {
    timeRemaining = 0; // Ensure it never goes negative
    updateTimerDisplay();
    stopTimer();
  }
}

/**
 * Attach event listeners to timer control buttons
 */
function attachTimerEventListeners() {
  document.getElementById('start-btn').addEventListener('click', startTimer);
  document.getElementById('stop-btn').addEventListener('click', stopTimer);
  document.getElementById('reset-btn').addEventListener('click', resetTimer);
}

// ============================================================================
// TaskList Component
// ============================================================================

// Task state
let tasks = [];
let localStorageAvailable = true;

/**
 * Save tasks to Local Storage with error handling
 */
function saveTasks() {
  if (!localStorageAvailable) {
    // Fallback: data persists in memory only for this session
    return;
  }
  
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Tasks will only persist in memory for this session.');
      localStorageAvailable = false;
    } else if (e.name === 'SecurityError') {
      console.error('localStorage access denied. Tasks will only persist in memory for this session.');
      localStorageAvailable = false;
    } else {
      console.error('Failed to save tasks to localStorage:', e);
      localStorageAvailable = false;
    }
  }
}

/**
 * Load tasks from Local Storage with error handling
 */
function loadTasks() {
  try {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    } else {
      tasks = [];
    }
  } catch (e) {
    if (e.name === 'SecurityError') {
      console.error('localStorage access denied. Starting with empty task list.');
      localStorageAvailable = false;
    } else {
      console.error('Failed to load tasks from localStorage:', e);
    }
    tasks = [];
  }
}

/**
 * Check if task text already exists (case-insensitive)
 * @param {string} text - Task text to check
 * @param {string|null} excludeId - Optional task ID to exclude from check
 * @returns {boolean} True if duplicate found, false otherwise
 */
function isDuplicateTask(text, excludeId = null) {
  const normalizedText = text.trim().toLowerCase();
  
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task.id !== excludeId) {
      if (task.text.trim().toLowerCase() === normalizedText) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Display temporary notification about duplicate task
 */
function showDuplicateNotification() {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'duplicate-notification';
  notification.textContent = 'This task already exists!';
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

/**
 * Add a new task to the task list
 * @param {string} text - Task description
 */
function addTask(text) {
  // Prevent empty task creation
  if (!text || text.trim().length === 0) {
    return;
  }
  
  // Check for duplicates
  if (isDuplicateTask(text)) {
    showDuplicateNotification();
    return;
  }
  
  const newTask = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  };
  
  tasks.push(newTask);
  saveTasks();
}

/**
 * Find a task by its ID
 * @param {string} taskId - Task identifier
 * @returns {object|undefined} Task object or undefined if not found
 */
function findTaskById(taskId) {
  return tasks.find(task => task.id === taskId);
}

/**
 * Toggle task completion status
 * @param {string} taskId - Task identifier
 */
function toggleTask(taskId) {
  const task = findTaskById(taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
  }
}

/**
 * Edit task text
 * @param {string} taskId - Task identifier
 * @param {string} newText - New task description
 */
function editTask(taskId, newText) {
  // Prevent empty task text
  if (!newText || newText.trim().length === 0) {
    return;
  }
  
  // Check for duplicates (excluding current task)
  if (isDuplicateTask(newText, taskId)) {
    showDuplicateNotification();
    return;
  }
  
  const task = findTaskById(taskId);
  if (task) {
    task.text = newText.trim();
    saveTasks();
  }
}

/**
 * Delete a task from the task list
 * @param {string} taskId - Task identifier
 */
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
}

/**
 * Move task up one position in the list
 * @param {string} taskId - Task identifier
 */
function moveTaskUp(taskId) {
  const index = tasks.findIndex(task => task.id === taskId);
  
  // Return early if task is at index 0 (first position) or not found
  if (index <= 0) {
    return;
  }
  
  // Swap array elements using destructuring
  [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
  
  saveTasks();
  renderTasks();
}

/**
 * Move task down one position in the list
 * @param {string} taskId - Task identifier
 */
function moveTaskDown(taskId) {
  const index = tasks.findIndex(task => task.id === taskId);
  
  // Return early if task is at last index or not found
  if (index < 0 || index >= tasks.length - 1) {
    return;
  }
  
  // Swap array elements using destructuring
  [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
  
  saveTasks();
  renderTasks();
}

/**
 * Create a DOM element for a single task
 * @param {object} task - Task object
 * @returns {HTMLElement} Task list item element
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.taskId = task.id;
  
  // Apply completed class if task is completed
  if (task.completed) {
    li.classList.add('completed');
  }
  
  // Create task text span
  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = task.text;
  
  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'task-buttons';
  
  // Create complete button
  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
  completeBtn.addEventListener('click', () => {
    toggleTask(task.id);
    renderTasks();
  });
  
  // Create edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    // Enable edit mode
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = task.text;
    
    // Replace text span with input
    li.replaceChild(input, textSpan);
    input.focus();
    
    // Save on blur
    input.addEventListener('blur', () => {
      const newText = input.value;
      editTask(task.id, newText);
      renderTasks();
    });
    
    // Save on Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
    
    // Cancel on Escape key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        renderTasks(); // Re-render without saving
      }
    });
  });
  
  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id);
    renderTasks();
  });
  
  // Create move up button
  const moveUpBtn = document.createElement('button');
  moveUpBtn.className = 'move-up-btn';
  moveUpBtn.textContent = '↑';
  moveUpBtn.addEventListener('click', () => {
    moveTaskUp(task.id);
  });
  
  // Create move down button
  const moveDownBtn = document.createElement('button');
  moveDownBtn.className = 'move-down-btn';
  moveDownBtn.textContent = '↓';
  moveDownBtn.addEventListener('click', () => {
    moveTaskDown(task.id);
  });
  
  // Assemble the task element
  buttonContainer.appendChild(completeBtn);
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);
  buttonContainer.appendChild(moveUpBtn);
  buttonContainer.appendChild(moveDownBtn);
  
  li.appendChild(textSpan);
  li.appendChild(buttonContainer);
  
  return li;
}

/**
 * Update DOM with current tasks
 */
function renderTasks() {
  const container = document.getElementById('task-list');
  container.innerHTML = '';
  
  // Render tasks in creation order (order they appear in array)
  for (let i = 0; i < tasks.length; i++) {
    const taskElement = createTaskElement(tasks[i]);
    container.appendChild(taskElement);
  }
}

/**
 * Attach event listeners to task input and add button
 */
function attachTaskEventListeners() {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  
  // Add task on button click
  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value;
    addTask(text);
    renderTasks();
    taskInput.value = ''; // Clear input after adding
  });
  
  // Add task on Enter key
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = taskInput.value;
      addTask(text);
      renderTasks();
      taskInput.value = ''; // Clear input after adding
    }
  });
}

// ============================================================================
// QuickLinks Component
// ============================================================================

// Links state
let links = [];
let linksStorageAvailable = true;

/**
 * Save links to Local Storage with error handling
 */
function saveLinks() {
  if (!linksStorageAvailable) {
    // Fallback: data persists in memory only for this session
    return;
  }
  
  try {
    localStorage.setItem('links', JSON.stringify(links));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Links will only persist in memory for this session.');
      linksStorageAvailable = false;
    } else if (e.name === 'SecurityError') {
      console.error('localStorage access denied. Links will only persist in memory for this session.');
      linksStorageAvailable = false;
    } else {
      console.error('Failed to save links to localStorage:', e);
      linksStorageAvailable = false;
    }
  }
}

/**
 * Load links from Local Storage with error handling
 */
function loadLinks() {
  try {
    const storedLinks = localStorage.getItem('links');
    if (storedLinks) {
      links = JSON.parse(storedLinks);
    } else {
      links = [];
    }
  } catch (e) {
    if (e.name === 'SecurityError') {
      console.error('localStorage access denied. Starting with empty links list.');
      linksStorageAvailable = false;
    } else {
      console.error('Failed to load links from localStorage:', e);
    }
    links = [];
  }
}

/**
 * Add a new link to the quick links list
 * @param {string} name - Link display name
 * @param {string} url - Link URL
 */
function addLink(name, url) {
  // Prevent empty name or URL
  if (!name || name.trim().length === 0 || !url || url.trim().length === 0) {
    return;
  }
  
  const newLink = {
    id: generateId(),
    name: name.trim(),
    url: url.trim()
  };
  
  links.push(newLink);
  saveLinks();
}

/**
 * Delete a link from the quick links list
 * @param {string} linkId - Link identifier
 */
function deleteLink(linkId) {
  links = links.filter(link => link.id !== linkId);
  saveLinks();
}

/**
 * Open a URL in a new browser tab
 * @param {string} url - URL to open
 */
function openLink(url) {
  window.open(url, '_blank');
}

/**
 * Create a DOM element for a single link
 * @param {object} link - Link object
 * @returns {HTMLElement} Link button element
 */
function createLinkElement(link) {
  const linkButton = document.createElement('button');
  linkButton.className = 'link-button';
  linkButton.textContent = link.name;
  
  // Open link on click
  linkButton.addEventListener('click', () => {
    openLink(link.url);
  });
  
  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'link-delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent opening link when deleting
    deleteLink(link.id);
    renderLinks();
  });
  
  // Create wrapper for link button and delete button
  const wrapper = document.createElement('div');
  wrapper.className = 'link-item';
  wrapper.appendChild(linkButton);
  wrapper.appendChild(deleteBtn);
  
  return wrapper;
}

/**
 * Update DOM with current links
 */
function renderLinks() {
  const container = document.getElementById('links-container');
  container.innerHTML = '';
  
  // Render links in creation order
  for (let i = 0; i < links.length; i++) {
    const linkElement = createLinkElement(links[i]);
    container.appendChild(linkElement);
  }
}

/**
 * Attach event listeners to link input and add button
 */
function attachLinkEventListeners() {
  const linkNameInput = document.getElementById('link-name-input');
  const linkUrlInput = document.getElementById('link-url-input');
  const addLinkBtn = document.getElementById('add-link-btn');
  
  // Add link on button click
  addLinkBtn.addEventListener('click', () => {
    const name = linkNameInput.value;
    const url = linkUrlInput.value;
    addLink(name, url);
    renderLinks();
    linkNameInput.value = ''; // Clear inputs after adding
    linkUrlInput.value = '';
  });
  
  // Add link on Enter key in either input field
  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      const name = linkNameInput.value;
      const url = linkUrlInput.value;
      addLink(name, url);
      renderLinks();
      linkNameInput.value = ''; // Clear inputs after adding
      linkUrlInput.value = '';
    }
  };
  
  linkNameInput.addEventListener('keypress', handleEnterKey);
  linkUrlInput.addEventListener('keypress', handleEnterKey);
}

// ============================================================================
// SettingsPanel Component
// ============================================================================

/**
 * Initialize settings panel with current values
 */
function initSettingsPanel() {
  // Populate input fields with current values
  const nameInput = document.getElementById('name-input');
  const timerInput = document.getElementById('timer-duration-input');
  
  if (nameInput) {
    nameInput.value = userName || '';
  }
  
  if (timerInput) {
    timerInput.value = timerDuration;
  }
  
  // Attach event listeners
  attachSettingsEventListeners();
}

/**
 * Attach event listeners to settings controls
 */
function attachSettingsEventListeners() {
  // Name settings
  const saveNameBtn = document.getElementById('save-name-btn');
  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('name-input');
      const newName = nameInput.value;
      saveUserName(newName);
      updateGreeting();
      showSettingsSavedFeedback('name');
    });
  }
  
  // Timer duration settings
  const saveTimerBtn = document.getElementById('save-timer-btn');
  if (saveTimerBtn) {
    saveTimerBtn.addEventListener('click', () => {
      const timerInput = document.getElementById('timer-duration-input');
      const newDuration = parseInt(timerInput.value, 10);
      
      // Validate input
      if (isNaN(newDuration)) {
        showSettingsError('timer', 'Duration must be a number');
        return;
      }
      
      if (newDuration < 1 || newDuration > 120) {
        showSettingsError('timer', 'Duration must be between 1 and 120 minutes');
        return;
      }
      
      // Save timer duration
      const success = saveTimerDuration(newDuration);
      if (success) {
        resetTimer(); // Apply new duration
        showSettingsSavedFeedback('timer');
      } else {
        showSettingsError('timer', 'Failed to save timer duration');
      }
    });
  }
}

/**
 * Display success indicator for saved setting
 * @param {string} settingType - Type of setting ('name' or 'timer')
 */
function showSettingsSavedFeedback(settingType) {
  const indicator = document.getElementById(settingType + '-saved-indicator');
  if (indicator) {
    indicator.classList.add('show');
    
    setTimeout(() => {
      indicator.classList.remove('show');
    }, 2000);
  }
}

/**
 * Display error message for invalid setting
 * @param {string} settingType - Type of setting ('name' or 'timer')
 * @param {string} message - Error message to display
 */
function showSettingsError(settingType, message) {
  const errorElement = document.getElementById(settingType + '-error');
  // Determine correct input element ID based on setting type
  const inputId = settingType === 'timer' ? 'timer-duration-input' : settingType + '-input';
  const inputElement = document.getElementById(inputId);
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
  
  if (inputElement) {
    inputElement.classList.add('error');
  }
  
  setTimeout(() => {
    if (errorElement) {
      errorElement.classList.remove('show');
    }
    if (inputElement) {
      inputElement.classList.remove('error');
    }
  }, 3000);
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize application on page load
 */
function init() {
  // Initialize theme
  loadTheme();
  attachThemeEventListener();
  
  // Initialize greeting display
  loadUserName();
  updateGreeting();
  setInterval(updateGreeting, 1000);
  
  // Initialize focus timer
  loadTimerDuration(); // Load timer duration before initializing timer
  initTimer();
  attachTimerEventListeners();
  
  // Initialize task list
  loadTasks();
  renderTasks();
  attachTaskEventListeners();
  
  // Initialize quick links
  loadLinks();
  renderLinks();
  attachLinkEventListeners();
  
  // Initialize settings panel
  initSettingsPanel();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
