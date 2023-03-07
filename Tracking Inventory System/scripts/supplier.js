import { getSuppliers } from "./data.mjs";

//I get the new supplier from add-supplier.html
let newSupplier =
localStorage.getItem("newSupplier") != null
    ? JSON.parse(localStorage.getItem("newSupplier"))
    : "";

    let updatedSupplier =
  localStorage.getItem("updateSupplier") != null
    ? JSON.parse(localStorage.getItem("updateSupplier"))
    : "";

let supplierList = getSuppliers();
if (newSupplier) {
  newSupplier.forEach(supplier => supplierList.push(supplier));
  window.localStorage.removeItem("newSupplier");
}

if (updatedSupplier) {
  let suppId = updatedSupplier.id
  supplierList = supplierList.map(c => c.id == suppId ? updatedSupplier : c);
}

// Variables
let supplierTable = document.getElementById("suppliers-table");
let filterBtn = document.querySelector(".btn-filter");
let keywordInput = document.querySelector(".keyword");
let msg = document.querySelector(".msg");
//////////////////////////
let pagination_element = document.getElementById("pagination");
let current_page = 1;
let rows =5;

function SetUpPagination(supplierList, wrapper, row_per_page){
  wrapper.innerHTML ="";
  let page_count =Math.ceil(supplierList.length/row_per_page)
  for (let i = 1; i < page_count + 1; i++ ){
      let btn = PaginationButton(i,supplierList);
      wrapper.appendChild(btn);
  }
}

function PaginationButton(page,supplierList){
  let button = document.createElement('button');
  button.innerText= page;

  if(current_page == page)button.classList.add('active');
  button.addEventListener('click', function(){
      current_page = page;
      displaySupplierList(supplierTable, supplierList, rows, current_page);
      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');
      button.classList.add('active');
  });
  return button;
}
//////////////////////////
// DOM loaded
window.addEventListener("DOMContentLoaded", () => {
	displaySupplierList(supplierTable, supplierList, rows, current_page);
  SetUpPagination(supplierList, pagination_element, rows);

  // Filter button clicked
filterBtn?.addEventListener("click", () => {
  let newList;
  if (keywordInput.value == "" ) {
    location.reload();
  } else {
    newList = filterWithKeyword(supplierList, keywordInput.value);
    console.log(newList)
    if (newList.length == 0) {
    msg.innerHTML =
          '<span style="color:#fc4903; padding-left: 40px;">There is no data match your search query</span>';
      } else {
        //displaySupplierListFilter(supplierTable, newList);
        displaySupplierList(supplierTable, newList, rows, current_page);
        SetUpPagination(newList, pagination_element, rows);
        msg.innerHTML =
          '<a href="supplier.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
      }
    }
    keywordInput.value = "";
});

  let editBtns = document.querySelectorAll(".edit-btn");
  // Edit button clicked
  editBtns.forEach((btn) =>
  btn.addEventListener("click", () =>{
    let suppId = btn.id.split("-")[1];
    window.location.href = `supplier-edit.html?suppId=${suppId}`;
  })
  );
});

function format(number){
  var num_sf= number
  var num_cf=''
  num_cf="("+num_sf.substring(0,3)+")"+"-"
  num_cf+=num_sf.substring(3,6)+"-"
  num_cf+=num_sf.substring(6,9)
  return num_cf;
  }

function displaySupplierList(wrapper, arr, row_per_page, page) {
  wrapper.innerHTML ="";
  page--;
  let start = row_per_page*page;
  let end = start+row_per_page;
  let paginatedItems = arr.slice(start,end);

  let rows = "";
  for (let i = 0; i < paginatedItems.length; i++) {
    rows += `<tr>
				<td>${paginatedItems[i].supplierCode}</td>
				<td>${paginatedItems[i].supplierName}</td>
				<td>${paginatedItems[i].postalCode}</td>
        <td>${paginatedItems[i].email}</td>
        <td>${format(paginatedItems[i].phone)}</td>
        <td>${paginatedItems[i].gender}</td>
        <td>${paginatedItems[i].contactName}</td>
        <td><button class='edit-btn' id='supplier-${
          paginatedItems[i].id
        }'>EDIT</button></td>
        
		</tr>`;
  }
  wrapper.innerHTML = rows;
}


  
  


  // Filter function
  function filterWithKeyword(arr, kword) {
    kword = kword.toLowerCase();
    return arr.filter(
      (item) =>
        item.supplierName.toLowerCase().includes(kword) ||
        item.email.toLowerCase().includes(kword) ||
        item.phone.toLowerCase().includes(kword) ||
        item.postalCode.toLowerCase().includes(kword) 
    );
  }