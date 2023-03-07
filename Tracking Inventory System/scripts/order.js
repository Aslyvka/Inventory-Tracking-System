import { getOrderList } from "./data.mjs";
let newItem =
  localStorage.getItem("newOrder") != null
    ? JSON.parse(localStorage.getItem("newOrder"))
    : "";

let orderList = getOrderList();
if (newItem) {
  newItem.forEach(item => orderList.push(item));
  window.localStorage.removeItem("newOrder");
}


// Display the list descending by 'Order Date'
orderList = orderList.sort((a, b) => {
  let dateA = a.requestedDate;
  let dateB = b.requestedDate;
  let result = 0;
  result = dateA > dateB ? -1 : 1;
  return result;
});

// Variables
let orderTable = document.getElementById("order-table");
let orderDateBtn = document.querySelector(".order-date");
let keywordFilter = document.querySelector(".keyword");
let dateStart = document.querySelector(".date-start");
let dateEnd = document.querySelector(".date-end");
let filterBtn = document.querySelector(".btn-filter");
let radioBtns = document.querySelectorAll('input[name="orderlist-radio"]');
let editModal = document.querySelector(".edit-modal");
let editInfo = document.querySelector(".edit-info");

let msg = document.querySelector(".msg");
let requestDateSortBtn = document.querySelector(".sort-request");
let orderDateSortBtn = document.querySelector(".sort-order");
let receivedDateSortBtn = document.querySelector(".sort-receive");
//////////////////////////
let pagination_element = document.getElementById("pagination");
let current_page = 1;
let rows = 5;

function SetUpPagination(orderList, wrapper, row_per_page){
  wrapper.innerHTML ="";
  let page_count =Math.ceil(orderList.length/row_per_page)
  for (let i = 1; i < page_count + 1; i++ ){
      let btn = PaginationButton(i,orderList);
      wrapper.appendChild(btn);
  }
}

