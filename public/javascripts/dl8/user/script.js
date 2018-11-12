
//タイマーをセット
function tm() {
    // tm = setInterval("location.reload()",1000*10);
    onoff();
}

function onoff() {
    var aiArray = [0, 0, 20, 0, 1, 100, 20, 0, 0, 0, 230, 0, 0, 0, 10];
    for (var i = 0; i < 15; i++) {
        aiArray[i] = Number(ai_per[i]);
    }

    for (var i = 0; i < aiArray.length; i++) {
        if (aiArray[i] > 0) {
            $(".room div.CH" + (i + 1) + "").addClass("on");
        } else {
            $(".room div.CH" + (i + 1) + "").removeClass("on");
        }
    }
    //工場
    var factry = 0;
    for (var i = 3; i < aiArray.length; i++) {
        factry += 995 / 131.5 * aiArray[i]
    }
    $(".w_factry").html("現在の電力消費量は" + Math.round(factry) + "W<br>1時間あたり約" + Math.round(factry * 23.7 / 1000) + "円です。");
    //203
    var a203 = aiArray[2] * 995 / 131.5;
    $(".w_a203").html("現在の電力消費量は" + Math.round(a203) + "W<br>1時間あたり約" + Math.round(a203 * 23.7 / 1000) + "円です。");

    //202
    var a202 = aiArray[0] * 995 / 131.5 + aiArray[1] * 995 / 131.5;
    $(".w_a202").html("現在の電力消費量は" + Math.round(a202) + "W<br>1時間あたり約" + Math.round(a202 * 23.7 / 1000) + "円です。");

}


// 部屋ごとのtrendの合計
let trend_factry_per = [];
let trend_A202_per = [];
let trend_A203_per = [];
let trend_all_per = [];

let trend_factry_w = [];
let trend_A202_w = [];
let trend_A203_w = [];
let trend_all_w = [];

let trend_factry_yen = [];
let trend_A202_yen = [];
let trend_A203_yen = [];
let trend_all_yen = [];

// 部屋ごとにtrendの配列をたてにたす.
trend_factry_per = trend_p1_ch1.map(function (value, index, array) {
    return trend_p1_ch4[index] + trend_p2_ch1[index] + trend_p2_ch2[index] + trend_p2_ch3[index] + trend_p2_ch4[index] + trend_p3_ch1[index] + trend_p3_ch2[index] + trend_p3_ch3[index] + trend_p3_ch4[index] + trend_p4_ch1[index] + trend_p4_ch2[index] + trend_p4_ch3[index];
})
trend_A202_per = trend_p1_ch1.map(function (value, index, array) {
    return trend_p1_ch1[index];
})
trend_A203_per = trend_p1_ch1.map(function (value, index, array) {
    return trend_p1_ch2[index] + trend_p1_ch2[index];
})
trend_all_per = trend_p1_ch1.map(function (value, index, array) {
    return trend_factry_per[index] + trend_A202_per[index] + trend_A203_per[index];
})


trend_factry_w = perToW(trend_factry_per);
trend_A202_w = perToW(trend_A202_per);
trend_A203_w = perToW(trend_A203_per);
trend_all_w = perToW(trend_all_per);

trend_factry_yen = wToYen(trend_factry_w);
trend_A202_yen = wToYen(trend_A202_w);
trend_A203_yen = wToYen(trend_A203_w);
trend_all_yen = wToYen(trend_all_w);

// 単位変換（配列）％->W
function perToW(perArray) {
    return perArray.map(function (value) {
        return value * 995 / 131.5
    });
}
// 単位変換（配列）W->円
function wToYen(wArray) {
    return wArray.map(function (value) {
        return Math.round(value * 23.7 / 1000)
    });
}


function getDaynum(num) {
    var Daynum = 0;
    if (num == 0) {
        Daynum = 6;
    } else {
        Daynum = num - 1;
    }
    return Daynum;
}
var weekGoalArray = [20000, 20000, 20000, 20000, 20000, 20000, 20000];
var lastWeekArray = [0, 0, 0, 0, 0, 0, 0];
var thisWeekArray = [0, 0, 0, 0, 0, 0, 0];

var today = new Date(year, mon - 1, day, hour, min);
var k = 0;

