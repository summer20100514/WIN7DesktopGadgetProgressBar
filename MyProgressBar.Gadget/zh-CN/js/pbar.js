////////////////////////////////////////////////////////////////////////////////
//
// THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
// Copyright (c) 2009 Microsoft Corporation. All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
var REFRESH_INTERVAL = 500;
var newTimeOut = 0,
    workTimeStart = 0,
    workTimeEnd = 0,
    timeTotal = 0,
    setTimeStart = 0,
    setTimeEnd = 0,
    setTimeTotal = 0,
    has_started = false;

////////////////////////////////////////////////////////////////////////////////
//
// GADGET FUNCTIONS
//
////////////////////////////////////////////////////////////////////////////////
function getHourMin(timestamp) {
    var h = new Date(timestamp).getHours();
    var m = new Date(timestamp).getMinutes();

    h = (h<10) ? '0' + h : h;
    m = (m<10) ? '0' + m : m;

    return h + ':' + m;
}

function getHourMin2(millSecond) {
    var h = parseInt(millSecond/1000/3600);
    var m = parseInt(((millSecond/1000)%3600)/60);
    
    h = (h<10) ? '0' + h : h;
    m = (m<10) ? '0' + m : m;

    return h + ':' + m;
}


function loadMain()
{
    System.Gadget.visibilityChanged = checkVisibility;
    workTimeStart = new Date();
    workTimeEnd = new Date(workTimeStart.getTime());
    workTimeStart = workTimeStart.setHours(10, 0, 0, 0);
    workTimeEnd = workTimeEnd.setHours(19, 00, 0, 0);
    timeTotal = workTimeEnd - workTimeStart;
    //console.log("timeTotal %d", timeTotal);
    //console.log("workTimeStart %d", workTimeStart);
    //console.log("workTimeEnd %d", workTimeEnd);
    setTimeStart = 0;
    setTimeEnd = 0;
    setTimeTotal = 0;
    $('#set_time').hide();
    $('#set_time_units').text("");
    $('#pbar_innerdiv2').css("width", 0 + "%");
    $('#pbar_innertext2').css("left", "39.5%").text("0:0:0 (0.0%)");
    $('#bottom_text2').text(getHourMin2(setTimeTotal));
    clearTimeout(newTimeOut);
    animateUpdate();
}

function setPressed()
{
    //console.log("setPressed");
    if (!has_started) {
        $('#bottom_text2').text("");
        $('#set_time_units').text("mins");
        $('#set_time').val(0);
        $('#set_time').show();
    }
}

function startStopPressed()
{
    var setMins = 0;
    //console.log("startStopPressed");
    if (!has_started) {
        setMins = $('#set_time').val();
        if (!isNaN(setMins) && setMins > 0) {
            setTimeStart = new Date();
            setTimeEnd = setTimeStart.getTime() + setMins*60*1000;
            setTimeTotal = setTimeEnd - setTimeStart;
            $('#set_time').hide();
            $('#set_time_units').text("");
            $('#button_set').prop('disabled', true);
            has_started = true;
            animateUpdate(); // refresh once
        }
    } else {
        $('#button_set').prop('disabled', false);
        has_started = false;
    }
}
////////////////////////////////////////////////////////////////////////////////
//
// start gadget animation
//
////////////////////////////////////////////////////////////////////////////////
function updateProgress(millSeconds, millSeconds2) {
    if (millSeconds < 0) {
        millSeconds = 0;
    }
    var x = (millSeconds/timeTotal)*100,
        y = x.toFixed(1);
    var totalSec= (millSeconds / 1000);
    var min = parseInt(totalSec/60);
    var sec = parseInt(totalSec%60);
    var hr= parseInt(min/60);
    min = parseInt(min % 60);
    if (x <= 100.0) {
        $('#pbar_innerdiv').css("width", x + "%");
        //$('#pbar_innertext').css("left", x + "%").text(hr+":"+min+":"+sec + "");
        $('#pbar_innertext').css("left", "39.5%").text(hr+":"+min+":"+sec+" "+"("+y+"%)");
    } else {
        $('#pbar_innerdiv').css("width", 100 + "%");
        //$('#pbar_innertext').css("left", x + "%").text(hr+":"+min+":"+sec + "");
        $('#pbar_innertext').css("left", "39.5%").text(hr+":"+min+":"+sec+" "+"(+"+(y-100.0).toFixed(1)+"%)");
    }
    $('#bottom_text').text(getHourMin(workTimeStart)+"-"+getHourMin(workTimeEnd));

    if (has_started)
    {
        if (millSeconds2 < 0) {
            millSeconds2 = 0;
        }
        var x = (millSeconds2/setTimeTotal)*100,
            y = x.toFixed(1);
        var totalSec= (millSeconds2 / 1000);
        var min = parseInt(totalSec/60);
        var sec = parseInt(totalSec%60);
        var hr= parseInt(min/60);
        min = parseInt(min % 60);
        if (x <= 100.0) {
            $('#pbar_innerdiv2').css("width", x + "%");
            $('#pbar_innertext2').css("left", "39.5%").text(hr+":"+min+":"+sec+" "+"("+y+"%)");
        } else {
            $('#pbar_innerdiv2').css("width", 100 + "%");
            $('#pbar_innertext2').css("left", "39.5%").text(hr+":"+min+":"+sec+" "+"(+"+(y-100.0).toFixed(1)+"%)");
        }
        $('#bottom_text2').text(getHourMin2(setTimeTotal));
    }
}

function animateUpdate() {
    var millSecond = new Date().getTime() - workTimeStart;
    var millSecond2 = new Date().getTime() - setTimeStart;
    ////console.log("perc %d", perc);
    //if(perc < timeTotal) {
    //    updateProgress(perc);
    //    newTimeOut = setTimeout(animateUpdate, REFRESH_INTERVAL);
    //} else {
    //    updateProgress(timeTotal);
    //}
   updateProgress(millSecond, millSecond2);
   newTimeOut = setTimeout(animateUpdate, REFRESH_INTERVAL);
}

function checkVisibility()
{
    isVisible = System.Gadget.visible;
    clearTimeout(newTimeOut);
    
    if (isVisible)
    {
        newTimeOut = setTimeout(animateUpdate, REFRESH_INTERVAL);
    }
}

