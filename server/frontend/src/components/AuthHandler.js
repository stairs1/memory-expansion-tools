import { url, loginEnd, refreshEnd, signupEnd } from "../constants";

class AuthHandle {

    static async checkExpired(token){
        var decodedToken = this.parseJwt(token);
        var date = new Date();
        // date.getTime() is in milliseconds and thus we've got to divide by 1000
        if(decodedToken.exp<date.getTime()/1000){ //the token has expired
            return true;
        }
        return false;
    }

    static async getToken(){
        var token = await this.getCookie("access_token_cookie");
        if (token === null){
            return null;
        }
        if(this.checkExpired(token)){ //the token has expired
            var res = await this.refresh();
            if (res){ 
                var token = this.getCookie("access_token_cookie");
                return token;
            }
        }
        return null;
    }

    static async authStatus(){ //this bit is a gross and should be abstracted out, it's just a repeat of above
        console.log("getting it...");
        var token = await AuthHandle.getToken();
        console.log("got it...");
        if (token === null){
            console.log("running");
            return false;
        }
            console.log("not running");
        return true; //return true because we have a token and it is not expired
    }

    static async logout(){
        this.deleteCookie("access_token_cookie");//delete the login cookies
        this.deleteCookie("refresh_token_cookie"); 
        return true;
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

    static async deleteCookie(name){
        var d = new Date(); //Create an date object
        d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
        var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
        window.document.cookie = name+"="+"; "+expires;//Set the cookie with name and the expiration date
    }

    static async getCookie(name) {
        var nameEQ = name + "=";
        if (document.cookie === null) { //there are no cookies at all
            return null;
        }
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
