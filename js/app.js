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
  spanLeft.style.display = "block";
  spanTotal.innerHTML = pushUps.length;
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

tabs[1].addEventListener("click", function(){
  if(finished) return;

  pushUps.push(new Date().getTime());
  spanTotal.innerHTML = pushUps.length;

  window.clearTimeout(timeoutFinished);
  timeoutFinished = setTimeout(function(){
    finished = true;
    switchView(2);
  }, 3000);

  if(pushUps.length < pushUpsLeft){
    spanLeft.innerHTML = pushUpsLeft - pushUps.length;
  }else{
    document.getElementById("descLeft").innerHTML = "";
    spanLeft.innerHTML = "You beat your old Record. Keep on going!";
    setTimeout(function(){
      spanLeft.style.display = "none";
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
