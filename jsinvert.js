
function doSomething() {
    var ctx=document.getElementById("testcanvas").getContext("2d");
    
    var img=document.getElementById("myimage");
    var x=0,y=0,width=img.width,height=img.height;
    ctx.drawImage(img,x,y,width,height);
    
    var imgd = ctx.getImageData(x,y,width,height); 
    var pix = imgd.data;  
    
    for (var i = 0, n = pix.length; i < n; i += 4) {
	pix[i  ] = 255 - pix[i  ]; // red
	pix[i+1] = 255 - pix[i+1]; // green
	pix[i+2] = 255 - pix[i+2]; // blue
	// i+3 is alpha (the fourth element) 
    }  
    
    ctx.putImageData(imgd, x, y); 
}	

function test_script()
{
   confirm("this works!"); 
    console.log("this is working!");
}