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
            var data = {"placetypes": datamapper.placetypes.placetypes};
            console.log(data);
            output = Mustache.render(html, data);
            document.getElementById('wrapper').innerHTML=output;
        })
    },

    get_places_templates: function(){
        require(["text!place_list.html", "mustache"], function(html, Mustache){
            var template = html;
            var data = {"places": datamapper.places.places};
            output = Mustache.render(html, data);
            document.getElementById('wrapper').innerHTML=output;
            places = document.querySelectorAll(".place");
            for(var i=0; i<places.length;i++){
                places[i].addEventListener("click", datamapper.get_details, false)
            }
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
            document.getElementById("geochoice-form")
                .addEventListener("click", function(){
                    var choices = this.elements.choice;
                    for(var i=0;i<data.choices.length;i++){
                        for(var j=0; j<choices.length;j++){
                            if(choices[j].checked){
                                var chosen = choices[j];
                                break;
                            };
                        };
                    };
                    for(var i=0; i< data.choices.length;i++){
                        if(data.choices[i].display_name == chosen.value){
                            datamapper.lat = data.choices[i].lat;
                            datamapper.lon = data.choices[i].lon;
                            require(["text!geolocation.html", "mustache"], function(html, Mustache){
                                api.getNominatim(datamapper.lat, datamapper.lon, html, Mustache);
                            });
                            break;
                        }
                    }
                }, false)
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
    }
};
