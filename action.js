/* Warning 31-Mar-2016: this piece of code seems to be incompatible with Chrome 49.0.2623.87 m
After clicking on the "start trial" button, the code doesn't run. This problem does not exist in Edge 25.10586.0.0
*/
var sizesArray = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
// ReadOnly - Do not modify. 
// Stores the sizes of matrices in each questions.

var majorColorsArray = []; 
// records major colors of each question. 
// Colors are stored in string format. eg: #FFFF00

var minorColorsArray = [];
// Minor colors, in the same format as majorColorsArray.

var colorDifferencesArray = [];
// Color differences.

var startTimesArray = [];
// In milliseconds. Updated in displayTableStartTiming();

var timeUsedArray = []; 
// stores the response time of each question. In milliseconds.

var falseClickNumbers = []; 
// each element stores the number of false click before success

var currQuestionIndex = 0; 
// stores the current question index. Starts from 0.

var startTrialTime; 
// in milliseconds. Initialized in startTrial()

var TRIAL_TOTAL_TIME = 60000;
// Constant. Total game length.

var refreshIntervalId = 0;
var r_id2 = 0;
// Global variable used to stop checkTrialFinishes() after it really finishes.

var participantNumber = 0;

function startTrial() {	
	
	var d = new Date(); // contains the current time
	startTrialTime = d.getTime(); // in milliseconds
	
	var participantNumberInput = document.getElementById("ParticipantNumber");
	
	participantNumber = participantNumberInput.value;
	participantNumberInput.style.display="none";
	
	document.getElementById("InputParticipantNumTextView").style.display="none";
	
	currQuestionIndex = 0;
	
	displayTableStartTiming(sizesArray[currQuestionIndex]);
	
	// How to know when a trial finishes? Check every second!
	refreshIntervalId = setInterval("checkTrialFinishes()");
	
	// Get rid of startTrialButton
	var startTrialButton = document.getElementById("startTrialButton");
	startTrialButton.parentNode.removeChild(startTrialButton);
	
	displayRemainingTime();
	r_id2 = setInterval("displayRemainingTime()", 1000);
}

function displayTableStartTiming(N) {
	var r = Math.floor(Math.random() * N * N); // The r-th cell has unique number
	var majorColor = randomRGBString();	
	var minorColor = randomRGBString();
	// majorColor and minorColor are hex string representations
	var JND = 2.3; // Just Noticeable Difference
	var temp = colorDiffDeltaE(majorColor, minorColor);
	while (temp <= JND) {
		majorColor = randomRGBString();
		minorColor = randomRGBString();
		temp = colorDiffDeltaE(majorColor, minorColor);
	}
	var galleryTable = document.getElementById("galleryTable");
	var tableRowHead = "<tr>";
	var tableString = "";
	var width_pctg = 100 / N;
	var height_pctg = 100 / N;
	  
	for (var i = 0; i < N; i++) {	
		tableString += "<tr height='"
			+ height_pctg + "%'>";		
		for (var j = 0; j < N; j++) {
			if ((i * N + j == r))
				tableString += "<td bgcolor="
					+ "'" + minorColor + "'"
					+ " onclick='onClickCorrectCell();'";
			else 
				tableString += "<td bgcolor="
					+ "'" + majorColor + "'"
					+ " onclick='onClickFalseCell();'";
			tableString += " style='width:" + width_pctg + "%;height=100%'></td>";
		}
		tableString += "</tr>";
	}
	galleryTable.innerHTML = tableString;
	majorColorsArray.push(majorColor);
	minorColorsArray.push(minorColor);
	diffDeltaE = colorDiffDeltaE(majorColor, minorColor);
	colorDifferencesArray.push(diffDeltaE);
	startTimesArray.push(new Date().getTime());
}

