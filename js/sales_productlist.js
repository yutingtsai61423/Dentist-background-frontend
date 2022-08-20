var products = [];
window.onload = function () {
  getProducts(null, null);
};

function search() {
  let productName = $("#productNameInput").val();
  let category = $("#category").val();
  getProducts(productName, category);
}

function reset() {
  $("#productNameInput").val("");
  $("#category").val("");
}

function getProducts(productName, category) {
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let url = new URL(YOKULT_URL + PRODUCT);
  if (productName != null && productName != "") {
    url.searchParams.append("productName", productName);
  }
  if (category != null && category != "") {
    url.searchParams.append("category", category);
  }

  fetch(url, requestOptions)
    .then((response) => response.text())
    .then((text) => {
      const rep = JSON.parse(text);

      products = rep.products;

      removeAllProducts();

      addProducts(rep.products);
    })
    .catch((error) => console.log("error", error));
}

function removeAllProducts() {
  $("#example2>tbody").remove();
}

function addProducts(products) {
  products.forEach((product, idx) => {
    let productlistHtml = "";

    productlistHtml = `
      <tbody>
        <tr>
          <td>${product.proID}</td>
          <td>${product.proName}</td>
          <td>${product.proStock}</td>
          <td>${product.proPrice}</td>
          <td>${product.proSpecs}</td>
          <td>${product.proBrand}</td>
          <td>${product.proCategory}</td>
          <td>0</td>
          <td>
            <button
              class="btn-xs btn-light"
              onclick="setModalData(${idx})"
              data-toggle="modal"
              data-target="#editProduct"
            >
              編輯
            </button>
          </td>
        </tr>
      </tbody>`;

    $("#example2").prepend(productlistHtml);
  });
}

function setModalData(idx) {
  let product = products[idx];

  if (product == null || product == undefined) {
    return;
  }

  $("#proID").val(product.proID);
  $("#proName").val(product.proName);
  $("#proStock").val(product.proStock);
  $("#proPrice").val(product.proPrice);
  $("#proSpecs").val(product.proSpecs);
  $("#proBrand").val(product.proBrand);
  $("#proCategory").val(product.proCategory);
}

function saveProduct() {
  var raw = JSON.stringify({
    proID: $("#proID").val(),
    proName: $("#proName").val(),
    proStock: $("#proStock").val(),
    proPrice: $("#proPrice").val(),
    proSpecs: $("#proSpecs").val(),
    proBrand: $("#proBrand").val(),
    proCategory: $("#proCategory").val(),
  });

  var requestOptions = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow",
  };

  fetch(YOKULT_URL + PRODUCT, requestOptions)
    .then((response) => response.text())
    .then((result) => search())
    .catch((error) => console.log("error", error));

  $("#proID").val();
  $("#proName").val();
  $("#proStock").val();
  $("#proPrice").val();
  $("#proSpecs").val();
  $("#proBrand").val();
  $("#proCategory").val();

  $("#editProduct").modal("hide");
}
