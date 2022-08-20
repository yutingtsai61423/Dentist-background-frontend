var product = []; //var是函式作用域
window.onload = function () {
    //function(函數)將大程式分成許多個小的，方便管理及偵錯，減少重複
    //getProducts(null, null); //get攝取值

    $(document).on("click", "button.check", function () {
        let orderid = $(this).closest("tr").find("td").eq(0).text();
        console.log(orderid);
        getOrderlist(orderid);
    });

    init();
    $("button.search").on("click", function () {
        if (!$("#ordidInput").val()) {
            alert("請輸入訂單編號");
        }
        console.log($("#ordidInput").val());
        $.ajax({
            url: "http://localhost:8080/yokult/api/0.01/order/selectOrderid", // 資料請求的網址
            type: "POST", // GET | POST | PUT | DELETE | PATCH
            contentType: "application/json",
            data: JSON.stringify({
                ordid: $("#ordidInput").val(),
            }),
            dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
            success: function (data) {
                // console.log(data);
                if (data.msg == "success") {
                    $("tbody.abc").html("");
                    //清空原資料後開始迴圈

                    $("tbody.abc").append(`<tr>
                      <td>${data.order.ordid}</td>
                      <td>${data.order.memid}</td>
                      <td>${data.order.paymethod}</td>
                      <td>${data.order.orderstatus}</td>
                      <td>${data.order.addr}</td>
                      <td>${data.order.receipter}</td>
                      
                      <td>${data.order.shoptime}</td>
                      <td>${data.order.cellphone}</td>
                      <td>${data.order.phone}</td>
                      <td>
                          <button class="check btn-xs btn-light" data-toggle="modal"
                              data-target="#editProduct">
                              查看詳情</button>
                      </td>
                  </tr>`);
                }
            },
        });
    });
    //依類別去查詢
    $("button.searchStatus").on("click", function () {
        if ($("select#category :selected").text() == "查詢全部") {
            init();
        }
        let statusSend = null;
        let choice = $("select#category :selected").text();
        console.log(choice);

        switch (choice) {
            case "待付款":
                statusSend = "arrearage";
                break;
            case "處理中":
                statusSend = "processing";
                break;
            case "配送中":
                statusSend = "delivery";
                break;
            case "完成訂單":
                statusSend = "complete";
                break;
            case "取消訂單":
                statusSend = "cancel";
                break;
            case "退貨/退款":
                statusSend = "return";
                break;
        }
        const orderstatusMap = {
            //Map=映射，訂單狀態從英文狀態
            arrearage: "待付款",
            processing: "處理中",
            delivery: "配送中",
            complete: "完成訂單",
            cancel: "取消訂單",
            return: "退貨/退款",
        };
        const paymethodMap = {
            //Map=映射，付款方式英文狀態
            cash: "現金",
            creditcard: "信用卡",
            payment: "電子支付",
        };
        console.log(statusSend);
        $.ajax({
            url: "http://localhost:8080/yokult/api/0.01/order/selectOrderStatus", // 資料請求的網址
            type: "POST", // GET | POST | PUT | DELETE | PATCH
            contentType: "application/json",
            data: JSON.stringify({
                orderstatus: statusSend,
            }),
            dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
            success: function (data) {
                // console.log(data);
                if (data.msg == "success") {
                    // console.log(data);

                    $("tbody.abc").html("");
                    //清空原資料後開始迴圈
                    $.each(data.order, function (i, item) {
                        $("tbody.abc").append(`<tr>
                      <td>${item.ordid}</td>
                      <td>${item.memid}</td>
                      <td>${paymethodMap[item.paymethod]}</td>
                      <td>${orderstatusMap[item.orderstatus]}</td>
                      <td>${item.addr}</td>
                      <td>${item.receipter}</td>
                      
                      <td>${item.shoptime}</td>
                      <td>${item.cellphone}</td>
                      <td>${item.phone}</td>
                      <td>
                          <button class="check btn-xs btn-light" data-toggle="modal"
                              data-target="#editProduct">
                              查看詳情</button>
                      </td>
                  </tr>`);
                    });
                }
            },
        });
    });
};

