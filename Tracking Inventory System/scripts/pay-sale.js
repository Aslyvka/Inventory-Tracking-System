let salesInfo =
  localStorage.getItem("salesInfo") != null
    ? JSON.parse(localStorage.getItem("salesInfo"))
    : {};


// Variables
let backBtn = document.querySelector(".back-btn");
let payBtn = document.querySelector(".pay-btn");
let receiptBtn = document.querySelector(".receipt-btn");
let backToMainBtn = document.querySelector(".back-to-main-btn");
let processPayBtns = document.querySelector(".process-pay");
let processPrintBtns = document.querySelector(".process-print");
let message = document.querySelector(".request-msg");
let itemsPrice = document.querySelector(".price");
let itemsTax = document.querySelector(".tax");
let itemsTotal = document.querySelector(".total");
let checkBoxAmountInputs = document.querySelectorAll(".checkbox-amount");
let paidAmount = document.querySelector(".paid-amount");
let balaceAmount = document.querySelector(".balance-amount");
let creditCardX = document.querySelector(".credit-card-x");
let otherInfoX = document.querySelector(".other-info-x");
let clearCreditInfo = document.querySelector(".clear-credit-info");
let question = document.querySelector(".question");
let help = document.querySelector(".help");
let paymentMethod = "Credit Card";
let selectedPayInfo = {'Credit Card': '', 'Debit': '', 'Cash': '', 'Other': ''};
let creditInfo = {};
let sum=0;


document.addEventListener("DOMContentLoaded", () => {
	itemsPrice.value =`$ ${salesInfo.amount?.netTotal}`;
	itemsPrice.disabled = true;
	itemsTax.value = `$ ${salesInfo.amount?.taxTotal}`;
	itemsTax.disabled = true;
	itemsTotal.value = `$ ${salesInfo.amount?.amountTotal}`;
	itemsTotal.disabled = true;
	balaceAmount.innerHTML = `$${(salesInfo.amount?.amountTotal - sum).toFixed(2)}`;

	infoModal("credit-info", "myForm");
 	infoModal("other-info", "myForm1");

	closeModal(creditCardX, "credit-info");
	closeModal(otherInfoX, "other-info");
})


// payment amount input
checkBoxAmountInputs.forEach(input => {
	// let sum = 0;
	input.addEventListener("change", () => {
		let checkBox = input.previousElementSibling.previousElementSibling;
		let errMsg = input.parentElement.querySelector(".err-msg");
		if(!isNaN(input.value) && input.value.length > 0) {
			errMsg.innerHTML = "";
			checkBox.checked = true;
			selectedPayInfo[checkBox.value] = input.value;
			calculatePayment(checkBox.value, input.value);
			// sum += Number(input.value);
			// paidAmount.innerHTML = `$${sum.toFixed(2)}`;
			// balaceAmount.innerHTML = `$${(salesInfo.amount?.amountTotal - sum).toFixed(2)}`;
		} else if (isNaN(input.value) && input.value.length > 0){
			checkBox.checked = true;
			errMsg.innerHTML = "Please insert numeric input";
		} else {
			selectedPayInfo[checkBox.value] = '';
			calculatePayment(checkBox.value, "");
			checkBox.checked = false;
			errMsg.innerHTML = "";
		}
	})
})

checkBoxAmountInputs.forEach(input => {
	input.addEventListener("focus", () => message.innerHTML = "")
})
// calculate different payment logic
function calculatePayment(key, value) {
	let addSum = 0;
	Object.values(selectedPayInfo).forEach(n =>addSum += Number(n))
	sum = addSum;
	paidAmount.innerHTML = `$${sum.toFixed(2)}`;
	balaceAmount.innerHTML = `$${(salesInfo.amount?.amountTotal - sum).toFixed(2)}`;
}

// check boxes
document.querySelectorAll("input[type=checkbox]").forEach(elem => {
	elem.addEventListener("change", () => {
		if (elem.checked == true) {
			console.log(elem.checked);
		} else {
		   elem.parentElement.querySelector(".checkbox-amount").value = "";
			selectedPayInfo[elem.value] = "";
		   calculatePayment(elem.value, "");
		}
	})
})

backBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "summary-sale.html";
});

