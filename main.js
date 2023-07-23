const list_el = document.getElementById("list");  // Div id "list" is stored in const list_el
const create_btn_el = document.getElementById("create"); // Button with id=create is stored on create_btn_el

let todos = []  // Initialize empty array where "To Do" are going to be stored


// Clicking on button (Add a task), calls the function CreateNewTodo 
create_btn_el.addEventListener('click', CreateNewTodo);

function CreateNewTodo () {
    const item = {
        id: new Date().getTime(),
        text: "",
        complete: false
    }

    // Add an item on top of list (start of array)
    todos.unshift(item);

    // Obtains values of "item_el" and "input_el" from function CreateTodoElement(item)
    const { item_el, input_el} = CreateTodoElement(item);

    // Add item_el obtained from function CreateTodoElement to the start of list of elements "list_el"
    list_el.prepend(item_el);

    // By default it is set to disabled, this remove the default, so it can be edited.
    input_el.removeAttribute("disabled");

    // Sets "input_el" as the active element so text field can be written straight away.
    input_el.focus();

    // Save that input on the local storage
    Save();

}

// html structure to use
    
                /* <div class="item">
                    <input type="checkbox"/>                           
                    <input type="text" value="Todo content goes here" disabled/>
                    <div class="actions">
                        <button class="material-icons">edit</button>
                        <button class="material-icons remove-btn">remove_circle</button>
                    </div>
                </div> */

// CreateTodoElement(item) creates the html structure and gives funcionality to the buttons.
function CreateTodoElement(item) {
    // Creates a div element with the class item
    const item_el = document.createElement("div");
    item_el.classList.add("item");

    // Creates an input element with type "checkbox"
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    
    // item.complete is by default "false" so box is not checked on creation
    checkbox.checked = item.complete;

    // If it is completed, the class "complete" is added and styles will change
    if (item.complete) {
        item_el.classList.add("complete");
    } 

    // Creates an input element with type "text", "value" as written in the field and attribute "disabled" by default
    const input_el = document.createElement("input");
    input_el.type = "text";
    input_el.value = item.text;
    input_el.setAttribute("disabled", "");

    // Creates a div element with class "actions"
    const actions_el = document.createElement("div");
    actions_el.classList.add("actions");

    // Creates a button with class "materials-icons and the inner text "edit"
    const edit_btn_el = document.createElement("button");
    edit_btn_el.classList.add("material-icons");
    edit_btn_el.innerText = "edit";

    // Creates a button with class materials-icons and remove-btn and the inner text "remove-circle"
    const remove_btn_el = document.createElement("button");
    remove_btn_el.classList.add("material-icons", "remove-btn");
    remove_btn_el.innerText = "delete";

    // After every html element is being created, they are appended on the right order to "item_el", the div wrapper
    // Firstly "edit_btn_el" and "remove_btn_el" buttons are added to the div with class "actions"
    actions_el.append(edit_btn_el);
    actions_el.append(remove_btn_el);
    // After "checkbox", "input_el" and "actions" are added
    item_el.append(checkbox);
    item_el.append(input_el);
    item_el.append(actions_el);


    //EVENTS

    // If the checkbox content has changed (is marked), it will change item.complete to checked
    checkbox.addEventListener("change", () => {
        item.complete = checkbox.checked;

        // If it is checked and unchecked it just adding or removing the class that styles it
        if (item.complete) {
            item_el.classList.add("complete");
        } else {
            item_el.classList.remove("complete");
        }
        // Saves update to localstorage
        Save();
    });

    // User's input changes "item.text"
    input_el.addEventListener("input", () => {
        item.text = input_el.value;
    });

    // If "input_el" loses focus (click outside), attribute would be "disabled" and save to localstorage the update.
    input_el.addEventListener("blur", () => {
        input_el.setAttribute("disabled", "");
        Save();
    });

    // If edit button is clicked "disabled" attribute is removed. Text then can be written and item is focused
    edit_btn_el.addEventListener("click", () => {
        input_el.removeAttribute("disabled");
        input_el.focus();
    });

    // if remove button is clicked, "todos" awway is updated with all values except the one on which delete is being clicked
    remove_btn_el.addEventListener("click", () => {
        todos = todos.filter(t => t.id != item.id);
        // item where delete is clicked gets removed
        item_el.remove();
        // localstorage is updated
        Save();
    });

    return { item_el, input_el, edit_btn_el, remove_btn_el}
}

// Display "item_el" elements 
function DisplayTodos () {
    Load();

    for (let i = 0; i < todos.length; i++) {
        const item = todos[i];

        const { item_el } = CreateTodoElement(item);

        list_el.append(item_el);
    }
}

// it needs to be called in order to be activated
DisplayTodos();


// Changes are saved in the localstorage so content is displayed when the page is open
function Save() {
    const save = JSON.stringify(todos);

    // (ctrl + shift + i), developer tools, application tab, local storage, the new elements are stored in there
    localStorage.setItem("my_tasks", save);
}

function Load() {
    const data = localStorage.getItem("my_tasks");

    // if there is anything stored
    if (data) {
        // takes a json string and converts it into an object of JSON an array in this case
        todos = JSON.parse(data);
    }
}