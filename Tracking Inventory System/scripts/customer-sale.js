import { getCustomers } from "./data.mjs";
let customersList = getCustomers();

let salesInfo =
  localStorage.getItem("salesInfo") != null
    ? JSON.parse(localStorage.getItem("salesInfo"))
    : {};

// Variables
let addNewCustomerBtn = document.querySelector(".new-customer-btn");
let findCustomerBtn = document.querySelector(".find-customer-btn");
let postalEnterBtn = document.querySelector(".postal-enter-btn");
let backBtn = document.querySelector(".back-btn");
let skipBtn = document.querySelector(".skip-btn");
let postalInput = document.querySelector(".postalCode-input");
let salesCustomerMsg = document.querySelector(".request-msg");
let editModal = document.querySelector(".edit-modal");
let modalX = document.querySelector(".x");
let searchCustomerInput = document.querySelector(".search-customer-input");
let searchCustomerBtn = document.querySelector(".search-customer-btn");
let customerResult = document.querySelector(".result");
let tableBody = document.querySelector(".table-body");
let modalMgs = document.querySelector(".modal-msg");
let question = document.querySelector(".question");
let help = document.querySelector(".help");

// When the page loaded, focus on input box
window.addEventListener("DOMContentLoaded", postalInput.focus());

// Click 'Add New Customer' button 
addNewCustomerBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "new-customer.html";
});

// Click 'Find Customer' button 
findCustomerBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  editModal.style.display = "flex";
  searchCustomerInput.focus();
  tableBody.innerHTML = `<div></div>`;
});

// type 'Postal code' and click 'ENTER' button
postalEnterBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  postalCodeInputProcess();
});

// type 'Postal code' and press 'ENTER' keyboard
postalInput?.addEventListener("keyup", (e) => {
	e.preventDefault();
  	if (e.keyCode === 13) {
		postalCodeInputProcess();
	}
})

backBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "sales-form.html";
});

skipBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "summary-sale.html";
});


// With Modal button and input event
searchCustomerInput?.addEventListener("focus", () => (modalMgs.innerHTML = ""));

searchCustomerInput?.addEventListener("keyup", (e) => {
	e.preventDefault();
	if (e.keyCode === 13) {
		searchCustomerAndDisplay();
	}
})


searchCustomerBtn?.addEventListener("click", (e) => {
	e.preventDefault();
	searchCustomerAndDisplay();
});


modalX?.addEventListener("click", () => editModal.style.display = "none");

postalInput?.addEventListener("focus", () => (salesCustomerMsg.innerHTML = ""));



function postalCodeInputProcess() {
	let regex = /^[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]$/;
	let pr = regex.test(postalInput?.value);
	let customerInfo = {};
	salesCustomerMsg.innerHTML = "";
	
	if (pr === true) {
		customerInfo.postalCode = postalInput?.value;
		salesInfo.customer = customerInfo;
		localStorage.removeItem("salesInfo");
		localStorage.setItem("salesInfo", JSON.stringify(salesInfo));
		// salesCustomerMsg.innerHTML = "valid postal code";
		window.location.href = "summary-sale.html";
	} else {
		salesCustomerMsg.style.color = "tomato";
		salesCustomerMsg.innerHTML = "Invalid Postal Code";
	}
	postalInput.value = "";
}

function searchCustomerAndDisplay() {
	let result = searchCustomerByInput(searchCustomerInput.value);
	tableBody.innerHTML = `<div></div>`;
	modalMgs.innerHTML = "";
	if (result.length > 0) {
		customerResult.style.display = "block";

		result.forEach((customer) => {
		let tr = document.createElement("tr");
		tr.setAttribute("id", customer.id);
		tr.innerHTML = `
					<tr>
						<td>${customer.gender}</td>
						<td>${customer.firstName}</td>
						<td>${customer.lastName}</td>
						<td>${customer.postalCode}</td>
						<td>${customer.email}</td>
						<td>${customer.phone}</td>
						<td><span class="select-customer">SELECT</span></td>
					</tr>
				`;
		tableBody?.appendChild(tr);
		searchCustomerInput.value = "";

		let filteredCustomerSelects =
			document.querySelectorAll(".select-customer");
		filteredCustomerSelects.forEach((select) =>
			select.addEventListener("click", () => {
			addCustomerInfo(select);
			})
		);
		});
	} else {
		searchCustomerInput.value = "";
		modalMgs.style.color = "tomato";
		modalMgs.innerHTML = "No Customer Found";
	}
}
function searchCustomerByInput(input) {
  let inputString = input.toLowerCase();
  return customersList.filter(
    (c) =>
      c.firstName.toLowerCase().includes(inputString) ||
      c.lastName.toLowerCase().includes(inputString) ||
      c.phone.includes(inputString)
  );
}

function addCustomerInfo(selectElem) {
  let customerId = selectElem.parentElement.parentElement.id;
  let selectedCustomer = customersList.find((c) => c.id == customerId);
  // add data to localhost
  salesInfo.customer = selectedCustomer;
  localStorage.setItem("salesInfo", JSON.stringify(salesInfo));
  window.location.href = "summary-sale.html";
}

//Help system
question?.addEventListener("click", ()=> {
  if (help?.classList.contains("show")) {
    help.classList.remove("show");
  } else {
    help?.classList.add("show");
  }
})

question?.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    if (help?.classList.contains("show")) {
      help.classList.remove("show");
    } else {
      help?.classList.add("show");
    }
  }
});