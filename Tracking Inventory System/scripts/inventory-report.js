// Variables
let reportFilter = document.querySelector(".report-filter");
let inventoryReportOptions = document.querySelector(
  ".inventory-report-options"
);
let dateRange = document.querySelector(".date-range");

let viewReportBtn = document.querySelector(".view-report");
let backHomeBtn = document.querySelector(".back-home-btn");
let downloadBtn = document.querySelector(".download-btn");
let printBtn = document.querySelector(".print-btn");
let saveBtn = document.querySelector(".save-btn");
let msg = document.querySelector(".msg");
let printMsg = document.querySelector(".print-msg");

// Select options change event
inventoryReportOptions?.addEventListener("change", () => {
  let optionValue = inventoryReportOptions.value;
  msg.innerHTML = "";

  if (optionValue == "details" || optionValue == "none") {
    dateRange.innerHTML = `
		<div><span>Period:</span></div>
		<div class="tooltip">
			<span class="tooltiptext">Start Date</span>
			<input type="date" id="date-start" class="date-start" tabindex="2">
		</div>
		<div class="tooltip">
			<span class="tooltiptext">End Date</span>
			<input type="date" id="date-end" class="date-end" tabindex="3">
		</div>`;
  } else if (
    optionValue == "inventory-item" ||
    optionValue == "inventory-status"
  ) {
    // only need one date
    dateRange.innerHTML = `
			<div><span>Date:</span></div>
			<div class="tooltip">
				<span class="tooltiptext">Choose Inventory Date</span>
				<input type="date" id="inventory-date" class="inventory-date" tabindex="2">
			</div>`;
  }
});

// View Report buttons click event
viewReportBtn?.addEventListener("click", () => {
  let optionValue = inventoryReportOptions.value;
  if (optionValue == "details") {
    // need start - end dates
    let dateStart = reportFilter?.querySelector(".date-start");
    let dateEnd = reportFilter?.querySelector(".date-end");

    if (dateStart.value == "" && dateEnd.value == "") {
      msg.innerHTML = "Please select the start and end date";
    } else if (dateStart.value != "" && dateEnd.value == "") {
      msg.innerHTML = "Please select the end date";
    } else if (dateStart.value == "" && dateEnd.value != "") {
      msg.innerHTML = "Please select the start";
    } else {
      document.querySelector(".report-data").style.display = "flex";
      let reportContainer = document.querySelector(".report-container");
      let period = document.querySelector(".period");
      let current = document.querySelector(".today");

      msg.innerHTML = "";
      period.innerHTML = `Period : ${dateStart.value
        .split("-")
        .join(".")} - ${dateEnd.value.split("-").join(".")}`;
      current.innerHTML = getToday();

      displayReport(reportContainer, optionValue);
    }
  } else if (
    optionValue == "inventory-item" ||
    optionValue == "inventory-status"
  ) {
    // only need one date
    let inventoryDate = reportFilter?.querySelector(".inventory-date");
    if (inventoryDate.value == "") {
      msg.innerHTML = "Please select the inventory date";
    } else {
      document.querySelector(".report-data").style.display = "flex";
      let reportContainer = document.querySelector(".report-container");
      let period = document.querySelector(".period");
      let current = document.querySelector(".today");

      msg.innerHTML = "";
      period.innerHTML = `Inventory Date : ${inventoryDate.value
        .split("-")
        .join(".")}`;
      current.innerHTML = getToday();

      displayReport(reportContainer, optionValue);
    }
  } else {
    msg.innerHTML = "Please select report option";
  }
});

backHomeBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "home.html";
});

downloadBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  printMsg.innerHTML = "Downloading report ...";
  setTimeout(() => {
    printMsg.innerHTML = "";
  }, 2000);
});

printBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  printMsg.innerHTML = "Sending data to printer...";
  setTimeout(() => {
    printMsg.innerHTML = "";
    // window.location.href = "print-invoice.html";
  }, 2000);
});

saveBtn?.addEventListener("click", () => {
  window.location.href = "print-inventory.html";
});

function displayReport(container, option) {
  if (option == "details") {
    container.innerHTML = inventoryMovementReport();
  } else if (option == "inventory-item") {
    container.innerHTML = byItemNameReport();
  } else if (option == "inventory-status") {
    container.innerHTML = byStatusReport();
  }
}

