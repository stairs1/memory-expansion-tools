window.onload = function(){ //runs main when the window has loaded
        main();
}

function main() {
	var loginForm = document.getElementById("loginForm")

	loginForm.addEventListener("submit", search);
}

async function search(event) {
	event.preventDefault();
	var form = document.getElementById("loginForm");
	var username = form['username'].value
	var password = form['password'].value
	console.log(form, username, password);
	console.log(event);
	fetch('/', {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({ "userId" : username, "password" : password})
		}).then((response) => response.json())
		.then((data) => {
			console.log('Success:', data);
			if (data['success'] == 1){
				setCookie('access_token_cookie', data['token'], 1);
				window.location = "ltwo";
			}
			else {
				alert(data['message']);
			}

		});
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
