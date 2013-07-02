
// Copywrite © Clayton Ward 2013
// this program is under the "MIT license"
// please see the file "license" in the source
// distribution of this software for license terms
function dosomething(canvas_pass,picture_pass)
{
    var ctx=document.getElementById("testcanvas").getContext("2d");
    
    var img=document.getElementById("rainbow_rose");
    var x=0,y=0,width=img.width,height=img.height;
    ctx.drawImage(img,x,y,width,height);
    
    var imgd = ctx.getImageData(x,y,width,height); 
    var pix = imgd.data;  
    
    for (var i = 0, n = pix.length; i < n; i += 4) {
	pix[i  ] = 255 - pix[i  ]; // red
	pix[i+1] = 255 - pix[i+1]; // green
	pix[i+2] = 255 - pix[i+2]; // blue
	
    }  
    
    ctx.putImageData(imgd, x, y); 
}	

function test_script()
{
    confirm("this works!"); 
    console.log("this is working!");
}

function input_box()
{
    var text=document.getElementById("myinput").value;
    confirm(text);
}
