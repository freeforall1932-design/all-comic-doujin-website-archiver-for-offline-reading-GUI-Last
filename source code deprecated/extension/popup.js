'use strict';
var cn = 'hitomi-downloader-script';

function execCode(func, callback=null){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: func
    }, callback);
  })
}

var done = false;
function callback(r){
  var data = r[0].result;
  if (!data.url) return;
  if (done){
    //console.log('already done');
    return;
  }
  done = true;
  document.getElementsByClassName('no-video')[0].style.display = 'none';
  addButton(data);
  clearInterval(t);
}
function timeout(){
  function foo(){
    var s = document.getElementsByClassName(cn)[0];
    return s ? {version: "0.4",url:s.getAttribute("url"),data:s.getAttribute("data")} : {url:null};
  }
  execCode(foo, callback);
}
var t = setInterval(timeout, 1000);
timeout();

function addButton(data){
  var view = document.getElementsByClassName('view')[0];

  var button = document.createElement('button');
  button.id = "download";
  button.style = "cursor:pointer"
  var img = document.createElement('img');
  img.src = "images/down.png"
  img.width = 32
  img.height = 32
  button.appendChild(img);
  view.appendChild(button);

  button.onclick = function(element) {
      var s = 'data:hitomi_downloader_task;' + JSON.stringify(data);
      send(s);
    };
}

function send(str){
  var socket = new WebSocket('ws://127.0.0.1:6974');
  socket.onopen = function(e) {
    socket.send(str);
  }
  socket.onmessage = function(msg) {
    //console.log(msg);
  }
  socket.onclose = function(e){
    if (e.code != 3001){
      //copy(str);
      function foo(){
        alert("Hitomi downloader is not running.");
      }
      execCode(foo);
    }
  }
}

function copy(str) {
  const el = document.createElement('textarea');  // Create a <textarea> element
  el.value = str;                                 // Set its value to the string that you want copied
  el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
  el.style.position = 'absolute';
  el.style.left = '-9999px';                      // Move outside the screen to make it invisible
  document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0        // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0)     // Store selection if found
      : false;                                    // Mark as false to know no selection existed before
  el.select();                                    // Select the <textarea> content
  document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el);                  // Remove the <textarea> element
  if (selected) {                                 // If a selection existed before copying
    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
    document.getSelection().addRange(selected);   // Restore the original selection
  }
};


var button = document.getElementsByClassName('cookie')[0];
button.onclick = function(element) {
  chrome.cookies.getAll({},
      function(cookies) {
        var s = 'data:hitomi_downloader_cookies;' + JSON.stringify(cookies);
        send(s);
    });
  };
