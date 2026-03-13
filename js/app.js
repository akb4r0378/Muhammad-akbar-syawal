// Browser Productivity Dashboard - Main Application Logic

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
  
  // Update DOM
  document.getElementById('time-display').textContent = timeString;
  document.getElementById('date-display').textContent = dateString;
  document.getElementById('greeting-message').textContent = greeting;
}

// ============================================================================
// FocusTimer Component
// ============================================================================

// Timer state
let timeRemaining = 1500; // 25 minutes in seconds
let isRunning = false;
let intervalId = null;

/**
 * Initialize timer state and display
 */
function initTimer() {
  timeRemaining = 1500;
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
}

/**
 * Reset timer to 25 minutes
 */
function resetTimer() {
  stopTimer();
  timeRemaining = 1500;
  updateTimerDisplay();
}

/**
 * Decrement timer by one second
 */
function tick() {
  if (timeRemaining > 0) {
    timeRemaining = timeRemaining - 1;
    updateTimerDisplay();
  } else {
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

/**
 * Save tasks to Local Storage
 */
function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage:', e);
  }
}

/**
 * Load tasks from Local Storage
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
    console.error('Failed to load tasks from localStorage:', e);
    tasks = [];
  }
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
  });
  
  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id);
    renderTasks();
  });
  
  // Assemble the task element
  buttonContainer.appendChild(completeBtn);
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);
  
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
// Initialization
// ============================================================================

/**
 * Initialize application on page load
 */
function init() {
  // Initialize greeting display
  updateGreeting();
  setInterval(updateGreeting, 1000);
  
  // Initialize focus timer
  initTimer();
  attachTimerEventListeners();
  
  // Initialize task list
  loadTasks();
  renderTasks();
  attachTaskEventListeners();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