for (var j = hour; j >= 0; j--) {
    thisWeekArray[getDaynum(today.getDay())] += trend_all_yen[trend_p1_ch1.length - 1 - k];
    k++;
}

if (getDaynum(today.getDay()) != 0) {
    for (var i = getDaynum(today.getDay()) - 1; i >= 0; i--) {
        for (var j = 23; j >= 0; j--) {
            if (trend_p1_ch1.length <= k) {
                break;
            }
            thisWeekArray[i] += trend_all_yen[trend_p1_ch1.length - 1 - k];
            k++;

        }

    }

}



for (var i = 6; i >= 0; i--) {
    for (var j = 23; j >= 0; j--) {
        if (trend_p1_ch1.length <= k) {
            break;
        }
        lastWeekArray[i] += trend_all_yen[trend_p1_ch1.length - 1 - k];
        k++;
    }

}
for (var i = 6; i >= 0; i--) {
    if (lastWeekArray[i] == 0) {
        lastWeekArray[i] = 15;
    }
}
var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["先週", "今週"],
        datasets: [{
                label: '月曜日',
                data: [lastWeekArray[0], thisWeekArray[0]],
                backgroundColor: [
                    'RGBA(56,134,70, 0.7)',
                    'RGBA(56,134,70, 0.7)'
                ],
                borderColor: [
                    '#388646',
                    '#388646'
                ],
                borderWidth: 1
            },
            {
                label: '火曜日',
                data: [lastWeekArray[1], thisWeekArray[1]],
                backgroundColor: [
                    'RGBA(67, 149, 83, 0.7)',
                    'RGBA(67, 149, 83, 0.7)'
                ],
                borderColor: [
                    '#439553',
                    '#439553'
                ],
                borderWidth: 1
            },
            {
                label: '水曜日',
                data: [lastWeekArray[2], thisWeekArray[2]],
                backgroundColor: [
                    'RGBA(123, 165, 85, 0.7)',
                    'RGBA(123, 165, 85, 0.7)'
                ],
                borderColor: [
                    '#7ba555',
                    '#7ba555'
                ],
                borderWidth: 1
            },
            {
                label: '木曜日',
                data: [lastWeekArray[3], thisWeekArray[3]],
                backgroundColor: [
                    'RGBA(182, 169, 79, 0.7)',
                    'RGBA(182, 169, 79, 0.7)'
                ],
                borderColor: [
                    '#b6a94f',
                    '#b6a94f'
                ],
                borderWidth: 1
            },
            {
                label: '金曜日',
                data: [lastWeekArray[4], thisWeekArray[4]],
                backgroundColor: [
                    'RGBA(187, 184, 74, 0.7)',
                    'RGBA(187, 184, 74, 0.7)'
                ],
                borderColor: [
                    '#bbb84a',
                    '#bbb84a'
                ],
                borderWidth: 1
            },
            {
                label: '土曜日',
                data: [lastWeekArray[5], thisWeekArray[5]],
                backgroundColor: [
                    'RGBA(204, 205, 80, 0.7)',
                    'RGBA(204, 205, 80, 0.7)'
                ],
                borderColor: [
                    '#cccd50',
                    '#cccd50'
                ],
                borderWidth: 1
            },
            {
                label: '日曜日',
                data: [lastWeekArray[6], thisWeekArray[6]],
                backgroundColor: [
                    'RGBA(255, 231, 96, 0.7)',
                    'RGBA(255, 231, 96, 0.7)'
                ],
                borderColor: [
                    '#FFE760',
                    '#FFE760'
                ],
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            xAxes: [{
                stacked: true,
            }],
            yAxes: [{
                stacked: true,
                scaleLabel: { //軸ラベル設定
                    display: true, //表示設定
                    labelString: '円', //ラベル
                    fontSize: 10 //フォントサイズ
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            labels: {
                boxWidth: 30,
                padding: 20 //凡例の各要素間の距離
            },
            position: 'bottom',
            display: true
        },
        animation: false
    }
});


// （引数）日前の日の0時のindexを返す関数 0日だと今日の0時
function indexofDataZero(num){
    let index = 0;
    let hour_length = 24 * num + trend_p1_hour[trend_p1_hour.length - 1] + 1;
    index = trend_p1_hour.length - hour_length;
    return index;
}

//  [(start)日前0時] から [(end)日前0時 or 現在]　のデータを取得
function getDataArray(data, start){
    const startDayIndex = indexofDataZero(start);
    const slicedArray = data.slice(startDayIndex);
    return slicedArray;
}
function getDataArray2(data, start, end){
    const startDayIndex = indexofDataZero(start);
    const endDayIndex = indexofDataZero(end);
    const slicedArray = data.slice(startDayIndex, endDayIndex);
    return slicedArray;
}


// for 折れ線グラフ--------------------------------
let timeLabelArraytmp = trend_p1_year.map(function (value, index) {
    let year = trend_p1_year[index];
    let mon = trend_p1_mon[index];
    let day = trend_p1_day[index];
    let hour = trend_p1_hour[index];
    return `${year}/${mon}/${day} ${hour}時`;
})

let numofDays = 7; 

let timeLabelArray = getDataArray(timeLabelArraytmp,numofDays);
let trend_factry_yen_chart = getDataArray(trend_factry_yen,numofDays);
let trend_A202_yen_chart = getDataArray(trend_A202_yen,numofDays);
let trend_A203_yen_chart = getDataArray(trend_A203_yen,numofDays);
//--------------------------------


// for 棒グラフ----------------------------------------
let timeLabelArraytmp_bar = trend_p1_year.map(function (value, index) {
    let hour = trend_p1_hour[index];
    return `${hour}時`;
})

// 今日の日付
let trend_yen_chart_bar_date_today = `${trend_p1_mon[indexofDataZero(0)]}/${trend_p1_day[indexofDataZero(0)]}`;
// 先週の今日の日付
let trend_yen_chart_bar_date_lastweek = `${trend_p1_mon[indexofDataZero(7)]}/${trend_p1_day[indexofDataZero(7)]}`;

// ラベルの配列
let timeLabelArray_bar = getDataArray2(timeLabelArraytmp_bar, 7, 6);

//今日のデータの配列
let trend_factry_yen_chart_bar_today = getDataArray(trend_factry_yen, 0);
let trend_A202_yen_chart_bar_today = getDataArray(trend_A202_yen, 0);
let trend_A203_yen_chart_bar_today = getDataArray(trend_A203_yen, 0);

//先週の今日データの配列
let trend_factry_yen_chart_bar_lastweek = getDataArray2(trend_factry_yen, 7, 6);
let trend_A202_yen_chart_bar_lastweek = getDataArray2(trend_A202_yen, 7, 6);
let trend_A203_yen_chart_bar_lastweek = getDataArray2(trend_A203_yen, 7, 6);
// ----------------------------------------


// 工場
var ctx1 = document.getElementById("chart_factry");
var chart_factry = new Chart(ctx1, {
    type: 'line', // チャートのタイプ
    data: { // チャートの内容
        labels: timeLabelArray,
        datasets: [{
            label: '工場 電気料金（円）',
            lineTension: 0, // ベジェ曲線を無効化
            data: trend_factry_yen_chart,
            backgroundColor: 'RGBA(56,134,70, 0.4)',
            borderColor: 'RGBA(56,134,70, 1)',
            borderWidth: 1,
            pointRadius: 1,
        }]
    },
    options: { // チャートのその他オプション
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                },
            }],
            xAxes: [{
                ticks: {
                    stepSize: 12,
                }
            }]
        }
    }
});



