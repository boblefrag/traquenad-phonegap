define(['mustache'], function(Mustache){
    // Tell Require.js that this module returns a reference to Mustache
    console.log("from loader", Mustache)
    return Mustache;
 });