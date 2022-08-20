$(function () {
  document.querySelector("#p_file").addEventListener("change", function (e) {
    if (this.files.length > 0) {
      //若此物件陣列裡面元素 "至少有一個檔案"的話
      var reader = new FileReader();
      // 執行讀取檔案
      reader.readAsDataURL(this.files[0]);
      // 監聽讀取完成事件
      reader.addEventListener("load", function () {
        // 圖片處理要用img標籤 src會自動解讀base64格式檔案
        document.querySelector(
          "#preview"
        ).innerHTML = `<img src="${reader.result}" class = "preview_img" >`;
      });
    } else {
      document.querySelector("#preview").innerHTML =
        '<span class="text">預覽圖</span>';
    }
  });
  // console.log(!!$(".preview_img").attr("src"));

  document.querySelector("#btn_submit").addEventListener("click", function () {
    var form_data = {};
    if (!!$(".preview_img").attr("src")) {
      form_data.img_base64 = document
        .querySelector(".preview_img")
        .getAttribute("src");
    }

    if (form_data.img_base64 == "" || $("input.drName").val() == null) {
      alert("資料未完成");
      return;
    }
    console.log(form_data.img_base64);
    // form_data.img_base64 = form_data.img_base64.substring(
    //   form_data.img_base64.indexOf(",") + 1
    // );

    // console.log(document.querySelector("#p_file").files[0]);
    //   console.log(form_data.img_base64);

    //   sessionStorage.setItem("form_data", JSON.stringify(form_data));
    let option1 = $("select.dr :selected").text();
    // console.log($("select.dr"));
    let drID = option1.substring(option1.indexOf("0") + 2);
    console.log("here in #btn_submit click");
    console.log($("input.drName").val());
    $.ajax({
      url: YOKULT_URL + DOCTOR + "/saveDr", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      contentType: "application/json",
      data: JSON.stringify({
        doctorId: drID,
        doctorName: $("input.drName").val(),
        doctorPhoto: form_data.img_base64,
      }),
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (data.msg == "no name") {
          alert("儲存失敗，沒有名字!");
        } else if (data.msg == "no photo") {
          alert("儲存失敗，沒有照片!");
        } else {
          alert("儲存成功!");
        }
      },
    });
  });

  $("button.search").on("click", function () {
    let option1 = $("select.dr :selected").text();
    // console.log($("select.dr"));
    let drID = option1.substring(option1.indexOf("0") + 2);
    $.ajax({
      url: YOKULT_URL + DOCTOR + "/loadDr", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      contentType: "application/json",
      data: JSON.stringify({
        doctorId: drID,
      }),
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (!!data.doctor.doctorName) {
          $("input.drName").val(data.doctor.doctorName);
        }
        if (!!data.doctor.doctorPhoto) {
          document.querySelector(
            "#preview"
          ).innerHTML = `<img src="data:image/png;base64,${data.doctor.doctorPhoto}" class = "preview_img" >`;
        } else {
          document.querySelector("#preview").innerHTML =
            '<span class="text">預覽圖</span>';
        }
      },
    });
  });
});
