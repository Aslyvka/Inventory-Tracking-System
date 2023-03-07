let salesInfo =
  localStorage.getItem("salesInfo") != null
    ? JSON.parse(localStorage.getItem("salesInfo"))
    : {};

let newCust =
  localStorage.getItem("newCustomer") != null
    ? JSON.parse(localStorage.getItem("newCustomer"))
    :[];

import { getInventoryList } from "./data.mjs";
let inventoryList = getInventoryList();

let customerInfoContainer = document.querySelector(".customer-info-container");
let productSummaryHead = document.querySelector(".product-summary-head")
let productsContainer = document.querySelector(".products-container");
let itemQuantityElems = document.querySelectorAll(".itemQuantity");
let goBackBtn = document.querySelector(".back-btn");
let confirmBtn = document.querySelector(".confirm-btn");
let message = document.querySelector(".request-msg");
let question = document.querySelector(".question");
let help = document.querySelector(".help");


window.addEventListener("DOMContentLoaded", () => {
	// display customer info
	customerInfoContainer.style.display = "block";
	if (salesInfo.customer?.customerCode) {
		displayCustomerInfo(salesInfo.customer);
	} else if (newCust.length > 0)
		displayCustomerInfo(newCust[0]);
	else {
		customerInfoContainer.style.display = "none";
	}
	//   display products info
	if (salesInfo.products?.length > 0) {
		
		displayTableHead();
		displayProductInfo(salesInfo.products);
		getTotalPrice();
		
		let itemQuantityElems = document.querySelectorAll(".itemQuantity");
		itemQuantityElems.forEach(quantity => {
			quantity.addEventListener("change", () => changeQuantityPrice(quantity))
		})

		itemQuantityElems.forEach((quantity) => {
			quantity.addEventListener("click", () => changeQuantityPrice(quantity));
		});

		let removeBtns = document.querySelectorAll(".remove");
		removeBtns.forEach(btn => btn.addEventListener("click", () => removeItem(btn)))
	} 
});

function displayTableHead() {
	let tableHead = `
    <div class="sales-table-head" >
      <span style="margin-left:20px;">Item</span>
      <span style="margin-left: 110px;">Price</span>
      <span style="margin-left: 36px;">Qty</span>
      <span style="margin-left: 51px;">Net</span>
      <span style="margin-left: 61px;">Tax</span>
      <span style="margin-left: 61px;">Total</span>
	  <span style=""></span>
    </div>
  `;
  productSummaryHead.innerHTML = tableHead;
}

function displayProductInfo(products) {
	products.forEach(p => {
		let inventoryProdQuantity = inventoryList.find((inv) => inv.UPC == p.UPC).quantity;
		let div = document.createElement("div");
		div.classList.add("d-flex");
		div.classList.add("purchased-item");
		div.innerHTML = `
			<input type="text" class="itemName" name="itemName" id="itemName" value="${p.itemName}" style="width: 120px; margin-top: -15px;" required disabled>			
			<input type="text" class="price" name="price" value="$ ${p.price}" id="price" style="width: 50px; margin-top: -15px" required disabled>
			<input type="number" class="itemQuantity" name="itemQuantity" value="${p.salesQuantity}" id="itemQuantity" style="width: 40px; margin-top: -15px" min="1" max="${inventoryProdQuantity}" tabindex="1" required>
			<input type="text" class="net" name="net" value="$ ${p.net}" id="net" style="width: 70px; margin-top: -15px" required disabled>
			<input type="text" class="tax" name="tax" value="$ ${p.tax}" id="tax" style="width: 60px; margin-top: -15px" required disabled>
			<input type="text" class="total" name="total" value="$ ${p.total}" id="total" style="width: 70px; margin-top: -15px" required disabled>
			<button class="remove" tabindex="2" style="margin-top: -15px">REMOVE</button>
		`;
		productsContainer?.appendChild(div);
	})
}

function displayCustomerInfo(customer) {
	let firstName = document.querySelector(".firstName");
	let lastName = document.querySelector(".lastName");
	let phone = document.querySelector(".phone");
	let email = document.querySelector(".email");

	firstName.value = customer.firstName;
	firstName.disabled = true;
	lastName.value = customer.lastName;
	lastName.disabled = true;
	phone.value = customer.phone;
	phone.disabled = true;
	email.value = customer.email;
	email.disabled = true;
}