function PaginationButton(page,orderList){
  let button = document.createElement('button');
  button.innerText= page;

  if(current_page == page)button.classList.add('active');
  button.addEventListener('click', function(){
      current_page = page;
      displayOrderList(orderTable, orderList, rows, current_page);
      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');
      button.classList.add('active');
  });
  return button;
}
// DOM loaded
window.addEventListener("DOMContentLoaded", () => {
  let filterList = orderList.filter((item) => item.status == "Requested");
  displayOrderList(orderTable, filterList, rows, current_page);
  SetUpPagination(filterList, pagination_element, rows);

  let editBtns = document.querySelectorAll(".edit-btn");
  let saveBtn = document.querySelector(".modal-save");
  let modalCloseBtn = document.querySelector(".modal-close");
  let modalX = document.querySelector(".x")
  let modalProcess = document.querySelector(".modal-process");

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
        newList = filterWithKeyword(orderList, keywordFilter.value);
        if (newList.length == 0) {
          msg.innerHTML =
            '<span style="color:#fc4903; padding-left: 40px;">There is no data matching your search query</span>';
        } else {
          //displayOrderList(orderTable, newList);
          displayOrderList(orderTable, newList, rows, current_page);
          SetUpPagination(newList, pagination_element, rows);
          msg.innerHTML =
            '<a href="order-list.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
        }
      }
      if (dateStart.value != "" || dateEnd.value != "") {
        newList = filterByDates(orderList, dateStart.value, dateEnd.value);
        if (newList.length == 0) {
          msg.innerHTML =
            '<span style="color:#fc4903; padding-left: 40px;">There is no data match your search query</span>';
        } else {
          //displayOrderList(orderTable, newList);
          displayOrderList(orderTable, newList, rows, current_page);
          SetUpPagination(newList, pagination_element, rows);
          msg.innerHTML =
            '<a href="order-list.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
        }
      }
      clearField();
    }
  });

  orderDateBtn?.addEventListener("click", () => {
    let newArray = orderList.sort(sortByDateDesc);
    //displayOrderList(orderTable, newArray);
    displayOrderList(orderTable, newArray, rows, current_page);
    SetUpPagination(newArray, pagination_element, rows);
  });

  // Edit button clicked
  editBtns.forEach((btn) =>
    btn.addEventListener("click", () => OpenModal(btn.id.split("-")[1]))
  );

  // Ordr-Request / Ordered / Arrived - Save button clicked
  saveBtn?.addEventListener("click", () => {
    let id = Number(document.getElementById("order-id").value);
    let newItem = orderList.filter((item) => item.id == id)[0];
    newItem.orderDate = document.getElementById("order-date").value;
    newItem.receivedDate = document.getElementById("received-date").value;
    newItem.orderNum = document.getElementById("order-number").value;
    newItem.supplierCode = document.getElementById("supplier").value;
    newItem.status = document.getElementById("orderStatus").value;
    newItem.quantity = Number(document.getElementById("quantity").value);
    newItem.price = Number(document.getElementById("price").value);

    if (newItem.status == "Arrived") {
      let modalProcessBtns = modalProcess?.querySelectorAll("button");
      // let stayCurrentBtn = document.querySelector(".modal-stay-current");
      // let goInventoryBtn = document.querySelector(".modal-go-inventory");
      localStorage.setItem("newArrival", JSON.stringify(newItem));
      saveBtn.disabled = true;
      modalCloseBtn.disabled = true;
      modalProcess.style.display = "flex";

      modalProcessBtns?.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (btn.classList.contains("modal-stay-current")) {
            saveBtn.disabled = false;
            modalCloseBtn.disabled = false;
            modalProcess.style.display = "none";
            CloseModal();
            let filterList = orderList.filter((item) => item.status == "Ordered");
            displayOrderList(orderTable, filterList, rows, current_page);
            SetUpPagination(filterList, pagination_element, rows);
            // displayOrderList(
            //   orderTable,
            //   orderList.filter((item) => item.status == "Ordered")
            // );
            editBtns = document.querySelectorAll(".edit-btn");
            editBtns.forEach((btn) =>
              btn.addEventListener("click", () =>
                OpenModal(btn.id.split("-")[1])
              )
            );
          } else {
            saveBtn.disabled = false;
            modalCloseBtn.disabled = false;
            modalProcess.style.display = "none";
            location.href = "inventory.html";
          }
        });
      });
    } else {
      let listIndex = orderList.findIndex((item) => item.id == id);
      orderList[listIndex] = newItem;
      CloseModal();
      window.document.dispatchEvent(
        new Event("DOMContentLoaded", { bubbles: true, cancelable: true })
      );
    }
  });

  // Cancel button clicked
  modalCloseBtn?.addEventListener("click", () => CloseModal());
  modalX?.addEventListener("click", () => CloseModal());
});

// Open edit-modal
function OpenModal(id) {
  editModal.style.display = "flex";
  let selected = orderList.filter((item) => item.id == id)[0];
  let editHtml = displayEditOrder(selected);
  editInfo.innerHTML += editHtml;

  // variables
  let orderDate = editInfo?.querySelector("#order-date");
  let receiveDate = editInfo?.querySelector("#received-date");
  orderDate.addEventListener("change", () => {
    editInfo.querySelector("#orderStatus").innerHTML = 
      `<option value="Requested" >Requested</option>
      <option value="Ordered" selected="selected">Ordered</option>
      <option value="Arrived>Arrived</option>`
  })
  receiveDate.addEventListener("change", () => {
    editInfo.querySelector("#orderStatus").innerHTML = 
    `<option value="Requested" >Requested</option>
      <option value="Ordered">Ordered</option>
      <option value="Arrived" selected="selected">Arrived</option>`;
  });
}

