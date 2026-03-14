# Implementation Plan: Dashboard Enhancements

## Overview

This plan implements five key enhancements to the existing Browser Productivity Dashboard: light/dark mode theming, personalized greeting with custom names, customizable Pomodoro timer duration (1-120 minutes), duplicate task prevention (case-insensitive), and task sorting with move up/down controls. The implementation extends the existing vanilla JavaScript codebase while maintaining backward compatibility with existing data.

## Tasks

- [x] 1. Implement theme toggle functionality
  - [x] 1.1 Add theme state management and storage functions
    - Add `currentTheme` state variable (default 'light')
    - Implement `loadTheme()` to retrieve theme from localStorage with key 'theme'
    - Implement `saveTheme()` to persist theme to localStorage
    - Implement `applyTheme(theme)` to set `data-theme` attribute on body element
    - Handle localStorage errors gracefully with try-catch
    - _Requirements: 1.6, 1.7, 1.8, 7.1, 7.6_
  
  - [x] 1.2 Implement theme toggle control
    - Implement `toggleTheme()` to switch between 'light' and 'dark'
    - Call `applyTheme()` and `saveTheme()` after toggle
    - Add theme toggle button to HTML with id `theme-toggle`
    - Attach click event listener to theme toggle button
    - Call `loadTheme()` during initialization
    - _Requirements: 1.1, 1.2, 7.4_
  
  - [x] 1.3 Write property test for theme toggle alternation
    - **Property 1: Theme Toggle Alternation**
    - **Validates: Requirements 1.2**
  
  - [ ]* 1.4 Write property test for theme persistence round-trip
    - **Property 2: Theme Persistence Round-Trip**
    - **Validates: Requirements 1.6, 1.7**

- [x] 2. Add dark mode CSS styling
  - [x] 2.1 Define CSS custom properties for theming
    - Add CSS variables for colors in `:root` selector
    - Define light theme colors as defaults
    - Override with dark theme colors using `[data-theme="dark"]` selector
    - Ensure WCAG AA contrast ratios (minimum 4.5:1) for both themes
    - Apply theme colors to all components (greeting, timer, tasks, links, settings)
    - _Requirements: 1.3, 1.4, 1.5, 7.2, 7.6_
  
  - [x] 2.2 Add theme transition effects
    - Add CSS transition for smooth theme switching (max 300ms)
    - Apply transitions to background-color and color properties
    - _Requirements: 10.1_

- [x] 3. Checkpoint - Verify theme toggle functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement custom name in greeting
  - [x] 4.1 Add user name state and storage functions
    - Add `userName` state variable (default empty string)
    - Implement `loadUserName()` to retrieve from localStorage with key 'userName'
    - Implement `saveUserName(name)` to persist to localStorage
    - Handle localStorage errors gracefully with try-catch
    - _Requirements: 2.5, 2.6, 7.2, 7.6_
  
  - [x] 4.2 Enhance greeting display to include user name
    - Modify `updateGreeting()` function to append user name if configured
    - Format as "[Greeting], [Name]" when name exists and is not whitespace-only
    - Display greeting without name when userName is empty or whitespace-only
    - Call `loadUserName()` during initialization
    - _Requirements: 2.2, 2.3, 2.4, 2.8_
  
  - [x] 4.3 Write property test for greeting format with name
    - **Property 3: Greeting Format with Name**
    - **Validates: Requirements 2.2, 2.3**
  
  - [ ]* 4.4 Write property test for user name persistence round-trip
    - **Property 4: User Name Persistence Round-Trip**
    - **Validates: Requirements 2.5, 2.6**