function inventoryMovementReport() {
  return `
    <h3 class="title">Inventory Movement Details</h3>
    <table class ="inventory-movement" cellpadding="0" cellspacing="0">   
        <tr class="heading items-list">
            <td>Item Name</td>
            <td class ="inventory-report-colspan" colspan="4">Qty</td>
            <td>Price</td>
            <td>Value</td>
        </tr>
        <tr class="heading items-list">
            <td></td>
            <td>Begin</td>
            <td>In</td>
            <td>Out</td>
            <td>Current</td>
            <td></td>
            <td></td>
        </tr>
        <tr class="item">
            <td>Ascend TX</td>
            <td>8</td>
            <td>10</td>
            <td>10</td>
            <td>8</td>
            <td>$10.00</td>
            <td>$80.00</td>
        </tr>
        <tr class="item">
            <td>Cube Battery</td>
            <td>16</td>
            <td>5</td>
            <td>8</td>
            <td>13</td>
            <td>$10.00</td>
            <td>$130.00</td>
        </tr>
        <tr class="item">
            <td>Capital 3X</td>
            <td>25</td>
            <td>0</td>
            <td>12</td>
            <td>13</td>
            <td>$6.00</td>
            <td>$78.00</td>
        </tr>
        <tr class="item">
            <td>Blade Razor</td>
            <td>6</td>
            <td>10</td>
            <td>10</td>
            <td>6</td>
            <td>$7.00</td>
            <td>$42.00</td>
        </tr>
        <tr class="item">
            <td>HPL Blade</td>
            <td>0</td>
            <td>20</td>
            <td>16</td>
            <td>4</td>
            <td>$20.00</td>
            <td>$80.00</td>
        </tr>
        <tr class="item">
            <td>Strike Blade</td>
            <td>23</td>
            <td>10</td>
            <td>20</td>
            <td>13</td>
            <td>$10.00</td>
            <td>$130.00</td>
        </tr>
        <tr class="item">
            <td>Kinetica Chaine 255</td>
            <td>6</td>
            <td>20</td>
            <td>15</td>
            <td>11</td>
            <td>$5.00</td>
            <td>$55.00</td>
        </tr>
        <tr class="item">
            <td>Chain Tractor</td>
            <td>5</td>
            <td>15</td>
            <td>10</td>
            <td>10</td>
            <td>$5.00</td>
            <td>$50.00</td>
        </tr>
        <tr class="item">
            <td>4A ENGINE</td>
            <td>5</td>
            <td>0</td>
            <td>2</td>
            <td>3</td>
            <td>$50.00</td>
            <td>$150.00</td>
        </tr>
        <tr class="item">
            <td>Atlas Engine</td>
            <td>4</td>
            <td>0</td>
            <td>1</td>
            <td>3</td>
            <td>$55.00</td>
            <td>$165.00</td>
        </tr>
        <tr class="item">
            <td>Enforce Oil 111</td>
            <td>30</td>
            <td>30</td>
            <td>50</td>
            <td>10</td>
            <td>$10.00</td>
            <td>$100.00</td>
        </tr>
        <tr class="item">
            <td>Turismo Oil N</td>
            <td>20</td>
            <td>10</td>
            <td>21</td>
            <td>9</td>
            <td>$12.00</td>
            <td>$108.00</td>
        </tr>
        <tr class="item">
            <td>Oil Premier</td>
            <td>8</td>
            <td>20</td>
            <td>24</td>
            <td>4</td>
            <td>$9.50</td>
            <td>$38.00</td>
        </tr>
        <tr class="item">
            <td>O3DE Recoil</td>
            <td>8</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>$5.00</td>
            <td>$35.00</td>
        </tr>
        <tr class="item">
            <td>Allocate Recoil</td>
            <td>5</td>
            <td>10</td>
            <td>2</td>
            <td>13</td>
            <td>$6.00</td>
            <td>$78.00</td>
        </tr>
        <tr class="item.last">
            <td>Source Tire 123</td>
            <td>6</td>
            <td>10</td>
            <td>12</td>
            <td>4</td>
            <td>$38.00</td>
            <td>$156.00</td>
        </tr>     
        <tr class="total">
            <td>Total: </td>
            <td>175</td>
            <td>175</td>
            <td>219</td>
            <td>131</td>
            <td></td>
            <td class="total-amount">$1475.00</td>
        </tr>
    </table>`;
}

