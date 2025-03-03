document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-btn');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputBox = createInputBox();
            const listContainer = button.closest('.dash-section').querySelector('.list-actv');
            listContainer.appendChild(inputBox);

            attachCheckButtonListener(inputBox, button);
        });
    });

    initializeTaskCounters();
});

function createInputBox() {
    const inputBox = document.createElement('div');
    inputBox.innerHTML = `
        <input type="text" 
               class="task-input" 
               placeholder="Enter task">
        <button class="check-btn">✔</button>
    `;
    return inputBox;
}

function attachCheckButtonListener(inputBox, button) {
    const checkButton = inputBox.querySelector('.check-btn');
    const taskInput = inputBox.querySelector('.task-input');

    checkButton.addEventListener('click', () => processTask(inputBox,button,taskInput));

    // Listener con la tecla "Enter"
    taskInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            processTask(inputBox, button, taskInput);
        }
    });
}

function processTask(inputBox, button, taskInput) {
    if (taskInput.value.trim() !== '') {
        const taskItem = createTaskItem(taskInput.value, inputBox.parentElement.classList);
        const taskList = button.closest('.dash-section').querySelector('.activities');
        taskList.appendChild(taskItem);
        inputBox.remove();

        updateTaskCounter(button.closest('.dash-section'));
    }
}

function createTaskItem(taskText, parentClassList) {
    const taskItem = document.createElement('li');
    taskItem.textContent = taskText;
    
    if (parentClassList.contains("not-list")) {
        taskItem.classList.add("not-item");
    } else if (parentClassList.contains("progress-list")) {
        taskItem.classList.add("progress-item");
    } else {
        taskItem.classList.add("completed-item");
    }
    
    return taskItem;
}

// Mostrar informacion sobre la cantidad de tasks
function initializeTaskCounters(){
    const titleSections = document.querySelectorAll('.title');

    titleSections.forEach(title => {
        const counter = document.createElement('h3');
        counter.classList.add('task-counter');
        counter.textContent = "Quantity: " + getTasksNumb(title);

        title.appendChild(counter);
    });
}

function updateTaskCounter(dashSection) {
    // Search 4 title
    const title = dashSection.querySelector('.title');
    const counter = title.querySelector('.task-counter');
    if (counter) {
        counter.textContent = "Quantity: " + getTasksNumb(title);
        counter.classList.add("scale-animation");

        setTimeout(() => {
            counter.classList.remove("scale-animation");
        }, 800);
    }
}

function getTasksNumb(title){
    const activityList = title.nextElementSibling.querySelector('.activities');

    const qntActv = activityList.children.length;
    console.log(qntActv)

    return qntActv;
}