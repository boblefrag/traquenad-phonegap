({
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
    name: "index",
    out: "main-built.js"
})