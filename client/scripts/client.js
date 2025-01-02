

  // Get the elements
  let todo = document.getElementById("todo");
  let inProgress = document.getElementById("inProgress");
  let done = document.getElementById("done");
  const taskForm = document.getElementById("taskForm");
  const modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));

  
  // Get the tasks
  const createTask = (task) => {
    let taskElement = document.createElement("div");
    taskElement.innerHTML = `
      <div class="card task" id="${task.id}">
        <div class="card-header">
          ${task.taskName}
        </div>
        <div class="card-body">
          ${task.taskDesc}
        </div>
        <div class="card-footer" style="display: none">
          <button class="btn btn-primary" id="inProgressBtn" >In Progress</button>
          <button class="btn btn-success" id="doneBtn" >Done</button>
          <button class="btn btn-danger"  id ="delete">Delete</button>
        </div>
      </div>`

    taskElement.addEventListener("mouseover", () => {
      taskElement.querySelector(".card-footer").style.display = "block";
    });

    taskElement.addEventListener("mouseout", () => {
      taskElement.querySelector(".card-footer").style.display = "none";
    });

    return taskElement;
  };

  const taskStatusSelect = document.getElementById("taskStatus");



  // Append the tasks to the board
  const appendTask = (tasks) => {
    for (task of tasks) {
      let taskElement = createTask(task);
      document.getElementById(task.taskStatus).appendChild(taskElement);
    }
  };
  const displayBoards = async () => {
    const boards = await fetch("/api/boards").then((res) => res.json());
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
    const taskName = document.getElementById("taskName").value;
    const taskDesc = document.getElementById("taskDescription").value;
    const taskStatus = document.getElementById("taskStatus").value;
    const task = {
      "taskName": taskName,
      "taskDesc": taskDesc,
      "taskStatus": taskStatus,
    };
    console.log(task);
    if(taskName === "" || taskDesc === ""){
      alert("Please enter a task name and description");
      return;
    }
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    };


    const res = await fetch("/api/addTask", request);
    if (res.status === 200) {
      displayBoards();
      document.getElementById("taskName").value = "";
      document.getElementById("taskDescription").value = "";
      modal.hide();
    }
  }

  // Change the status of the task
  document.addEventListener("click", async (event) => {
    let taskId;
    let newStatus;
    if (event.target.id === "inProgressBtn") {
      console.log("inProgress clicked");
       taskId = event.target.parentElement.parentElement.id;
      newStatus = "inProgress";
    }
    if (event.target.id === "doneBtn") {
      console.log("done clicked");
       taskId = event.target.parentElement.parentElement.id;
      
      newStatus = "done";
    }
    if (event.target.id === "delete") {
      console.log("delete clicked");
       taskId = event.target.parentElement.parentElement.id;
      const request = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: taskId,
        }),
      };
      const res = await fetch("/api/deleteTask", request);
      if (res.status === 200) {
        displayBoards();
      }
      else {
        console.log("Error");
      } 
    }
    if (newStatus) {
      const request = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: taskId,
          newStatus: newStatus,
        }),
      };
      const res = await fetch("/api/changeTaskStatus", request);
      
      if (res.status === 200) {
        displayBoards();
      }
      else {
        console.log("Error");
      }
    }
  });
 
  displayBoards();

