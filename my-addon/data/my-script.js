// Copywrite © Clayton Ward 2013
// this program is under the "MIT license"
// please see the file "license" in the source
// distribution of this software for license terms
    self.on("click", function (node, data) {
      self.postMessage(node.src);
    var picframe = window.open("", "picframe1");
 //   var text = document.createTextNode("hi");
//    $(picframe.document.body).append("<p>hi</p>");

//  var newCanvas = 
//    $('<canvas/>',{'class':'radHuh','id' : 'canv'})
 //   .width(node.width)
 //   .height(node.height);
    
    var newCanvas = jQuery("<canvas/>", {
    'id' : "canv"
});
$(newCanvas).attr('height', node.naturalHeight).attr('width', node.naturalWidth);
//$(newCanvas).attr('height', node.height).attr('width', node.width);

    $(picframe.document.body).append(newCanvas);
    $(picframe.document.body).append("<br>");
    $(picframe.document.body).append(node);
//    $(picframe.document.body).append( '<p>' + node.src + '</p>');
 
function daltonize2(image_pass, deficiency, canvas_pass) {
    var protanope = [0.0, 2.02344, -2.52581,
    	     0.0, 1.0, 0.0,
		     0.0, 0.0, 1.0];
    var deuteranope = [1.0, 0.0, 0.0,
		       0.494207, 0.0, 1.24827,
		       0.0, 0.0, 1.0];
    var tritanope = [1.0, 0.0, 0.0,
		     0.0, 1.0, 0.0,
		     -0.395913, 0.801109, 0.0];
    var identity = [1.0, 0.0, 0.0,
		    0.0, 1.0, 0.0,
		    0.0, 0.0, 1.0];
    var ctx= picframe.document.getElementById(canvas_pass).getContext("2d");
 //   var img= picframe.document.getElementById(image_pass);
      var img = image_pass;
//    var img=node;
//    canvas = document.createElement("canvas"),
//    ctx = canvas.getContext("2d");
//    canvas.width = image.width;
//    canvas.height = image.height;
    var x=0,y=0,width=img.width,height=img.height;
    $(picframe.document.body).append( '<p> height ' + height +' width ' + width + '</p>');
    $(picframe.document.body).append( '<p> height ' + node.height +' width ' + node.width + '</p>');
    $(picframe.document.body).append( '<p> height ' + image_pass.height +' width ' + image_pass.width + '</p>');
    ctx.drawImage(img, 0, 0);
    try {
	var imageData = ctx.getImageData(x, y, canvas.width, canvas.height);
//	var imageData = ctx.getImageData(x,y,width,height);
   var data = imageData.data;	
   var length = data.length;
   console.log(lenght);
    if(typeof imageData.data === 'undefined'){
        $(picframe.document.body).append( '<p> shit shit shit </p>');
    }
    } catch(e) { 
         $(picframe.document.body).append("<p> duck </p>");
    }
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
//shit starts here
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
	for(var id = 0; id < length; id += 4) {

		var r = data[id],
			g = data[id + 1],
			b = data[id + 2];
 //       $(picframe.document.body).append("<p>" + r + " " + g + " " + b +"</p>");
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
 //       $(picframe.document.body).append("<p>" + R + " " + G + " " + B +"</p>");


    }
    // Record data
    if(id >= length)
    {
    ctx.putImageData(imageData, 0, 0); 
    $(picframe.document.body).append("<p> duck </p>");
    }
    
}

daltonize2(node, '1' , 'canv');

  //$(picframe.document.body).append( '<input id="daltonize" type="button" value="daltonize" onclick="daltonize2(\'test_img\', \'2\', \'test_canvas\');"/>');
  //$(picframe.document.body).append( '<input id="daltonize" type="button" value="daltonize" onclick="daltonize2();">');
 // $(picframe.document.body).append( '<input id="daltonize" type="button" value="daltonize">');


});