function displayEditOrder(selected) {
  let orderDateInput = selected.orderDate 
    ? `<input type="date" id="order-date" disabled="true" value=${selected.orderDate} />` 
    : `<input type="date" id="order-date" value="" />`;
  
  let receivedDateInput = selected.receivedDate
    ? `<input type="date" id="received-date" disabled="true" value=${selected.receivedDate} />`
    : `<input type="date" id="received-date"   value="" />`;

  return `
  <div class="d-flex">
    <div class="flex-1">
        <input type="hidden" id="order-id" name="orderID" value="${
          selected.id
        }">
        <div class="d-flex ai-center">
            <label for="upc">UPC Code</label>
            <p>${selected.UPC}</p>
        </div>
        <div class="d-flex ai-center">
            <label for="requested-date">Requested Date</label>
            <p>${selected.requestedDate}</p>
        </div>
        <div class="d-flex ai-center">
            <label for="order-date">Order Date</label>
            ${orderDateInput}
        </div>
        <div class="d-flex ai-center">
            <label for="received-date">Received Date</label>
            ${receivedDateInput}
        </div>
        <div class="d-flex ai-center">
            <label for="order-number">Order Number</label>
            <input type="text" id="order-number" value="${selected.orderNum}">
        </div>
    </div>
    <div class="flex-1">
        <div class="d-flex ai-center">
            <label for="name">Item Name</label>
            <p>${selected.itemName}</p>
        </div>
        <div class="d-flex ai-center">
            <label for="supplier">Supplier Code</label>
            <input type="text" id="supplier" value="${selected.supplierCode}">
        </div>
        <div class="d-flex ai-center">
            <label for="orderStatus">Status</label>
            <select name="orderStatus" id="orderStatus" >
                <option value="Requested" ${
                  selected.status == "Requested" ? "selected" : ""
                } >Requested</option>
                <option value="Ordered" ${
                  selected.status == "Ordered" ? "selected" : ""
                } >Ordered</option>
                <option value="Arrived" ${
                  selected.status == "Arrived" ? "selected" : ""
                } >Arrived</option>
            </select>
        </div>
        <div class="d-flex ai-center">
            <label for="quantity">Quantity</label>
            <input type="text" id="quantity" value="${selected.quantity}">
        </div>
        <span style="color:tomato; font-size: 15px; margin-left: 12px;"></span>
        <div class="d-flex ai-center">
            <label for="price">Original Price</label>
            <input type="text" id="price" value="${selected.price}">
        </div>
        <span style="color:tomato; font-size: 15px; margin-left: 12px;"></span>
    </div>
</div>
  `;
}

// Close modal
function CloseModal() {
  editModal.style.display = "none";
  editInfo.innerHTML = "<div><div/>";
}

function displayOrderList(table, arr, row_per_page, page) {
  table.innerHTML ="";
  page--;
  let start = row_per_page*page;
  let end = start+row_per_page;
  let paginatedItems = arr.slice(start,end);

  let rows = "";
  for (let i = 0; i < paginatedItems.length; i++) {
    rows += `<tr>
            <td class="table-upc">${paginatedItems[i].UPC}</td>
            <td>${paginatedItems[i].requestedDate}</td>
						<td>${paginatedItems[i].orderDate ? paginatedItems[i].orderDate : "-"}</td>
						<td>${paginatedItems[i].receivedDate ? paginatedItems[i].receivedDate : "-"}</td>
            <td class="table-orderNum">${
              paginatedItems[i].orderNum ? paginatedItems[i].orderNum : "-"
            }</td>
						<td class="table-name">${paginatedItems[i].itemName}</td>
						<td class="table-supplier">${paginatedItems[i].supplierCode}</td>
						<td class="table-status">${paginatedItems[i].status}</td>
						<td>${paginatedItems[i].quantity}</td>
						<td>$${Number(paginatedItems[i].price).toFixed(2)}</td>
						<td>$${paginatedItems[i].quantity * paginatedItems[i].price}</td>
            <td><button class='edit-btn' id='order-${
              paginatedItems[i].id
            }'>EDIT</button></td>
					</tr>`;
  }
  table.innerHTML = rows;
}

