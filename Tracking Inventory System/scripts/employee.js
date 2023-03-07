import { getEmployees } from "./data.mjs";

let newEmployee =
  localStorage.getItem("newEmployee") != null
    ? JSON.parse(localStorage.getItem("newEmployee"))
    : "";

let updatedEmployee =
  localStorage.getItem("updateEmployee") != null
    ? JSON.parse(localStorage.getItem("updateEmployee"))
    : "";;

let employeeList = getEmployees();
if (newEmployee) {
  newEmployee.forEach(employee => employeeList.push(employee));
  window.localStorage.removeItem("newEmployee");
}

if (updatedEmployee) {
  let empId = updatedEmployee.id
  employeeList = employeeList.map(c => c.id == empId ? updatedEmployee : c);
}

// Variables
let employeesTable = document.getElementById("employees-table");
let filterBtn = document.querySelector(".btn-filter");
let keywordInput = document.querySelector(".keyword");
let msg = document.querySelector(".msg");
//////////////////////////
let pagination_element = document.getElementById("pagination");
let current_page = 1;
let rows =10;

function SetUpPagination(employeeList, wrapper, row_per_page){
  wrapper.innerHTML ="";
  let page_count =Math.ceil(employeeList.length/row_per_page)
  for (let i = 1; i < page_count + 1; i++ ){
      let btn = PaginationButton(i,employeeList);
      wrapper.appendChild(btn);
  }
}

function PaginationButton(page,employeeList){
  let button = document.createElement('button');
  button.innerText= page;

  if(current_page == page)button.classList.add('active');
  button.addEventListener('click', function(){
      current_page = page;
      displayEmployeeList(employeesTable, employeeList, rows, current_page);
      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');
      button.classList.add('active');
  });
  return button;
}
//////////////////////////

// DOM loaded
window.addEventListener("DOMContentLoaded", () => {
  displayEmployeeList(employeesTable, employeeList, rows, current_page);
  SetUpPagination(employeeList, pagination_element, rows);

  let editBtns = document.querySelectorAll(".edit-btn");
  // Edit button clicked
  editBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      let empId = btn.id.split("-")[1];
      window.location.href = `employee-edit.html?empId=${empId}`;
    })
  );
});

// Filter button clicked
  filterBtn?.addEventListener("click", () => {
    let newList;
    if (keywordInput.value == "") {
      location.reload();
    } else {
      newList = filterWithKeyword(employeeList, keywordInput.value);
      console.log(newList);
      if (newList.length == 0) {
        msg.innerHTML =
          '<span style="color:#fc4903; padding-left: 40px;">There is no data matching your search query</span>';
      } else {
        //displayEmployeeListFilter(employeesTable, newList);
        displayEmployeeList(employeesTable, newList, rows, current_page);
        SetUpPagination(newList, pagination_element, rows);
        msg.innerHTML =
          '<a href="employees.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
        
        let editBtns = document.querySelectorAll(".edit-btn");
        // Edit button clicked
        editBtns.forEach((btn) =>
          btn.addEventListener("click", () => {
            let empId = btn.id.split("-")[1];
            window.location.href = `employee-edit.html?empId=${empId}`;
          })
        );
      }
    }
    keywordInput.value = "";
  });



function format(number){
  var num_sf= number
  var num_cf=''
  num_cf="("+num_sf.substring(0,3)+")"+"-"
  num_cf+=num_sf.substring(3,6)+"-"
  num_cf+=num_sf.substring(6,10)
  return num_cf;
  }


function displayEmployeeList(wrapper, arr, row_per_page, page) {
  wrapper.innerHTML ="";
  page--;
  let start = row_per_page*page;
  let end = start+row_per_page;
  let paginatedItems = arr.slice(start,end);

  let rows = "";
  for (let i = 0; i < paginatedItems.length; i++) {
    rows += `<tr>
				<td>${paginatedItems[i].gender}</td>
				<td>${paginatedItems[i].firstName}</td>
        <td>${paginatedItems[i].lastName}</td>
        <td>${paginatedItems[i].department}</td>
				<td>${format(paginatedItems[i].phone)}</td>
        <td><button class='edit-btn' id='employee-${paginatedItems[i].id}'>EDIT</button></td>
			</tr>`;
  }
  wrapper.innerHTML = rows;
}

  // Filter function
  function filterWithKeyword(arr, kword) {
    kword = kword.toLowerCase();
    return arr.filter(
      (item) =>
        item.firstName.toLowerCase().includes(kword) ||
        item.lastName.toLowerCase().includes(kword) ||
        item.phone.toLowerCase().includes(kword) ||
        item.employeeCode.toLowerCase().includes(kword)
    );
  }