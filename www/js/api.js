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
                require(["text!login.html", "mustache"], function(html, Mustache){
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
                api.getMyplace();
            }
        };
        xhr.send(params);
    },
    getMyplace: function(lat, lon){
        var xhr = new XMLHttpRequest();
        string = "lat="+encodeURIComponent(lat)+"&lon="+encodeURIComponent(lon)
        xhr.open('GET', api.url +"/api/geoadress/?" + string , true);
        xhr.setRequestHeader("Authorization", "Token " +database.token);
        xhr.onload = function () {

            if(this.status == 200){
                data = {"places": JSON.parse(this.responseText)};
                datamapper.initialize(data);
                datamapper.get_places_templates();
            }
        };

        xhr.send()
    },
    getPlaceType: function(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', api.url +"/api/placetype/", true);
        xhr.setRequestHeader("Authorization", "Token " +database.token);
        xhr.onload = function () {
            if(this.status == 200){
                data = {"placetypes": JSON.parse(this.responseText)};
                datamapper.placetype(data);
                datamapper.get_placetypes_templates();
            }
        };
        xhr.send()
    },
    getPlaceList: function(){
        if(datamapper.lat == null || datamapper.lon == null){
            alert("indiquez votre position")
            return;
        };

        var xhr = new XMLHttpRequest();
        var qs = "lat="+encodeURIComponent(datamapper.lat)+"&lon="+encodeURIComponent(datamapper.lon)
        if(this.id != "all"){
            qs += "&placetype=" + encodeURIComponent(this.id)
        }
        console.log(qs)
        xhr.open('GET', api.url +"/api/geoadress/?" + qs , true);
        xhr.setRequestHeader("Authorization", "Token " +database.token);
        console.log("Authorization", "Token " +database.token)
        xhr.onload = function () {

            if(this.status == 200){
                data = {"places": JSON.parse(this.responseText)};
                datamapper.initialize(data);
                datamapper.get_places_templates();
            }
        };

        xhr.send()
    },
    getNominatim: function(lat, lon, html, Mustache){
        var xhr = new XMLHttpRequest();
        xhr.open('GET',
                 "http://nominatim.openstreetmap.org/reverse?format=json&lat="+lat+"&lon="+lon, true);
        xhr.onload = function(){
            var data = {"position": JSON.parse(this.responseText).display_name}
            var template = html;
            output = Mustache.render(html, data);
            document.getElementById("geolocation").innerHTML = output;
            document.getElementById("change")
                .addEventListener("click",
                                  datamapper.locForm,
                                  false);
        };
        xhr.send()
    },
    getNominatimReverse: function(address){
        var xhr = new XMLHttpRequest();
        xhr.open(
            'GET',
            "http://nominatim.openstreetmap.org/?zoom=18&format=json&countrycodes=fr&q="+encodeURIComponent(address),
            true);
        xhr.onload = function(){
            datamapper.geo_choices(JSON.parse(this.responseText))
        }
        xhr.send()
    },
    getUserInfos: function(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', api.url +"/api/user/me/" , true);
        xhr.setRequestHeader("Authorization", "Token " +database.token);
        xhr.onload = function () {
            datamapper.get_user_template(JSON.parse(this.responseText))
        };
        xhr.send();
    }
}