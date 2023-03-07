import { getOrderList, getProducts } from "./data.mjs";
let orderList = getOrderList();
let productList = getProducts();

let selectedProduct = localStorage.getItem("selectedProduct") != null ? JSON.parse(localStorage.getItem("selectedProduct")) : "";
//console.log(selectedProduct)

// Variables
let fieldsetContainer = document.querySelector(".fieldset-container");
let addMore = document.querySelector(".add-more");

let clearBtn = document.querySelector(".request-clear-btn");
let processBtn = document.querySelector(".request-process-order");
let message = document.querySelector(".request-msg");
let question = document.querySelector(".question");
let help = document.querySelector(".help");
let num = 1;

window.addEventListener("DOMContentLoaded", ()=> {
  addFieldset();
  getCategories(document.querySelector(".categorySelect"));
  fieldsetContainer
    ?.querySelector(".categorySelect")
    ?.addEventListener("change", (e) => {
      let cat = e.target.value;
      // console.log(e.target)
      let itemDDL = e.target.parentNode.querySelector(".nameSelect");
      getItemNamesFromCategory(cat, itemDDL);
    });

    // If the page opened from 'Products' page
    if (selectedProduct) {
      document.querySelector(".categorySelect").value =selectedProduct.category;
      getItemName(
        selectedProduct.category,
        document.querySelector("#add-1").querySelector(".nameSelect")
      );
      document.querySelector(".nameSelect").value = selectedProduct.itemName;
      document.querySelector(".price").value = selectedProduct.price;
      document.querySelector(".upcCode").value = selectedProduct.UPC;
      window.localStorage.removeItem("selectedProduct");
    }

  let addedfieldset = document.getElementById(`add-${num}`);
  document.getElementById("itemName")?.addEventListener("change", (e) => {
    let name = e.target.value;
    itemInfoFromItemname(name, addedfieldset);
  });
})

// 'Add More' Button clicked
addMore?.addEventListener("click", () => {
  message.innerHTML= "";
  num++;
  addFieldset();
  let addedfieldset = document.getElementById(`add-${num}`)
  let addedCategory = addedfieldset?.querySelector(".categorySelect");
  let addedItemName = addedfieldset?.querySelector(".nameSelect");
  getCategories(addedCategory);

  addedCategory?.addEventListener("change", (e) => {
    getItemNamesFromCategory(e.target.value, addedItemName);
  });

  addedItemName?.addEventListener("change", (e) => {
    let name = e.target.value;
    itemInfoFromItemname(name, addedfieldset);
  });

  // close request
  let closeRequests = document.querySelectorAll(".close-request");
  closeRequests.forEach((btn) => btn.addEventListener("click", (e) => {
      removeFieldset(e.target.parentNode.id);
    })
  );
})


// function addFieldset() {
//   let div = document.createElement("div");
//   div.setAttribute("id", `add-${num}`);
//   div.classList.add("order-struct")
//   div.innerHTML = `
//     <fieldset>
//       <span class="close-request" style="margin-right: -13px; margin-top:-5px; font-size: 24px" >X</span>
//       <div class="d-flex">
//         <select name="orderItem" id="orderItem" class="categorySelect" style="width: 80%; box-shadow: 1px 1px 1px 1px #D1ACA5;" tabindex="1">
//           <option value="">--Select Category--</option>
//         </select>
//         <select name="itemName" id="itemName" class="nameSelect" style="width: 58%; box-shadow: 1px 1px 1px 1px #D1ACA5;" tabindex="2">
//             <option value="">Select Item</option>
//         </select>
//         <input type="text" name="upcCode" id="upcCode" class="upcCode" placeholder="ex. UPC000" style="width: 40%; box-shadow: 1px 1px 1px 1px #D1ACA5; border-width: 0.03px; border-color: #BEBEBE";   required>
//         <input type="text" name="price" placeholder="ex. $0.00" id="price" class="price" style="width: 35%; box-shadow: 1px 1px 1px 1px #D1ACA5; border-width: 0.03px; border-color: #BEBEBE";   required>
//         <select name="itemQuantity" id="itemQuantity" class="itemQuantity" style="width: 17%; box-shadow: 1px 1px 1px 1px #D1ACA5"; tabindex="3">
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//             <option value="5">5</option>
//             <option value="6">6</option>
//         </select>
//       </div>
//     </fieldset>
//     <div class="tooltip">
//       <span class="tooltiptext" style="bottom: 150%; width:100px;">Add more product</span>
//       <button class="plus">+</button>
//     </div>
//   `;
//   fieldsetContainer?.appendChild(div);
// }


