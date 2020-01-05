window.onload = function(){ //runs main when the window has loaded
        main();
}

function main() {
	var timeForm = document.getElementById("timeForm")
	var searchButton = document.getElementById("searchButton")
	timeForm.addEventListener("submit", submit);
	searchButton.addEventListener("click", search);
}

async function submit(event) {
	event.preventDefault();
	console.log("Shit");
	var form = document.getElementById("timeForm");
	var timeFrame = form['timeFrame'].value
	var urlParams = new URLSearchParams(window.location.search);
	var talkId = urlParams.get('talkId');
	var userId = urlParams.get('userId');
	console.log(talkId, userId);
	fetch('/timeflow', {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
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


async function search(event) {
	window.location = "/search"
}
