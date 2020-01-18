window.onload = function(){ //runs main when the window has loaded
        main();
}

function main() {
	var timeForm = document.getElementById("timeForm")
	var searchButton = document.getElementById("searchButton")
	var recentButton = document.getElementById("recent")
	timeForm.addEventListener("submit", loadSubmit);
	searchButton.addEventListener("click", search);
	recentButton.addEventListener("click", seeRecent);
	submit();
}

async function loadSubmit(event) {
	event.preventDefault();
	submit();
}

async function submit() {
	console.log("Shit");
	var form = document.getElementById("timeForm");
	var timeFrame = form['timeFrame'].value
	if (timeFrame == "") {
		timeFrame = "-1";
	}
	var urlParams = new URLSearchParams(window.location.search);
	var talkId = urlParams.get('talkId');
	var userId = urlParams.get('userId');
	var token = getCookie("access_token_cookie");
	console.log(talkId, userId);
	fetch('/timeflow', {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': "Bearer " + token
		},
		body: JSON.stringify({ "talkId" : talkId, "timeFrame" : timeFrame, "userId" : userId })
		}).then((response) => response.json())
		.then((data) => {
		console.log('Success:', data);
		var results = document.getElementById("resultsList");
		results.innerHTML = "";
		for (var i = 0; i < data.length; i++){
			var item = document.createElement("li");
			var talk = document.createElement("p");
			if (data[i]['_id'] == talkId){
				talk.innerHTML = "<b>" + data[i]['talk'] + ", " + data[i]['prettyTime'] + "</b>"
			} else {
				talk.innerHTML = data[i]['talk'] + ", " + data[i]['prettyTime']
			}
			item.appendChild(talk)
			results.appendChild(item);
		}
		});
}

async function seeRecent() {
	console.log("Shit");
	var form = document.getElementById("timeForm");
	var timeFrame = form['timeFrame'].value
	if (timeFrame == "") {
		timeFrame = "-1";
	}
	var urlParams = new URLSearchParams(window.location.search);
	var userId = urlParams.get('userId');
	var token = getCookie("access_token_cookie");
	fetch('/timeflow', {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': "Bearer " + token
		},
		body: JSON.stringify({ "timeFrame" : timeFrame, "userId" : userId })
		}).then((response) => response.json())
		.then((data) => {
		console.log('Success:', data);
		var results = document.getElementById("resultsList");
		results.innerHTML = "";
		for (var i = 0; i < data.length; i++){
			var item = document.createElement("li");
			var talk = document.createElement("p");
				talk.innerHTML = data[i]['talk'] + ", " + data[i]['prettyTime']
			item.appendChild(talk)
			results.appendChild(item);
		}
		});
}



function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


async function search(event) {
	window.location = "/search"
}