function changeQuantityPrice(quantityElem) {
	let itemContainer = quantityElem.parentElement;
	let itemName = itemContainer.querySelector(".itemName").value
	let price = itemContainer.querySelector(".price").value.split(" ")[1];
	let quantity = itemContainer.querySelector(".itemQuantity").value;
	let net = itemContainer.querySelector(".net");
	let tax = itemContainer.querySelector(".tax");
	let total = itemContainer.querySelector(".total");
	let inventoryProdQuantity = inventoryList.find((inv) => inv.itemName == itemName)?.quantity;
	// console.log(inventoryProdQuantity);

	if (inventoryProdQuantity < quantity) {
		message.style.color = "tomato";
		message.innerHTML = `Maximum ${inventoryProdQuantity} item${
		inventoryProdQuantity == 1 ? "" : "s"
		} ${inventoryProdQuantity == 1 ? "is" : "are"} available`;
      	itemContainer.querySelector(".itemQuantity").value = inventoryProdQuantity
	} else if (inventoryProdQuantity == quantity) {
		message.style.color = "tomato";
		message.innerHTML = `Maximum ${inventoryProdQuantity} item${
		inventoryProdQuantity == 1 ? "" : "s"
		} ${inventoryProdQuantity == 1 ? "is" : "are"} available`;
		net.value = `$ ${(Number(price) * Number(quantity)).toFixed(2)}`;
		tax.value = `$ ${(Number(price) * Number(quantity) * 0.13).toFixed(2)}`;
		total.value = `$ ${(Number(price) * Number(quantity) +Number(price) * Number(quantity) * 0.13).toFixed(2)}`;
		getTotalPrice();
	} else if (inventoryProdQuantity > quantity) {
		message.style.color = "tomato";
		message.innerHTML = "";
		net.value = `$ ${(Number(price) * Number(quantity)).toFixed(2)}`;
		tax.value = `$ ${(Number(price) * Number(quantity) * 0.13).toFixed(2)}`;
		total.value = `$ ${(Number(price) * Number(quantity) +Number(price) * Number(quantity) * 0.13).toFixed(2)}`;
		getTotalPrice();
	}
}

function removeItem(btnElem) {
	if (window.confirm("Are you sure you want to remove this?")) {
		let itemContainer = btnElem.parentElement;
		itemContainer.remove();
		getTotalPrice();
	}
}

function getTotalPrice() {
	let purchasedItems = document.querySelectorAll(".purchased-item");
	let netTotalElem = document.querySelector(".net-total");
	let taxTotalElem = document.querySelector(".tax-total");
	let amountTotalElem = document.querySelector(".amount-total");

	let netTotal = 0;
	let taxTotal = 0;
	purchasedItems.forEach(item => {
		netTotal += Number(item.querySelector(".net").value.split(" ")[1])
		taxTotal += Number(item.querySelector(".tax").value.split(" ")[1])
	})
	netTotalElem.innerHTML = netTotal.toFixed(2)
	taxTotalElem.innerHTML = taxTotal.toFixed(2)
	amountTotalElem.innerHTML = (netTotal + taxTotal).toFixed(2)
	
}

goBackBtn?.addEventListener("click", e => {
	e.preventDefault();
	window.location.href = "customer-sale.html";
})

confirmBtn?.addEventListener("click", e => {
	e.preventDefault();
	message.innerHTML = "";

	let products = [];
  	let items = document.querySelectorAll(".purchased-item");
	if (items.length == 0) {
		message.style.color = "tomato";
		message.innerHTML =
		"There is no item selected. Please Go Back.";
	} else {
		items.forEach((item) => {
		let p = {
			itemName: item.querySelector(".itemName").value,
			price: item.querySelector(".price").value.split(" ")[1],
			salesQuantity: item.querySelector(".itemQuantity").value,
			net: item.querySelector(".net").value.split(" ")[1],
			tax: item.querySelector(".tax").value.split(" ")[1],
			total: item.querySelector(".total").value.split(" ")[1],
		};
		products.push(p);
		
		salesInfo.products = [...products];
		salesInfo.amount = {
					netTotal: document.querySelector(".net-total")?.textContent,
					taxTotal: document.querySelector(".tax-total")?.textContent,
					amountTotal: document.querySelector(".amount-total")?.textContent,
				};
		localStorage.setItem("salesInfo", JSON.stringify(salesInfo));

		})
		 window.location.href = "pay-sale.html";
	}
})

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