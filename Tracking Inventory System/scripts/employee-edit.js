import { getEmployees } from "./data.mjs";
let employeeList = getEmployees();
let queryString = window.location.search;
let empId = new URLSearchParams(queryString).get("empId");

let employee = employeeList.find(c => c.id == empId);

// Variables
let fieldsetContainer = document.querySelector(".fieldset-container");
let processBtn = document.querySelector(".process");
let clearBtn = document.querySelector(".clear-btn");
let backBtn = document.querySelector(".back");

window.addEventListener("DOMContentLoaded", () => {
  addFieldset();
});

processBtn?.addEventListener("click", (e) =>{
	e.preventDefault();
	updateEmployee();
	window.location.href = "employees.html"; 
})

backBtn?.addEventListener("click", (e) => {
	e.preventDefault();
  window.location.href = "employees.html"; 
});

function addFieldset(){
let fieldset = document.createElement("fieldset");
fieldset.setAttribute("id", `${empId}`);
fieldset.innerHTML = `
	<div>
		<div class="two-cols">
			<div>
				<label for="genderSelect">Title</label>
				<select name="genderSelect" id="genderSelect" class="genderSelect" style="width: 80px;" tabindex="1">
					<option value="Mr" ${employee?.gender == "Mr" ? "selected" : ""}>Mr.</option>
					<option value="Mrs" ${employee?.gender == "Mrs" ? "selected" : ""}>Mrs.</option>
					<option value="Ms" ${employee?.gender == "Ms" ? "selected" : ""}>Ms.</option>
				</select>
			</div>
			<div>
				<label for="firstName" style="margin-left: -85px;">First Name</label>
				<input type="text" value= ${employee?.firstName} name="firstName" id="firstName" class="firstName" style="width: 200px; margin-left: -90px;" tabindex="2" required>  
			</div>
			<div>
				<label for="lastName" style="margin-left: -43px;">Last Name</label>
				<input type="text" value= ${employee?.lastName} name="lastName" id="lastName" class="lastName" style="width: 200px; margin-left: -47px;" tabindex="3" required>  					
			</div>
		</div>
		<br>
		<hr>
		
		<div class="two-cols">
			<div>
				<label for="phone">Phone</label>
				<input type="text" value=${employee?.phone} name="phone" id="phone" class="phone" tabindex="4">  
			</div>
			<div>
				<label for="email">Email</label>
				<input type="text" value=${employee?.email} name="email" id="email" class="email" tabindex="5">  
			</div>
		</div>

		<div class="two-cols">
			<div>
				<label for="street">Street</label>
				<input type="text" value="${employee?.street}" name="street" id="street" class="street" tabindex="6">  
			</div>
			<div>
				<label for="city">City</label>
				<input type="text"  value=${employee?.city} name="city" id="city" class="city" tabindex="7">  
			</div>
		</div>

		<div class="two-cols">
			<div >
				<label for="provinceSelect">Province</label>
				<select name="provinceSelect" id="provinceSelect" class="provinceSelect" tabindex="8" style="width: 260px;">
					<option value="">-- Select Province --</option>
					<option ${employee?.province == "AB" ? "selected" : ""} value="AB">Alberta</option>
					<option ${employee?.province == "BC" ? "selected" : ""} value="BC">British Columbia</option>
					<option ${employee?.province == "MB" ? "selected" : ""} value="MB">Manitoba</option>
					<option ${employee?.province == "NB" ? "selected" : ""} value="NB">New Brunswick</option>
					<option ${employee?.province == "NL" ? "selected" : ""} value="NL">Newfoundland and Labrador</option>
					<option ${employee?.province == "NT" ? "selected" : ""} value="NT">Northwest Territories</option>
					<option ${employee?.province == "NS" ? "selected" : ""} value="NS">Nova Scotia</option>
					<option ${employee?.province == "NU" ? "selected" : ""} value="NU">Nunavut</option>
					<option ${employee?.province == "ON" ? "selected" : ""} value="ON">Ontario</option>
					<option ${employee?.province == "PE" ? "selected" : ""} value="PE">Prince Edward Island</option>
					<option ${employee?.province == "QC" ? "selected" : ""} value="QC">Quebec</option>
					<option ${employee?.province == "SK" ? "selected" : ""} value="SK">Saskatchewan</option>
				</select>
			</div>
			<div>
				<label for="postalCode">Postal Code</label>
				<input name="postalCode" value="${employee?.postalCode}" id="postalCode" class="postalCode" type="text"
							pattern="[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]" tabindex="9" required>  
			</div>
		</div>
		<br>
		<hr>
		
        <div class="two-cols">
			<div >
				<label for="deptSelect">Department</label>
				<select name="deptSelect" id="deptSelect" class="deptSelect" style="width:260px;" tabindex="10">
					<option value="">-- Select Department --</option>
					<option ${employee?.department == "Administration" ? "selected" : ""}  value="Administration">Administration</option>
					<option ${employee?.department == "Manager" ? "selected" : ""}  value="Manager">Manager</option>
					<option ${employee?.department == "Ordering" ? "selected" : ""}  value="Ordering">Ordering and Purchase</option>
					<option ${employee?.department == "Sales" ? "selected" : ""}  value="Sales">Sales</option>
					<option ${employee?.department == "Technician" ? "selected" : ""}  value="Technician">Technician</option>
				</select>
			</div>
			<div>
				<label for="psw">User Password</label>
				<input type="text" placeholder="ex. Emma1!" name="psw" required tabindex="11">
			</div>
		</div>
	`;
	fieldsetContainer?.appendChild(fieldset);
}

function updateEmployee() {
	let selectedEmployee = {
    id: empId,
    employeeCode: employee?.employeeCode,
    gender: document.querySelector(".genderSelect").value,
    firstName: document.querySelector(".firstName").value,
    lastName: document.querySelector(".lastName").value,
    street: document.querySelector(".street").value,
    city: document.querySelector(".city").value,
    province: document.querySelector(".provinceSelect").value,
    postalCode: document.querySelector(".postalCode").value,
    email: document.querySelector(".email").value,
    phone: document.querySelector(".phone").value,
	department: document.querySelector(".deptSelect").value
  };

  localStorage.setItem("updateEmployee", JSON.stringify(selectedEmployee));
}

// Clear button clicked
clearBtn?.addEventListener("click", () => {
    clearFields();
});


function clearFields() {
    document.querySelector(".genderSelect").value = "";
    document.querySelector(".firstName").value = "";
    document.querySelector(".lastName").value = "";
    document.querySelector(".phone").value = "";
    document.querySelector(".email").value = "";
    document.querySelector(".street").value = "";
    document.querySelector(".provinceSelect").value = "";
    document.querySelector(".city").value = "";
    document.querySelector(".postalCode").value = "";
}