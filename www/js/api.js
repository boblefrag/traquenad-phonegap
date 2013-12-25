var api = {
    url: "http://www.traquenard.net/",
    check_login: function(evt){
        evt.preventDefault();
        params = "password=" + this.elements.password.value + "&username="+ this.elements.login.value
        console.log(params);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', api.url +"/get_token/", true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            if(this.status != 200){
                require(["text!login.html"], function(html){
                    var data = {"error": "Wrong username or password"};
                    var template = html;
                    output = Mustache.render(html, data);
                    document.getElementById('wrapper').innerHTML=output;
                    document.getElementById("login-form")
                    .addEventListener('submit', api.check_login, false)
                });
            }else{
                token = JSON.parse(this.responseText).token;
                database.save_token(token);
            }
        };
        xhr.send(params)
    },
    getMyplace: function(){
        console.log(database.token)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', api.url +"/api/place/", true);
        xhr.setRequestHeader("Authorization", "Token " +database.token);
        xhr.onload = function () {

            if(this.status == 200){
                data = {"places": JSON.parse(this.responseText)};
                console.log(data["places"][0])
                require(["text!place_list.html"], function(html){
                    var template = html;
                    output = Mustache.render(html, data);
                    document.getElementById('wrapper').innerHTML=output;
                    places = document.querySelectorAll(".place");
                    for(var i=0; i<places.length;i++){
                        places[i].addEventListener("click", datamapper.get_details, false)
                    }
                })
            }
        };

        xhr.send()
    }
}