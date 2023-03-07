import { getCustomers } from "./data.mjs";
let customersList = getCustomers();
let queryString = window.location.search;
let custId = new URLSearchParams(queryString).get("custId");

let customer = customersList.find(c => c.id == custId);

// Variables
let fieldsetContainer = document.querySelector(".fieldset-container");
let processBtn = document.querySelector(".process");
//let clearBtn = document.querySelector(".clear-btn");
let backBtn = document.querySelector(".back");

window.addEventListener("DOMContentLoaded", () => {
	addFieldset();
});

processBtn?.addEventListener("click", (e) =>{
	e.preventDefault();
	updateCustomer();
	window.location.href = "customers.html"; 
})

backBtn?.addEventListener("click", (e) => {
	e.preventDefault();
  window.location.href = "customers.html"; 
});

// Add fieldset to Add Customer form
function addFieldset(){
let fieldset = document.createElement("fieldset");
fieldset.setAttribute("id", `${custId}`);
fieldset.innerHTML = `
	<div>
		<div class="two-cols">
			<div>
				<label for="genderSelect">Title</label>
				<select name="genderSelect" id="genderSelect" class="genderSelect" style="width: 80px;" tabindex="1">
					<option value="Mr" ${customer?.gender == "Mr" ? "selected" : ""}>Mr.</option>
					<option value="Mrs" ${customer?.gender == "Mrs" ? "selected" : ""}>Mrs.</option>
					<option value="Ms" ${customer?.gender == "Ms" ? "selected" : ""}>Ms.</option>
				</select>
			</div>
			<div>
				<label for="firstName" style="margin-left: -85px;">First Name</label>
				<input type="text" value= ${customer?.firstName} name="firstName" id="firstName" class="firstName" style="width: 200px; margin-left: -90px;" tabindex="2" required>  
			</div>
			<div>
				<label for="lastName" style="margin-left: -43px;">Last Name</label>
				<input type="text" value= ${customer?.lastName} name="lastName" id="lastName" class="lastName" style="width: 200px; margin-left: -47px;" tabindex="3" required>  					
			</div>
		</div>
		<br>
		<hr>
		
		<div class="two-cols">
			<div>
				<label for="phone">Phone</label>
				<input type="text" value=${customer?.phone} name="phone" id="phone" class="phone" tabindex="4">  
			</div>
			<div>
				<label for="email">Email</label>
				<input type="text" value=${customer?.email} name="email" id="email" class="email" tabindex="5">  
			</div>
		</div>

		<div class="two-cols">
			<div>
				<label for="street">Street</label>
				<input type="text" value="${customer?.street}" name="street" id="street" class="street" tabindex="6">  
			</div>
			<div >
				<label for="provinceSelect">Province</label>
				<select name="provinceSelect" id="provinceSelect" class="provinceSelect" tabindex="7">
					<option value="">-- Select Province --</option>
					<option ${customer?.province == "AB" ? "selected" : ""} value="AB">Alberta</option>
					<option ${customer?.province == "BC" ? "selected" : ""} value="BC">British Columbia</option>
					<option ${customer?.province == "MB" ? "selected" : ""} value="MB">Manitoba</option>
					<option ${customer?.province == "NB" ? "selected" : ""} value="NB">New Brunswick</option>
					<option ${customer?.province == "NL" ? "selected" : ""} value="NL">Newfoundland and Labrador</option>
					<option ${customer?.province == "NT" ? "selected" : ""} value="NT">Northwest Territories</option>
					<option ${customer?.province == "NS" ? "selected" : ""} value="NS">Nova Scotia</option>
					<option ${customer?.province == "NU" ? "selected" : ""} value="NU">Nunavut</option>
					<option ${customer?.province == "ON" ? "selected" : ""} value="ON">Ontario</option>
					<option ${customer?.province == "PE" ? "selected" : ""} value="PE">Prince Edward Island</option>
					<option ${customer?.province == "QC" ? "selected" : ""} value="QC">Quebec</option>
					<option ${customer?.province == "SK" ? "selected" : ""} value="SK">Saskatchewan</option>
				</select>
			</div>
		</div>

		<div class="two-cols">
			<div>
				<label for="city">City</label>
				<input type="text"  value=${customer?.city} name="city" id="city" class="city" tabindex="8">  
			</div>
			<div>
				<label for="postalCode">Postal Code</label>
				<input name="postalCode" value="${customer?.postalCode}" id="postalCode" class="postalCode" type="text"
							pattern="[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]" tabindex="9" required>  
			</div>
		</div>
	`;
	fieldsetContainer?.appendChild(fieldset);
}

function updateCustomer() {
	let selectedCustomer = {
    id: custId,
    customerCode: customer?.customerCode,
    gender: document.querySelector(".genderSelect").value,
    firstName: document.querySelector(".firstName").value,
    lastName: document.querySelector(".lastName").value,
    street: document.querySelector(".street").value,
    city: document.querySelector(".city").value,
    province: document.querySelector(".provinceSelect").value,
    postalCode: document.querySelector(".postalCode").value,
    email: document.querySelector(".email").value,
    phone: document.querySelector(".phone").value,
  };

  localStorage.setItem("updateCustomer", JSON.stringify(selectedCustomer));
}