
var timeout         = 50;
var closetimer		= 0;
var ddmenuitem      = 0;

// open hidden layer
function mopen(id,clas) {
    
	// cancel close timer
	mcancelclosetime();
	// close old layer
	if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';
	// get new layer and show it
	ddmenuitem = document.getElementById(id);
	//ddmenuitem.slideDown("slow");
	ddmenuitem.style.visibility = 'visible';
	$("."+clas).addClass("on");

}
// close showed layer
function mclose() {

    if (ddmenuitem) ddmenuitem.style.visibility = 'hidden';
  
}

// go close timer
function mclosetime(clas) {
    $("." + clas).removeClass("on");
	closetimer = window.setTimeout(mclose, timeout);
}

// cancel close timer
function mcancelclosetime(clas) {
    $("." + clas).addClass("on");
	if(closetimer) {
	   
		window.clearTimeout(closetimer);
		closetimer = null;
	}

}

// close layer when click-out
document.onclick = mclose; 

