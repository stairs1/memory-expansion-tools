import { url, loginEnd, refreshEnd, signupEnd } from "../constants";

class AuthHandle {

    static async getToken(){
        var token = await this.getCookie("access_token_cookie");
        var decodedToken = this.parseJwt(token);
        console.log(decodedToken);
        var date = new Date();
        // date.getTime() is in milliseconds and thus we've got to divide by 1000
        if(decodedToken.exp<date.getTime()/1000){ //the token has expired
            await this.refresh();
            var token = this.getCookie("access_token_cookie");
        }
        return token;
    }

    static async login(username, password) {
	return await fetch(url + loginEnd, {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({ "userId" : username, "password" : password})
		}).then((response) => response.json())
		.then((data) => {
			console.log('Success:', data);
			if (data['success'] === 1){
				this.setCookie('access_token_cookie', data['token'], 1);
				this.setCookie('refresh_token_cookie', data['refreshToken'], 7);
                return true;
			}
			else {
                return false;
			}
    })
  }

    static setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    static async getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
        }

    static parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    static async refresh(){
        var refreshToken = await this.getCookie('refresh_token_cookie');
        return await fetch(url + refreshEnd, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
		        'Authorization': "Bearer " + refreshToken
                }
                }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    console.log('Success:', data);
                    if (data['success'] === 1){
                        this.setCookie('access_token_cookie', data['token'], 1);
                        return true;
                    }
                    else {
                        return false;
                    }
            })
    } 

    static async signup(username, email, name, password) {
        return await fetch(url + signupEnd, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "username" : username, "password" : password, "email" : email, "name" : name})
            }).then((response) => response.json())
            .then((data) => {
                console.log('Success:', data);
                if (data['success'] === 1){
                    return true;
                }
                else {
                    return false;
                }
        })
      }


}

export default AuthHandle;
