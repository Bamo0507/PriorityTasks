// Espera a que se cargue el DOM y ya despues que se cargue, dispara el listener
document.addEventListener('DOMContentLoaded', () => {
    //Selecciona todos los botones que tienen la clase .add-btn
    const addButtons = document.querySelectorAll('.add-btn');

    addButtons.forEach(button => {
        // Se
        button.addEventListener('click', () => {
            const inputBox = document.createElement('div');
            inputBox.innerHTML = `
                <input type="text" 
                class="task-input" 
                placeholder="Enter task"
                >

                <button class="check-btn">✔</button>
            `;
            
            const listContainer = button.closest('.dash-section').querySelector('.list-actv');
            listContainer.appendChild(inputBox);

            const checkButton = inputBox.querySelector('.check-btn');
            checkButton.addEventListener('click', () => {
                const taskInput = inputBox.querySelector('.task-input');
                if (taskInput.value.trim() !== '') {
                    const taskItem = document.createElement('li');
                    taskItem.textContent = taskInput.value;

                    // Obtener quien es la clase padre
                    const clasePadre = inputBox.parentElement.classList;

                    if(clasePadre.contains("not-list")){
                        taskItem.classList.add("not-item")
                    } else if (clasePadre.contains("progress-list")){
                        taskItem.classList.add("progress-item")
                    } else {
                        taskItem.classList.add("completed-item")
                    }

                    const taskList = button.closest('.dash-section').querySelector('.activities');
                    taskList.appendChild(taskItem)

                    inputBox.remove();
                }
            });
        });
    });
});