function colorDiffDeltaE(c1, c2) {
	/*Input: hex string c1 and c2
	* Output: float number showing the color difference delta_E.
	*/
	
	
	// Handle format in case the strings start with additional #
	c1 = (c1.substring(0, 1) == '#') ? c1.substring(1, 7) : c1;
	c2 = (c2.substring(0, 1) == '#') ? c2.substring(1, 7) : c2;
	
	c1_r = parseInt(c1.substring(0, 2), 16);
	c1_g = parseInt(c1.substring(2, 4), 16);
	c1_b = parseInt(c1.substring(4, 6), 16);
	
	
	c2_r = parseInt(c2.substring(0, 2), 16);
	c2_g = parseInt(c2.substring(2, 4), 16);
	c2_b = parseInt(c2.substring(4, 6), 16);
	
	
	var temp_arr1 = rgb_to_LAB(c1_r, c1_g, c1_b);
	c1_L = temp_arr1[0];
	c1_A = temp_arr1[1];
	c1_B = temp_arr1[2];
	
	/*
	alert(c1 + " RGB=(" + c1_r + ", " + c1_g + ", " + c1_b + ") "
		 + "LAB=(" + c1_L + ", " + c1_A + ", " + c1_B + ")");
	*/
	
	var temp_arr2 = rgb_to_LAB(c2_r, c2_g, c2_b);
	c2_L = temp_arr2[0];
	c2_A = temp_arr2[1];
	c2_B = temp_arr2[2];
	
	var delta_E = Math.sqrt((c1_L-c2_L)*(c1_L-c2_L)+
		(c1_A-c2_A)*(c1_A-c2_A) + (c1_B-c2_B)*(c1_B-c2_B));
	
	return Math.round(delta_E * 100 + 0.001) / 100; 
	// only keeps up to 2 decimal points, while using scaling to avoid the floating point issues by adding the 0.001
}

function rgb_to_LAB(r, g, b) {
	var var_R = r / 255;
	var var_G = g / 255;
	var var_B = b / 255;
	
	var_R = (var_R > 0.04045) ? 
		(Math.pow(((var_R + 0.055) / 1.055), 2.4)) :
		(var_R / 12.92);
	var_G = (var_G > 0.04045) ? 
		(Math.pow(((var_R + 0.055) / 1.055), 2.4)) :
		(var_G / 12.92);
	var_B = (var_B > 0.04045) ? 
		(Math.pow(((var_R + 0.055) / 1.055), 2.4)) :
		(var_B / 12.92);
	
	var_R *= 100;
	var_G *= 100;
	var_B *= 100;
	
	
		
	var x = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
	var y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722; 
	var z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;
	
	
	var var_X = x / 95.047;
	var var_Y = y / 100.000;
	var var_Z = z / 108.883;
	
	var_X = (var_X > 0.008856) ? (Math.pow(var_X, 1/3)) :
		(7.787 * var_X + 16/116);
	var_Y = (var_Y > 0.008856) ? (Math.pow(var_Y, 1/3)) :
		(7.787 * var_Y + 16/116);
	var_Z = (var_Z > 0.008856) ? (Math.pow(var_Z, 1/3)) :
		(7.787 * var_Z + 16/116);
		
	var L = 116 * var_Y - 16;
	var A = 500 * (var_X - var_Y);
	var B = 200 * (var_Y - var_Z);
	
	return [L, A, B];
}
function onClickCorrectCell() {
	// Record results: user response time.
	var t = new Date().getTime();
	timeUsedArray.push(t - startTimesArray[currQuestionIndex]);
	
	
	if(falseClickNumbers.length <= currQuestionIndex)
		falseClickNumbers.push(0);
	
		
	
	// Update views: next question.
	currQuestionIndex++;
	displayTableStartTiming(sizesArray[currQuestionIndex]);
}

function onClickFalseCell() {
	if(falseClickNumbers.length <= currQuestionIndex)
		falseClickNumbers.push(1);
	else
		falseClickNumbers[currQuestionIndex]++;
	
}

function randomRGBString() {
	
	r = Math.floor(Math.random() * 255);
	r = (r < 16) ? ('0' + r.toString(16)) : (r.toString(16));
	
	g = Math.floor(Math.random() * 255);
	g = (g < 16) ? ('0' + g.toString(16)) : (g.toString(16));
	
	b = Math.floor(Math.random() * 255);
	b = (b < 16) ? ('0' + b.toString(16)) : (b.toString(16));
	
	
	
	return r + g + b;
}

