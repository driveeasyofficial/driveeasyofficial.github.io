// Mobile menu toggle
(function(){
  var btn=document.getElementById("menuBtn"),menu=document.getElementById("menu");
  if(!btn||!menu)return;
  btn.addEventListener("click",function(){menu.classList.toggle("open");});
})();
