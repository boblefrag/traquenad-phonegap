/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
require.config({
    baseUrl: "./tpl/",
    paths: {
        index: "../index",
        datamapper: "../datamapper",
        datastore: "../datastore",
        api: "../api",
        mustache: "../mustache",
    },
    shim: {
        'mustache': {
            exports: 'Mustache'
        }
    },
});


require(["datamapper", "datastore", "api"], function(datamapper, datastore, api){
    var datamapper = datamapper;
    var datastore = datastore;
    var api = api;
})


var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
            console.log("ready");
            datamapper.initialize();
            database = new db();
            database.initialize();
            database.get_token(app);
    },
    onGetToken: function(token){
        if(token == false){
            require(["text!login.html", "mustache"], function(html, Mustache){
                var data = {};
                var template = html;
                output = Mustache.render(html, data);
                document.getElementById('wrapper').innerHTML= output;
                document.getElementById("login-form")
                    .addEventListener('submit', api.check_login, false)
            });
        }else{
            api.getPlaceType()
            document.getElementById("search").addEventListener(
                "click",
                datamapper.get_placetypes_templates,
                false
            );
            document.getElementById("user").addEventListener(
                "click",
                datamapper.get_user_infos,
                false
            );
            document.getElementById("create").addEventListener(
                "click",
                datamapper.create_place,
                false
            );
            
            require(["text!geolocation.html", "mustache"], function(html, Mustache){
                var data = {"position": "chargement"};
                var template = html;
                output = Mustache.render(html, data);
                document.getElementById("geolocation").innerHTML = output;
            })

            navigator.geolocation.getCurrentPosition(
                datamapper.setgeo,
                datamapper.ongeoError,
                { maximumAge: 3000, timeout: 50000, enableHighAccuracy: true }
            );

        }
    },

};