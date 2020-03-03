window.onload = function(){ //runs main when the window has loaded
        main();
}

function main() {
	var signupForm = document.getElementById("signupForm")

	signupForm.addEventListener("submit", signup);
}

async function signup(event) {
	event.preventDefault();
	var form = document.getElementById("signupForm");
	var username = form['username'].value
	var password = form['password'].value
	var email = form['email'].value
	var name = form['name'].value
	console.log(form, username, password);
	console.log(event);
	fetch('/signup', {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
		},
        body: JSON.stringify({ "username" : username, "password" : password, "email" : email, "name" : name})
		}).then((response) => response.json())
		.then((data) => {
			console.log('Success:', data);
			if (data['success'] == 1){
                alert("Success! Now please log in.")
			}
			else {
				alert("Unsuccessful signup attempt.");
			}

		});
}
