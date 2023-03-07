let salesInfo =
  localStorage.getItem("salesInfo") != null
    ? JSON.parse(localStorage.getItem("salesInfo"))
    : {};

import { getInventoryList } from "./data.mjs";

let inventoryList = getInventoryList();

// Variables
let fieldsetContainer = document.querySelector(".fieldset-container");
let fieldsetBody = document.querySelector(".fieldset-body");
let findProductBtn = document.querySelector(".find-product-btn");
let upcInputValue = document.querySelector(".upc-input");
let clearBtn = document.querySelector(".clear-btn");
let nextBtn = document.querySelector(".next-btn");
let message = document.querySelector(".request-msg");
let question = document.querySelector(".question");
let help = document.querySelector(".help");

window.addEventListener("DOMContentLoaded", upcInputValue.focus());

// page came back from "sales-customer.html"
if (salesInfo.products?.length > 0) {
  let productItems = salesInfo.products;
  displayTableHead();
  productItems.forEach((item) => {
    displaySalesProduct(item);
  });
  localStorage.removeItem("salesInfo");
}

// type UPC code input and press 'ENTER' keyboard
upcInputValue?.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.keyCode === 13) {
    findProductItem();
  }
});

// type UPC code input and click 'Find' button
findProductBtn?.addEventListener("click", () => findProductItem());

function findProductItem() {
  message.innerHTML = "";
  if (upcInputValue.value == "") {
    message.style.color = "tomato";
    message.innerHTML = "Please type UPC code";
  } else {
    let selectedItem = inventoryList.find(
      (item) => item.UPC.toLowerCase() == upcInputValue.value.toLowerCase()
    );

    if (!selectedItem) {
		message.style.color = "tomato";
		message.innerHTML = "No item matched with the UPC code";
		upcInputValue.value = "";
    } else {
      // console.log(selectedItem)
      displayTableHead();
      displaySalesProduct(selectedItem);
      upcInputValue.value = "";
    }
  }
}

// set table head
function displayTableHead() {
  let tableHead = `
    <div class="sales-table-head">
      <span style="">UPC Code</span>
      <span style="margin-left: 20px;">Category</span>
      <span style="margin-left: 100px;">Item</span>
      <span style="margin-left: 130px;">Price</span>
      <span style="margin-left: 30px;">Qty</span>
      <span style="margin-left: 20px;">Net</span>
      <span style="margin-left: 40px;">Tax</span>
      <span style="margin-left: 60px;">Total</span>
	    <span style=""></span>
    </div>
  `;
  fieldsetContainer.innerHTML = tableHead;
}

// find the product from inventory list and display the item info
function displaySalesProduct(salesItem) {
  let salesPrice = salesItem.price;
  let salesQuantity = salesItem.salesQuantity ? salesItem.salesQuantity : 1;
  let salesNet = (salesPrice * salesQuantity).toFixed(2);
  let salesTax = (Number(salesNet) * 0.13).toFixed(2);
  let salesTotal = (Number(salesNet) + Number(salesTax)).toFixed(2);
  let inventoryProdQuantity = salesItem.quantity;

  let fieldset = document.createElement("fieldset");
  fieldset.setAttribute("id", `sale-${salesItem.id}`);
  fieldset.innerHTML = `
		<div class="d-flex ai-center" >
			<input type="text" name="upcCode" class="upcCode" id="upcCode" value="${salesItem.UPC}" style="width: 60px" tabindex=""  required disabled>
			<input type="text" name="orderItem" class="orderItem"  id="orderItem" value="${salesItem.category}" tabindex=""  required disabled>
			<input type="text" name="itemName" class="itemName"  id="itemName" value="${salesItem.itemName}" tabindex="" required disabled>
			<input type="text" name="price" class="salesPrice" value="$ ${salesPrice}" id="price" style="width: 50px" tabindex="" required disabled>
			<input type="number" name="itemQuantity" class="itemQuantity" value="${salesQuantity}" id="itemQuantity" style="width: 32px; padding: 8px 5px;" min="1" max="${inventoryProdQuantity}" tabindex=""  required>
			<input type="text" name="net" class="salesNet" value="$ ${salesNet}" id="price" style="width: 60px; padding: 10px 5px;"  tabindex="" required disabled>
			<input type="text" name="tax" class="salesTax" value="$ ${salesTax}" id="tax" style="width: 60px"  tabindex=""  required disabled>
			<input type="text" name="total" class="salesTotal" value="$ ${salesTotal}" id="total" style="width: 65px; padding: 10px 5px;"  tabindex=""  required disabled>
			<span class="select-customer remove" style="margin-left: 24px;">REMOVE</span>
		</div>
	`;
  fieldsetBody?.appendChild(fieldset);

  fieldset.querySelector(".itemQuantity")?.addEventListener("change", (e) => {
      if (e.target.value > inventoryProdQuantity) {
        message.style.color = "tomato";
        message.innerHTML = `Maximum ${inventoryProdQuantity} item${
          inventoryProdQuantity == 1 ? "" : "s"
        } ${inventoryProdQuantity == 1 ? "is" : "are"} available`;
        fieldset.querySelector(".itemQuantity").value = inventoryProdQuantity;
      } else {
        calculatePrice(fieldset);
        message.style.color = "green";
        message.innerHTML = "";
      }
    });

  fieldset.querySelector(".itemQuantity")?.addEventListener("click", (e) => {
    // checkInventoryQuantity(e.target.value, inventoryProdQuantity);
    if (e.target.value >= inventoryProdQuantity) {
      message.style.color = "tomato";
      message.innerHTML = `Maximum ${inventoryProdQuantity} item${
        inventoryProdQuantity == 1 ? "" : "s"
      } ${inventoryProdQuantity == 1 ? "is" : "are"} available`;
      fieldset.querySelector(".itemQuantity").value = inventoryProdQuantity;
    } else {
      message.style.color = "green";
      message.innerHTML = "";
    }
  });

  fieldset.querySelector(".remove")?.addEventListener("click", (e) => {
    e.preventDefault();
    let id = e.target.parentElement.parentElement.id;
    removeFieldset(id);
  });
}

