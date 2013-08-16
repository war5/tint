// Copywrite © Clayton Ward 2013
// this program is under the "MIT license"
// please see the file "license" in the source
// distribution of this software for license terms
/*
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
T1*RGB -> LMS
(0.31399 | 0.639513 | 0.0464975
0.155372 | 0.757894 | 0.0867014
0.0177524 | 0.109442 | 0.872569)
T2*LMS -> RGB
(5.47221 | -4.64196 | 0.169637
-1.12524 | 2.29317 | -0.167895
0.0298017 | -0.193181 | 1.16365)


*/
function rgb2xyz(RGB, xyz) {
    var rf, gf, bf;
    var r, g, b, X, Y, Z;
    var rgb = [];
    rgb[0] = RGB[0]/255; //R 0..1
    rgb[1] = RGB[0]/255; //G 0..1
    rgb[2] = RGB[0]/255; //B 0..1
    for(var i = 0; i < 3; ++i) {
	if (rgb[i] <= 0.04045){
	    rgb[i] = rgb[i]/12;
	}
	else{
	    rgb[i] = Math.pow((rgb[i]+0.055)/1.055,2.4);
	}
    }
    xyz[0] =  0.436052025 *rgb[0]   + 0.385081593 *rgb[1] + 0.143087414 *rgb[2];
    xyz[1] =  0.222491598 *rgb[0]   + 0.71688606 *rgb[1] +  0.060621486 *rgb[2];
    xyz[2] =  0.013929122 *rgb[0]   + 0.097097002 *rgb[1] + 0.71418547  *rgb[2];
    
    xyz[0] = (255*xyz[0] + .5);
    xyz[1] = (255*xyz[1] + .5); 
    xyz[2] = (255*xyz[2] + .5);    
} 
function xyz2rgb(XYZ, RGB) {
    var xyz = [];
    var rgb = [];
    xyz[0] = XYZ[0];
    xyz[1] = XYZ[1];
    xyz[2] = XYZ[2];
    xyz[0] = (xyz[0]-.5)/255;
    xyz[1] = (xyz[1]-.5)/255;
    xyz[2] = (xyz[2]-.5)/255;

    rgb[0] = 3.13405134 * xyz[0] + -1.61702771 * xyz[1] + -0.49065221 * xyz[2];
    rgb[1] = -0.97876273 * xyz[0] + 1.91614223 * xyz[1] + 0.03344963 * xyz[2];
    rgb[2] = 0.07194258 * xyz[0] + -0.22897118 * xyz[1] + 1.40521831 * xyz[2]
    for(var i = 0; i < 3; ++i) {
	if (rgb[i] < 0.04045){
	    RGB[i] = 12 * rgb[i];
	}
	else{
	    RGB[i] = (1.055 * Math.pow(rgb[i], (1/2.4)) - .055);
	}
    }
    RGB[0] = 255 * RGB[0];
    RGB[1] = 255 * RGB[1];
    RGB[2] = 255 * RGB[2];
}

//changed to having it use /255
function XYZ_sRGB(XYZ, sRGB) {
    var tRGB = [];
    var xyz = []; 
    var i;
    xyz[0] = XYZ[0]; //used so that I may preserve the original XYZ vector
    xyz[1] = XYZ[1];
    xyz[2] = XYZ[2];
//    xyz[0] = (xyz[0])/255;//changes the domain to 0...1
//    xyz[1] = (xyz[1])/255;
//    xyz[2] = (xyz[2])/255; 


   
    tRGB[0] = (3.2406 * xyz[0] - 1.5372 * xyz[1] - 0.4986 * xyz[2]) / 100.0;
    tRGB[1] = (-0.9689 * xyz[0] + 1.8758 * xyz[1] + 0.0415 * xyz[2]) / 100.0;
    tRGB[2] = (0.0557 * xyz[0] - 0.2040 * xyz[1] + 1.0570 * xyz[2]) / 100.0;
  
    for (i = 0; i < 3; ++i) {
        if (tRGB[i] < 0.0031308) {
            sRGB[i] = 12.92 * tRGB[i];
        }
        else {
            sRGB[i] = (1.055 * Math.pow(tRGB[i], (1.0 / 2.4)) - 0.055);
        }
    }
    sRGB[0] = 255 * sRGB[0];
    sRGB[1] = 255 * sRGB[1];
    sRGB[2] = 255 * sRGB[2];
}