function init() {
    const orderstatusMap = {
        //Map=映射，訂單狀態從英文狀態
        arrearage: "待付款",
        processing: "處理中",
        delivery: "配送中",
        complete: "完成訂單",
        cancel: "取消訂單",
        return: "退貨/退款",
    };
    const paymethodMap = {
        //Map=映射，付款方式英文狀態
        cash: "現金",
        creditcard: "信用卡",
        payment: "電子支付",
    };
    $.ajax({
        url: "http://localhost:8080/yokult/api/0.01/order/", // 資料請求的網址
        type: "GET", // GET | POST | PUT | DELETE | PATCH
        // data: {
        // },
        dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
        success: function (data) {
            // console.log(data);
            if (data.msg == "success") {
                $("tbody.abc").html("");
                //清空原資料後開始迴圈
                $.each(data.orders, function (i, item) {
                    $("tbody.abc").append(`<tr>
                  <td>${item.ordid}</td>
                  <td>${item.memid}</td>
                  <td>${paymethodMap[item.paymethod]}</td>
                  <td>${orderstatusMap[item.orderstatus]}</td>
                  <td>${item.addr}</td>
                  <td>${item.receipter}</td>
                  
                  <td>${item.shoptime}</td>
                  <td>${item.cellphone}</td>
                  <td>${item.phone}</td>
                  <td>
                      <button class="check btn-xs btn-light" data-toggle="modal"
                          data-target="#editProduct">
                          查看詳情</button>
                  </td>
              </tr>`);
                });
            }
        },
    });
}

//鎖定下拉選單
/* <select name="" id="order">
                          <option value=""></option>
                          <option value="">待付款</option>
                          <option value="">已付款</option>
                          <option value="">待處理</option>
                          <option value="">處理中</option>
                          <option value="">已出貨</option>
                          <option value="">配送中</option>
                          <option value="">完成訂單</option>
                          <option value="">取消訂單</option>
                          <option value="">退貨</option>
                          <option value="">退款中</option>
                          <option value="">退款成功</option>
                  </select>
                      <button id="btn" class=" btn-xs btn-light">鎖定</button> 
                      <script>
                                      document.querySelector(
                                          "#btn"
                                      ).onclick = () => {
                                          document.querySelector(
                                              "#order"
                                          ).disabled =
                                              !document.querySelector(
                                                  "#order"
                                              ).disabled;
                                      };
                                  </script> */

// console.log(JSON.stringify(me, myReplacer));
// 回傳結果已去除數值為數字的資料;

//function search($orderid) {
//search搜尋資料
//let orderid = $("#ordidInput").val(); //let區塊作用域，就是說只能在自己的區域宣告變數
//let category = $("#category").val(); //category聲明私有方法, $函數用來自定函數寫一個功能
//getorderlist(ordid, category);
//}

function reset() {
    //reset重整
    $("#ordidInput").val("");
    $("#category").val("");
}

function getOrderlist(ordId) {
    let requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    };

    let url = new URL("http://localhost:8080/yokult/api/0.01/orderlist/");
    if (ordId !== null && ordId !== "") {
        url.searchParams.append("ordId", ordId);
    }

    fetch(url.toString(), requestOptions)
        .then((response) => response.text())
        .then((text) => {
            const rep = JSON.parse(text);

            orderlists = rep.Orderlists;
            console.log(orderlists);
            // removeAllProducts();

            addOrderlist(orderlists);
        })
        .catch((error) => console.log("error", error));
}

// function removeAllProducts() {
//     $("#example2>tbody").remove();
// }

function addOrderlist(orderlists) {
    console.log("AddOrderList");
    $("#orderlist").empty().append(`<thead>
    <tr>
        <th>商品ID</th>
        <th>商品名稱</th>
        <th>商品數量</th>
        
    </tr>
</thead>`);
    orderlists.forEach((orderlist, idx) => {
        console.log("run");
        console.log(orderlist);
        let orderlistHtml = "";
        orderlistHtml = `
		<tbody>
        <tr>
          <td>${orderlist.orderlistid}</td>
          <td>${orderlist.proName}</td>
          <td>${orderlist.quantity}</td>
        </tr>
      </tbody>
		`;
        $("#orderlist").append(orderlistHtml);
    });
}

function setModalData(idx) {
    let product = products[idx];

    if (product === null || product === undefined) {
        return;
    }

    $("#proID").val(product.proID);
    $("#proName").val(product.proName);
    $("#proQuantity").val(product.proQuantity);
}

function saveProduct() {
    var raw = JSON.stringify({
        proID: $("#proID").val(),
        proName: $("#proName").val(),
        proQuantity: $("#proQuantity").val(),
    });

    var requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
    };

    fetch("http://localhost:8080/yokult/api/0.01/orderlist/", requestOptions)
        .then((response) => response.text())
        .then((result) => search())
        .catch((error) => console.log("error", error));

    $("#proID").val();
    $("#proName").val();
    $("#proQuantity").val();
    $("#editProduct").modal("hide");
}
