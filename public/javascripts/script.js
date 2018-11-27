
let compare = {};
let logData = {};
let weekBar = {};

//タイマーをセット
function tm() {
    // tm = setInterval("location.reload()",1000*10);
    onoff();
    fetchCompare();
    fetchLog();
    fetchWeekBar();
    displayChart();
}
function isClassTime() {
    let now = new Date();
    console.log('now.getDay', now.getDay());
    let dayOfWeek = now.getDay();  // youbi 0=nichi 1=getu 2=ka 3=sui 4=moku 5=kin 6=do
    let hour = now.getHours() ;	// 時
    let minute = now.getMinutes() ;	// 分

    let tmpObj = {
        A202: false,
        A203: false,
        factry: false
    };
    // 2=ka
    if(dayOfWeek === 2) {
        if ( hour==9 && (hour==10 && minute<=30) ){
            tmpObj.A202 = true;
            // tmpObj.A203 = true;
        } else if ( (hour==10  && minute>=40) || hour==11 || (hour==12 && minute<=10) ) {
            tmpObj.A202 = true;
            // tmpObj.A203 = true;
        } else if ( hour=13 || (hour==14 && minute<=30) ) {

        } else if ( (hour==14  && minute>=40) || hour==15 || (hour==16 && minute<=10) ) {

        }
    // 3=sui
    } else if(dayOfWeek === 3) {
        if ( hour==9 && (hour==10 && minute<=30) ){
            // tmpObj.A203 = true;
        } else if ( (hour==10  && minute>=40) || hour==11 || (hour==12 && minute<=10) ) {  
            tmpObj.A203 = true;
        } else if ( hour=13 || (hour==14 && minute<=30) ) {
            tmpObj.A202 = true;
            // tmpObj.A203 = true;
        } else if ( (hour==14  && minute>=40) || hour==15 || (hour==16 && minute<=10) ) {
            // tmpObj.A203 = true;
        }  
    // 4=moku 
    } else if(dayOfWeek === 3) {
        if ( hour==9 && (hour==10 && minute<=30) ){

        } else if ( (hour==10  && minute>=40) || hour==11 || (hour==12 && minute<=10) ) {  

        } else if ( hour=13 || (hour==14 && minute<=30) ) {
            tmpObj.A202 = true;
        } else if ( (hour==14  && minute>=40) || hour==15 || (hour==16 && minute<=10) ) {
            tmpObj.A202 = true;
        }   
    }

    return tmpObj
}

async function fetchCompare() {
    $.ajax({
        url:`https://ncuvems.sda.nagoya-cu.ac.jp/permin/compare/`,
        type:'GET',
        async: false
    })
    // Ajaxリクエストが成功した時発動
    .done( (data) => {
        // $('#alert_area').html(data);
        compare = data;
        console.log('cokmpare2', compare);
    })
    // Ajaxリクエストが失敗した時発動
    .fail( (data) => {
        console.log('error', data);
    })
    // Ajaxリクエストが成功・失敗どちらでも発動
    .always( (data) => {
        
    });
}

