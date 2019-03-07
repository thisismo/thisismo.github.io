var tabs = document.getElementsByClassName("tab");
var current = tabs[0];
var spanTotal = document.getElementById("spanTotal"),
    spanLeft = document.getElementById("spanLeft");
var pushUpsLeft = 10; //Temporary Value xD
var pushUps = [];

var timeoutFinished = null;
var finished = false;

window.onresize = function() {
    document.body.height = window.innerHeight;
}
window.onresize(); // called to initially set the height.

function reset(){
  switchView(0);
  pushUps = [];
  timeoutFinished = null;
  finished = false;
  getPushupGoal();
  document.getElementById("descLeft").innerHTML = "Push ups left to beat:";
  document.getElementById("descLeft").style.display = "block";
  spanLeft.style.display = "block";
  spanTotal.innerHTML = pushUps.length;
}

function preventZoom(e) {
  var t2 = e.timeStamp;
  var t1 = e.currentTarget.dataset.lastTouch || t2;
  var dt = t2 - t1;
  var fingers = e.touches.length;
  e.currentTarget.dataset.lastTouch = t2;

  if (!dt || dt > 500 || fingers > 1) return; // not double-tap

  e.preventDefault();
  e.target.click();
}

reset();

function getPushupGoal(){
  if(!localStorage.getItem("stats")){
    pushUpsLeft = 10;
  }else{
    var statsBefore = JSON.parse(localStorage.getItem("stats"));
    pushUpsLeft = statsBefore[statsBefore.length - 1].pushups;
  }
  spanLeft.innerHTML = pushUpsLeft;
}

if(!is_touch_device()){
  switchView(4);
}

//Generate UUID for saving Stats
if(!localStorage.getItem('uuid')) {
  localStorage.setItem('uuid', 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }));
}

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

document.addEventListener("touchstart", preventZoom);

tabs[1].addEventListener("touchstart", function(){
  if(finished) return;

  pushUps.push(new Date().getTime());
  spanTotal.innerHTML = pushUps.length;

  window.clearTimeout(timeoutFinished);
  timeoutFinished = setTimeout(function(){
    finished = true;
    document.getElementById("delta").innerHTML = (pushUps.length - pushUpsLeft);
    switchView(2);
  }, 4000);

  if(pushUps.length < pushUpsLeft){
    spanLeft.innerHTML = pushUpsLeft - pushUps.length;
  }else{
    document.getElementById("descLeft").innerHTML = "You beat your old Record. Keep on going!";
    spanLeft.style.display = "none";
    setTimeout(function(){
      document.getElementById("descLeft").style.display = "none";
    }, 2000);
  }
});

document.getElementById("submit").addEventListener("click", function(){
  if(!localStorage.getItem("stats")){
    localStorage.setItem("stats", JSON.stringify([{date: new Date().getTime(), pushups: pushUps.length, timestamps: pushUps}]));
  }else{
    var statsBefore = JSON.parse(localStorage.getItem("stats"));
    statsBefore.push({date: new Date().getTime(), pushups: pushUps.length, timestamps: pushUps});
    localStorage.setItem("stats", JSON.stringify(statsBefore));
  }
  reset();
})

function updateStats(){
  var stats = JSON.parse(localStorage.getItem("stats"));
  var totalSessions = stats.length;
  var totalPushups = 0;
  var averageImprovement = 0;
  for(var i = 0; i < stats.length; i++){
    totalPushups += stats[i].pushups;
    if(i == 0) continue;
    averageImprovement += stats[i].pushups - stats[i - 1].pushups;
  }
  console.log("1: " + averageImprovement);
  averageImprovement /= (totalSessions - 1);
  console.log("2: " + averageImprovement);
  document.getElementById("totalSessions").innerHTML = totalSessions;
  document.getElementById("totalPushups").innerHTML = totalPushups;
  document.getElementById("avgImprovement").innerHTML = averageImprovement.toFixed(2);
  switchView(3);
}

//Switching Views
function switchView(n){
  current.style.display = "none";
  current = tabs[n];
  current.style.display = "block";
}

function is_touch_device() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

function resetStats(){
  var c = confirm("Are you sure you want to reset your statistics?");
  if(!c) return;
  if(!localStorage.getItem("oldStats") && localStorage.getItem("stats")){
    localStorage.setItem("oldStats", JSON.stringify([JSON.parse(localStorage.getItem("stats"))]));
  }else{
    var oldStats = JSON.parse(localStorage.getItem("oldStats"));
    oldStats.push(JSON.parse(localStorage.getItem("stats")));
    localStorage.setItem("oldStats", JSON.stringify(oldStats));
  }
  localStorage.removeItem("stats");
  reset();
}