var barChartData_factry = {
    labels: timeLabelArray_bar,
    datasets: [
    {
        label: '先週: ' + trend_yen_chart_bar_date_lastweek.slice(0, -1) + 'の電気料金 (円)',
        data: trend_factry_yen_chart_bar_lastweek.slice(0, -1),
        borderColor : "rgba(254,97,132,0.8)",
        backgroundColor : "rgba(254,97,132,0.5)",
    },
    {
        label: '今日: ' + trend_yen_chart_bar_date_today.slice(0, -1) + 'の電気料金 (円)',
        data: trend_factry_yen_chart_bar_today.slice(0, -1),
        borderColor : "rgba(54,164,235,0.8)",
        backgroundColor : "rgba(54,164,235,0.5)",
    },
    ]
};
var complexChartOption = {
    responsive: true,
};
var ctx11 = document.getElementById("chart_factry2").getContext("2d");
window.myBar = new Chart(ctx11, {
    type: 'bar', // ここは bar にする必要があります
    data: barChartData_factry,
    options: complexChartOption
});


// A202
var ctx2 = document.getElementById("chart_A202");
var chart_A202 = new Chart(ctx2, {
    type: 'line', // チャートのタイプ
    data: { // チャートの内容
        labels: timeLabelArray,
        datasets: [{
            label: 'A202 電気料金（円）',
            lineTension: 0, // ベジェ曲線を無効化
            data: trend_A202_yen_chart,
            backgroundColor: 'RGBA(56,134,70, 0.4)',
            borderColor: 'RGBA(56,134,70, 1)',
            borderWidth: 1,
            pointRadius: 1,
        }]
    },
    options: { // チャートのその他オプション
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});


var barChartData_A202 = {
    labels: timeLabelArray_bar,
    datasets: [
    {
        label: '先週: ' + trend_yen_chart_bar_date_lastweek.slice(0, -1) + 'の電気料金 (円)',
        data: trend_A202_yen_chart_bar_lastweek.slice(0, -1),
        borderColor : "rgba(254,97,132,0.8)",
        backgroundColor : "rgba(254,97,132,0.5)",
    },
    {
        label: '今日: ' + trend_yen_chart_bar_date_today.slice(0, -1) + 'の電気料金 (円)',
        data: trend_A202_yen_chart_bar_today.slice(0, -1),
        borderColor : "rgba(54,164,235,0.8)",
        backgroundColor : "rgba(54,164,235,0.5)",
    },
    ]
};
var complexChartOption = {
    responsive: true,
};
var ctx11 = document.getElementById("chart_A2022").getContext("2d");
window.myBar = new Chart(ctx11, {
    type: 'bar', // ここは bar にする必要があります
    data: barChartData_A202,
    // options: complexChartOption,
    options: {
        complexChartOption,
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMax: 15,
                    // min: 0,
                    // stepSize: 10
                }
            }]
        }
    }
});



