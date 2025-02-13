// Get the elements
let todo = document.getElementById("todo");
let inProgress = document.getElementById("inProgress");
let done = document.getElementById("done");
const taskForm = document.getElementById("taskForm");
const regForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const addTaskModal = new bootstrap.Modal(
  document.getElementById("addTaskModal")
);
const registerModal = new bootstrap.Modal(
  document.getElementById("registerModal")
);
const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
const logoutModal = new bootstrap.Modal(document.getElementById("logoutModal"));

// Create the tasks
const createTask = (task) => {
  let taskElement = document.createElement("div");
  taskElement.innerHTML = `
      <div class="card task my-2" id="${task._id}">
        <div class="card-header">
          ${task.title}
        </div>
        <div class="card-body">
          ${task.description}
        </div>
        <div class="card-footer" style="display: none">
          <button class="btn btn-primary" id="inProgressBtn" >In Progress</button>
          <button class="btn btn-success" id="doneBtn" >Done</button>
          <button class="btn btn-danger"  id ="delete">Delete</button>
        </div>
      </div>`;

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
  for (let task of tasks) {
    console.log(task);
    let taskElement = createTask(task);
    document.getElementById(task.taskStatus).appendChild(taskElement);
  }
};
const displayBoards = async () => {
  todo.innerHTML = "";
  inProgress.innerHTML = "";
  done.innerHTML = "";
 
    const tasks = await fetch("/api/boards").then((res) => res.json());

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
    taskName: taskName,
    taskDesc: taskDesc,
    taskStatus: taskStatus,
  };
  console.log(task);
  if (taskName === "" || taskDesc === "") {
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
  if (res.status != 500) {
    displayBoards();
    document.getElementById("taskName").value = "";
    document.getElementById("taskDescription").value = "";
    addTaskModal.hide();
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
    await deleteTask(taskId);
  }
  if (newStatus) {
    await changeTaskStatus(taskId, newStatus);
  }
});

// Delete the task
async function deleteTask(taskId) {
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
    console.log("Task deleted");
    displayBoards();
  } else {
    console.log(res);
  }
}

//change task status
async function changeTaskStatus(taskId, newStatus) {
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
    console.log("Task status changed");
    displayBoards();
  } else {
    console.log(res);
  }
}

const registerUser = async function () {
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  const user = {
    username: username,
    email: email,
    password: password,
  };
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };
  const res = await fetch("/api/register", request);
  if (res.status === 200) {
    console.log("User registered");
    for (let input of regForm.querySelectorAll("input")) {
      input.value = "";
    }
    registerModal.hide();
    loginModal.show();
  } else {
    alert("Error registering user", res.e);
  }
};
regForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await registerUser();
});

function showWelcome(username) {
  document.getElementById("welcomeMessage").textContent =
    "Welcome " + username + "!";
  document.getElementById("loginBtn").style.display = "none";
  document.getElementById("logoutBtn").style.display = "Block";
}

const loginUser = async function () {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const user = {
    username: username,
    password: password,
  };
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };
  const res = await fetch("/api/login", request);
  if (res.status === 200) {
    console.log("Login successful");
    for (let input of loginForm.querySelectorAll("input")) {
      input.value = "";
    }
    const data = await res.json();
    console.log(data.username);
    loginModal.hide();
    displayBoards();
    showWelcome(data.username);
  } else {
    const data = await res.json();
    console.log("Login failed");
    alert(data.message);
  }
};

// Login the user
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loginUser();
});

// Logout the user
document.getElementById("logoutBtn").addEventListener("click", async () => {
  logoutModal.show();
});

document.getElementById("logout").addEventListener("click", async () => {
  const res = await fetch("/api/logout");
  console.log(res);
  if (res.status === 200) {
    console.log("Logout successful");
    document.getElementById("welcomeMessage").textContent = "";
    document.getElementById("loginBtn").style.display = "block";
    document.getElementById("logoutBtn").style.display = "none";
    todo.innerHTML = "";
    inProgress.innerHTML = "";
    done.innerHTML = "";
  } else {
    console.log("Error logging out");
  }
  logoutModal.hide();
});
