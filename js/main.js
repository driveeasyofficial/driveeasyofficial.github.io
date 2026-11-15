var OWNER_EMAIL = "ssachinsharma0801@gmail.com";
var SCHOOL = "DriveEasy Driving School";
var CARS = [
  {n:"Wagon R", p7:4000, p15:4500},
  {n:"Baleno", p7:5000, p15:5500},
  {n:"Brezza", p7:6000, p15:6500},
  {n:"KIA", p7:6000, p15:6500}
];
var PLANS = [
  {id:"15", days:15, mins:30, label:"Relaxed", desc:"Short daily practice", total:"7.5 hours"},
  {id:"7", days:7, mins:60, label:"Fast Track", desc:"Learn quicker with longer lessons", total:"7 hours"}
];
var st = {step:1, car:null, plan:null};
var $ = function(id){return document.getElementById(id)};
var rs = function(n){return "₹" + n.toLocaleString("en-IN")};
var mapUrl = function(pickup,address,city){
  return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent([pickup,address,city].join(", "));
};
var names = ["Choose Car","Choose Course","Address","Done"];

function sendEnquiry(fields,buttonId,errorId,onSuccess,buttonText){
  var button=$(buttonId), error=$(errorId);
  button.disabled=true;
  button.textContent="Sending...";
  error.classList.add("hidden");
  fetch("https://formsubmit.co/ajax/"+OWNER_EMAIL,{
    method:"POST",
    headers:{"Content-Type":"application/json","Accept":"application/json"},
    body:JSON.stringify(fields)
  }).then(function(response){
    return response.json().then(function(data){
      if(!response.ok||(data.success!==true&&data.success!=="true"))throw new Error("Email service rejected the enquiry");
      return data;
    });
  }).then(function(){
    onSuccess();
  }).catch(function(){
    error.textContent="Your request could not be sent. Please check your internet connection and try again.";
    error.classList.remove("hidden");
    button.disabled=false;
    button.textContent=buttonText;
  });
}

