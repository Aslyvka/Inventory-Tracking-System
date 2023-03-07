import { getCustomers} from "./data.mjs";
let customersList = getCustomers();


//let selectedProduct = localStorage.getItem("selectedProduct") != null ? JSON.parse(localStorage.getItem("selectedProduct")) : "";
//console.log(selectedProduct)


// Variables
let fieldsetContainer = document.querySelector(".fieldset-container");
let addMore = document.querySelector(".add-more");//IT's not necessary now but it's here just to not change the orginal code, and make it works
let clearBtn = document.querySelector(".clear-btn");
let processBtn = document.querySelector(".process");
let backBtn = document.querySelector(".back");
let message = document.querySelector(".msg");
let num = 1;

window.addEventListener("DOMContentLoaded", ()=> {
    addFieldset();
})

backBtn?.addEventListener("click",()=>{
    window.history.back();
})
// 'Add More Customers and close fields set' Button clicked
addMore?.addEventListener("click", () => {
    message.innerHTML= "";
    num++;
    addFieldset();

    // close request
    let closeRequests = document.querySelectorAll(".close");
    closeRequests.forEach((btn) => btn.addEventListener("click", (e) => {
    removeFieldset(e.target.parentNode.id);
    })
    );
})

// Add fieldset to Add Customer form
function addFieldset(){
let fieldset = document.createElement("fieldset");
fieldset.setAttribute("id", `add-${num}`);
fieldset.innerHTML = `
                    <div>
                        <div class="two-cols">
                            <div>
                                <label for="genderSelect">Title</label>
                                    <select name="genderSelect" id="genderSelect" class="genderSelect" style="width: 80px;" tabindex="1">
                                        <option value="Mr">Mr.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Ms">Ms.</option>
                                    </select>
                            </div>
                            <div>
                                <label for="firstName" style="margin-left: -85px;">First Name</label>
                                <div class="tooltip">
                                    <span class="tooltiptext">First Name, ex. John</span> 
                                    <input type="text" name="firstName" id="firstName" class="firstName" placeholder="ex. John" style="width: 200px; margin-left: -90px;" tabindex="2" required>  
                                </div>
                            </div>
                            <div>
                                <label for="lastName" style="margin-left: -43px;">Last Name</label>
                                <div class="tooltip">
                                    <span class="tooltiptext">Last Name, ex. Smith</span> 
                                    <input type="text" name="lastName" id="lastName" class="lastName" placeholder="ex. Smith" style="width: 200px; margin-left: -47px;" tabindex="3" required>  
                                </div>
                            </div>
                        </div>
                        <br>
                        <hr>

                        <div class="two-cols">
                            <div>
                                <label for="phone">Phone</label>
                                <div class="tooltip">
                                    <span class="tooltiptext">Phone, ex.111-111-1111</span> 
                                    <input type="text" name="phone" id="phone" class="phone" placeholder=" ex.111-111-1111" tabindex="4">  
                                </div>
                            </div>
                            <div>
                                <label for="email">Email</label>
                                <div class="tooltip">
                                    <span class="tooltiptext">Email, ex. jsmith@gmail.com</span> 
                                    <input type="text" name="email" id="email" class="email" placeholder="ex. jsmith@gmail.com" tabindex="5">  
                                </div>
                            </div>
                        </div>
            
                        <div class="two-cols">
                            <div>
                                <label for="street">Street</label>
                                <div class="tooltip">
                                    <span class="tooltiptext">Street, ex. 123 King St.</span> 
                                    <input type="text" name="street" id="street" class="street" placeholder="ex. 123 King St." tabindex="6">  
                                </div>
                            </div>
                            <div >
                                <label for="provinceSelect">Province</label>
                                <select name="provinceSelect" id="provinceSelect" class="provinceSelect" tabindex="7">
                                    <option value="">-- Select Province --</option>
                                    <option value="Ab">Alberta</option>
                                    <option value="BC">British Columbia</option>
                                    <option value="MB">Manitoba</option>
                                    <option value="NB">New Brunswick</option>
                                    <option value="NL">Newfoundland and Labrador</option>
                                    <option value="NT">Northwest Territories</option>
                                    <option value="NS">Nova Scotia</option>
                                    <option value="NU">Nunavut</option>
                                    <option value="ON">Ontario</option>
                                    <option value="PE">Prince Edward Island</option>
                                    <option value="QC">Quebec</option>
                                    <option value="SK">Saskatchewan</option>
                                </select>
                            </div>
                        </div>
            
                        <div class="two-cols">
                            <div>
                                <label for="city">City</label>
                                <div class="tooltip">
                                    <span class="tooltiptext">City, ex.Welland</span> 
                                    <input type="text" name="city" id="city" class="city" placeholder=" ex.Welland" tabindex="8">  
                                </div>
                            </div>
                            <div>
                                <label for="postalCode">Postal Code</label>
                                <div class="tooltip">
                                    <span class="tooltiptext">Postal Code, ex.A1A 1A1</span> 
                                    <input name="postalCode" id="postalCode" class="postalCode" placeholder="ex.A1A A1A" type="text"
                                            pattern="[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]" tabindex="9" required>  
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


// Process save customer Click
processBtn?.addEventListener("click", (e) => {
e.preventDefault();
let newCustomer = [];
let allFieldsets = document.querySelectorAll("fieldset");

allFieldsets.forEach(fieldset => {
    
    let gender = fieldset.querySelector(".genderSelect");
    let firstName = fieldset.querySelector(".firstName");
    let lastName = fieldset.querySelector(".lastName");
    let street = fieldset.querySelector(".street");
    let city = fieldset.querySelector(".city");
    let province = fieldset.querySelector(".provinceSelect");
    let postalCode = fieldset.querySelector(".postalCode");
    let email = fieldset.querySelector(".email");
    let phone = fieldset.querySelector(".phone");

    if (firstName.value == "" || lastName.value == "" || email.value == "" || postalCode.value == "") {
        message.style.color = "tomato";
        message.textContent = "Please fill up all fields in the Form";
    } else {
        let newRequest = {
            id: customersList.length + 1,
            customerCode:`C${customersList.length + 1}`,
            gender: gender.value,
            firstName: firstName.value,
            lastName: lastName.value,
            street: street.value,
            city: city.value,
            province: province.value,
            postalCode: postalCode.value,
            email: email.value,
            phone: phone.value,
        };
        newCustomer.push(newRequest)
    }
    
    console.log(newCustomer)
    
    if (newCustomer.length > 0) {       
        localStorage.setItem("newCustomer", JSON.stringify(newCustomer));
        window.history.back();
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

    // Variables customer reset
    let fieldset = document.querySelector("#add-1")
    // Variables customer reset
    fieldset.querySelector(".genderSelect").value = "-- Select Title --";
    fieldset.querySelector(".firstName").value = "";
    fieldset.querySelector(".lastName").value = "";
    fieldset.querySelector(".phone").value = "";
    fieldset.querySelector(".email").value = "";
    fieldset.querySelector(".street").value = "";
    fieldset.querySelector(".provinceSelect").value = "-- Select Province --";
    fieldset.querySelector(".city").value = "";
    fieldset.querySelector(".postalCode").value = "1";
        
    message.textContent = "";
}