function sRGB_XYZ(RGB, resultXYZ) {
    var linearRGB = [];
    var rgb = []; //used so that I dont modify the original RGB vector
    var i;
    rgb[0] = RGB[0] / 255;//changes domain t0 0...1
    rgb[1] = RGB[1] / 255;
    rgb[2] = RGB[2] / 255;
    
  /* compute linear luminance RGB */ 
    
    for (i = 0; i < 3; ++i) {	
        if (rgb[i] <= 0.04045) {
            linearRGB[i] = rgb[i] / 12.92;
        }
        else {
            linearRGB[i] = (rgb[i] + 0.055) / 1.055;
            if (linearRGB[i] < 0.0)
                linearRGB[i] = 0.0;
            linearRGB[i] = Math.pow(linearRGB[i], 2.4);
        }
    }
    resultXYZ[0] = 100.0 * (0.4124 * linearRGB[0] + 0.3576 * linearRGB[1] + 0.1805 * linearRGB[2]);
    resultXYZ[1] = 100.0 * (0.2126 * linearRGB[0] + 0.7152 * linearRGB[1] + 0.0722 * linearRGB[2]);
    resultXYZ[2] = 100.0 * (0.0193 * linearRGB[0] + 0.1192 * linearRGB[1] + 0.9505 * linearRGB[2]);
//    resultXYZ[0] =  (255 * resultXYZ[0]);//changes domain to 0...255
//    resultXYZ[1] =  (255 * resultXYZ[1]);
//    resultXYZ[2] =  (255 * resultXYZ[2]);
}
function getRGBrand()
{
    return Math.floor(Math.random()*255);
}

function check_equality()
{
/*    var pro = [0.0, 2.02344, -2.52581,
		     0.0, 1.0, 0.0,
		     0.0, 0.0, 1.0];*/
    var pro = [1.0, 0.0, 0.0,   // actually duet matrix
	       0.494207, 0.0, 1.24827,
	       0.0, 0.0, 1.0];

    var greatest = 0;
    var b_RGB = []; //before
    var a_RGB = []; //after
    var XYZ = [];   //transition XYZ
    var LMS = [];
    var tests = 1;
    for(var i = 0; i < 20; i++)
    {
	//seeds the RGB values with data in range
	for(var j = 0; j < 3; j++){
	    b_RGB[j] = getRGBrand();
	    //b_RGB[j] = 50;
	}
	console.log("original %f %f %f", b_RGB[0], b_RGB[1], b_RGB[2]);
	//convert to XYZ
	rgb2xyz(b_RGB, XYZ);
	console.log("xyz before LMS: %f %f %f", XYZ[0], XYZ[1], XYZ[2]);
	if(tests == 1)
	{
	//convert to LMS
	    LMS[0] = 0.38971 * XYZ[0] + 0.68898 * XYZ[1] + -0.07868 * XYZ[2];
            LMS[1] = -0.22981 * XYZ[0] + 1.18340 * XYZ[1] +  0.04641 * XYZ[2];
	    LMS[2] = 0.00000 * XYZ[0] + 0.00000 * XYZ[1] + 1.00000 * XYZ[2];
	    
	    
	    // Simulate color blindness
	    l = (pro[0] * LMS[0]) + (pro[1] * LMS[1]) + (pro[2] * LMS[2]);
	    m = (pro[3] * LMS[0]) + (pro[4] * LMS[1]) + (pro[5] * LMS[2]);
	    s = (pro[6] * LMS[0]) + (pro[7] * LMS[1]) + (pro[8] * LMS[2]);
	    LMS[0] = l;
	    LMS[1] = m;
	    LMS[2] = s;
	    XYZ[0] = 1.91019683 * LMS[0] + -1.11212389 * LMS[1] + 0.201907957 * LMS[2];
	    XYZ[1] = 0.370950088 * LMS[0] + 0.629054257 * LMS[1] +  -0.00000805514218 * LMS[2];
	    XYZ[2] = 0.00000000 * LMS[0] +  0.00000000 * LMS[2] + 1.00000000 * LMS[2];
	    
	}
	//covert back to RGB

//	console.log("before %f", a_RGB[0]);
	xyz2rgb(XYZ, a_RGB);
	console.log("xyz after LMS: %f %f %f", XYZ[0], XYZ[1], XYZ[2]);
	console.log("after %f %f %f", a_RGB[0], a_RGB[1], a_RGB[2]);
    }
}

