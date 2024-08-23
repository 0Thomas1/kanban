(() => {
  // Get the elements
  let todo = document.getElementById("todo");
  let inProgress = document.getElementById("inProgress");
  let done = document.getElementById("done");

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
  displayBoards();
})();
