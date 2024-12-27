

  // Get the elements
  let todo = document.getElementById("todo");
  let inProgress = document.getElementById("inProgress");
  let done = document.getElementById("done");
  const taskForm = document.getElementById("taskForm");
  const modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));

  
  // Get the tasks
  const createTask = (task,i) => {
    let taskElement = document.createElement("div");
    taskElement.innerHTML = `
      <div class="card" id="task_${i}" >
        <div class="card-header">
          ${task.taskName}
        </div>
        <div class="card-body">
          ${task.taskDesc}
        </div>
      </div>`

    return taskElement;
  };
  const appendTask = (tasks) => {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      let taskElement = createTask(task,i);
      document.getElementById(task.taskStatus).appendChild(taskElement);
    }
  };
  const displayBoards = async () => {
    const boards = await fetch("/api/boards").then((res) => res.json());
    console.log(boards);
    todo.innerHTML = "";
    inProgress.innerHTML = "";
    done.innerHTML = "";
    const tasks = boards.tasks;
    appendTask(tasks);
   
  };
  
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