function byItemNameReport() {
  return `
        <h3 class="title">Inventory by Item</h3>
        <table class ="by-itemname" cellpadding="0" cellspacing="0">   
            <tr class="heading items-list">
                <td>Category</td>
                <td>ItemName</td>
                <td>UnitPrice</td>
                <td>Qty</td>
                <td>Amuont</td>
            </tr>                    
            <tr class="item">
                <td>Battery</td>
                <td>AscendTX</td>
                <td>$10.00</td>
                <td>8</td>
                <td>$80.00</td>
            </tr>
            <tr class="item">
                <td>Battery</td>
                <td>Cube Battery</td>
                <td>$10.00</td>
                <td>13</td>
                <td>$130.00</td>
            </tr>
            <tr class="item">
                <td>Battery</td>
                <td>Capital 3X</td>
                <td>$6.00</td>
                <td>13</td>
                <td>$78.00</td>
            </tr>
            <tr class="item">
                <td>Blade</td>
                <td>Blade Razor</td>
                <td>$7.00</td>
                <td>6</td>
                <td>$42.00</td>
            </tr>
            <tr class="item">
                <td>Blade</td>
                <td>HPL Blade</td>
                <td>$20.00</td>
                <td>4</td>
                <td>$80.00</td>
            </tr>
            <tr class="item">
                <td>Blade</td>
                <td>Strike Blade</td>
                <td>$10.00</td>
                <td>13</td>
                <td>$130.00</td>
            </tr>                          
            <tr class="item">
                <td>Chain</td>
                <td>Kinetica Chaine 255</td>
                <td>$5.00</td>
                <td>11</td>
                <td>$55.00</td>
            </tr> 
            <tr class="item">
                <td>Chain</td>
                <td>Chain Tractor</td>
                <td>$5.00</td>
                <td>10</td>
                <td>$50.00</td>
            </tr>
            <tr class="item">
                <td>Engine</td>
                <td>4A ENGINE</td>
                <td>$50.00</td>
                <td>3</td>
                <td>$150.00</td>
            </tr> 
            <tr class="item">
                <td>Engine</td>
                <td>Atlas Engine</td>
                <td>$55.00</td>
                <td>3</td>
                <td>$165.00</td>
            </tr>  
            <tr class="item">
                <td>Gas</td>
                <td>Enforce Oil 111</td>
                <td>$10.00</td>
                <td>10</td>
                <td>$100.00</td>
            </tr>
            <tr class="item">
                <td>Gas</td>
                <td>Turismo Oil N</td>
                <td>$12.00</td>
                <td>9</td>
                <td>$108.00</td>
            </tr>
            <tr class="item">
                <td>Gas</td>
                <td>Oil Premier</td>
                <td>$9.50</td>
                <td>4</td>
                <td>$38.00</td>
            </tr>
            <tr class="item">
                <td>Recoil</td>
                <td>O3DE Recoil</td>
                <td>$5.00</td>
                <td>7</td>
                <td>$35.00</td>
            </tr> 
            <tr class="item">
                <td>Recoil</td>
                <td>Allocate Recoil</td>
                <td>$6.00</td>
                <td>13</td>
                <td>$78.00</td>
            </tr>
            <tr class="item.last">
                <td>Tire</td>
                <td>Source Tire A</td>
                <td>$38.00</td>
                <td>4</td>
                <td>$156.00</td>
            </tr>  

            <tr class="total">
                <td>Total: </td>
                <td></td>
                <td></td>
                <td>131</td>
                <td class="total-amount">$1475.00</td>
            </tr>
        </table>`;
}

function byStatusReport() {
  return `
        <h3 class="title">Inventory by Status</h3>
        <table class ="by-status" cellpadding="0" cellspacing="0">   
            <tr class="heading items-list">
                <td>Status</td>
                <td>Qty</td>
                <td>Amuont</td>
            </tr>
            
            <tr class="item">
                <td>Current</td>
                <td>105</td>
                <td>$5,500</td>
            </tr>

            <tr class="item.last">
                <td>Discontinued</td>
                <td>30</td>
                <td>$180</td>
            </tr> 

            <tr class="total">
                <td>Total: </td>
                <td>334</td>
                <td class="total-amount">$5,680</td>
            </tr>
        </table>`;
}

function getToday() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  return `${yyyy}.${mm}.${dd}`;
}
