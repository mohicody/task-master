// Task Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateEmptyState();
}

function updateEmptyState() {
    const emptyState = document.getElementById('emptyState');
    emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
}

// Event Listeners
document.getElementById('addTaskBtn').addEventListener('click', addNewTask);
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addNewTask();
});

// Filter buttons
document.querySelectorAll('.filters button').forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.textContent.toLowerCase();
        filterTasks(filter);
    });
});

function addNewTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskPriority = document.getElementById('taskPriority');
    
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        date: taskDate.value || null,
        priority: taskPriority.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTask(task);
    
    // Reset inputs
    taskInput.value = '';
    taskDate.value = '';
    taskPriority.value = 'low';
    taskInput.focus();
}

function renderTask(task) {
    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.dataset.id = task.id;
    if (task.completed) taskItem.classList.add('completed');

    // Create task content container
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Create task text and date
    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-text';
    taskDetails.textContent = task.text;

    if (task.date) {
        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        dateSpan.textContent = new Date(task.date).toLocaleDateString();
        taskDetails.appendChild(dateSpan);
    }

    // Create priority badge
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `priority-badge priority-${task.priority}`;
    priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    // Create actions container
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => {
        taskItem.style.opacity = '0';
        taskItem.style.transform = 'translateX(20px)';
        setTimeout(() => {
            deleteTask(task.id);
        }, 300);
    });

    // Assemble the task item
    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskDetails);
    taskContent.appendChild(priorityBadge);
    actions.appendChild(deleteBtn);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(actions);

    // Add animation class
    taskItem.style.opacity = '0';
    taskItem.style.transform = 'translateX(-20px)';
    taskList.insertBefore(taskItem, taskList.firstChild);

    // Trigger animation
    setTimeout(() => {
        taskItem.style.opacity = '1';
        taskItem.style.transform = 'translateX(0)';
    }, 10);
}

function toggleTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        taskElement.classList.toggle('completed');
        saveTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    taskElement.remove();
    saveTasks();
}

function filterTasks(filter) {
    const filterButtons = document.querySelectorAll('.filters button');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');

    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        item.style.transition = 'all 0.3s ease';
        
        switch(filter) {
            case 'all':
                item.style.display = '';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                break;
            case 'active':
                if (isCompleted) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                } else {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                }
                break;
            case 'completed':
                if (!isCompleted) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                } else {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                }
                break;
        }
    });
}

// Initial render
window.addEventListener('load', () => {
    tasks.forEach(task => renderTask(task));
    updateEmptyState();
});