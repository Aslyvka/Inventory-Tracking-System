// Variables
let dateStart = document.querySelector(".date-start");
let dateEnd = document.querySelector(".date-end");
let viewReportBtn = document.querySelector(".btn-filter");

let empsReport = document.querySelector(".emps-report")
let backHomeBtn = document.querySelector(".back-home-btn");
let downloadBtn = document.querySelector(".download-btn");
let printBtn = document.querySelector(".print-btn");
let saveBtn = document.querySelector(".save-btn");
let msg = document.querySelector(".msg");
let printMsg = document.querySelector(".print-msg");

viewReportBtn?.addEventListener("click", () => {
  if (dateStart.value == "" && dateEnd.value == "") {
    msg.innerHTML = "Please select the start and end date";
  } else if (dateStart.value != "" && dateEnd.value == "") {
    msg.innerHTML = "Please select the end date";
  } else if (dateStart.value == "" && dateEnd.value != "") {
    msg.innerHTML = "Please select the start";
  } else{
    empsReport.style.display = "flex";
    let start = document.querySelector(".start");
    let end = document.querySelector(".end");
    let current = document.querySelector(".today");

    msg.innerHTML = "";
    start.innerHTML = dateStart.value.split("-").join(".");
    end.innerHTML = dateEnd.value.split("-").join(".");
    current.innerHTML = getToday();
  }
})

backHomeBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "home.html";
});

downloadBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  printMsg.innerHTML = "Downloading report ...";
  setTimeout(() => {
    printMsg.innerHTML = "";
  }, 2000);
});

printBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  printMsg.innerHTML = "Sending data to printer...";
  setTimeout(() => {
    printMsg.innerHTML = "";
    // window.location.href = "print-invoice.html";
  }, 2000);
});

saveBtn?.addEventListener("click", () => {
  window.location.href = "print-employee.html";
});

function getToday() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  return `${yyyy}.${mm}.${dd}`;
}