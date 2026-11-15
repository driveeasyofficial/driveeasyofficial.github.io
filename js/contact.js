// Contact page form -> opens email app addressed to the school
(function(){
  var OWNER_EMAIL="ssachinsharma0801@gmail.com";
  var btn=document.getElementById("csubmit");
  if(!btn)return;
  function link(){
    var body="Name: "+document.getElementById("cname").value.trim()+"\nMobile: "+document.getElementById("cphone").value.trim()+"\n\n"+document.getElementById("cmsg").value.trim();
    return "mailto:"+OWNER_EMAIL+"?subject="+encodeURIComponent("Website enquiry – DriveEasy")+"&body="+encodeURIComponent(body);
  }
  btn.addEventListener("click",function(){
    if(!validateFields(["cname","cphone","cmsg"]))return;
    window.location.href=link();
    document.getElementById("cdone").classList.remove("hidden");
  });
})();