function renderSteps(){
  $("steps").innerHTML = names.map(function(t,i){
    var c = (i+1===st.step)?"on":(i+1<st.step?"done":"");
    return '<span class="pill '+c+'">'+(i+1)+'. '+t+'</span>';
  }).join("");
}
function renderCars(){
  $("cars").innerHTML = CARS.map(function(c,i){
    return '<button type="button" class="card '+(st.car===i?"sel":"")+'" data-i="'+i+'">'+
      '<div class="car">🚗 '+c.n+'</div><div class="price">From '+rs(c.p7)+'</div>'+
      '<div class="sub">7-day course · pick 7 or 15 days next</div></button>';
  }).join("");
  Array.prototype.forEach.call($("cars").children,function(b){
    b.onclick=function(){st.car=+b.dataset.i;st.plan=null;renderCars();update();};
  });
}
function renderPlans(){
  if(st.car===null)return;
  var c = CARS[st.car];
  $("plans").innerHTML = PLANS.map(function(p,i){
    var price = p.days===15?c.p15:c.p7;
    return '<button type="button" class="card plan '+(st.plan===i?"sel":"")+'" data-i="'+i+'">'+
      '<span class="tag">'+p.label+'</span>'+
      '<h3>'+p.days+' Days · '+p.mins+(p.mins===60?" Hour":" Min")+' / day</h3>'+
      '<div class="sub">'+p.desc+'</div>'+
      '<div class="price">'+rs(price)+'</div>'+
      '<ul><li>Car<b>'+c.n+'</b></li>'+
      '<li>Duration<b>'+p.days+' days</b></li>'+
      '<li>Daily lesson<b>'+(p.mins===60?"1 hour":"30 minutes")+'</b></li>'+
      '<li>Total practice<b>'+p.total+'</b></li></ul></button>';
  }).join("");
  Array.prototype.forEach.call($("plans").children,function(b){
    b.onclick=function(){st.plan=+b.dataset.i;renderPlans();update();};
  });
  $("planNote").innerHTML = "<b>The difference:</b> 15 days is 30 minutes a day, spread out gently ("+rs(c.p15)+"). 7 days is 1 hour a day, so you finish in half the time ("+rs(c.p7)+").";
}
function summary(){
  var c = CARS[st.car], p = PLANS[st.plan];
  return {car:c.n, price:p.days===15?c.p15:c.p7, plan:p.days+" days, "+(p.mins===60?"1 hour":"30 min")+" per day"};
}
function renderSum(){
  var s = summary();
  $("sum").innerHTML = '<div><span>Car</span><b>'+s.car+'</b></div><div><span>Course</span><b>'+s.plan+'</b></div><div><span>Total</span><b>'+rs(s.price)+'</b></div>';
}
function update(){
  ["s1","s2","s3","s4"].forEach(function(id,i){$(id).classList.toggle("hidden",i+1!==st.step)});
  $("nav").classList.toggle("hidden",st.step===4);
  $("back").style.visibility = st.step===1?"hidden":"visible";
  $("next").textContent = st.step===3?"Submit booking ✉️":"Continue →";
  $("next").disabled = (st.step===1&&st.car===null)||(st.step===2&&st.plan===null);
  if(st.step===2)renderPlans();
  if(st.step===3)renderSum();
  renderSteps();
}
function bookingDetails(){
  var s = summary();
  var pickup=$("pickup").value.trim(), address=$("addr").value.trim(), city=$("city").value.trim();
  return {
    _subject:"Driving Lesson Booking - "+s.car+" ("+s.plan+")",
    Car:s.car,
    Course:s.plan,
    Fee:rs(s.price),
    Name:$("name").value.trim(),
    Mobile:$("phone").value.trim(),
    "Pickup spot / landmark":pickup,
    "Full address (Google Maps)":address,
    "City / Area":city,
    "Google Maps link":mapUrl(pickup,address,city),
    "Start date":$("date").value,
    "Time slot":$("slot").value.trim()||"Any",
    Payment:"In advance when the vehicle arrives."
  };
}
$("next").onclick=function(){
  if(st.step<3){st.step++;update();window.scrollTo(0,0);return;}
  if(!validateFields(["name","phone","pickup","addr","city","date"])){return;}
  sendEnquiry(bookingDetails(),"next","sendError",function(){
    st.step=4;update();window.scrollTo(0,0);
  },"Submit booking ✉️");
};
$("back").onclick=function(){if(st.step>1){st.step--;update();}};
$("restart").onclick=function(){st={step:1,car:null,plan:null};$("f").reset();renderCars();update();};
var LTYPES=["New Learner’s License","Permanent License","License Renewal","Duplicate / Address Change"];
var LVEH=["Two-wheeler","Car","Both"];
var lt=0,lv=1;
function renderL(){
  $("ltype").innerHTML=LTYPES.map(function(t,i){return '<button type="button" class="card '+(lt===i?"sel":"")+'" data-i="'+i+'">'+t+'</button>'}).join("");
  $("lveh").innerHTML=LVEH.map(function(t,i){return '<button type="button" class="card '+(lv===i?"sel":"")+'" data-i="'+i+'">'+t+'</button>'}).join("");
  Array.prototype.forEach.call($("ltype").children,function(b){b.onclick=function(){lt=+b.dataset.i;renderL();}});
  Array.prototype.forEach.call($("lveh").children,function(b){b.onclick=function(){lv=+b.dataset.i;renderL();}});
}
function lMail(){
  var pickup=$("lpickup").value.trim(), address=$("laddr").value.trim(), city=$("lcity").value.trim();
  return {
    _subject:"Driving License Request - "+LTYPES[lt],
    Service:LTYPES[lt],
    Vehicle:LVEH[lv],
    Name:$("lname").value.trim(),
    Mobile:$("lphone").value.trim(),
    "Pickup spot / landmark":pickup,
    "Full address (Google Maps)":address,
    "City / Area":city,
    "Google Maps link":mapUrl(pickup,address,city),
    Note:$("lnote").value.trim()||"-"
  };
}
function tab(lic){
  $("tabDrive").classList.toggle("on",!lic);$("tabLic").classList.toggle("on",lic);
  $("steps").classList.toggle("hidden",lic);document.querySelector("main").classList.toggle("hidden",lic);
  $("lic").classList.toggle("hidden",!lic);$("lok").classList.add("hidden");
  window.scrollTo(0,0);
}
$("tabDrive").onclick=function(){tab(false)};
$("tabLic").onclick=function(){tab(true)};
$("lsubmit").onclick=function(){
  if(!validateFields(["lname","lphone","lpickup","laddr","lcity"]))return;
  sendEnquiry(lMail(),"lsubmit","licenseSendError",function(){
    $("lic").classList.add("hidden");$("lok").classList.remove("hidden");window.scrollTo(0,0);
  },"Submit request ✉️");
};
$("lrestart").onclick=function(){$("lf").reset();$("lok").classList.add("hidden");$("lic").classList.remove("hidden");};
renderL();
renderCars();update();
if(location.hash==="#license"){tab(true);}
