// filter button
const filterbtn = document.querySelector(".filter");
const filterContainer = document.querySelector(".filterbtn");
const deleteAll = document.querySelector(".deleteALL");
filterbtn.addEventListener("click", () => {
  console.log(filterContainer);
  filterContainer.classList.toggle("show");
});

// form variable
const form = document.querySelector("#form");

// tbody variable
const list = document.querySelector("#list");

// no Data message container
const noData = document.querySelector(".noData");

let id = JSON.parse(localStorage.getItem("id")) || 0;

// getting data from form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const task = formData.get("task");
  const time = formData.get("time");
  form.reset();

  //  removing no data message
  noData.style.display = "none";

  //   storing data in localStroage
  storeData(task, id, time, false);
  createNode(id, task, time, false);
  id++;
  localStorage.setItem("id", JSON.stringify(id));
});

// function to store data in localStroage
const storeData = (task, id, time, done) => {
  let Data;
  if (localStorage.getItem("tasks") === null) {
    Data = [];
  } else {
    Data = JSON.parse(localStorage.getItem("tasks"));
  }
  Data.push({ task, id, time, done });
  localStorage.setItem("tasks", JSON.stringify(Data));
};

// // function to read data from localStroage
const readData = () => {
  let Data = JSON.parse(localStorage.getItem("tasks")) || [];
  JSON.parse(localStorage.getItem("id")) || 0;
  if (Data.length > 0) {
    noData.style.display = "none";
    Data.forEach((task) => {
      createNode(task.id, task.task, task.time, task.done);
    });
  }
};

// function to create node elements
const createNode = (id, task, time, done) => {
  const tr = document.createElement("tr");
  const tdTask = document.createElement("td");
  const tdTime = document.createElement("td");
  const tdAction = document.createElement("td");

  const doneButton = document.createElement("button");
  doneButton.className = "done";
  doneButton.textContent = "Done";
  doneButton.setAttribute("data-id", id);

  doneButton.onclick = function () {
    const dataId = this.getAttribute("data-id");
    const tr = document.querySelector(`tr[data-id="${dataId}"]`);
    tr.classList.toggle("done");
    const Data = JSON.parse(localStorage.getItem("tasks"));
    const index = Data.findIndex((task) => task.id == dataId);
    Data[index].done = !Data[index].done;
    localStorage.setItem("tasks", JSON.stringify(Data));
  };

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("data-id", id);

  deleteButton.onclick = function () {
    const dataId = this.getAttribute("data-id");
    const tr = document.querySelector(`tr[data-id="${dataId}"]`);
    tr.remove();
    if (list.children.length === 0) {
      noData.style.display = "flex";
    }
    const Data = JSON.parse(localStorage.getItem("tasks"));
    const index = Data.findIndex((task) => task.id == dataId);
    Data.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(Data));
  };

  tdAction.appendChild(doneButton);
  tdAction.appendChild(deleteButton);

  tdTask.textContent = task;
  tdTime.textContent = time;

  tr.setAttribute("data-id", id);
  tr.appendChild(tdTask);
  tr.appendChild(tdTime);
  tr.appendChild(tdAction);
  if (done) {
    tr.classList.add("done");
  }
  list.appendChild(tr);
};

readData();

// filter button functionality
const filter = (value) => {
  const Data = JSON.parse(localStorage.getItem("tasks")) || [];
  list.innerHTML = "";
  if (value === "pending") {
    const filteredData = Data.filter((task) => task.done === false);
    filteredData.forEach((task) => {
      createNode(task.id, task.task, task.time, task.done);
    });
  } else if (value === "completed") {
    const filteredData = Data.filter((task) => task.done === true);
    filteredData.forEach((task) => {
      createNode(task.id, task.task, task.time, task.done);
    });
  } else {
    Data.forEach((task) => {
      createNode(task.id, task.task, task.time, task.done);
    });
  }
};

// delete All data
deleteAll.addEventListener("click", () => {
  localStorage.removeItem("tasks");
  localStorage.removeItem("id");
  list.innerHTML = "";
  noData.style.display = "flex";
});