- [x] 5. Create settings panel UI
  - [x] 5.1 Add settings panel HTML structure
    - Add settings panel section with id `settings-panel` to index.html
    - Add name settings: input field (id `name-input`), save button (id `save-name-btn`), success indicator (id `name-saved-indicator`)
    - Add timer settings: input field (id `timer-duration-input`), save button (id `save-timer-btn`), success indicator (id `timer-saved-indicator`), error display (id `timer-error`)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 5.2 Implement settings panel initialization
    - Implement `initSettingsPanel()` to populate input fields with current values
    - Call during application initialization
    - _Requirements: 6.6_
  
  - [x] 5.3 Implement settings event handlers
    - Implement `attachSettingsEventListeners()` for save buttons
    - Handle name save: call `saveUserName()`, update greeting, show feedback
    - Handle timer save: validate input, call `saveTimerDuration()`, reset timer, show feedback or error
    - Implement `showSettingsSavedFeedback(settingType)` to display success indicator for 2 seconds
    - Implement `showSettingsError(settingType, message)` to display error for 3 seconds
    - _Requirements: 6.5, 6.7, 10.3, 10.4_
  
  - [x] 5.4 Style settings panel
    - Add CSS for settings panel layout and visual distinction
    - Style input fields, buttons, success indicators, and error messages
    - Add hover states for interactive controls
    - _Requirements: 6.2, 7.3, 10.5_

- [x] 6. Checkpoint - Verify settings panel and name customization
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement customizable timer duration
  - [x] 7.1 Add timer duration state and storage functions
    - Add `timerDuration` state variable (default 25 minutes)
    - Implement `loadTimerDuration()` to retrieve from localStorage with key 'timerDuration'
    - Parse stored string to integer, validate range [1, 120], default to 25 if invalid
    - Implement `saveTimerDuration(minutes)` to validate and persist to localStorage
    - Return false if validation fails (outside range [1, 120])
    - Handle localStorage errors gracefully with try-catch
    - _Requirements: 3.5, 3.6, 3.7, 3.8, 7.3, 8.1, 8.2, 8.3, 8.6_
  
  - [x] 7.2 Enhance timer to use configured duration
    - Modify `initTimer()` to use `timerDuration * 60` instead of hardcoded 1500
    - Modify `resetTimer()` to use `timerDuration * 60` instead of hardcoded 1500
    - Call `loadTimerDuration()` during initialization (before `initTimer()`)
    - _Requirements: 3.3, 3.4_
  
  - [ ]* 7.3 Write property test for timer duration validation
    - **Property 5: Timer Duration Validation**
    - **Validates: Requirements 3.2, 3.8**
  
  - [ ]* 7.4 Write property test for timer uses configured duration
    - **Property 6: Timer Uses Configured Duration**
    - **Validates: Requirements 3.3, 3.4**
  
  - [ ]* 7.5 Write property test for timer duration persistence round-trip
    - **Property 7: Timer Duration Persistence Round-Trip**
    - **Validates: Requirements 3.5, 3.6, 8.1, 8.2, 8.5**
  
  - [ ]* 7.6 Write property test for timer duration parsing validation
    - **Property 15: Timer Duration Parsing Validation**
    - **Validates: Requirements 8.3, 8.6**

- [x] 8. Implement duplicate task prevention
  - [x] 8.1 Implement duplicate detection function
    - Implement `isDuplicateTask(text, excludeId = null)` function
    - Normalize text by trimming and converting to lowercase
    - Compare against all tasks (excluding task with excludeId if provided)
    - Return true if duplicate found, false otherwise
    - _Requirements: 4.1, 4.4, 4.5_
  
  - [x] 8.2 Implement duplicate notification UI
    - Implement `showDuplicateNotification()` to display temporary message
    - Create notification element with class `duplicate-notification`
    - Display message "This task already exists!" for 2 seconds
    - Add CSS styling for notification (fixed position, visible styling)
    - _Requirements: 4.3, 10.2_
  
  - [x] 8.3 Enhance addTask to prevent duplicates
    - Add duplicate check before creating new task
    - Call `showDuplicateNotification()` and return early if duplicate
    - Do not modify task list or save to localStorage if duplicate
    - _Requirements: 4.1, 4.2_
  
  - [x] 8.4 Enhance editTask to prevent duplicates
    - Add duplicate check before updating task text
    - Pass current task ID to `isDuplicateTask()` to exclude from comparison
    - Call `showDuplicateNotification()` and return early if duplicate
    - Allow edit if new text matches task's own current text
    - _Requirements: 4.6, 4.7_
  
  - [ ]* 8.5 Write property test for duplicate task detection
    - **Property 8: Duplicate Task Detection**
    - **Validates: Requirements 4.1, 4.2, 4.4**
  
  - [ ]* 8.6 Write property test for duplicate prevention on add
    - **Property 9: Duplicate Prevention on Add**
    - **Validates: Requirements 4.1, 4.2**
  
  - [ ]* 8.7 Write property test for duplicate prevention on edit
    - **Property 10: Duplicate Prevention on Edit**
    - **Validates: Requirements 4.6, 4.7**

