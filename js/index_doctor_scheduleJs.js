$(function () {
  let doctorId = 1;

  //=============選擇醫師
  $("button.D001").on("click", function () {
    if ($("button.D002").hasClass("clicked")) {
      $("button.D002").removeClass("clicked");
    }
    $("button.D001").addClass("clicked");
    doctorId = 1;
    let str = $("select.selectDate option:selected").text();
    let date1 = str.substring(0, str.indexOf(" "));
    let date2 = str.substring(str.lastIndexOf(" ") + 1);
    ajaxForScheduleDrname(date1, date2);
  });
  $("button.D002").on("click", function () {
    if ($("button.D001").hasClass("clicked")) {
      $("button.D001").removeClass("clicked");
    }
    $("button.D002").addClass("clicked");
    doctorId = 2;
    let str = $("select.selectDate option:selected").text();
    let date1 = str.substring(0, str.indexOf(" "));
    let date2 = str.substring(str.lastIndexOf(" ") + 1);
    ajaxForScheduleDrname(date1, date2);
  });

  // ===============下一周下拉選單==========
  function weekDate(date) {
    let year = date.getFullYear();
    let one_day = 86400000;
    //回傳星期幾
    let day = date.getDay();
    // 設時間為0:0:0
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    //回傳自1970/01/01至今的毫秒數
    let todayMillis = date.getTime();
    let sixDayMillis = 6 * 24 * 60 * 60 * 1000;
    let sevenDayMillis = 7 * 24 * 60 * 60 * 1000;
    //轉Date物件
    let this_week_end = new Date(todayMillis + sixDayMillis);
    let next_week_start = new Date(todayMillis + sevenDayMillis);
    let next_week_end = new Date(next_week_start.getTime() + sixDayMillis);
    let next_2week_start = new Date(next_week_start.getTime() + sevenDayMillis);
    let next_2week_end = new Date(next_2week_start.getTime() + sixDayMillis);

    let next_3week_start = new Date(
      next_2week_start.getTime() + sevenDayMillis
    );
    let next_3week_end = new Date(next_3week_start.getTime() + sixDayMillis);

    let thisWeek = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} - ${this_week_end.getFullYear()}/${
      this_week_end.getMonth() + 1
    }/${this_week_end.getDate()}`;

    let nextWeek = `${next_week_start.getFullYear()}/${
      next_week_start.getMonth() + 1
    }/${next_week_start.getDate()} - ${next_week_end.getFullYear()}/${
      next_week_end.getMonth() + 1
    }/${next_week_end.getDate()}`;

    let next2Week = `${next_2week_start.getFullYear()}/${
      next_2week_start.getMonth() + 1
    }/${next_2week_start.getDate()} - ${next_2week_end.getFullYear()}/${
      next_2week_end.getMonth() + 1
    }/${next_2week_end.getDate()}`;

    let next3Week = `${next_3week_start.getFullYear()}/${
      next_3week_start.getMonth() + 1
    }/${next_3week_start.getDate()} - ${next_3week_end.getFullYear()}/${
      next_3week_end.getMonth() + 1
    }/${next_3week_end.getDate()}`;

    var map = new Map();
    map["1"] = thisWeek;
    map["2"] = nextWeek;
    map["3"] = next2Week;
    map["4"] = next3Week;

    return map;
  }
  //===下拉選單方法執行填入===
  const now = new Date();
  let weekMap = weekDate(now);
  $("select.selectDate")
    .children("option")
    .each(function (index, item) {
      $(item).text(weekMap[index + 1]);
    });

  //====預設填入本周日期======
  trWriteinit(now);

  //====依據下拉事選單 填入對應日期===
  $("select.selectDate").on("change", function () {
    let dateObjectBaseline;
    let sevenDayMillis = 7 * 24 * 60 * 60 * 1000;
    if ($("select.selectDate option.week1").prop("selected")) {
      dateObjectBaseline = now;
    } else if ($("select.selectDate option.week2").prop("selected")) {
      dateObjectBaseline = new Date(now.getTime() + sevenDayMillis);
    } else if ($("select.selectDate option.week3").prop("selected")) {
      dateObjectBaseline = new Date(now.getTime() + 2 * sevenDayMillis);
    } else if ($("select.selectDate option.week4").prop("selected")) {
      dateObjectBaseline = new Date(now.getTime() + 3 * sevenDayMillis);
    }
    trWrite(dateObjectBaseline);

    //=======ajax
    let str = $("select.selectDate option:selected").text();
    let date1 = str.substring(0, str.indexOf(" "));
    let date2 = str.substring(str.lastIndexOf(" ") + 1);
    ajaxForScheduleDrname(date1, date2);
  });

  //===========自動填入星期相關方法==============
  //=====預設載入頁面值===
  function trWriteinit(now) {
    trWrite(now);
  }

  //寫入日期標籤
  function trWrite(dateObjectBaseline) {
    let thisWeekDateTextMap = getThisWeekDate(dateObjectBaseline);
    $("tr.weeekDate")
      .children("td")
      .each(function (index, item) {
        let text = thisWeekDateTextMap[index + 1];
        $(item).html(text);
      });

    let thisWeekDateObjectMap =
      getThisWeekEverydayDateObject(dateObjectBaseline);
    let thisWeekDateChineseMap = getChineseWeekDay(thisWeekDateObjectMap);

    $("tr.chineseWeekDay")
      .children("th")
      .each(function (index, item) {
        let text2 = thisWeekDateChineseMap[index + 1];
        $(item).html(text2);
      });
  }
  // 拿到每天日期字串;
  function getThisWeekDate(date) {
    let thisWeekDateObjectMap = getThisWeekEverydayDateObject(date);
    let thisWeekDateTextMap = getThisWeekEverydayDateText(
      thisWeekDateObjectMap
    );
    return thisWeekDateTextMap;
  }

  //拿到每天日期字串
  function getThisWeekEverydayDateText(thisWeekDateObjectMap) {
    let thisWeekDateTextMap = new Map();
    for (let i = 1; i < 8; i++) {
      let str = `<input type="hidden" value="${thisWeekDateObjectMap[
        i
      ].getFullYear()}">${
        thisWeekDateObjectMap[i].getMonth() + 1
      } / ${thisWeekDateObjectMap[i].getDate()}`;
      thisWeekDateTextMap[i] = str;
      //   console.log(str);
    }
    return thisWeekDateTextMap;
  }

  //拿到本周每日Date物件
  function getThisWeekEverydayDateObject(date) {
    let todayMillis = date.getTime();
    let oneDayMillis = 1 * 24 * 60 * 60 * 1000;
    let thisWeekDateObjectMap = new Map();
    let thisMillis = todayMillis;
    for (let i = 1; i < 8; i++) {
      if (i == 1) {
        thisWeekDateObjectMap[i] = date;
      } else {
        thisMillis += oneDayMillis;
        thisWeekDateObjectMap[i] = new Date(thisMillis);
      }
      //   console.log(thisWeekDateObjectMap[i]);
    }
    return thisWeekDateObjectMap;
  }

  //拿到每天星期字串
  function getChineseWeekDay(thisWeekDateObjectMap) {
    let thisWeekDateChineseMap = new Map();
    for (let i = 1; i < 8; i++) {
      // console.log(thisWeekDateObjectMap[i]);
      let n = thisWeekDateObjectMap[i].getDay();
      switch (n) {
        case 1:
          thisWeekDateChineseMap[i] = "一";
          break;
        case 2:
          thisWeekDateChineseMap[i] = "二";
          break;
        case 3:
          thisWeekDateChineseMap[i] = "三";
          break;
        case 4:
          thisWeekDateChineseMap[i] = "四";
          break;
        case 5:
          thisWeekDateChineseMap[i] = "五";
          break;
        case 6:
          thisWeekDateChineseMap[i] = "六";
          break;
        case 0:
          thisWeekDateChineseMap[i] = "日";
          break;
      }
    }
    return thisWeekDateChineseMap;
  }

  //=====按下去呈現顏色
  $("table.table")
    .find("button.btn")
    .on("click", function () {
      let buttonClicked = $(this);
      if ($(buttonClicked).hasClass("clicked")) {
        buttonClicked.removeClass("clicked");
      } else {
        $(buttonClicked).addClass("clicked");
      }
    });
  // console.log($("tr.weeekDate").children("td").text());

  function ajaxForScheduleDrname(date1, date2) {
    $.ajax({
      url: YOKULT_URL + BOOKING + "/drSchedule", // 資料請求的網址
      type: "GET", // GET | POST | PUT | DELETE | PATCH
      data: {
        date1: date1,
        date2: date2,
        doctorId: doctorId,
      }, // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        // console.log(data);
        //  $("span.drName").text(data.schedule.name + "醫師");
        //  $("img.drImg").attr(
        //    "src",
        //    `data:image/png;base64,${data.schedule.photo}`
        //  );

        //判斷最後兩個數字
        //歸零
        $("table.weekBookingTime").find("button").removeClass("clicked");
        $.each(data.schedule.list, function (i, listitem) {
          //listitem印出{doctorScheduleDate: '2022-07-22', doctorAmpm: '早'}
          // console.log("here in loop");
          $.each($("tr.weeekDate").children("td"), function (index, item) {
            // console.log($(item).text());
            let str =
              $(item)
                .text()
                .substring($(item).text().lastIndexOf(" ") + 1) + "";
            if (str.length == 1) {
              str = "0" + str;
            }

            if (listitem.doctorScheduleDate.substring(8) == str) {
              let ampm = listitem.doctorAmpm;
              switch (ampm) {
                case "早":
                  $("table.weekBookingTime")
                    .find("tr")
                    .eq(2)
                    .find("td")
                    .eq(index)
                    .find("button")
                    .addClass("clicked");
                  break;
                case "午":
                  $("table.weekBookingTime")
                    .find("tr")
                    .eq(3)
                    .find("td")
                    .eq(index)
                    .find("button")
                    .addClass("clicked");
                  break;
                case "晚":
                  $("table.weekBookingTime")
                    .find("tr")
                    .eq(4)
                    .find("td")
                    .eq(index)
                    .find("button")
                    .addClass("clicked");
                  break;
              }
            }
          });
        });
      },
    });
  }
  //=======收集click
  $("button.saveDr").on("click", function () {
    let listOfPackage = new Array();
    $.each($("table.weekBookingTime").find("button"), function (index, item) {
      if ($(item).hasClass("clicked")) {
        let package = {};
        let str = $(item).text().trim();
        package.doctorAmpm = str;
        let num = $(item).attr("data-num");
        let tag = $("tr.weeekDate").children("td").eq(num);
        let year = $(tag).find("input").val();
        let date = $(tag).text().replace(/ /g, "");
        let arr = date.split("/");
        let monthadd;
        let dateadd;
        if (arr[0].length == 1) {
          monthadd = "0" + arr[0];
        } else {
          monthadd = arr[0];
        }
        if (arr[1].length == 1) {
          dateadd = "0" + arr[1];
        } else {
          dateadd = arr[1];
        }
        let getdate = year + "-" + monthadd + "-" + dateadd;
        console.log(getdate);
        package.doctorScheduleDate = getdate.replace(/\//g, "-");
        package.doctorId = doctorId;
        package.doctorStatus = 1;
        listOfPackage.push(package);
      }
      if (!$(item).hasClass("clicked")) {
        let package = {};
        let str = $(item).text().trim();
        package.doctorAmpm = str;
        let num = $(item).attr("data-num");
        let tag = $("tr.weeekDate").children("td").eq(num);
        let year = $(tag).find("input").val();
        let date = $(tag).text().replace(/ /g, "");
        let arr = date.split("/");
        let monthadd;
        let dateadd;
        if (arr[0].length == 1) {
          monthadd = "0" + arr[0];
        } else {
          monthadd = arr[0];
        }
        if (arr[1].length == 1) {
          dateadd = "0" + arr[1];
        } else {
          dateadd = arr[1];
        }
        let getdate = year + "-" + monthadd + "-" + dateadd;
        package.doctorScheduleDate = getdate.replace(/\//g, "-");
        package.doctorId = doctorId;
        package.doctorStatus = 0;
        listOfPackage.push(package);
      }
    });
    console.log(listOfPackage);
    $.ajax({
      url: YOKULT_URL + DOCTOR + "/updateDrSchedule", // 資料請求的網址
      type: "PUT", // GET | POST | PUT | DELETE | PATCH
      contentType: "application/json",
      data: JSON.stringify({
        listOfDoctorSchedule: listOfPackage,
      }),
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        alert("修改成功!");
      },
    });
  });
});
