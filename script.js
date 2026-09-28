// LocalStorage se Data load karna ya empty structure initialization
let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || {
    'todo-column': [],
    'progress-column': [],
    'done-column': []
};

// Application start hone par render karein
document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
});

// Task render karne ka function
function renderBoard() {
    for (const columnId in tasks) {
        const listElement = document.getElementById(columnId.replace('-column', '-list'));
        listElement.innerHTML = '';

        tasks[columnId].forEach((taskText, index) => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.draggable = true;
            taskCard.id = `${columnId}-${index}`;
            taskCard.ondragstart = (e) => drag(e, columnId, index);

            taskCard.innerHTML = `
                <span>${taskText}</span>
                <i class="fa-solid fa-trash delete-btn" onclick="deleteTask('${columnId}', ${index})"></i>
            `;

            listElement.appendChild(taskCard);
        });

        // Task counts update karein
        const countElement = document.getElementById(columnId.replace('-column', '-count'));
        if (countElement) {
            countElement.innerText = tasks[columnId].length;
        }
    }
    // LocalStorage mein save karein
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}

// Naya Task add karna
function addTask(columnId, inputId) {
    const input = document.getElementById(inputId);
    const text = input.value.trim();

    if (text !== '') {
        tasks[columnId].push(text);
        input.value = '';
        renderBoard();
    }
}

// Task delete karna
function deleteTask(columnId, index) {
    tasks[columnId].splice(index, 1);
    renderBoard();
}

// Drag & Drop Handling
function allowDrop(e) {
    e.preventDefault();
}

function drag(e, sourceColumn, index) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ sourceColumn, index }));
}

function drop(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Drop target ki column find karna
    let targetElement = e.target;
    while (targetElement && !targetElement.classList.contains('column')) {
        targetElement = targetElement.parentElement;
    }

    if (targetElement) {
        const targetColumnId = targetElement.id;
        
        // Element ko source se remove karke target column mein add karna
        const [movedTask] = tasks[data.sourceColumn].splice(data.index, 1);
        tasks[targetColumnId].push(movedTask);

        renderBoard();
    }
}