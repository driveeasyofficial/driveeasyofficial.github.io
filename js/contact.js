(function(){
  var OWNER_EMAIL="ssachinsharma0108@gmail.com";
  var btn=document.getElementById("csubmit");
  if(!btn)return;
  btn.addEventListener("click",function(){
    if(!validateFields(["cname","cphone","cmsg"]))return;
    var error=document.getElementById("contactSendError");
    var done=document.getElementById("cdone");
    var fields={
      _subject:"Website enquiry - DriveEasy",
      Name:document.getElementById("cname").value.trim(),
      Mobile:document.getElementById("cphone").value.trim(),
      Message:document.getElementById("cmsg").value.trim()
    };
    btn.disabled=true;
    btn.textContent="Sending...";
    error.classList.add("hidden");
    done.classList.add("hidden");
    fetch("https://formsubmit.co/ajax/"+OWNER_EMAIL,{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify(fields)
    }).then(function(response){
      return response.json().then(function(data){
        if(!response.ok||(data.success!==true&&data.success!=="true"))throw new Error("Email service rejected the enquiry");
      });
    }).then(function(){
      done.classList.remove("hidden");
      btn.form.reset();
    }).catch(function(){
      error.textContent="Your request could not be sent. Please check your internet connection and try again.";
      error.classList.remove("hidden");
    }).then(function(){
      btn.disabled=false;
      btn.textContent="Send ✉️";
    });
  });
})();