- [x] 9. Checkpoint - Verify duplicate prevention
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement task sorting with move up/down controls
  - [x] 10.1 Implement task reordering functions
    - Implement `moveTaskUp(taskId)` to swap task with previous task
    - Return early if task is at index 0 (first position)
    - Swap array elements using destructuring: `[tasks[i-1], tasks[i]] = [tasks[i], tasks[i-1]]`
    - Call `saveTasks()` and `renderTasks()` after swap
    - Implement `moveTaskDown(taskId)` to swap task with next task
    - Return early if task is at last index
    - Swap array elements using destructuring: `[tasks[i], tasks[i+1]] = [tasks[i+1], tasks[i]]`
    - Call `saveTasks()` and `renderTasks()` after swap
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 10.2 Add move up/down buttons to task UI
    - Modify `createTaskElement()` to add move up button (text: '↑')
    - Modify `createTaskElement()` to add move down button (text: '↓')
    - Attach click event listeners to call `moveTaskUp()` and `moveTaskDown()`
    - Add buttons to task button container
    - _Requirements: 5.1, 5.2_
  
  - [x] 10.3 Style move up/down buttons
    - Add CSS for move buttons (consistent with other task buttons)
    - Add hover states for move buttons
    - Ensure buttons are accessible and visible
    - _Requirements: 7.3, 10.5_
  
  - [ ]* 10.4 Write property test for move up position change
    - **Property 11: Move Up Position Change**
    - **Validates: Requirements 5.3**
  
  - [ ]* 10.5 Write property test for move down position change
    - **Property 12: Move Down Position Change**
    - **Validates: Requirements 5.4**
  
  - [ ]* 10.6 Write property test for task order persistence round-trip
    - **Property 13: Task Order Persistence Round-Trip**
    - **Validates: Requirements 5.7, 5.8**

- [x] 11. Add visual feedback and animations
  - [x] 11.1 Add smooth animation for task reordering
    - Add CSS transition for task position changes
    - Ensure animation completes within reasonable time
    - _Requirements: 10.6_
  
  - [x] 11.2 Verify all visual feedback requirements
    - Verify theme transition is smooth (within 300ms)
    - Verify duplicate notification displays for at least 2 seconds
    - Verify settings success indicators display correctly
    - Verify error states highlight input fields
    - Verify hover states work for all new controls
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 12. Implement comprehensive settings persistence
  - [ ]* 12.1 Write property test for settings persistence round-trip
    - **Property 14: Settings Persistence Round-Trip**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
  
  - [ ]* 12.2 Write property test for default values for missing settings
    - **Property 17: Default Values for Missing Settings**
    - **Validates: Requirements 1.8, 2.4, 3.7, 7.6**

- [x] 13. Verify backward compatibility
  - [x] 13.1 Test with existing localStorage data
    - Verify existing tasks and links are preserved after enhancements
    - Verify dashboard functions correctly without new settings configured
    - Verify new settings use default values when not present
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 13.2 Write property test for initialization preserves existing data
    - **Property 16: Initialization Preserves Existing Data**
    - **Validates: Requirements 9.4**

- [x] 14. Final checkpoint and integration testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Implementation extends existing codebase incrementally
- All new features integrate with existing components
- Backward compatibility is maintained throughout
- Property tests validate universal correctness properties
- Checkpoints ensure incremental validation