// Filter function
function filterWithKeyword(arr, kword) {
  kword = kword.toLowerCase();
  return arr.filter(
    (item) =>
      item.orderNum.toLowerCase().includes(kword) ||
      item.UPC.toLowerCase().includes(kword) ||
      item.itemName.toLowerCase().includes(kword) ||
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
  return arr.filter(
    (item) => item.orderDate >= date1 && item.orderDate <= date2
  );
}

function clearField() {
  keywordFilter.value = "";
  dateStart.value = "";
  dateEnd.value = "";
}

function showRadioClicked(e) {
  let query = e.target.value;
  let newArray;

  if (query == "requested") {
    newArray = orderList.filter((item) => item.status == "Requested");
    //displayOrderList(orderTable, newArray);
    displayOrderList(orderTable, newArray, rows, current_page);
    SetUpPagination(newArray, pagination_element, rows);  
  } else if (query == "ordered") {
    newArray = orderList.filter((item) => item.status == "Ordered");
    //displayOrderList(orderTable, newArray);
    displayOrderList(orderTable, newArray, rows, current_page);
    SetUpPagination(newArray, pagination_element, rows);
  } else if (query == "arrived") {
    newArray = orderList.filter((item) => item.status == "Arrived");
    //displayOrderList(orderTable, newArray);
    displayOrderList(orderTable, newArray, rows, current_page);
    SetUpPagination(newArray, pagination_element, rows);
  } else if (query == "all") {
    //displayOrderList(orderTable, orderList);
    displayOrderList(orderTable, orderList, rows, current_page);
    SetUpPagination(orderList, pagination_element, rows);
  }

  let editBtns = document.querySelectorAll(".edit-btn");
  // let saveBtn = document.querySelector(".modal-save");
  // let modalCloseBtn = document.querySelector(".modal-close");

  // Edit button clicked
  editBtns.forEach((btn) =>
    btn.addEventListener("click", () => OpenModal(btn.id.split("-")[1]))
  );
}


// Radio buttons function
radioBtns.forEach((btn) =>
  btn.addEventListener("change", (e) => showRadioClicked(e))
);
// Sort by Request date
requestDateSortBtn?.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-caret-down")) {
    e.target.classList.remove("fa-caret-down");
    e.target.classList.add("fa-caret-up");
    orderList = orderList.sort((a, b) => {
      return new Date(a.requestedDate) - new Date(b.requestedDate);
    });
    //console.log(orderList);
  } else {
    e.target.classList.remove("fa-caret-up");
    e.target.classList.add("fa-caret-down");
    orderList = orderList.sort((a, b) => {
      return new Date(b.requestedDate) - new Date(a.requestedDate);
    });
  }
  //displayOrderList(orderTable, orderList);
  displayOrderList(orderTable, orderList, rows, current_page);
  SetUpPagination(orderList, pagination_element, rows);
});

// Sort by Order date
orderDateSortBtn?.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-caret-down")) {
    e.target.classList.remove("fa-caret-down");
    e.target.classList.add("fa-caret-up");
    orderList = orderList.sort((a, b) => {
      return new Date(a.orderDate) - new Date(b.orderDate);
    });
    //console.log(orderList);
  } else {
    e.target.classList.remove("fa-caret-up");
    e.target.classList.add("fa-caret-down");
    orderList = orderList.sort((a, b) => {
      return new Date(b.orderDate) - new Date(a.orderDate);
    });
  }
  //displayOrderList(orderTable, orderList);
  displayOrderList(orderTable, orderList, rows, current_page);
  SetUpPagination(orderList, pagination_element, rows);
});

// Sort by Recieved date
receivedDateSortBtn?.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-caret-down")) {
    e.target.classList.remove("fa-caret-down");
    e.target.classList.add("fa-caret-up");
    orderList = orderList.sort((a, b) => {
      return new Date(a.receivedDate) - new Date(b.receivedDate);
    });
    //console.log(orderList);
  } else {
    e.target.classList.remove("fa-caret-up");
    e.target.classList.add("fa-caret-down");
    orderList = orderList.sort((a, b) => {
      return new Date(b.receivedDate) - new Date(a.receivedDate);
    });
  }
  //displayOrderList(orderTable, orderList);
  displayOrderList(orderTable, orderList, rows, current_page);
  SetUpPagination(orderList, pagination_element, rows);
});