//Add fieldset to request form
function addFieldset(){
  let fieldset = document.createElement("fieldset");
  fieldset.setAttribute("id", `add-${num}`);
  fieldset.innerHTML = `
    <span class="close-request" style="margin-right: -13px; margin-top:-5px; font-size: 24px" >X</span>
    <div class="d-flex">
      <select name="orderItem" id="orderItem" class="categorySelect" style="width: 80%; box-shadow: 1px 1px 1px 1px #D1ACA5;" tabindex="1">
        <option value="">--Select Category--</option>
      </select>
      <select name="itemName" id="itemName" class="nameSelect" style="width: 58%; box-shadow: 1px 1px 1px 1px #D1ACA5;" tabindex="2">
          <option value="">Select Item</option>
      </select>
      <input type="text" name="upcCode" id="upcCode" class="upcCode" placeholder="ex. UPC000" style="width: 40%; box-shadow: 1px 1px 1px 1px #D1ACA5; border-width: 0.03px; border-color: #BEBEBE";   required>
      <input type="text" name="price" placeholder="ex. $0.00" id="price" class="price" style="width: 35%; box-shadow: 1px 1px 1px 1px #D1ACA5; border-width: 0.03px; border-color: #BEBEBE";   required>
      <select name="itemQuantity" id="itemQuantity" class="itemQuantity" style="width: 17%; box-shadow: 1px 1px 1px 1px #D1ACA5"; tabindex="3">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
      </select>
    </div>
    
  `;
  fieldsetContainer?.appendChild(fieldset);
}

// Remove fieldset to request form
function removeFieldset(fieldsetId) {
  document.getElementById(fieldsetId)?.remove();
}


// Clear button clicked
clearBtn?.addEventListener("click", () => {
  clearFields();
});

// Process Order Click
processBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  let newItem = [];
  let allFieldsets = document.querySelectorAll("fieldset");
  
  allFieldsets.forEach(fieldset => {
    let category = fieldset.querySelector(".categorySelect");
    let itemName = fieldset.querySelector(".nameSelect");
    let price = fieldset.querySelector(".price");
    let upc = fieldset.querySelector(".upcCode");
    let quantity = fieldset.querySelector(".itemQuantity");

    if (itemName.value == "" ||price.value == "" || upc.value == "") {
      message.style.color = "tomato";
      message.textContent = "Please fill up all fields in the Request Form";
    } else {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();

      let newRequestItem = {
        id: orderList.length + 1,
        requestedDate: `${yyyy}-${mm}-${dd}`,
        orderDate: "",
        receivedDate: "",
        orderNum: "",
        UPC: upc.value,
        category: category.value,
        itemName: itemName.value,
        supplier: "",
        supplierCode: "",
        status: "Requested",
        quantity: Number(quantity.value),
        price: Number(price.value),
      };
      newItem.push(newRequestItem)
    }

    console.log(newItem)
    if (newItem.length > 0) {
      localStorage.setItem("newOrder", JSON.stringify(newItem));

      clearFields();
      message.style.color = "green";
      message.textContent = "Form is submitted successfully.";
    }
  })
});

function clearFields() {
  let fieldsets = document.querySelectorAll('fieldset');
  for (let i = 1; i < fieldsets.length; i++){
    fieldsets[i].remove();
  }

  // Variables reset
  let fieldset = document.querySelector("#add-1")
  fieldset.querySelector(".categorySelect").value = "-- Select Category --";
  fieldset.querySelector(".nameSelect").value = "-- Select Item --";
  fieldset.querySelector(".itemQuantity").value = "1";
  fieldset.querySelector(".price").value = "";
  fieldset.querySelector(".upcCode").value = "";

  message.textContent = "";
}


function getItemNamesFromCategory(cat, itemDDL) {
  let items = ["-- Select Item --"];
  if (cat == "Blade") {
    getItemName("Blade", itemDDL);
  } else if (cat == "Engine") {
    getItemName("Engine", itemDDL);
  } else if (cat == "Gas") {
    getItemName("Gas", itemDDL);
  } else if (cat == "Battery") {
    getItemName("Battery", itemDDL);
  } else {
    clearFields();
  }
}

function itemInfoFromItemname(name, elemContainer) {
  let cat = elemContainer.querySelector(".categorySelect");
  let itemName = elemContainer.querySelector(".nameSelect");
  let selectedPrice = elemContainer.querySelector(".price");
  let selectedUpc = elemContainer.querySelector(".upcCode");
  let selectedItem = productList.find((item) => item.itemName == name);

  if (
    cat.value != "-- Select Category --" &&
    itemName.value != "-- Select Item --"
  ) {
    selectedPrice.value = selectedItem?.price;
    selectedUpc.value = selectedItem?.UPC;
  } else {
    selectedPrice.value = "";
    selectedUpc.value = "";
  }
}


function getCategories(catElements) {
  let categories = ["-- Select Category --"];
  productList.forEach((item) => {
    !categories.includes(item.category) ? categories.push(item.category) : "";
  });
  let categoriesOptions = categories
    .map((c) => {
      return `<option value="${c}">${c}</option>`;
    })
    .join("");
  catElements.innerHTML = categoriesOptions;
}

function getItemName(value, itemDDL) {
  let items = productList
    .filter((item) => item.category == value)
    .map((item) => item.itemName);
  items.unshift("-- Select Item --");

  let itemNameOptions = items
    .map((i) =>  `<option value="${i}">${i}</option>`)
    .join("");
  itemDDL.innerHTML = itemNameOptions;
}

//Help system
question?.addEventListener("click", () => {
  if (help?.classList.contains("show")) {
    help.classList.remove("show");
  } else {
    help?.classList.add("show");
  }
});

question?.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    if (help?.classList.contains("show")) {
      help.classList.remove("show");
    } else {
      help?.classList.add("show");
    }
  }
});