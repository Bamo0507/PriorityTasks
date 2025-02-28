document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.add-btn');

    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputBox = document.createElement('div');
            inputBox.innerHTML = `
                <input type="text" class="task-input" placeholder="Enter task">
                <button class="check-btn">✔</button>
            `;
            button.parentElement.appendChild(inputBox);

            const checkButton = inputBox.querySelector('.check-btn');
            checkButton.addEventListener('click', () => {
                const taskInput = inputBox.querySelector('.task-input');
                if (taskInput.value.trim() !== '') {
                    const taskItem = document.createElement('li');
                    taskItem.textContent = taskInput.value;
                    button.parentElement.nextElementSibling.querySelector('.activities').appendChild(taskItem);
                    inputBox.remove();
                }
            });
        });
    });
});