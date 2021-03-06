// Copywrite © Clayton Ward 2013
// this program is under the "MIT license"
// please see the file "license" in the source
// distribution of this software for license terms


function daltonize2(image_pass, deficiency, canvas_pass) {
$.getImageData({
url:"http://www.google.com/images/srpr/logo4w.png",
success:function(image){
    var protanope = [0.0, 2.02344, -2.52581,
		     0.0, 1.0, 0.0,
		     0.0, 0.0, 1.0];
    var deuteranope = [1.0, 0.0, 0.0,
		       0.494207, 0.0, 1.24827,
		       0.0, 0.0, 1.0];
    var tritanope = [1.0, 0.0, 0.0,
		     0.0, 1.0, 0.0,
		     -0.395913, 0.801109, 0.0];
    var protanope_inv =  [0, 0, 0,
			  0.1763, 0.6432, 0.4454,
			  -0.2201, 0.4454, 0.4440];
    var deuteranope_inv = [0.8037, 0.3972, 0,
			   0, 0, 0,
			   0, 0, 1.0000];
    var tritanope_inv = [0.9128, 0.1763, -0.2201,
			 0.1763, 0.6432, 0.4454,
			 0, 0, 0];
    var identity = [1.0, 0.0, 0.0,
		    0.0, 1.0, 0.0,
		    0.0, 0.0, 1.0];
    var ctx=document.getElementById('canv').getContext("2d");
    var img=document.getElementById(image_pass);
//	var img = image_pass;
//    canvas = picframe.document.createElement("canvas");
//    ctx = canvas.getContext("2d");
//    canvas.width = img.naturalWidth;
//    canvas.height = img.naturalHeight;
    var x=0,y=0,width=img.width,height=img.height;
    ctx.drawImage(img, 0, 0);
//    try {
//	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
	var imageData = ctx.getImageData(x,y,width,height);
	data = imageData.data;		
//    } catch(e) { }
    // Apply Daltonization

    if(deficiency == 1)
    {
	var cvd = protanope;
    }
    else if(deficiency == 2)
    {
	var cvd = deuteranope;
    }
    else if(deficiency == 3)
    {
	var cvd = tritanope;
    }
    else if(deficiency == 4)
    {
	var cvd = identity;
    }
    else if(deficiency == 5)
    {
	var cvd = deuteranope_inv;
    }
    else if(deficiency == 6)
    {
	var cvd = tritanope_inv;
    }
//var cvd = CVDMatrix[type],
		var cvd_a = cvd[0],
		cvd_b = cvd[1],
		cvd_c = cvd[2],
		cvd_d = cvd[3],
		cvd_e = cvd[4],
		cvd_f = cvd[5],
		cvd_g = cvd[6],
		cvd_h = cvd[7],
		cvd_i = cvd[8];
	var L, M, S, l, m, s, R, G, B, RR, GG, BB;
	for(var id = 0, length = data.length; id < length; id += 4) {
		var r = data[id],
			g = data[id + 1],
			b = data[id + 2];
		// RGB to LMS matrix conversion
		L = (17.8824 * r) + (43.5161 * g) + (4.11935 * b);
		M = (3.45565 * r) + (27.1554 * g) + (3.86714 * b);
		S = (0.0299566 * r) + (0.184309 * g) + (1.46709 * b);
		// Simulate color blindness
		l = (cvd_a * L) + (cvd_b * M) + (cvd_c * S);
		m = (cvd_d * L) + (cvd_e * M) + (cvd_f * S);
		s = (cvd_g * L) + (cvd_h * M) + (cvd_i * S);
		// LMS to RGB matrix conversion
		R = (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s);
		G = (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s);
		B = (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s);
		// Isolate invisible colors to color vision deficiency (calculate error matrix)
		R = r - R;
		G = g - G;
		B = b - B;
		// Shift colors towards visible spectrum (apply error modifications)
		RR = (0.0 * R) + (0.0 * G) + (0.0 * B);
		GG = (0.7 * R) + (1.0 * G) + (0.0 * B);
		BB = (0.7 * R) + (0.0 * G) + (1.0 * B);
		// Add compensation to original values
		R = RR + r;
		G = GG + g;
		B = BB + b;
		// Clamp values
		if(R < 0) R = 0;
		if(R > 255) R = 255;
		if(G < 0) G = 0;
		if(G > 255) G = 255;
		if(B < 0) B = 0;
		if(B > 255) B = 255;
		// Record color
		data[id] = R;
		data[id + 1] = G;
		data[id + 2] = B;
	



    }
    // Record data
    ctx.putImageData(imageData, x, y); //x and y 
//    ctx.putImageData(imageData, 0, 0);
//    if(typeof options.callback == "function") {
//	options.callback(canvas);
//   }

},
error: function(xhr, text_status){
console.log("noooo");
}
});
}
function newnew(){
 var picele = document.getElementById("test_img");
 var canv = document.createElement('canvas');
	canv.height = picele.naturalHeight;
	canv.width = picele.naturalWidth;
	canv.id = 'canv'; 
//var picframe = window.open("", "picframe1");
$(document.body).append(canv);

//function  holydiver(){
//$(picframe.document.body).append(heavyImage);
//}
//     picframe.onload = holydiver();
//    var newCanvas = jQuery("<canvas/>", {
//    'id' : "canv"
//});
//$(picframe.document.body).append(newCanvas);
//$(picframe.document.body).append(picele);

//$(newCanvas).attr('height', picele.naturalHeight).attr('width', picele.naturalWidth);



//function preload(arrayOfImages) {
//    $(arrayOfImages).each(function(index){
//        $('<img />')
//        .attr('src', arrayOfImages[index])
//        .load(function(){
//            $('div').append( $(this) );
 //           // Your other custom code
 //       });
 //   });
//}



daltonize2('test_img', '1', 'canv');
}

function newnew2(){
$.getImageData({
  url: "http://farm4.static.flickr.com/3002/2758349058_ab6dc9cfdc_z.jpg?zz=1",
  success: function(image){
 
    // Set up the canvas
    var can = document.getElementsByTagName('canvas')[0];
    var ctx = can.getContext('2d');
 
    // Set the canvas width and heigh to the same as the image
    $(can).attr('width', image.width);
    $(can).attr('height', image.height);
 
    // Draw the image on to the canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);
 
    // Get the image data
    var image_data = ctx.getImageData(0, 0,  image.width, image.height);
    var image_data_array = image_data.data;
 
    // Invert every pixel
    for (var i = 0, j = image_data_array.length; i < j; i+=4) {
      image_data_array[i] = 255 - image_data_array[i];
      image_data_array[i+1] = 255 - image_data_array[i+1];
      image_data_array[i+2] = 255 - image_data_array[i+2];
    }
 
    // Write the image data to the canvas
    ctx.putImageData(image_data, 0, 0);
 
  },
  error: function(xhr, text_status){
	console.log("why am I hear");
    // Handle your error here
  }
});
}