// check the inventory product quantity and sales request
function checkInventoryQuantity(reqQuantity, totalQuantity) {
  if (reqQuantity >= totalQuantity) {
    message.style.color="tomato";
    message.innerHTML = "This is the last product in the inventory";
    console.log(this)
  }
  else {
    message.style.color = "green";
    message.innerHTML = "";
  }
  // console.log(reqQuantity, totalQuantity)
}

// calculate tax and total according to product quantity
function calculatePrice(fieldsetDiv) {
  let price = fieldsetDiv.querySelector(".salesPrice").value.split(" ")[1];
  let salesQuantity = fieldsetDiv.querySelector(".itemQuantity").value;
  let net = fieldsetDiv.querySelector(".salesNet");
  let tax = fieldsetDiv.querySelector(".salesTax");
  let total = fieldsetDiv.querySelector(".salesTotal");

  let netValue = (price * salesQuantity).toFixed(2);
  let taxValue = (Number(netValue) * 0.13).toFixed(2);
  let totalValue = (Number(netValue) + Number(taxValue)).toFixed(2);

  net.value = `$ ${netValue}`;
  tax.value = `$ ${taxValue}`;
  total.value = `$ ${totalValue}`;
}

// remove individual product info
function removeFieldset(fieldsetId) {
  document.getElementById(fieldsetId)?.remove();
}

// clear input box when it focuses
upcInputValue?.addEventListener("focus", () => (message.innerHTML = ""));

// clear button click event
clearBtn?.addEventListener("click", () => {
  let fieldsets = document.querySelectorAll("fieldset");
  if (fieldsets.length == 0) {
    message.style.color = "tomato";
    message.innerHTML = "There is no product selected";
  } else {
    fieldsets.forEach((item) => item.remove());
    message.innerHTML = "All the products are removed successfully.";
  }
});

// next button click event
nextBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  let products = [];
  let fieldsets = document.querySelectorAll("fieldset");
  if (fieldsets.length == 0) {
    message.style.color = "tomato";
    message.innerHTML =
      "There is no product selected, please type UPC code in the input box";
  } else {
    fieldsets.forEach((item) => {
      let p = {
        UPC: item.querySelector(".upcCode").value,
        category: item.querySelector(".orderItem").value,
        itemName: item.querySelector(".itemName").value,
        price: item.querySelector(".salesPrice").value.split(" ")[1],
        salesQuantity: item.querySelector(".itemQuantity").value,
        net: item.querySelector(".salesNet").value.split(" ")[1],
        tax: item.querySelector(".salesTax").value.split(" ")[1],
        total: item.querySelector(".salesTotal").value.split(" ")[1],
      };
      products.push(p);
    });
    salesInfo.products = products;
    localStorage.setItem("salesInfo", JSON.stringify(salesInfo));
    message.innerHTML = "";
    window.location.href = "customer-sale.html";
  }
});

// //Help system
// question?.addEventListener("mouseover", () => {
//   help.style.display = "block";
// });

// question?.addEventListener("mouseout", () => {
//   help.style.display = "none";
// });

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

