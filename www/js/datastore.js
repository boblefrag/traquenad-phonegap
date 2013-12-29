var db = function(){
    this.token = "None"
    this.initialize = function(){
        this.dbShell = window.openDatabase(
            "traquenard", "0.1", "traquenard", 1000);
        this.dbShell.transaction(
            function(tx){
                tx.executeSql('CREATE TABLE IF NOT EXISTS token (id unique, token)')
            }
        );
    };

    this.save_token = function(token){

        this.dbShell.transaction(
            function(tx){
                str = 'INSERT INTO token (id, token) VALUES (1, "'+ token +'")';
                tx.executeSql(str);
            },
            function(tx, err){
                console.log(err);
            },
            function(tx){
                database.get_token()
            })
    };
    this.set_token = function(token){
        this.token = token;
        app.onGetToken(token);
    };

    this.get_token = function(app){
        this.dbShell.transaction(
            function(tx){
                tx.executeSql('SELECT * FROM token', [],
                              function(tx, result){
                                  console.log(result)
                                  if(result.rows.length == 0){
                                      database.set_token(false, app)
                                  }else{

                                      database.set_token(result.rows.item(0).token,
                                                         app)
                                  }
                              });
            });

    };
}