async function fetchLog() {
    $.ajax({
        url:`https://ncuvems.sda.nagoya-cu.ac.jp/permin/log/`,
        type:'GET',
        async: false
    })
    // Ajaxリクエストが成功した時発動
    .done( (data) => {
        // $('#alert_area').html(data);
        logData = data;
        console.log('logData', logData);
    })
    // Ajaxリクエストが失敗した時発動
    .fail( (data) => {
        console.log('error', data);
    })
    // Ajaxリクエストが成功・失敗どちらでも発動
    .always( (data) => {
        
    });
}
async function fetchWeekBar() {
    $.ajax({
        url:`https://ncuvems.sda.nagoya-cu.ac.jp/permin/weekBar/`,
        type:'GET',
        async: false
    })
    // Ajaxリクエストが成功した時発動
    .done( (data) => {
        // $('#alert_area').html(data);
        weekBar = data;
        console.log('weekBar', weekBar);
    })
    // Ajaxリクエストが失敗した時発動
    .fail( (data) => {
        console.log('error', data);
    })
    // Ajaxリクエストが成功・失敗どちらでも発動
    .always( (data) => {
        
    });
}
function onoff() {

    var aiArray = [0, 0, 20, 0, 1, 100, 20, 0, 0, 0, 230, 0, 0, 0, 10];
    for (var i = 0; i < 15; i++) {
        aiArray[i] = Number(ai_per[i]);
    }
    let A202_ai = 0;
    let A203_ai = 0;
    let factory_ai = 0;

    for (var i = 0; i < aiArray.length; i++) {
        
        if (aiArray[i] > 0) {
            $(".room div.CH" + (i + 1) + "").addClass("on");
            if(i < 2 && !isClassTime().A202){
                $(".room div.CH1").addClass("alert");
                $(".room div.CH2").addClass("alert");
                A202_ai += aiArray[i];
            }
            if(i === 2 && !isClassTime().A203){
                // $(".room div.CH3").addClass("alert");s
                A203_ai += aiArray[i];
            }

            if(i > 2 && !isClassTime().factry){
                // $(".room div.CH4").addClass("alert");
                // $(".room div.CH5").addClass("alert");
                // $(".room div.CH6").addClass("alert");
                // $(".room div.CH7").addClass("alert");
                // $(".room div.CH8").addClass("alert");
                // $(".room div.CH9").addClass("alert");
                // $(".room div.CH10").addClass("alert");
                // $(".room div.CH11").addClass("alert");
                // $(".room div.CH12").addClass("alert");
                // $(".room div.CH13").addClass("alert");
                // $(".room div.CH14").addClass("alert");
                // $(".room div.CH15").addClass("alert");
                factory_ai += aiArray[i];
            }
        } else {
            $(".room div.CH" + (i + 1) + "").removeClass("on");
            $(".room div.CH" + (i + 1) + "").removeClass("alert");
  
        }
    }
    // if(A202_ai+A203_ai+factory_ai>0){  
    if(A202_ai>0){  
        $("#alert_area").removeClass("display_none");
        if(A202_ai>0){    
            $("#alert_area_text_A202").removeClass("display_none"); 
        } else {
            $("#alert_area_text_A202").addClass("display_none");
        }
        if(A203_ai>0){
            // $("#alert_area_text_A203").removeClass("display_none");
        } else {
            $("#alert_area_text_A203").addClass("display_none");
        }
        if(factory_ai>0){
            // $("#alert_area_text_工場").removeClass("display_none");
        } else {
            $("#alert_area_text_A203").addClass("display_none");
        }
    }else{
        $("#alert_area").addClass("display_none");
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


function displayChart(){

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["先週", "今週"],
            datasets: [{
                    label: '月曜日',
                    data: [weekBar.lastWeekArray[0], weekBar.thisWeekArray[0]],
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
                    data: [weekBar.lastWeekArray[1], weekBar.thisWeekArray[1]],
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
                    data: [weekBar.lastWeekArray[2], weekBar.thisWeekArray[2]],
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
                    data: [weekBar.lastWeekArray[3], weekBar.thisWeekArray[3]],
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
                    data: [weekBar.lastWeekArray[4], weekBar.thisWeekArray[4]],
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
                    data: [weekBar.lastWeekArray[5], weekBar.thisWeekArray[5]],
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
                    data: [weekBar.lastWeekArray[6], weekBar.thisWeekArray[6]],
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


    // 工場
    var ctx1 = document.getElementById("chart_factry");
    var chart_factry = new Chart(ctx1, {
        type: 'line', // チャートのタイプ
        data: { // チャートの内容
            labels: logData.time,           datasets: [{
                label: '工場 電気料金（円）',
                // lineTension: 0, // ベジェ曲線を無効化
                data: logData.factory,
                backgroundColor: 'RGBA(56,134,70, 0.4)',
                borderColor: 'RGBA(56,134,70, 1)',
                borderWidth: 1,
                pointRadius: 0,
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
        labels: compare.lastWeekday.time,
        datasets: [
        {
            label: '先週: ' + compare.lastWeekday.mon+'/'+compare.lastWeekday.day + 'の電気料金 (円)',
            data: compare.lastWeekday.factory,
            borderColor : "rgba(254,97,132,0.8)",
            backgroundColor : "rgba(254,97,132,0.5)",
            borderWidth: 1,
            pointRadius: 0,
            // lineTension: 0, // ベジェ曲線を無効化
        },
        {
            label: '今日: ' + compare.today.mon+'/'+compare.today.day + 'の電気料金 (円)',
            data: compare.today.factory,
            borderColor : "rgba(54,164,235,0.8)",
            backgroundColor : "rgba(54,164,235,0.5)",
            borderWidth: 1,
            pointRadius: 0,
            // lineTension: 0, // ベジェ曲線を無効化
        },
        ]
    };
    var complexChartOption = {
        responsive: true,
    };
    var ctx11 = document.getElementById("chart_factry2").getContext("2d");
    window.myBar = new Chart(ctx11, {
        type: 'line', // ここは bar にする必要があります
        data: barChartData_factry,
        options: complexChartOption
    });


    // A202
    var ctx2 = document.getElementById("chart_A202");
    var chart_A202 = new Chart(ctx2, {
        type: 'line', // チャートのタイプ
        data: { // チャートの内容
            labels: logData.time,
            datasets: [{
                label: 'A202 電気料金（円）',
                // lineTension: 0, // ベジェ曲線を無効化
                data: logData.A202,
                backgroundColor: 'RGBA(56,134,70, 0.4)',
                borderColor: 'RGBA(56,134,70, 1)',
                borderWidth: 1,
                pointRadius: 0,
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
        labels: compare.lastWeekday.time,
        datasets: [
        {
            label: '先週: ' + compare.lastWeekday.mon+'/'+compare.lastWeekday.day + 'の電気料金 (円)',
            data: compare.lastWeekday.A202,
            borderColor : "rgba(254,97,132,0.8)",
            backgroundColor : "rgba(254,97,132,0.5)",
            borderWidth: 1,
            pointRadius: 0,
            // lineTension: 0, // ベジェ曲線を無効化
        },
        {
            label: '今日: ' + compare.today.mon+'/'+compare.today.day + 'の電気料金 (円)',
            data: compare.today.A202,
            borderColor : "rgba(54,164,235,0.8)",
            backgroundColor : "rgba(54,164,235,0.5)",
            borderWidth: 1,
            pointRadius: 0,
            // lineTension: 0, // ベジェ曲線を無効化
        },
        ]
    };
    var complexChartOption = {
        responsive: true,
    };
    var ctx11 = document.getElementById("chart_A2022").getContext("2d");
    window.myBar = new Chart(ctx11, {
        type: 'line', // ここは bar にする必要があります
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
            labels: logData.time,
            datasets: [{
                label: 'A203 電気料金（円）',
                // lineTension: 0, // ベジェ曲線を無効化
                data: logData.A203,
                backgroundColor: 'RGBA(56,134,70, 0.4)',
                borderColor: 'RGBA(56,134,70, 1)',
                borderWidth: 1,
                pointRadius: 0,
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
        labels: compare.lastWeekday.time,
        datasets: [
        {
            label: '先週: ' + compare.lastWeekday.mon+'/'+compare.lastWeekday.day + 'の電気料金 (円)',
            data: compare.lastWeekday.A203,
            borderColor : "rgba(254,97,132,0.8)",
            backgroundColor : "rgba(254,97,132,0.5)",
            borderWidth: 1,
            pointRadius: 0,
            // lineTension: 0, // ベジェ曲線を無効化
        },
        {
            label: '今日: ' + compare.today.mon+'/'+compare.today.day + 'の電気料金 (円)',
            data: compare.today.A203,
            borderColor : "rgba(54,164,235,0.8)",
            backgroundColor : "rgba(54,164,235,0.5)",
            borderWidth: 1,
            pointRadius: 0,
            // lineTension: 0, // ベジェ曲線を無効化
        },
        ]
    };
    var complexChartOption = {
        responsive: true,
    };
    var ctx11 = document.getElementById("chart_A2032").getContext("2d");
    window.myBar = new Chart(ctx11, {
        type: 'line', // ここは bar にする必要があります
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


}