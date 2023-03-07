// Variables
let reportOptions = document.querySelector(".report-options");
let dateStart = document.querySelector(".date-start");
let dateEnd = document.querySelector(".date-end");
let viewReportBtn = document.querySelector(".btn-filter");
let backHomeBtn = document.querySelector(".back-home-btn");
let downloadBtn = document.querySelector(".download-btn");
let printBtn = document.querySelector(".print-btn");
let saveBtn = document.querySelector(".save-btn");
let msg = document.querySelector(".msg");
let printMsg = document.querySelector(".print-msg");

viewReportBtn?.addEventListener("click", () => {
  if (dateStart.value == "" && dateEnd.value == "") {
    msg.innerHTML = "Please select the start and end date";
  } else if (dateStart.value != "" && dateEnd.value == "") {
    msg.innerHTML = "Please select the end date";
  } else if (dateStart.value == "" && dateEnd.value != "") {
    msg.innerHTML = "Please select the start";
  } else {
    document.querySelector(".report-data").style.display = "flex";
    let reportContainer = document.querySelector(".report-container");
    let start = document.querySelector(".start");
    let end = document.querySelector(".end");
    let current = document.querySelector(".today");

    msg.innerHTML = "";
    start.innerHTML = dateStart.value.split("-").join(".");
    end.innerHTML = dateEnd.value.split("-").join(".");
    current.innerHTML = getToday();

    displayReport(reportContainer, reportOptions.value);
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
  window.location.href = "print-sales.html";
});

function displayReport(container, option) {
  if (option == "invoice") {
    container.innerHTML = salesByInvoice();
  } else if (option == "item") {
    container.innerHTML = salesByItem();
  } else if (option == "employee") {
    container.innerHTML = salesByEmployee();
  } else if (option == "payment") {
    container.innerHTML = salesByPayment();
  } else if (option == "all") {
    container.innerHTML = salesByAllOptions();
  }
}

function salesByInvoice() {
  return `<h3 class="title">Sales by Invoice</h3>
                <table class ="by-invoice" cellpadding="0" cellspacing="0">   
                    <tr class="heading items-list">
                        <td>Invoice #</td>
                        <td>Qty</td>
                        <td>Amuont</td>
                    </tr>
                    <tr class="item">
                        <td>IV011</td>
                        <td>3</td>
                        <td>$40.00</td>
                    </tr>
                    <tr class="item">
                        <td>IV012</td>
                        <td>4</td>
                        <td>$48.50</td>
                    </tr>
                    <tr class="item">
                        <td>IV013</td>
                        <td>5</td>
                        <td>$60.00</td>
                    </tr>
                    <tr class="item">
                        <td>IV014</td>
                        <td>1</td>
                        <td>$25.50</td>
                    </tr>
                    <tr class="item">
                        <td>IV015</td>
                        <td>6</td>
                        <td>$108.25</td>
                    </tr>
                    <tr class="item">
                        <td>IV016</td>
                        <td>1</td>
                        <td>$10.25</td>
                    </tr>
                    <tr class="item">
                        <td>IV017</td>
                        <td>2</td>
                        <td>$40.00</td>
                    </tr> 
                    <tr class="item">
                        <td>IV018</td>
                        <td>1</td>
                        <td>$12.00</td>
                    </tr>
                    <tr class="item">
                        <td>IV019</td>
                        <td>2</td>
                        <td>$24.50</td>
                    </tr>
                    <tr class="item">
                        <td>IV020</td>
                        <td>5</td>
                        <td>$60.00</td>
                    </tr>
                    <tr class="item">
                        <td>IV021</td>
                        <td>1</td>
                        <td>$51.25</td>
                    </tr>
                    <tr class="item">
                        <td>IV022</td>
                        <td>2</td>
                        <td>$48.00</td>
                    </tr>
                    <tr class="item">
                        <td>IV023</td>
                        <td>4</td>
                        <td>$65.25</td>
                    </tr>
                    <tr class="item">
                        <td>IV024</td>
                        <td>5</td>
                        <td>$45.25</td>
                    </tr> 
					<tr class="item">
                        <td>IV025</td>
                        <td>2</td>
                        <td>$24.50</td>
                    </tr>
                    <tr class="item">
                        <td>IV026</td>
                        <td>5</td>
                        <td>$60.00</td>
                    </tr>
                    <tr class="item">
                        <td>IV027</td>
                        <td>3</td>
                        <td>$28.00</td>
                    </tr>
                    <tr class="item">
                        <td>IV028</td>
                        <td>7</td>
                        <td>$108.00</td>
                    </tr>
                    <tr class="item">
                        <td>IV029</td>
                        <td>4</td>
                        <td>$65.25</td>
                    </tr>
                    <tr class="item.last">
                        <td>IV030</td>
                        <td>5</td>
                        <td>$45.25</td>
                    </tr>
                    <tr class="total">
                        <td>Sub Total: </td>
                        <td>68</td>
                        <td class="net">$969.75</td>
                    </tr>
                    <tr class="item">
                        <td></td>
                        <td>Tax</td>
                        <td class="tax">$90.57</td>
                    </tr>
                    <tr class="item">
                        <td></td>
                        <td>Discount</td>
                        <td> %</td>
                    </tr>
                    <tr class="total">
                        <td>Total: </td>
                        <td></td>
                        <td class="total-amount">$1060.32</td>
                    </tr>
                </table>`;
}

function salesByItem() {
  return `<table class="title" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <th>Sales by Item</th>
                    </tr>
                </thead>
            </table>
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
					<td>6</td>
					<td>$60.00</td>
				</tr>
				<tr class="item">
					<td>Battery</td>
					<td>Cube Battery</td>
					<td>$10.00</td>
					<td>8</td>
					<td>$80.00</td>
				</tr>
				<tr class="item">
					<td>Battery</td>
					<td>Capital 3X</td>
					<td>$6.00</td>
					<td>2</td>
					<td>$12.00</td>
				</tr>
				<tr class="item">
					<td>Blade</td>
					<td>Blade Razor</td>
					<td>$7.00</td>
					<td>4</td>
					<td>$28.00</td>
				</tr>
				<tr class="item">
					<td>Blade</td>
					<td>HPL Blade</td>
					<td>$20.00</td>
					<td>6</td>
					<td>$60.00</td>
				</tr>  	
				<tr class="item">
					<td>Blade</td>
					<td>Strike Blade</td>
					<td>$10.00</td>
					<td>0</td>
					<td>$0.00</td>
				</tr>			
				<tr class="item">
					<td>Chain</td>
					<td>Kinetica Chaine 255</td>
					<td>$5.00</td>
					<td>2</td>
					<td>$10.00</td>
				</tr>
				<tr class="item">
					<td>Chain</td>
					<td>Chain Tractor</td>
					<td>$5.00</td>
					<td>3</td>
					<td>$15.00</td>
				</tr> 
				<tr class="item">
					<td>Engine</td>
					<td>4A ENGINE</td>
					<td>$50.00</td>
					<td>2</td>
					<td>$100.00</td>
				</tr>
				<tr class="item">
					<td>Engine</td>
					<td>Atlas Engine</td>
					<td>$55.00</td>
					<td>1</td>
					<td>$55.00</td>
				</tr>	 				
				<tr class="item">
					<td>Gas</td>
					<td>Enforce Oil 111</td>
					<td>$10.00</td>
					<td>12</td>
					<td>$120.00</td>
				</tr>
				<tr class="item">
					<td>Gas</td>
					<td>Turismo Oil N</td>
					<td>$12.00</td>
					<td>4</td>
					<td>$48.00</td>
				</tr>
				<tr class="item">
					<td>Gas</td>
					<td>Oil Premier</td>
					<td>$9.50</td>
					<td>18</td>
					<td>$171.00</td>
				</tr>
				<tr class="item">
					<td>Recoil</td>
					<td>O3DE Recoil</td>
					<td>$5.00</td>
					<td>1</td>
					<td>$5.00</td>
				</tr> 
				<tr class="item">
					<td>Recoil</td>
					<td>Allocate Recoil</td>
					<td>$6.00</td>
					<td>0</td>
					<td>$0.00</td>
				</tr>
				<tr class="item.last">
					<td>Tire</td>
					<td>Source Tire A</td>
					<td>$38.00</td>
					<td>2</td>
					<td>$76.00</td>
				</tr>

				<tr class="total">
					<td>Sub Total: </td>
					<td></td>
					<td></td>
					<td>68</td>
					<td class="net">$969.75</td>
				</tr>
				<tr class="item">
					<td></td>
					<td></td>
					<td></td>
					<td>Tax</td>
					<td class="tax">$90.57</td>
				</tr>
				<tr class="item">
					<td></td>
					<td></td>
					<td></td>
					<td>Discount</td>
					<td> %</td>
				</tr>
				<tr class="total">
					<td>Total: </td>
					<td></td>
					<td></td>
					<td></td>
					<td class="total-amount">$1060.32</td>
				</tr>
			</table>`;
}

function salesByEmployee() {
  return `<h3 class="title">Sales by Employee</h3>
                <table class ="by-employee" cellpadding="0" cellspacing="0">   
                    <tr class="heading items-list">
                        <td>Name</td>
                        <td>Qty</td>
                        <td>Amuont</td>
                    </tr>
                    
                    <tr class="item">
                        <td>wtutty</td>
                        <td>35</td>
                        <td>$570.25</td>
                    </tr>
    
                    <tr class="item.last">
                        <td>wdickey</td>
                        <td>33</td>
                        <td>$399.50</td>
                    </tr> 
    
                    <tr class="total">
                        <td>Sub Total: </td>
                        <td>68</td>
                        <td class="net">$969.75</td>
                    </tr>

                    <tr class="item">
                        <td></td>
                        <td>Tax</td>
                        <td class="tax">$90.57</td>
                    </tr>
    
                    <tr class="total">
                        <td>Total: </td>
                        <td></td>
                        <td class="total-amount">$1060.32</td>
                    </tr>
                </table>`;
}

function salesByPayment() {
  return `<h3 class="title">Sales by Payment</h3>
                <table class ="by-payment" cellpadding="0" cellspacing="0">   
                    <tr class="heading items-list">
                        <td>Payment</td>
                        <td>Qty</td>
                        <td>Amuont</td>
                    </tr>
                    
                    <tr class="item">
                        <td>credit</td>
                        <td>30</td>
                        <td>$420.25</td>
                    </tr>

                    <tr class="item">
                        <td>debit</td>
                        <td>11</td>
                        <td>$145.00</td>
                    </tr>
    
                    <tr class="item.last">
                        <td>cash</td>
                        <td>27</td>
                        <td>$404.50</td>
                    </tr> 
    
                    <tr class="total">
                        <td>Sub Total: </td>
                        <td>68</td>
                        <td class="net">$969.75</td>
                    </tr>

                    <tr class="item">
                        <td></td>
                        <td>Tax</td>
                        <td class="tax">$90.57</td>
                    </tr>
    
                    <tr class="total">
                        <td>Total: </td>
                        <td></td>
                        <td class="total-amount">$1060.32</td>
                    </tr>
                </table>`;
}

function salesByAllOptions() {
  let report = "";
  report =
    salesByInvoice() + salesByItem() + salesByEmployee() + salesByPayment();
  return report;
}

function getToday() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  return `${yyyy}.${mm}.${dd}`;
}
