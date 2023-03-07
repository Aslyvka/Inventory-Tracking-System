import { getSuppliers} from "./data.mjs";
let supplierList = getSuppliers();


//let selectedProduct = localStorage.getItem("selectedProduct") != null ? JSON.parse(localStorage.getItem("selectedProduct")) : "";
//console.log(selectedProduct)


// Variables
let fieldsetContainer = document.querySelector(".fieldset-container");
let addMore = document.querySelector(".add-more");
let clearBtn = document.querySelector(".request-clear-btn");
let processBtn = document.querySelector(".request-process-order");
let backBtn = document.querySelector(".back");
let message = document.querySelector(".request-msg");
let num = 1;

window.addEventListener("DOMContentLoaded", ()=> {
    addFieldset();

});
backBtn?.addEventListener("click",()=>{
    window.history.back();
})
// 'Add More Customers and close fields set' Button clicked
addMore?.addEventListener("click", () => {
    message.innerHTML= "";
    num++;
    addFieldset();

    // close request
    let closeRequests = document.querySelectorAll(".close-request");
    closeRequests.forEach((btn) => btn.addEventListener("click", (e) => {
    removeFieldset(e.target.parentNode.id);
    })
    );
})

// Add fieldset to Add supplier form
function addFieldset(){
let fieldset = document.createElement("fieldset");
fieldset.setAttribute("id", `add-${num}`);
fieldset.innerHTML = `
        <div>
            <div class="two-cols">
                <div>
                    <label for="supplierName">Supplier Name</label>
                    <div class="tooltip">
                        <span class="tooltiptext">Supplier Name, ex. Fix Tire</span> 
                        <input id="supplierName" class="supplierName" placeholder="ex. Fix Tire" name="supplierName" type="text" tabindex="1" required>
                    </div>
                </div>
                <div>
                    <label for="postalCode">Postal Code</label>
                    <div class="tooltip">
                        <span class="tooltiptext">Postal Code, ex.A1A A1A</span> 
                        <input id="postalCode" placeholder="ex.A1A A1A" name="postalCode" class="postalCode" type="text"
                            pattern="[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]" tabindex="2" required>
                    </div>    
                </div>
            </div>
            <br>
            <hr>

            <div class="two-cols">
                <div>
                    <label for="genderSelect">Title</label>
                    <select name="genderSelect" id="genderSelect" class="genderSelect"  tabindex="3"">
                        <option value="">-- Select Title --</option>    
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                    </select>
                </div>
                <div>
                    <label for="contactName">Contact Name</label>
                    <div class="tooltip">
                        <span class="tooltiptext">Contact Name, ex. John Smith</span> 
                        <input id="contactName" placeholder="ex. John Smith" class="contactName" name="contactName" type="text" tabindex="4"
                            required>
                    </div>  
                </div>
            </div>

            <div class="two-cols">
                <div>
                    <label for="phone">Phone</label>
                    <div class="tooltip">
                        <span class="tooltiptext">Phone, ex.111 111 1111</span> 
                        <input id="phone" placeholder="ex.111 111 1111" name="phone" class="phone" type="tel" tabindex="5" required>
                    </div>  
                </div>
                <div>
                    <label for="email">Email</label>
                    <div class="tooltip">
                        <span class="tooltiptext">Email, ex. example@gmail.com</span> 
                        <input id="email" placeholder="ex. example@gmail.com" name="email" class="email "type="email" tabindex="6" required>
                    </div> 
                </div>
            </div>
        </div>
`;
fieldsetContainer?.appendChild(fieldset);
}

// Remove fieldset to Add Customer form
function removeFieldset(fieldsetId) {
    document.getElementById(fieldsetId)?.remove();
}


// Process Order Click----SAVECUSTOMER solo falta regresar automaticamente a Customer.html, la respuesta esta en
processBtn?.addEventListener("click", (e) => {
e.preventDefault();
let newSupplier = [];
let allFieldsets = document.querySelectorAll("fieldset");

allFieldsets.forEach(fieldset => {

    
    let supplierName = fieldset.querySelector(".supplierName");
    let postalCode = fieldset.querySelector(".postalCode");
    let email = fieldset.querySelector(".email");
    let phone = fieldset.querySelector(".phone");
    let gender = fieldset.querySelector(".genderSelect");
    let contactName = fieldset.querySelector(".contactName");


    if (supplierName.value == "" ||email.value == "" || phone.value == "" ) {
    message.style.color = "tomato";
    message.textContent = "Please fill up all fields in the Form";
    } else {
        
    let newRequest = {
        id: supplierList.length + 1,
        supplierCode:`S${supplierList.length + 1}`,
        supplierName: supplierName.value,
        postalCode: postalCode.value,
        email: email.value,
        phone: phone.value,
        gender: gender.value,
        contactName: contactName.value,
    };
    
    newSupplier.push(newRequest)
    
    }
    
    console.log(newSupplier)
    
    if (newSupplier.length > 0) {
        
    localStorage.setItem("newSupplier", JSON.stringify(newSupplier));
    location.href="supplier.html";
    clearFields();
    message.style.color = "green";
    message.textContent = "Form is saved successfully.";
    }

    })
});




// Clear button clicked
clearBtn?.addEventListener("click", () => {
    clearFields();
});


function clearFields() {
let fieldsets = document.querySelectorAll('fieldset');
for (let i = 1; i < fieldsets.length; i++){
    fieldsets[i].remove();
}

// Variables supplier reset
let fieldset = document.querySelector("#add-1")
// Variables customer reset
    
    fieldset.querySelector(".supplierName").value = "";
    fieldset.querySelector(".postalCode").value = "";
    fieldset.querySelector(".email").value = "";
    fieldset.querySelector(".phone").value = "";
    fieldset.querySelector(".genderSelect").value = "-- Select Title --";
    fieldset.querySelector(".contactName").value = "";
message.textContent = "";
}





