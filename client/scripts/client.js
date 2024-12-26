

  // Get the elements
  let todo = document.getElementById("todo");
  let inProgress = document.getElementById("inProgress");
  let done = document.getElementById("done");
  const taskForm = document.getElementById("taskForm");
  const modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));

  
  // Get the tasks
  const createTask = (task) => {
    let taskElement = document.createElement("div");
    taskElement.style.border = "3px solid black";
    taskElement.textContent = task;
    return taskElement;
  };
  const appendTask = (tasks, column) => {
    for (let task of tasks) {
      let taskElement = createTask(task);
      column.appendChild(taskElement);
    }
  };
  const displayBoards = async () => {
    const boards = await fetch("/api/boards").then((res) => res.json());
    console.log(boards);
    todo.innerHTML = "";
    inProgress.innerHTML = "";
    done.innerHTML = "";
    appendTask(boards.Todo, todo);
    appendTask(boards.In_Progress, inProgress);
    appendTask(boards.Done, done);
  };

  function setColumn(event) {
    column = event.target.id;
    console.log(column);
  }
  
  // Add a task to the board
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    addTask();
  });

  async function addTask() {
    const task = document.getElementById("taskName").value;
    if(task === "") {
      document.getElementById("taskName").value = "Please enter a task";
      return;
    }
    const column = "Todo";

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task, column }),
    }


    await fetch("/api/addTask", request).then(() => {   
      displayBoards();
      document.getElementById("taskName").value = "";
      modal.hide();
    });
  }
  displayBoards();