function daltonize(image, deficiency, canvas_pass) {
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
    var ctx=document.getElementById("testcanvas").getContext("2d");
    var img=document.getElementById("test_img");
    var x=0,y=0,width=img.width,height=img.height;
    ctx.drawImage(img, 0, 0);
    try {
	var imageData = ctx.getImageData(x,y,width,height);
	var data = imageData.data;		
    } catch(e) { }
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

    var   cvd_a = cvd[0],
    cvd_b = cvd[1],
    cvd_c = cvd[2],
    cvd_d = cvd[3],
    cvd_e = cvd[4],
    cvd_f = cvd[5],
    cvd_g = cvd[6],
    cvd_h = cvd[7],
    cvd_i = cvd[8];
    var L, M, S, l, m, s, R, G, B, RR, GG, BB;
    var XYZ = [];
    var RGB = [];
    var LMS = [];
    var greatest;
    // CONTROLS TURNING ON OR OFF CONSOLE LOGS FOR TESTING
    var tests = 1;
    var test_count = 0;
    for(var id = 0, length = data.length; id < length; id += 4) {
	var r = data[id],
	g = data[id + 1],
	b = data[id + 2];
	
	// for getting console logs without overflow
	test_count++;
	if(tests == 1)
	{
	    if(test_count > 50)
	    {
		break;
	    }
	}
	RGB[0] = r,
	RGB[1] = g,
	RGB[2] = b;
	if(tests == 1)
	    console.log("orginal rgb %f %f %f",RGB[0],RGB[1],RGB[2]);
	// RGB to LMS matrix conversion
	//convert sRGB to XYZ
//	rgb2xyz(RGB, XYZ);
	sRGB_XYZ(RGB, XYZ);
	//convert to LMS
	if(tests == 1)
	    console.log("original xyz %f %f %f",XYZ[0],XYZ[1],XYZ[2]);


	LMS[0] = 0.38971 * XYZ[0] + 0.68898 * XYZ[1] + -0.07868 * XYZ[2];
        LMS[1] = -0.22981 * XYZ[0] + 1.18340 * XYZ[1] +  0.04641 * XYZ[2];
	LMS[2] = 0.00000 * XYZ[0] + 0.00000 * XYZ[1] + 1.00000 * XYZ[2];

	if(tests == 1)
	    console.log("original LMS %f %f %f",LMS[0],LMS[1],LMS[2]);
	

	// Simulate color blindness
	l = (cvd_a * LMS[0]) + (cvd_b * LMS[1]) + (cvd_c * LMS[2]);
	m = (cvd_d * LMS[0]) + (cvd_e * LMS[1]) + (cvd_f * LMS[2]);
	s = (cvd_g * LMS[0]) + (cvd_h * LMS[1]) + (cvd_i * LMS[2]);
	LMS[0] = l;
	LMS[1] = m;
	LMS[2] = s;
	if(tests == 1)
	    console.log("after LMS %f %f %f",LMS[0],LMS[1],LMS[2]);


	XYZ[0] = 1.91019683 * LMS[0] + -1.11212389 * LMS[1] + 0.201907957 * LMS[2];
	XYZ[1] = 0.370950088 * LMS[0] + 0.629054257 * LMS[1] +  -0.00000805514218 * LMS[2];
	XYZ[2] = 0.00000000 * LMS[0] +  0.00000000 * LMS[2] + 1.00000000 * LMS[2];

	if(tests == 1)
	    console.log("after xyz %f %f %f",XYZ[0],XYZ[1],XYZ[2]);

/*
//somehow this is not correct
	//bring in the colors into the range 
	greatest = 0;
	if(deficiency > 0){
	    //find the largest value
	    for(var i = 0; i < 2; i++){
		if(greatest < Math.abs(XYZ[i])){
		    greatest = Math.abs(XYZ[i]);
		}
	    }
	    //reduce XYZ components by the largest value for the gamma
	    if(greatest > 1.0)
	    {
		XYZ[0] = XYZ[0]/greatest;
		XYZ[1] = XYZ[1]/greatest;
		XYZ[2] = XYZ[2]/greatest;
	    }
	}
*/
	//convert from XYZ to sRGB
//	xyz2rgb(XYZ, RGB);
	XYZ_sRGB(XYZ, RGB);
	R = RGB[0];
	G = RGB[1];
	B = RGB[2];
	if(tests == 1)
	{
	    console.log("after coming back to sRGB %f %f %f", R,G,B);
	}

//	R = r - R;
//	G = g - G;
//	B = b - B;
	if(tests == 2)
	{
	    console.log("differences %f %f %f", R, G, B);
	}
	// Shift colors towards visible spectrum (apply error modifications)
//	RR = (0 * R) + (0.0 * G) + (0.0 * B);
//	GG = (0.7 * R) + (1.0 * G) + (0.0 * B);
//	BB = (0.7 * R) + (0.0 * G) + (1.0 * B);
	// Add compensation to original values
//	R = R + r;
//	G = G + g;
//	B = B + b;
//	R = RR + r;
//	G = GG + g;
//	B = BB + b;
	// Clamp values
	if(R < 0) R = 0;
	if(R > 255) R = 255;
	if(G < 0) G = 0;
	if(G > 255) G = 255;
	if(B < 0) B = 0;
	if(B > 255) B = 255;

	data[id] = R;
	data[id + 1] = G;
	data[id + 2] = B;

	//rebinds the colors
//	data[id] = RGB[0];
//	data[id + 1] = RGB[1];
//	data[id + 2] = RGB[2];	
    }
    // Record data
    ctx.putImageData(imageData, x, y); 
//    ctx.putImageData(imageData, 0, 0);
//    if(typeof options.callback == "function") {
//	options.callback(canvas);
//   }
}

//other one being used
//This function is mostly from Micheal Deal http:mudcu.be credit to him
//The majority of the information on this algorithm can be found in the paper
// "Color display for dichromats" by Francoise Vienot" and "Hans Brettel"
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
    var ctx=document.getElementById(canvas_pass).getContext("2d");
    var img=document.getElementById(image_pass);
//    canvas = document.createElement("canvas"),
//    ctx = canvas.getContext("2d");
//    canvas.width = image.width;
//    canvas.height = image.height;
    var x=0,y=0,width=img.width,height=img.height;
    ctx.drawImage(img, 0, 0);
    try {
//	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
	var imageData = ctx.getImageData(x,y,width,height);
	data = imageData.data;		
    } catch(e) { }
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
}

