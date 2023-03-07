import { getProducts } from './data.mjs';
let productsList = getProducts();

// Variables
let productsTable = document.getElementById("products-table");
let filterBtn = document.querySelector(".btn-filter");
let keywordInput = document.querySelector(".keyword");
let msg = document.querySelector(".msg");
//////////////////////////
let pagination_element = document.getElementById("pagination");
let current_page = 1;
let rows =5;

function SetUpPagination(productsList, wrapper, row_per_page){
  wrapper.innerHTML ="";
  let page_count =Math.ceil(productsList.length/row_per_page)
  for (let i = 1; i < page_count + 1; i++ ){
      let btn = PaginationButton(i,productsList);
      wrapper.appendChild(btn);
  }
}

function PaginationButton(page,productsList){
  let button = document.createElement('button');
  button.innerText= page;

  if(current_page == page)button.classList.add('active');
  button.addEventListener('click', function(){
      current_page = page;
      displayProductsList(productsTable, productsList, rows, current_page);
      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');
      button.classList.add('active');
  });
  return button;
}
//////////////////////////
// DOM loaded
window.addEventListener("DOMContentLoaded", () => {
	displayProductsList(productsTable, productsList, rows, current_page);
  SetUpPagination(productsList, pagination_element, rows);

// Filter button clicked
filterBtn?.addEventListener("click", () => {
  let newList;
  if (keywordInput.value == "" ) {
    location.reload();
  } else {
    newList = filterWithKeyword(productsList, keywordInput.value);
	console.log(newList)
    if (newList.length == 0) {
    msg.innerHTML =
          '<span style="color:#fc4903; padding-left: 40px;">There is no data matching your search query</span>';
      } else {
        //displayProductsListFilter(productsTable, newList);
        displayProductsList(productsTable, newList, rows, current_page);
        SetUpPagination(newList, pagination_element, rows);
        msg.innerHTML =
          '<a href="products.html" style="color:green; padding-left: 40px; text-decoration:underline;">Go back to the original table</a>';
      }
    }
    keywordInput.value = "";
});


	let purchaseBtns = document.querySelectorAll(".edit-btn");

	// Purchase - ORDER button clicked
	purchaseBtns.forEach(btn => btn.addEventListener("click", () =>{
		let productId = btn.id.split("-")[1]
		let selectedProduct = productsList.find(item => item.id == productId);

		if (selectedProduct != null) {
			localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
			window.location.href="request-form.html";
		}
	}))
});

function displayProductsList(wrapper, arr,row_per_page, page) {
  wrapper.innerHTML ="";
  page--;
  let start = row_per_page*page;
  let end = start+row_per_page;
  let paginatedItems = arr.slice(start,end);

  let rows = "";
  for (let i = 0; i < paginatedItems.length; i++) {
    rows += `<tr>
				<td>${paginatedItems[i].UPC}</td>
				<td>${paginatedItems[i].category}</td>
				<td>${paginatedItems[i].itemName}</td>
				<td>${paginatedItems[i].supplierCode}</td>
				<td>${paginatedItems[i].supplierName}</td>
				<td><button class='edit-btn' id='purchase-${paginatedItems[i].id}'>ORDER</button></td>
			</tr>`;
  }
  wrapper.innerHTML = rows;
}

// Filter function
function filterWithKeyword(arr, kword) {
  kword = kword.toLowerCase();
  return arr.filter(
    (item) =>
      item.UPC.toLowerCase().includes(kword) ||
      item.category.toLowerCase().includes(kword) ||
      item.itemName.toLowerCase().includes(kword) ||
      item.supplierName.toLowerCase().includes(kword) ||
	  item.supplierCode.toLowerCase().includes(kword)
  );
}