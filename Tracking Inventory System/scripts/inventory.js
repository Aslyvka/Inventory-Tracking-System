import { getInventoryList } from "./data.mjs";
let inventoryList = getInventoryList();

// Check new orders arrived
let newArrival = localStorage.getItem("newArrival") != null ? JSON.parse(localStorage.getItem("newArrival")) : "";

if (newArrival) {
  let upc = newArrival.UPC;
  // find the inventory item according to UPC code
  let orderedItem = inventoryList.find(item => item.UPC == upc);
  // if there is not item in the inventory
  if (!orderedItem) {
    inventoryList.push(formatArrivalItem(newArrival))
  } else {
    // check how many items left
    let stockQuatity = orderedItem.quantity;
    if (stockQuatity == 0) {
      orderedItem.quantity = newArrival.quantity;
      orderedItem.price = newArrival.price;
    } else {
      orderedItem.quantity += newArrival.quantity;
      orderedItem.price = Number((orderedItem.price + newArrival.price) / 2).toFixed(2);
    }
  }
  window.localStorage.removeItem("newArrival");
}

function formatArrivalItem(newArrival){
  return {
    id: inventoryList.length + 1,
    date: newArrival.receivedDate,
    category: newArrival.category,
    UPC: newArrival.UPC,
    itemName: newArrival.itemName,
    supplierName: newArrival.supplier,
    supplierCode: newArrival.supplierCode,
    price: newArrival.price,
    quantity: newArrival.quantity,
    status: "Current",
  };
}

// Display the list according to UPC code
// inventoryList.sort((a, b) =>  a.UPC - b.UPC)
inventoryList.sort((a, b) => a.UPC.split("UPC")[1] - b.UPC.split("UPC")[1]);
// Variables
let inventoryTable = document.getElementById("inventory-table");
let keywordFilter = document.querySelector(".keyword");
let dateStart = document.querySelector(".date-start");
let dateEnd = document.querySelector(".date-end");
let filterBtn = document.querySelector(".btn-filter");
let radioBtns = document.querySelectorAll('input[name="inventory-radio"]');
let msg = document.querySelector(".msg");

//////////////////////////
let pagination_element = document.getElementById("pagination");
let current_page = 1;
let rows = 5;

function SetUpPagination(inventoryList, wrapper, row_per_page){
  wrapper.innerHTML ="";
  let page_count =Math.ceil(inventoryList.length/row_per_page)
  for (let i = 1; i < page_count + 1; i++ ){
      let btn = PaginationButton(i,inventoryList);
      wrapper.appendChild(btn);
  }
}

function PaginationButton(page,inventoryList){
  let button = document.createElement('button');
  button.innerText= page;

  if(current_page == page)button.classList.add('active');
  button.addEventListener('click', function(){
      current_page = page;
      displayInventoryList(inventoryTable, inventoryList, rows, current_page);
      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');
      button.classList.add('active');
  });
  return button;
}

// DOM loaded
window.addEventListener("DOMContentLoaded", () => {
  let filterList = inventoryList.filter((item) => item.status == "Current")
  displayInventoryList(inventoryTable, filterList, rows, current_page);
  SetUpPagination(filterList, pagination_element, rows);

  
// Filter button clicked
filterBtn?.addEventListener("click", () => {
  let newList;
  if (
    keywordFilter.value == "" &&
    dateStart.value == "" &&
    dateEnd.value == ""
  ) {
    location.reload();
  } else {
    if (keywordFilter.value != "") {
      newList = filterWithKeyword(inventoryList, keywordFilter.value);
      if (newList.length == 0) {
        msg.innerHTML =
          '<span style="color:#fc4903; padding-left: 40px;">There is no data match your search query</span>';
      } else {
        //displayInventoryListFilter(inventoryTable, newList);
        displayInventoryList(inventoryTable, newList, rows, current_page);
        SetUpPagination(newList, pagination_element, rows);
        msg.innerHTML =
          '<a href="inventory.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
      }
    }
    if (dateStart.value != "" || dateEnd.value != "") {
      newList = filterByDates(inventoryList, dateStart.value, dateEnd.value);
      if (newList.length == 0) {
        msg.innerHTML =
          '<span style="color:#fc4903; padding-left: 40px;">There is no data match your search query</span>';
      } else {
        //displayInventoryListFilter(inventoryTable, newList);
        displayInventoryList(inventoryTable, newList, rows, current_page);
        SetUpPagination(newList, pagination_element, rows);
        msg.innerHTML =
          '<a href="inventory.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
      }
    }
    clearField();
  }
});

// Radio buttons function
radioBtns.forEach((btn) =>
  btn.addEventListener("change", (e) => { showRadioClicked(e)})
);

});

function displayInventoryList(wrapper, arr, row_per_page, page) {
  wrapper.innerHTML ="";
  page--;
  let start = row_per_page*page;
  let end = start+row_per_page;
  let paginatedItems = arr.slice(start,end);

  let rows = "";
  for (let i = 0; i < paginatedItems.length; i++) {
    rows += `<tr>
                <td>${paginatedItems[i].UPC}</td>
                <td>${paginatedItems[i].date}</td>
                <td>${paginatedItems[i].category}</td>
                <td>${paginatedItems[i].itemName}</td>
                <td>${paginatedItems[i].supplierName}</td>
                <td>${paginatedItems[i].supplierCode}</td>
                <td>$ ${Number(paginatedItems[i].price).toFixed(2)}</td>
                <td>${paginatedItems[i].quantity}</td>
                <td>${paginatedItems[i].status}</td>
            </tr>`;
  }
  wrapper.innerHTML = rows;
}


// Filter function
function filterWithKeyword(arr, kword) {
  kword = kword.toLowerCase();
  return arr.filter(
    (item) =>
      item.category.toLowerCase().includes(kword) ||
      item.UPC.toLowerCase().includes(kword) ||
      item.itemName.toLowerCase().includes(kword) ||
      item.supplierName.toLowerCase().includes(kword) ||
      item.supplierCode.toLowerCase().includes(kword)
  );
}

function filterByDates(arr, date1, date2) {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  date1 = date1 == "" ? "2022-01-01" : date1;
  date2 = date2 == "" ? `${yyyy}-${mm}-${dd}` : date2;
  return arr.filter((item) => item.date >= date1 && item.date <= date2);
}

function clearField() {
  keywordFilter.value = "";
  dateStart.value = "";
  dateEnd.value = "";
}



function showRadioClicked(e) {
  let query = e.target.value;
  let newArray;
  switch (query) {
    case "current":
      newArray = inventoryList.filter((item) => item.status == "Current");
      //displayInventoryListFilter(inventoryTable, newArray);
      displayInventoryList(inventoryTable, newArray, rows, current_page);
      SetUpPagination(newArray, pagination_element, rows);
      break;
    case "discontinued":
      newArray = inventoryList.filter((item) => item.status == "Discontinued");
      //console.log(newArray);
      //displayInventoryListFilter(inventoryTable, newArray);
      displayInventoryList(inventoryTable, newArray, rows, current_page);
      SetUpPagination(newArray, pagination_element, rows);
      break;
    case "all":
      //displayInventoryListFilter(inventoryTable, inventoryList);
      displayInventoryList(inventoryTable, inventoryList, rows, current_page);
      SetUpPagination(inventoryList, pagination_element, rows);
      break;
    default:
      break;
  }
}