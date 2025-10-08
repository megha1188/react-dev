// Type definition for a task's status
type TaskStatus = 'Running' | 'Succeeded' | 'Failed';

// Interface for a task object (though we'll be writing to the DOM directly)
interface Task {
    id: string;
    name: string;
    status: TaskStatus;
    log: string;
}

const sidebar = document.getElementById('sidebar')!;
const terminal = document.getElementById('terminal')!;
let taskIdCounter = 0;

/**
 * Handles clicks on the script buttons in the sidebar.
 */
sidebar.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
        const scriptName = target.dataset.script;
        if (scriptName) {
            runScript(scriptName);
        }
    }
});

/**
 * Creates and executes a script simulation.
 * @param scriptName The name of the script to run.
 */
function runScript(scriptName: string): void {
    const taskId = `task-${taskIdCounter++}`;
    const task: Task = {
        id: taskId,
        name: scriptName,
        status: 'Running',
        log: '',
    };

    // 1. Create the initial task element and add it to the terminal
    createTaskElement(task);

    // 2. Simulate script execution
    simulateScript(task);
}

/**
 * Creates the DOM elements for a new task and appends them to the terminal.
 * @param task The task object.
 */
function createTaskElement(task: Task): void {
    const taskElement = document.createElement('div');
    taskElement.id = task.id;
    taskElement.className = 'task task-running';

    taskElement.innerHTML = `
        <div class="task-header">
            <span class="task-name">${task.name}</span>
            <span class="task-status">🟡 Running</span>
        </div>
        <div class="task-output">
            <pre></pre>
        </div>
    `;

    terminal.appendChild(taskElement);
    // Scroll to the bottom to show the new task
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * Simulates the execution of a script and updates the UI upon completion.
 * @param task The task to simulate.
 */
function simulateScript(task: Task): void {
    const { id, name } = task;
    let duration = 2000;
    let willFail = false;
    let initialLog = '';

    switch (name) {
        case 'test':
            duration = 2000;
            break;
        case 'lint':
            duration = 3000;
            break;
        case 'build':
            duration = 5000;
            initialLog = 'Build process started...\n';
            break;
        case 'deploy':
            duration = 6000;
            willFail = Math.random() < 0.5;
            break;
        case 'stress-test':
            duration = 4000;
            // Handle the stress test logging separately
            runStressTest(id);
            break;
    }

    // Set initial log for scripts that have one
    if (initialLog) {
        const taskElement = document.getElementById(id)!;
        const logElement = taskElement.querySelector('.task-output pre')!;
        logElement.innerHTML = initialLog;
    }

    // Don't run the final update for the stress test here, as it has its own logic
    if (name === 'stress-test') {
        setTimeout(() => {
            updateTaskStatus(id, 'Succeeded', '');
        }, duration);
        return;
    }

    setTimeout(() => {
        const finalStatus: TaskStatus = willFail ? 'Failed' : 'Succeeded';
        const finalLog = willFail ? 'Deployment failed.' : `Script '${name}' finished.`;
        updateTaskStatus(id, finalStatus, finalLog);
    }, duration);
}

/**
 * Handles the special case for the stress test to demonstrate inefficient DOM updates.
 * @param taskId The ID of the stress test task.
 */
function runStressTest(taskId: string): void {
    const taskElement = document.getElementById(taskId)!;
    const logElement = taskElement.querySelector('.task-output pre')!;
    let logContent = '';

    for (let i = 1; i <= 5000; i++) {
        // Inefficiently update innerHTML in a loop
        logContent += `Generating log line ${i}...\n`;
        logElement.innerHTML = logContent;
    }
}

/**
 * Finds a task's DOM element by its ID and updates its status and log output.
 * @param taskId The ID of the task to update.
 * @param status The new status.
 * @param log The final log message to append.
 */
function updateTaskStatus(taskId: string, status: TaskStatus, log: string): void {
    const taskElement = document.getElementById(taskId);
    if (!taskElement) return;

    const statusElement = taskElement.querySelector('.task-status')!;
    const logElement = taskElement.querySelector('.task-output pre')!;

    let statusText = '';
    let statusClass = '';

    switch (status) {
        case 'Succeeded':
            statusText = '✅ Succeeded';
            statusClass = 'task-succeeded';
            break;
        case 'Failed':
            statusText = '❌ Failed';
            statusClass = 'task-failed';
            break;
        case 'Running':
            // This case is handled on creation, but included for completeness
            statusText = '🟡 Running';
            statusClass = 'task-running';
            break;
    }

    // Update class and text
    taskElement.className = `task ${statusClass}`;
    statusElement.textContent = statusText;

    // Append final log message
    if (log) {
        logElement.innerHTML += log;
    }
    
    // Scroll the log to the bottom
    const outputContainer = taskElement.querySelector('.task-output')!;
    outputContainer.scrollTop = outputContainer.scrollHeight;
}
