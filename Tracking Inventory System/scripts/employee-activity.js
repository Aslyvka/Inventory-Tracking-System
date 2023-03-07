import { getEmployees } from "./data.mjs";
let employeeList = getEmployees();

// Variables
let employeesTable = document.getElementById("employee-report-table");
let filterBtn = document.querySelector(".btn-filter");
let keywordInput = document.querySelector(".keyword");
let radioBtns = document.querySelectorAll("input[type='radio']");
let msg = document.querySelector(".msg");

// DOM loaded
window.addEventListener("DOMContentLoaded", () => {
  displayEmployeeList(employeesTable, employeeList);
});

// Filter button clicked
filterBtn?.addEventListener("click", () => {
  let newList;
  if (keywordInput.value == "") {
    location.reload();
  } else {
    newList = filterWithKeyword(employeeList, keywordInput.value);
    if (newList.length == 0) {
      msg.innerHTML =
        '<span style="color:#fc4903; padding-left: 40px;">There is no data matching your search query</span>';
    } else {
      displayEmployeeList(employeesTable, newList);
      msg.innerHTML =
        '<a href="employee-report.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
    }
  }
  keywordInput.value = "";
});

// Radio buttons
radioBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    employeeByStatus(e.target.value);
  })
);

// Display date into the table
function displayEmployeeList(table, arr) {
  let rows = "";
  for (let i = 0; i < arr.length; i++) {
    rows += `<tr>
				<td>${arr[i].gender}</td>
				<td>${arr[i].firstName}</td>
        <td>${arr[i].lastName}</td>
        <td>${arr[i].employeeCode}</td>
        <td>${arr[i].login}</td>
        <td>${arr[i].activity}</td>
			</tr>`;
  }
  table.innerHTML = rows;
}

// Filter function
function filterWithKeyword(arr, kword) {
  kword = kword.toLowerCase();
  return arr.filter(
    (item) =>
      item.firstName.toLowerCase().includes(kword) ||
      item.lastName.toLowerCase().includes(kword) ||
      item.email.toLowerCase().includes(kword) ||
      item.employeeCode.toLowerCase().includes(kword) ||
      item.postalCode.toLowerCase().includes(kword)
  );
}

function employeeByStatus(status) {
  let newEmplist;
  if (status == "active") {
    newEmplist = employeeList.filter((emp) => emp.login == "Active");
  } else if (status == "inactive") {
    newEmplist = employeeList.filter((emp) => emp.login == "Inactive");
  } else {
    // display all employees
    newEmplist = employeeList;
  }
  displayEmployeeList(employeesTable, newEmplist);
}
