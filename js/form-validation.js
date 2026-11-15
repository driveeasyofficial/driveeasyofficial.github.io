// Shared validator: marks empty required fields in red, returns true if all filled.
function validateFields(ids){
  var ok=true;
  ids.forEach(function(id){
    var el=document.getElementById(id);
    var bad=!el.value.trim();
    el.style.borderColor=bad?"var(--accent)":"";
    if(bad)ok=false;
  });
  return ok;
}