payBtn?.addEventListener("click", e => {
	e.preventDefault();
	
	if (balaceAmount.textContent?.split("$")[1] <= 0) {
		// checked to pay with credit card
		if(document.getElementById("creditcard").checked) {
			if (validateCreditCard() == true) {
				storeCreditInfo();
				proceedtoPay();
				resetCreditInfo();
				document.getElementById("myForm").style.display = "none";
			}
		}else{
			proceedtoPay();
		}
	} else {
		// insufficient pay amount
		message.style.color = "#b6432e";
		message.innerHTML = "Pay amount is not sufficient.";
	}
})

backToMainBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  // send the sales infomation to 'sales list' and remove data
  localStorage.removeItem("salesInfo");
  window.location.href = "home.html";
});

receiptBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  // go to the receipt page!
  window.location.href = "invoice-sale.html";
});

clearCreditInfo?.addEventListener("click", () =>  resetCreditInfo());

// credit card info, other info 
function infoModal(keyId, contentId) {
	let btn = document.getElementById(keyId);
	btn?.addEventListener("click", (e) => {
		e.preventDefault();
		let button = e.target;
		if (button.textContent == "+") {
		button.innerText = "-";
		document.getElementById(contentId).style.display = "block";
		} else {
		button.innerText = "+";
		document.getElementById(contentId).style.display = "none";
		}
	})
}

function closeModal(btn, keyId) {
	btn.addEventListener("click", () => {
		btn.parentElement.parentElement.style.display = "none";
		document.getElementById(keyId).innerHTML = "+";
	});
}

function openCreditCardInfo() {
	document.getElementById("myForm").style.display = "block";
	document.getElementById("credit-info").innerHTML = "-";
}

// pay with credit card and store the data
function storeCreditInfo() {
	let fName = document.getElementById("fName").value;
	let cardNum = document.getElementById("ccnum").value;

	let secureCardNum = `XXXX-XXXX-XXXX-${cardNum.slice(-4)}`;
	creditInfo.fName = fName; 
	creditInfo.cardNum = secureCardNum
	salesInfo.amount.creditInfo = creditInfo;
}

// proceed to pay
function proceedtoPay() {
	message.style.color = "green";
	message.innerHTML = "The payment completed successfully.";
	processPayBtns.style.display = "none";
	processPrintBtns.style.display = "block";
	// backBtn.disabled = true;
	// payBtn.disabled = true;
	backToMainBtn.style.display = "inline-block";
	receiptBtn.style.display = "inline-block";
	if (sum > salesInfo.amount?.amountTotal) {
		let balance = sum - Number(salesInfo.amount?.amountTotal);
		selectedPayInfo.Cash = (Number(selectedPayInfo.Cash) - balance).toFixed(2);
	}
	salesInfo.amount.selectedPayInfo = selectedPayInfo;
	localStorage.setItem("salesInfo", JSON.stringify(salesInfo));
}

// validate credit card
function validateCreditCard() {
	let fName = document.getElementById("fName");
	let cardNum = document.getElementById("ccnum");
	let expMonth = document.getElementById("expmonth");
	let expYear = document.getElementById("expyear");
	let cvv = document.getElementById("cvv");
	let creditNumMsg = document.querySelector(".credit-num-msg");
	let creditExpiryMsg = document.querySelector(".credit-expiry-msg");

	creditNumMsg.innerHTML = "";
	creditExpiryMsg.innerHTML = "";

	if (fName.value == "" || cardNum.value == ""|| expMonth.value == ""||expYear.value == ""||cvv.value == "") {
		message.style.color = "#b6432e";
    	message.innerHTML = "Please provide your credit infomation";
		openCreditCardInfo();
		return false;
	} else if(cardNum.value.length != 16) {
		message.style.color = "#b6432e";
    	creditNumMsg.innerHTML = "16 digits Credit card number without space";
		return false;
	} else if (expMonth.value.length != 2) {
		message.style.color = "#b6432e";
		creditExpiryMsg.innerHTML = "Please input expiry month in 2 digits";
		return false;
	} else if (expYear.value.length != 4) {
		message.style.color = "#b6432e";
		creditExpiryMsg.innerHTML = "Please input expiry year in 4 digits";
		return false;
	} else if (cvv.value.length != 3) {
		message.style.color = "#b6432e";
		creditExpiryMsg.innerHTML = "Please input 3 digits CVV";
		return false;
	} else {
		return true;
	}
}

// reset credit info
function resetCreditInfo() {
	document.getElementById("fName").value = "";
	document.getElementById("ccnum").value = "";
	document.getElementById("expmonth").value = "";
	document.getElementById("expyear").value = "";
	document.getElementById("cvv").value = "";
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
