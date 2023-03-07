import { getSalesListDemo } from "./data.mjs";
let salesList = getSalesListDemo();


let salesTable = document.getElementById("sales-table");
let keywordFilter = document.querySelector(".keyword");
let dateStart = document.querySelector(".date-start");
let dateEnd = document.querySelector(".date-end");
let filterBtn = document.querySelector(".btn-filter");
let radioBtns = document.querySelectorAll('input[name="saleslist-radio"]');
let msg = document.querySelector(".msg");
let sortSalesBtn = document.querySelector(".sort-sales");

//////////////////////////
let pagination_element = document.getElementById("pagination");
let current_page = 1;
let rows = 5;

window.addEventListener("DOMContentLoaded", () => {
  displaySalesList(salesTable, salesList, rows, current_page);
  SetUpPagination(salesList, pagination_element, rows);
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
        //displaySalesList(salesTable, newList);
        displaySalesList(salesTable, newList, rows, current_page);
        SetUpPagination(newList, pagination_element, rows);
      }
    }
    if (dateStart.value != "" || dateEnd.value != "") {
      newList = filterByDates(salesList, dateStart.value, dateEnd.value);
      if (newList.length == 0) {
        msg.innerHTML =
          '<p style="color:tomato; padding-left: 32px;">There is no data match your search query</p>';
      } else {
        // console.log(newList);
        //displaySalesList(salesTable, newList);
        displaySalesList(salesTable, newList, rows, current_page);
        SetUpPagination(newList, pagination_element, rows);
      }
    }
    clearField();
  }
});

radioBtns.forEach(btn => {
  btn.addEventListener("change", e => radioBtnClicked(e))
})

sortSalesBtn?.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-caret-down")) {
    e.target.classList.remove("fa-caret-down");
    e.target.classList.add("fa-caret-up");
    salesList = salesList.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  } else {
    e.target.classList.remove("fa-caret-up");
    e.target.classList.add("fa-caret-down");
    salesList = salesList.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }
  //displayOrderList(orderTable, orderList);
  displaySalesList(salesTable, salesList, rows, current_page);
  SetUpPagination(salesList, pagination_element, rows);
})

function radioBtnClicked(e) {
  let query = e.target.value;
  let newArray;

  if (query == "Credit") {
    newArray = salesList.filter(item => item.payment.paymentMethod == 'credit')
  } else if (query == "Debit") {
    newArray = salesList.filter(item => item.payment.paymentMethod == 'debit')
  } else if (query == "Cash") {
    newArray = salesList.filter(item => item.payment.paymentMethod == 'cash')
  } else if (query == "All") {
    newArray = salesList
  }
  displaySalesList(salesTable, newArray, rows, current_page);
  SetUpPagination(newArray, pagination_element, rows)
}

function SetUpPagination(salesList, wrapper, row_per_page){
  wrapper.innerHTML ="";
  let page_count =Math.ceil(salesList.length/row_per_page)
  for (let i = 1; i < page_count + 1; i++ ){
      let btn = PaginationButton(i,salesList);
      wrapper.appendChild(btn);
  }
}

function PaginationButton(page,salesList){
  let button = document.createElement('button');
  button.innerText= page;

  if(current_page == page)button.classList.add('active');
  button.addEventListener('click', function(){
      current_page = page;
      displaySalesList(salesTable, salesList, rows, current_page);
      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');
      button.classList.add('active');
  });
  return button;
}

function displaySalesList(table, arr, row_per_page, page) {
  table.innerHTML ="";
  page--;
  let start = row_per_page*page;
  let end = start+row_per_page;
  let paginatedItems = arr.slice(start,end);

  let rows = "";
  for (let i = 0; i < paginatedItems.length; i++) {
	let itemsArr = paginatedItems[i].items;
	let totalNet = 0;
	itemsArr.forEach(elem => {
		totalNet += (elem.price * elem.quantity)
	});

    rows += `<tr>
		<td>${paginatedItems[i].invoiceNum.toUpperCase()}</td>
        <td>${paginatedItems[i].date}</td>
        <td>${totalNet.toFixed(2)}</td>
        <td>$${(totalNet * 0.13).toFixed(2)}</td>
        <td>$${(totalNet * 1.13).toFixed(2)}</td>
        <td>${paginatedItems[i].payment.paymentMethod}</td>
        <td>${paginatedItems[i].employee}</td>
		<td><button class='edit-btn' id='${paginatedItems[i].invoiceNum}'>DETAILS</button></td>
	</tr>`;
  }
  table.innerHTML = rows;

  let detailBtns = salesTable?.querySelectorAll(".edit-btn");
  detailBtns?.forEach(btn => btn.addEventListener("click", () => {
	let id = btn.id;
	let detailsContainer = btn.parentElement?.parentElement;
	let invoiceDetail = salesList.find((elem) => elem.invoiceNum == id).items;
	
	if (btn.classList.contains("show-details")) {
		btn.classList.remove("show-details");
		btn.textContent = "DETAILS";
		for (let i = 0; i < invoiceDetail.length; i++) {
			let tr = detailsContainer?.nextElementSibling;
			tr?.remove();
		}
	} else {
		btn.classList.add("show-details");
		btn.textContent = "CLOSE";

		for (let i = 0; i < invoiceDetail.length; i++) {
			let tr = document.createElement("tr");
			tr.classList.add("sales-details")
			tr.innerHTML = `
				<tr>
					<td></td>
					<td>${invoiceDetail[i].UPC}</td>
					<td colspan="2">${invoiceDetail[i].itemName}</td>
					<td>Qty : ${invoiceDetail[i].quantity}</td>
					<td>Price : $${(invoiceDetail[i].price).toFixed(2)}</td>
					<td>Total : $${(invoiceDetail[i].quantity * invoiceDetail[i].price).toFixed(2)}</td>
          <td>
				<tr>
				<br/>`;
			detailsContainer.parentNode.insertBefore(tr,detailsContainer.nextElementSibling)
		}
	}}))
}

function filterWithKeyword(arr, kword) {
  kword = kword.toLowerCase();
  return arr.filter(
    (item) =>
      item.invoiceNum.toLowerCase().includes(kword) ||
      item.employee.toLowerCase().includes(kword) 
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

// // Sort by sales date
// sortSalesBtn?.addEventListener("click", (e) => {
//   if (e.target.classList.contains("fa-caret-down")) {
//     e.target.classList.remove("fa-caret-down");
//     e.target.classList.add("fa-caret-up");
//     salesList = salesList.sort((a, b) => {
//       return new Date(a.date) - new Date(b.date);
//     });
//     //console.log(orderList);
//   } else {
//     e.target.classList.remove("fa-caret-up");
//     e.target.classList.add("fa-caret-down");
//     salesList = salesList.sort((a, b) => {
//       return new Date(b.date) - new Date(a.date);
//     });
//   }
//   displaySalesList(salesTable, salesList);
// });