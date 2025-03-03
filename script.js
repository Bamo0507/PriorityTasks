let dragSourceSection = null; // Guardar la seccion origen

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

    // Agregar listeners de drag and drop a cada lista de tareas
    document.querySelectorAll('.list-actv').forEach(container => {
        container.addEventListener('dragover', dragOver);
        container.addEventListener('drop', drop);
    });
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

    // Se hace draggable la tarea
    taskItem.setAttribute('draggable', 'true');
    
    if (parentClassList.contains("not-list")) {
        taskItem.classList.add("not-item");
    } else if (parentClassList.contains("progress-list")) {
        taskItem.classList.add("progress-item");
    } else {
        taskItem.classList.add("completed-item");
    }

    // Meter listeners para los eventos de arraste, que hacer cuando se jala, y se suelta
    taskItem.addEventListener('dragstart', dragStart);
    taskItem.addEventListener('dragend', dragEnd);
    
    return taskItem;
}

function dragStart(event) {
    // Guardamos la sección origen donde se encuentra la tarea
    const sourceSection = event.target.closest('.dash-section');
    dragSourceSection = sourceSection;

    // Si el elemento no tiene id, se le asigna uno único
    if (!event.target.id) {
        event.target.id = 'task-' + Date.now();
    }
    // data transfer es un objeto propio de eventos de arraste, para
    // guardar la info de lo que se anda moviendo

    // text/plain solo es para indicar que se esta guardando texto simple
    // en el segundo parametro se manda el target id que se asigno, se guarda como
    // texto plano el id 
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';
    
    // clase para meter efectos
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    // Remover la clase visual al finalizar el arrastre
    event.target.classList.remove('dragging');
    
}

function dragOver(event) {
    event.preventDefault(); // Permite que se realice el drop
    event.dataTransfer.dropEffect = 'move';
}

function drop(event) {
    event.preventDefault();
    // Recuperar el id de la tarea arrastrada
    const taskId = event.dataTransfer.getData('text/plain');
    const draggedTask = document.getElementById(taskId);
    if (draggedTask) {
        // Insertar la tarea en el <ul> dentro del contenedor .list-actv
        const ul = event.currentTarget.querySelector('.activities');
        if (ul) {
            ul.appendChild(draggedTask);
        }
        
        // Cambiar la clase de la tarea según la lista destino
        draggedTask.classList.remove('not-item', 'progress-item', 'completed-item');
        // Usamos event.currentTarget porque es el contenedor .list-actv que tiene la clase que identifica el tipo de lista.
        if (event.currentTarget.classList.contains('not-list')) {
            draggedTask.classList.add('not-item');
        } else if (event.currentTarget.classList.contains('progress-list')) {
            draggedTask.classList.add('progress-item');
        } else if (event.currentTarget.classList.contains('completed-list')) {
            draggedTask.classList.add('completed-item');
        }
        
        // Actualizar los contadores:
        let destSection = event.currentTarget.closest('.dash-section');
        if (destSection) {
            updateTaskCounter(destSection);
        }
        // Actualizar el contador de la sección origen (si es distinta)
        if (dragSourceSection && dragSourceSection !== destSection) {
            updateTaskCounter(dragSourceSection);
        }
    }
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