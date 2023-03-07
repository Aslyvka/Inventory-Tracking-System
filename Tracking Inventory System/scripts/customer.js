import { getCustomers } from "./data.mjs";

//I get the new customer from new-customer.html
let newCustomer =
  localStorage.getItem("newCustomer") != null
    ? JSON.parse(localStorage.getItem("newCustomer"))
    : "";

let updatedCustomer =
  localStorage.getItem("updateCustomer") != null
    ? JSON.parse(localStorage.getItem("updateCustomer"))
    : "";

let customersList = getCustomers();

if (newCustomer) {
  newCustomer.forEach(customer => customersList.push(customer));
  window.localStorage.removeItem("newCustomer");
}

if (updatedCustomer) {
  let custId = updatedCustomer.id
  customersList = customersList.map(c => c.id == custId ? updatedCustomer : c);
}


customersList.sort(function (a, b) {
  let result = a.lastName.localeCompare(b.lastName)
  return result !== 0 ? result : a.firstName.localeCompare(b.firstName);
});

// Variables
let customersTable = document.getElementById("customers-table");
let filterBtn = document.querySelector(".btn-filter");
let keywordInput = document.querySelector(".keyword");
let msg = document.querySelector(".msg");
//////////////////////////
let pagination_element = document.getElementById("pagination");
let current_page = 1;
let rows =5;

// DOM loaded
window.addEventListener("DOMContentLoaded", () => {
	displayCustomersList(customersTable, customersList, rows, current_page);
  SetUpPagination(customersList, pagination_element, rows);

  let editBtns = document.querySelectorAll(".edit-btn");  
  // Edit button clicked
  editBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      let custId = btn.id.split("-")[1];
      window.location.href = `customer-edit.html?custId=${custId}`;
    })
  );
});

// Filter button clicked
filterBtn?.addEventListener("click", () => {
  let newList;
  if (keywordInput.value == "" ) {
    location.reload();
  } else {
    newList = filterWithKeyword(customersList, keywordInput.value);

    if (newList.length == 0) {
      msg.innerHTML =
          '<span style="color:#fc4903; padding-left: 40px;">There is no data matching your search query</span>';
      } else {
        //displayCustomersListFilter(customersTable, newList);
        displayCustomersList(customersTable, newList, rows, current_page);
        SetUpPagination(newList, pagination_element, rows);
        msg.innerHTML =
          '<a href="customers.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
      }
    }
    keywordInput.value = "";
});

function SetUpPagination(customersList, wrapper, row_per_page) {
  wrapper.innerHTML = "";
  let page_count = Math.ceil(customersList.length / row_per_page);
  for (let i = 1; i < page_count + 1; i++) {
    let btn = PaginationButton(i, customersList);
    wrapper.appendChild(btn);
  }
}

function PaginationButton(page, customersList) {
  let button = document.createElement("button");
  button.innerText = page;

  if (current_page == page) button.classList.add("active");
  button.addEventListener("click", function () {
    current_page = page;
    displayCustomersList(customersTable, customersList, rows, current_page);
    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");
    button.classList.add("active");
  });
  return button;
}

function format(number){
  var num_sf= number
  var num_cf=''
  num_cf="("+num_sf.substring(0,3)+")"+"-"
  num_cf+=num_sf.substring(3,6)+"-"
  num_cf+=num_sf.substring(6,10)
  return num_cf;
  }


function displayCustomersList(wrapper, arr, row_per_page, page) {
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
        <td>${paginatedItems[i].postalCode}</td>
				<td>${format(paginatedItems[i].phone)}</td>
        <td><button class='edit-btn' id='customer-${paginatedItems[i].id}'>EDIT</button></td>
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
      item.postalCode.toLowerCase().includes(kword) 
  );
}




