window.onload = function () {
  var the_file_element = document.getElementById("proPicture");
  the_file_element.addEventListener("change", function (e) {
    // 寫在這
    var picture_list = document.getElementById("picPreview");
    picture_list.innerHTML = ""; // 清空
    picture_list.innerＴext = ""; // 清空
    // console.log(this);
    let reader = new FileReader(); // 用來讀取檔案
    reader.readAsDataURL(this.files[0]); // 讀取檔案
    reader.addEventListener("load", function () {
      // console.log(reader.result);
      let li_html = `<img style="height: 180px;" src="${reader.result}" class="preview">`;
      picture_list.insertAdjacentHTML("beforeend", li_html); // 加進節點
    });
  });
  const form = document.querySelector("form");
  let proPicture;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    axios
      .post(YOKULT_URL + PRODUCT + "/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        let data = res.data;
        console.log(res);
        if (data.msg === "success") {
          alert("上傳成功");
          proPicture = data.proPicture;
          console.log("picture1: ", proPicture);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  document.getElementById("addProduct").addEventListener("click", () => {
    let product = {};
    product.proName = document.getElementById("proName").value;
    product.proCategory = document.getElementById("proCategory").value;
    product.proBrand = document.getElementById("proBrand").value;
    product.proSpecs = document.getElementById("proSpecs").value;
    product.proStock = document.getElementById("proStock").value;
    product.proPrice = document.getElementById("proPrice").value;
    product.proPicture = proPicture ?? "";
    console.log("picture2: ", proPicture);
    axios
      .post(YOKULT_URL + PRODUCT, product)
      .then((res) => {
        let data = res.data;
        console.log(res);
        if (data.msg === "success") {
          alert("商品上架成功");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
