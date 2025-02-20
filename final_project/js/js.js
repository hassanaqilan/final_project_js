let list = {};
const list_container = document.getElementById("list_container");
const submit_btn = document.getElementById("submit_btn");
const title = document.getElementById("title");
const description = document.getElementById("description");

list_status = {
    1: "new",
    2: "pending",
    3: "completed",
};

class list_item {
    constructor(id, title, description = "", status = 1) {
        this.id = id;
        this.title = title;
        this.description = description; // Add description
        this.status = status; // Set the status
    }

    display = () => {
        const div = document.createElement("div");
        div.classList = "grid-item";
        div.classList.add(list_status[this.status]);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.checked = this.status === 3;

        const taskTitle = document.createElement("span");
        taskTitle.classList.add("title");
        taskTitle.textContent = this.title;

        const actions = document.createElement("div");
        actions.classList.add("actions");

        const editButton = document.createElement("button");
        editButton.classList.add("action-btn", "edit-btn");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            openPopup(this);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("action-btn", "delete-btn");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            this.deleteTask();
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        checkbox.addEventListener("change", () => {
            this.toggleStatus(checkbox.checked);
        });

        div.appendChild(checkbox);
        div.appendChild(taskTitle);
        div.appendChild(actions);

        div.id = this.id;
        return div;
    };

    toggleStatus(checked) {
        this.status = checked ? 3 : 2;
        save();
        show();
    }

    deleteTask() {
        delete list[this.id];
        save();
        show();
    }
}

window.onload = () => {
    load();
};

const add = (title, description, status = 1) => {
    const id = Date.now() + "_" + title[0];
    list[id] = new list_item(id, title, description, status);
};

const show = () => {
    const noItemsMessage = document.getElementById("no-items-message");
    const listContainer = document.getElementById("list_container");
  
    listContainer.innerHTML = "";
  
    if (Object.keys(list).length === 0) {
      noItemsMessage.style.display = "block"; // Show "No items found"
      listContainer.style.display = "none"; // Hide task container
    } else {
      noItemsMessage.style.display = "none"; // Hide "No items found"
      listContainer.style.display = "grid"; // Show task container
  
      Object.values(list).forEach((task) => {
        listContainer.appendChild(task.display());
      });
    }
  };
  

const save = () => {
    localStorage.setItem("list", JSON.stringify(list));
};

const load = () => {
    let storedList = JSON.parse(localStorage.getItem("list"));

    if (storedList) {
        Object.values(storedList).forEach((ele) => {
            add(ele.title, ele.description, ele.status);
        });
    }
    show();
};


const filter = (status) => {
    // Select all elements with a specific class
    let elements = document.querySelectorAll(".grid-item");

    Object.values(list_status).map((st) => {
        let elements = document.querySelectorAll(`.${st}`);

        if (status == 'pending') {
            if (st == 'completed') {
                elements.forEach((element) => {
                    element.style.display = "none";
                });
            } else {
                elements.forEach((element) => {
                    element.style.display = "flex";
                });
            }
        }else{


        if (status != st && status != "all") {
            elements.forEach((element) => {
                element.style.display = "none";
            });
        } else {
            elements.forEach((element) => {
                element.style.display = "flex";
            });
        }
    }

    });
};

let editingTask = null; // To store the task currently being edited

function openPopup(task = null) {
    if (task) {
        document.getElementById("title").value = task.title;
        document.getElementById("description").value = task.description || "";
        editingTask = task;
        submit_btn.textContent = "Edit Task";
    } else {
        document.querySelector(".todo-form").reset();
        editingTask = null;
        submit_btn.textContent = "Add Task";
    }
    document.getElementById("popup-overlay").style.display = "flex";
}


// Close the popup if clicked outside the modal or by clicking the "Cancel" button
function closePopup(event) {
    if (event.target === document.getElementById("popup-overlay")) {
        document.getElementById("popup-overlay").style.display = "none";
    }
}

function cancelForm() {
    document.getElementById("popup-overlay").style.display = "none";
}

function submitForm(event) {

    event.preventDefault();

    const titleValue = title.value.trim();
    const descriptionValue = description.value.trim();

    if (titleValue && descriptionValue) {
        if (editingTask) {
            // Update existing task
            editingTask.title = titleValue;
            editingTask.description = descriptionValue;

            list[editingTask.id] = editingTask; // Save the updated task
        } else {
            // Create new task
            const id = Date.now() + "_" + titleValue[0];
            list[id] = new list_item(id, titleValue, descriptionValue);
        }

        save();
        show();
        document.getElementById("popup-overlay").style.display = "none";
        document.querySelector(".todo-form").reset();
    }
}

