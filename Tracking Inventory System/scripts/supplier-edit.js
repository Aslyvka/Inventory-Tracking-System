import { getSuppliers} from "./data.mjs";
let supplierList = getSuppliers();
let queryString = window.location.search;
let suppId = new URLSearchParams(queryString).get("suppId");

let supplier = supplierList.find(c => c.id == suppId);

//let selectedProduct = localStorage.getItem("selectedProduct") != null ? JSON.parse(localStorage.getItem("selectedProduct")) : "";
//console.log(selectedProduct)


// Variables
let fieldsetContainer = document.querySelector(".fieldset-container");
//let addMore = document.querySelector(".add-more");
//let clearBtn = document.querySelector(".request-clear-btn");
let processBtn = document.querySelector(".process");
let backBtn = document.querySelector(".back");
//let message = document.querySelector(".request-msg");
//let num = 1;

window.addEventListener("DOMContentLoaded", ()=> {
    addFieldset();
});

processBtn?.addEventListener("click", (e) =>{
	e.preventDefault();
	updateSupplier();
	window.location.href = "supplier.html"; 
})

backBtn?.addEventListener("click",(e)=>{
    e.preventDefault();
    window.location.href = "supplier.html"; 
});
// 'Add More Customers and close fields set' Button clicked
// addMore?.addEventListener("click", () => {
//     message.innerHTML= "";
//     num++;
//     addFieldset();

//     // close request
//     let closeRequests = document.querySelectorAll(".close-request");
//     closeRequests.forEach((btn) => btn.addEventListener("click", (e) => {
//     removeFieldset(e.target.parentNode.id);
//     })
//     );
// })

// Add fieldset to Add supplier form
function addFieldset(){
let fieldset = document.createElement("fieldset");
fieldset.setAttribute("id", `${suppId}`);
fieldset.innerHTML = `
        <div>
            <div class="two-cols">
                <div>
                    <label for="supplierName">Supplier Name</label>
                    <input type="text" value= "${supplier?.supplierName}" name="supplierName" id="supplierName" class="supplierName" tabindex="1">
                </div>
                <div>
                    <label for="postalCode">Postal Code</label>
                    <input  name="postalCode" value="${supplier?.postalCode}" id="postalCode" class="postalCode" type="text"
                    pattern="[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]" tabindex="2"> 
                </div>
            </div>
            <br>
            <hr>

            <div class="two-cols">
                <div>
                    <label for="genderSelect">Title</label>
                    <select name="genderSelect" id="genderSelect" class="genderSelect"  tabindex="3""> 
                        <option value="Mr" ${supplier?.gender == "Mr" ? "selected" : ""}>Mr.</option>
                        <option value="Mrs" ${supplier?.gender == "Mrs" ? "selected" : ""}>Mrs.</option>
                        <option value="Ms" ${supplier?.gender == "Ms" ? "selected" : ""}>Ms.</option>
                    </select>
                </div>
                <div>
                    <label for="contactName">Contact Name</label>
                    <input  type="text" value= "${supplier?.contactName}" name="contactName" id="contactName" class="contactName" tabindex="4">
                </div>
            </div>

            <div class="two-cols">
                <div>
                    <label for="phone">Phone</label>
                    <input type="text" value=${supplier?.phone} name="phone" id="phone"  class="phone"  tabindex="5">
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="text" value=${supplier?.email} name="email" id="email" class="email" tabindex="6">
                </div>
            </div>
        </div>
`;
fieldsetContainer?.appendChild(fieldset);
}

function updateSupplier() {
	let selectedSupplier = {
    id: suppId,
    supplierCode: supplier?.supplierCode,
    supplierName: document.querySelector(".supplierName").value,
    postalCode: document.querySelector(".postalCode").value,
    email: document.querySelector(".email").value,
    phone: document.querySelector(".phone").value,
    gender: document.querySelector(".genderSelect").value,
    contactName: document.querySelector(".contactName").value,

};

localStorage.setItem("updateSupplier", JSON.stringify(selectedSupplier));
}
// // Remove fieldset to Add Customer form
// function removeFieldset(fieldsetId) {
//     document.getElementById(fieldsetId)?.remove();
// }


// Process Order Click----SAVECUSTOMER solo falta regresar automaticamente a Customer.html, la respuesta esta en
// processBtn?.addEventListener("click", (e) => {
// e.preventDefault();
// let newSupplier = [];
// let allFieldsets = document.querySelectorAll("fieldset");

// allFieldsets.forEach(fieldset => {

    
//     let supplierName = fieldset.querySelector(".supplierName");
//     let postalCode = fieldset.querySelector(".postalCode");
//     let email = fieldset.querySelector(".email");
//     let phone = fieldset.querySelector(".phone");
//     let gender = fieldset.querySelector(".genderSelect");
//     let contactName = fieldset.querySelector(".contactName");


//     if (supplierName.value == "" ||email.value == "" || phone.value == "" ) {
//     message.style.color = "tomato";
//     message.textContent = "Please fill up all fields in the Form";
//     } else {
        
//     let newRequest = {
//         id: supplierList.length + 1,
//         supplierCode:`S${supplierList.length + 1}`,
//         supplierName: supplierName.value,
//         postalCode: postalCode.value,
//         email: email.value,
//         phone: phone.value,
//         gender: gender.value,
//         contactName: contactName.value,
//     };
    
//     newSupplier.push(newRequest)
    
//     }
    
//     console.log(newSupplier)
    
//     if (newSupplier.length > 0) {
        
//     localStorage.setItem("newSupplier", JSON.stringify(newSupplier));
//     location.href="supplier.html";
//     clearFields();
//     message.style.color = "green";
//     message.textContent = "Form is saved successfully.";
//     }

//     })
// });




// // Clear button clicked
// clearBtn?.addEventListener("click", () => {
//     clearFields();
// });


// function clearFields() {
// let fieldsets = document.querySelectorAll('fieldset');
// for (let i = 1; i < fieldsets.length; i++){
//     fieldsets[i].remove();
// }

// // Variables supplier reset
// let fieldset = document.querySelector("#add-1")
// // Variables customer reset
    
//     fieldset.querySelector(".supplierName").value = "";
//     fieldset.querySelector(".postalCode").value = "";
//     fieldset.querySelector(".email").value = "";
//     fieldset.querySelector(".phone").value = "";
//     fieldset.querySelector(".genderSelect").value = "-- Select Title --";
//     fieldset.querySelector(".contactName").value = "";
// message.textContent = "";
// }





