let express = require('express');

let app = express();
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5109);

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


/*********************************************************************
** Defining the DB
*********************************************************************/
let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs290_chaudhra',
    password: '2971',
    database: 'cs290_chaudhra'


});


/*********************************************************************
** A helper endpoint that will setup the table. NOT PRODUCTION RECOMENDED
*********************************************************************/
app.get('/reset-table', function(req, res, next) {
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err) { //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        pool.query(createString, function(err) {
            context.results = "Table reset";
            res.render('home', context);
        })
    });
});


/*********************************************************************
** An endpoint that can be used to view the contents of the DB
*********************************************************************/
app.get('/view-table', (req, res) => {

    let context = {};
    pool.query('SELECT * FROM workouts', (error, rows, fields) => {

        if (error) {
            console.log("ERROR:" + error);
            return;
        }
        context.results = JSON.stringify(rows);
        res.render('home', context);

    });

});


/*********************************************************************
** An endpoint that can be used to obtain JSON data containing the workouts from the DB
*********************************************************************/
app.get('/workouts', (req, res) => {


    pool.query('SELECT * FROM workouts', (error, rows, fields) => {

        if (error) {
            console.log("ERROR:" + error);
            return;
        }

        res.json(rows);

    });

});



/*********************************************************************
** An endpoint that can be used to delete a workout from the DB
*********************************************************************/
app.post('/delete', (req, res) => {


    pool.query('DELETE FROM workouts WHERE id=?', [req.query.id], (error, rows, fields) => {

        if (error) {
            console.log("ERROR:" + error);
            return;
        }

    });

	//Sends back a JSON response with the updated row values
    pool.query('SELECT * FROM workouts', (error, rows, fields) => {

        if (error) {
            console.log("ERROR:" + error);
            return;
        }

        res.json(rows);

    });



});


app.get('/', (req, res) => {


    //res.sendFile(__dirname+'/public/index.html');
});



/*********************************************************************
** An endpoint that can be used to insert a workout into the DB
*********************************************************************/
app.post('/insert', (req, res) => {


    pool.query('INSERT INTO workouts (name, reps, weight, date, lbs) VALUES(?,?,?,?,?)', [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], (error, result) => {

        if (error) {
            console.log(error);
            return;
        }

        //res.status(200).send('OK');
    });
	
            //Sends back a JSON response with the updated row values
            pool.query('SELECT * FROM workouts', (error, rows, fields) => {

                if (error) {
                    console.log("ERROR:" + error);
                    return;
                }

                res.json(rows);

            });	


});


/*********************************************************************
** An endpoint that can be used to update a workout in the DB
*********************************************************************/
app.post('/update', function(req, res, next) {
    var context = {};
    pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result) {
        if (err) {
            next(err);
            return;
        }
        if (result.length == 1) {
            var curVals = result[0];
            pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
                [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
                function(err, result) {
                    if (err) {
                        next(err);
                        return;
                    }

                });

            //Sends back a JSON response with the updated row values
            pool.query('SELECT * FROM workouts', (error, rows, fields) => {

                if (error) {
                    console.log("ERROR:" + error);
                    return;
                }

                res.json(rows);

            });

        }



    });

});


app.listen(app.get('port'), () => {

    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');

});