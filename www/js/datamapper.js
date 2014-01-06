var datamapper = {
    places: [],
    placetypes: [],
    lat: null,
    lon: null,
    initialize: function(data){
        this.places = data
        // we should connect to the api and retreive base infos
    },

    get_places: function(){
        return this.places
    },

    get_placetypes: function(){
        return this.placetypes
    },
    get_placetypes_templates:function(){

        require(["text!place_type_list.html", "mustache"], function(html, Mustache){
            var template = html;
            var data = {"placetypes": datamapper.placetypes.placetypes
                       };
            output = Mustache.render(html, data);
            document.getElementById('wrapper').innerHTML=output;
            var placetypes = document.getElementsByClassName("placetype");
            for(var i=0;i< placetypes.length; i++){
                placetypes[i].addEventListener("click", api.getPlaceList, false)
            }
        })
    },

    get_places_templates: function(){
        require(["text!place_list.html", "mustache"], function(html, Mustache){
            var template = html;
            var data = {"places": datamapper.places.places,
                        toFixed: function() {
                            return function(num, render) {
                                return parseFloat(render(num)).toFixed(0)}
                        }
                       };
            output = Mustache.render(html, data);
            document.getElementById('wrapper').innerHTML=output;
            document.getElementById("change").style.display = "none"
            places = document.querySelectorAll(".place");
            for(var i=0; i<places.length;i++){
                places[i].addEventListener("click", datamapper.get_details, false)
            };
            document.getElementById("retour")
                .addEventListener("click",
                                  function(){
                                      document.getElementById("change").style.display = "block"
                                      datamapper.get_placetypes_templates();
                                  }, false)
        });
    },

    placetype: function(){
        this.placetypes = data
    },

    setgeo: function(position){
        datamapper.lat = position.coords.latitude;
        datamapper.lon = position.coords.longitude;
        console.log(datamapper.lat, datamapper.lon);
        require(["text!geolocation.html", "mustache"], function(html, Mustache){
            api.getNominatim(datamapper.lat, datamapper.lon, html, Mustache);
        });
    },
    ongeoError: function(error){
        require(["text!geolocation.html", "mustache"], function(html, Mustache){
            var data = {"position": "Erreur: Impossible de vous localiser " + error.message + " " + error.code}
            var template = html;
            output = Mustache.render(html, data);
            document.getElementById("geolocation").innerHTML = output;
            document.getElementById("change")
                .addEventListener("click",
                                  datamapper.locForm,
                                  false);
        });
    },
    locForm: function(){
        require(["text!geo_change.html", "mustache"], function(html, Mustache){
            var data = {};
            var template = html;
            output = Mustache.render(html, data);
            document.getElementById("geolocation").innerHTML = output;
            document.getElementById("geochange-form").addEventListener("submit", datamapper.locValidate, false);
        })
    },
    locValidate: function(evt){
        evt.preventDefault();
        api.getNominatimReverse(this.elements.address.value)
    },
    geo_choices: function(choices){
        require(["text!geo_choices.html", "mustache"], function(html, Mustache){
            var data = {"choices": choices};
            output = Mustache.render(html, data);
            document.getElementById("geolocation").innerHTML = output;
            choices = document.querySelectorAll(".choices");
            for(var i=0; i<choices.length; i++){
                choices[i].addEventListener(
                    "click",
                    function(){
                        for(var j=0;j<data.choices.length;j++){
                            if(this.id == data.choices[j].display_name){
                                datamapper.lat = data.choices[j].lat;
                                datamapper.lon = data.choices[j].lon;
                                require(["text!geolocation.html", "mustache"], function(html, Mustache){
                                    api.getNominatim(datamapper.lat, datamapper.lon, html, Mustache);
                                });
                                break;
                            }
                        }
                    },
                    false)
            }
        });
    },

    get_details: function(evt){
        for (var i=0; i<datamapper.places.places.length; i++){
            if(datamapper.places.places[i].place.address == this.id){
                var data = {"place": datamapper.places.places[i].place,
                            toFixed: function() {
                                return function(num, render) {
                                    return parseFloat(render(num)).toFixed(0)}
                            }
                           }
                console.log(data)
                require(["text!place_details.html", "mustache"],
                        function(html, Mustache){
                            var template = html;
                            output = Mustache.render(html, data);
                            document.getElementById('wrapper').innerHTML=output;
                            document.getElementById("retour")
                                .addEventListener("click",
                                                  datamapper.get_places_templates,
                                                  false);
                            places = document.querySelectorAll(".place");
                            for(var i=0; i<places.length;i++){
                                places[i].addEventListener("click", datamapper.get_details, false)
                            }
                })
            }
        }
    },
    get_user_infos: function(){
        api.getUserInfos()
    },
    get_user_template: function(data){
        console.log(data)
        require(["text!user_preferences.html", "mustache"], function(html, Mustache){
            output = Mustache.render(html, data);
            document.getElementById('wrapper').innerHTML=output;
        })
    },
    create_place: function(){
        console.log("Create Place")
    },
};
