let salesInfo =
  localStorage.getItem("salesInfo") != null
    ? JSON.parse(localStorage.getItem("salesInfo"))
    : {};

let newCust =
localStorage.getItem("newCustomer") != null
	? JSON.parse(localStorage.getItem("newCustomer"))
	: [];

import { getInventoryList, getCustomers } from "./data.mjs";
let inventoryList = getInventoryList();


// Variables
let invoiceProductContainer = document.querySelector(".invoice-product-container");
let itemsList = document.querySelector(".items-list");
let invoiceNumber = document.querySelector(".invoice-number");
let invoiceDate = document.querySelector(".invoice-date");
let newSalesBtn = document.querySelector(".new-sales-btn");
let printInvoice = document.querySelector(".print-invoice");
let printMsg = document.querySelector(".print-msg");

window.addEventListener("DOMContentLoaded", () => {
	invoiceDate.innerHTML = getDate();
	getCustomerInfo(salesInfo);
	getSalesProducts(salesInfo.products);
	getAllPrices(salesInfo.amount);
	if (window.location.pathname == "/print-invoice.html") {
		setTimeout(()=> {window.location.href = "invoice-sale.html";}, 15000)
	}
})

newSalesBtn?.addEventListener("click", () => {
	localStorage.removeItem("salesInfo");
	localStorage.removeItem("newCustomer");
	window.location.href = "sales-form.html";
})

printInvoice?.addEventListener("click", () => {
	printMsg.innerHTML = "Sending data to printer...";
	setTimeout(() => {
		printMsg.innerHTML=''
		window.location.href = "print-invoice.html";
	}, 2000);
	// localStorage.removeItem("salesInfo");
	// localStorage.removeItem("newCustomer");
//   window.location.href = "home.html";
});

function getDate() {
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, "0");
	let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	let yyyy = today.getFullYear();
	return `${yyyy}-${mm}-${dd}`
}

function getCustomerInfo(data) {
	let custName = document.querySelector(".cust-name");
	let custDetail = document.querySelector(".cust-detail");
	
	if (data.customer?.customerCode || newCust.length >0) {
		let customerData = (data.customer) ? data.customer : newCust[0];
		custName.innerHTML = `${customerData.gender}. ${customerData.firstName} ${customerData.lastName}`
		custDetail.innerHTML = `${customerData.street} 
			<br />${customerData.city}, ${customerData.province}
	  		<br />${customerData.postalCode}
			<br />${phoneFormatted(customerData.phone)}`;
	} else {
		custName.innerHTML = "N/A";
		custDetail.innerHTML = "";
	}
}

function phoneFormatted(phone) {
	let areaCode = phone.substring(0, 3);
	let middle = phone.substring(3, 6);
	let last = phone.substring(6, 10);
	return `(${areaCode}) ${middle}-${last}`;
}

// purchase products infomation
function getSalesProducts(products) {
	products.forEach(p => {
		let upc = inventoryList.find(invItem => invItem.itemName == p.itemName).UPC
		let trElem = document.createElement("tr");
		trElem.classList.add("item");
		trElem.innerHTML = `
			<td>${upc}</td>
			<td>${p.itemName}</td>
			<td>$${p.price}</td>
			<td>${p.salesQuantity}</td>
			<td>$${p.price * p.salesQuantity}</td>
		`;
		// invoiceProductContainer?.appendAfter(tr);
		itemsList.parentNode?.insertBefore(trElem, itemsList?.nextSibling);
	});
}

// payment infomation
function getAllPrices(amount) {
	let netAmount = document.querySelector(".net");
	let taxAmount = document.querySelector(".tax");
	let totalAmount = document.querySelector(".total-amount");
	let paymentInfo = document.querySelector(".payment")
	let payment = amount.selectedPayInfo;
	let newPayment ={}
	let creditCardDetails = "";
	let payDetails = "";

	if (amount.creditInfo) {
		creditCardDetails += `Card Holder: ${amount.creditInfo.fName}<br/>Card Number: ${amount.creditInfo.cardNum}`;
	}
	
	Object.entries(payment)
		.filter(([, value]) => value != "")
		.forEach(([k, v]) => newPayment[k] = v)

	for (let key in newPayment) {
		if (key == "Credit Card") {
			payDetails += `${key}  $${newPayment[key]}<br />${creditCardDetails}<br /><br />`;
		} else {
			payDetails += `${key}  $${newPayment[key]}<br />`
		}
	}
	
	netAmount.innerHTML = `$${amount.netTotal}`;
	taxAmount.innerHTML = `$${amount.taxTotal}`;
	totalAmount.innerHTML = `$${amount.amountTotal}`;
	paymentInfo.innerHTML = payDetails;
}