// A203
var ctx3 = document.getElementById("chart_A203");
var chart_A203 = new Chart(ctx3, {
    type: 'line', // チャートのタイプ
    data: { // チャートの内容
        labels: timeLabelArray,
        datasets: [{
            label: 'A203 電気料金（円）',
            lineTension: 0, // ベジェ曲線を無効化
            data: trend_A203_yen_chart,
            backgroundColor: 'RGBA(56,134,70, 0.4)',
            borderColor: 'RGBA(56,134,70, 1)',
            borderWidth: 1,
            pointRadius: 1,
        }]
    },
    options: { // チャートのその他オプション
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var barChartData_A203 = {
    labels: timeLabelArray_bar,
    datasets: [
    {
        label: '先週: ' + trend_yen_chart_bar_date_lastweek.slice(0, -1) + 'の電気料金 (円)',
        data: trend_A203_yen_chart_bar_lastweek.slice(0, -1),
        borderColor : "rgba(254,97,132,0.8)",
        backgroundColor : "rgba(254,97,132,0.5)",
    },
    {
        label: '今日: ' + trend_yen_chart_bar_date_today.slice(0, -1) + 'の電気料金 (円)',
        data: trend_A203_yen_chart_bar_today.slice(0, -1),
        borderColor : "rgba(54,164,235,0.8)",
        backgroundColor : "rgba(54,164,235,0.5)",
    },
    ]
};
var complexChartOption = {
    responsive: true,
};
var ctx11 = document.getElementById("chart_A2032").getContext("2d");
window.myBar = new Chart(ctx11, {
    type: 'bar', // ここは bar にする必要があります
    data: barChartData_A203,
    options: complexChartOption,
});




// swiper
var mySwiper = new Swiper ('.swiper-container-h', {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides : true,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    breakpoints: {
      767: {
        slidesPerView: 1,
        spaceBetween: 0
      }
    },
    effect: 'coverflow',
    preventClicks: false, 
    preventClicksPropagation: false, 
    preventLinks: false,
  })

  var swiper = new Swiper('.swiper-container-target', {
    scrollbar: '.swiper-scrollbar-target',
    // direction: 'vertical',
    slidesPerView: 'auto',
    mousewheelControl: true,
    freeMode: true,
    nested: true
});