function getRemainingTimeMillis() {
	var sum = 0; // sum of prev questions time
	var d = new Date();	
	for (var i = 0; i < currQuestionIndex; i++) {
		sum += (timeUsedArray[i]);
	}
	return (TRIAL_TOTAL_TIME 
		- sum 
		- (d.getTime() - startTimesArray[currQuestionIndex]));
}

function displayRemainingTime() {
	// This method is just for displaying time. No modification to data arrays is involved.
	
	var timeDisplayArea = document.getElementById("timeDisplayArea");
	
	
	var remainingTime = getRemainingTimeMillis();
	
	remainingTime = Math.floor(remainingTime / 1000);
	
	timeDisplayArea.innerHTML = "Time remaining: " + remainingTime;
	
	timeDisplayArea = null; // free the memory
	
}

function checkTrialFinishes() {
	//console.log('checkTrialFinishes() called');
	if (getRemainingTimeMillis() <= 0) {
		
		clearInterval(refreshIntervalId);
		clearInterval(r_id2);
		
		
		var timeDisplayArea = document.getElementById("timeDisplayArea");	
		timeDisplayArea.innerHTML = "";
		
		
		var galleryTable = document.getElementById("galleryTable");
		// Make galleryTable height flexible.
		galleryTable.parentNode.height = "70%";
		galleryTable.parentNode.style.overflow = "scroll";
		
		// Replace galleryTable contents with results.
		var resultStrings = "<h3>Hi Participant #" + participantNumber + "!</h3><br><h3>You answered " + currQuestionIndex + " questions.</h3>";
		
		var temp = 0;
		for (var i = 0; i < currQuestionIndex; i++) {
			temp += timeUsedArray[i];
		}
		var avgResponseTime = temp / currQuestionIndex;
		resultStrings += "<h3>Your average response time was " + avgResponseTime + " milliseconds.</h3>"
		
		/*Test: Print out all the data retrieved as a table.*/
		resultStrings += "<tr><td>Question</td>"
			+ "<td>Color Difference</td>"
			+ "<td>Response Time</td>"
			+ "<td>False clicks</td>"
			+ "</tr>";
		for (i = 0; i < currQuestionIndex; i++) {
			resultStrings += "<tr><td>" + i + "</td>" 
				+ "<td>" + analogToDigital(colorDifferencesArray[i]) + "</td>"
				+ "<td>" + timeUsedArray[i] + "</td>"
				+ "<td>" + falseClickNumbers[i] + "</td>"
				+ "</tr>";
		}
		
		galleryTable.innerHTML = resultStrings;
		
		
		
		
	}
}

function analogToDigital(n) {
	if (n > 37) {
		return "large";
	} else {
		return "small";
	}
	
}

function submitResult() {
	/*Prepare the data for passing to server and send request for guiding to the questionnaire.*/
		/*Schema: finalData is a JSONObject having the following entries:
			finishTime; //in milliseconds by Date.now()
			screenHeight; (in pixels);
			screenWidth;
			
			N; //number of questions
			data; // array of objects containing {index, colorDiffDeltaE, timeUsed, falseClick}
		*/
		var trialData = document.getElementById('trialData');
		var finalData = {'finishTime': Date.now(),
			'screenHeight': screen.height,
			'screenWidth': screen.width,
			'N': currQuestionIndex,
			'data': []
		};
		for (i = 0; i < currQuestionIndex; i++) {
			var obj = {'index': i,
					'size':sizesArray[i],
					'colorDiffDeltaE': colorDifferencesArray[i],
					'timeUsed': timeUsedArray[i],
					'falseClick':falseClickNumbers[i]};
			finalData.data.push(obj);
		}
		var finalDataString = JSON.stringify(finalData);
		console.log('finalData=' + finalDataString);
		//trialData.innerHTML = encrypt(finalDataString);
		
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				//document.write("We have received your data. Redirecting to our questionnaire...");
			}
		}
		
		xhttp.open("GET", "result?dataString=" + finalDataString, true);
		xhttp.send();
}
function encrypt(inputString) {
	
	return inputString;
}

function isTrialTimeUsedUp() {
	//console.log('isTrialTimeUsedUp() called.');
	var curr_time = new Date().getTime();
	if (curr_time - startTrialTime >= TRIAL_TOTAL_TIME) 
		return true;
	else
		return false;
} 