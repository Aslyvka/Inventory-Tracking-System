import { getSalesList } from "./data.mjs";
let salesList = getSalesList();

// Display the list descending by 'Order Date'
salesList = salesList.sort((a, b) => {
  let dateA = a.date;
  let dateB = b.date;
  let result = 0;
  result = dateA > dateB ? -1 : 1;
  return result;
});

let salesTable = document.getElementById("sales-table");
let keywordFilter = document.querySelector(".keyword");
let dateStart = document.querySelector(".date-start");
let dateEnd = document.querySelector(".date-end");
let filterBtn = document.querySelector(".btn-filter");
let msg = document.querySelector(".msg");
let sortSalesBtn = document.querySelector(".sort-sales");

window.addEventListener("DOMContentLoaded", () => {
  displaySalesList(salesTable, salesList);
});

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
      newList = filterWithKeyword(salesList, keywordFilter.value);
      if (newList.length == 0) {
        msg.innerHTML =
          '<p style="color:tomato; padding-left: 32px;">There is no data match your search query</p>';
      } else {
        displaySalesList(salesTable, newList);
      }
    }
    if (dateStart.value != "" || dateEnd.value != "") {
      newList = filterByDates(salesList, dateStart.value, dateEnd.value);
      if (newList.length == 0) {
        msg.innerHTML =
          '<p style="color:tomato; padding-left: 32px;">There is no data match your search query</p>';
      } else {
        console.log(newList);
        displaySalesList(salesTable, newList);
      }
    }
    clearField();
  }
});

function displaySalesList(table, arr) {
  let rows = "";
  for (let i = 0; i < arr.length; i++) {
    let originalPrice = Number(arr[i].price).toFixed(2);
    let unitPrice = (arr[i].price * 1.01 * 1.23).toFixed(2);
    let net = (arr[i].quantity * Number(unitPrice)).toFixed(2);
    let tax = (Number(net) * 0.13).toFixed(2);
    let total = (Number(net) + Number(tax)).toFixed(2);

    rows += `<tr><td>${i + 1}</td>
        <td>${arr[i].date}</td>
        <td>${arr[i].section}</td>
        <td>${arr[i].UPC}</td>
        <td>${arr[i].itemName}</td>
        <td>${arr[i].customer}</td>
        <td>${arr[i].invoiceNumber}</td>
        <td>${arr[i].quantity}</td>
        <td>$${originalPrice}</td>
				<td>$${unitPrice}</td>
				<td>$${net}</td>
				<td>$${tax}</td>
				<td>$${total}</td>
			</tr>`;
  }
  table.innerHTML = rows;
}

function filterWithKeyword(arr, kword) {
  kword = kword.toLowerCase();
  return arr.filter(
    (item) =>
      item.UPC.toLowerCase().includes(kword) ||
      item.itemName.toLowerCase().includes(kword) ||
      item.customer.toLowerCase().includes(kword) ||
      item.invoiceNumber.toLowerCase().includes(kword)
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

// Sort by sales date
sortSalesBtn?.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-caret-down")) {
    e.target.classList.remove("fa-caret-down");
    e.target.classList.add("fa-caret-up");
    salesList = salesList.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    //console.log(orderList);
  } else {
    e.target.classList.remove("fa-caret-up");
    e.target.classList.add("fa-caret-down");
    salesList = salesList.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }
  displaySalesList(salesTable, salesList);
});