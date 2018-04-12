var mysql = require('mysql');
var inq = require('inquirer')
var pmpt = inq.createPromptModule()
var pass = false
var stock
var qs = [{
        type: 'input',
        name: 'id',
        message: 'What item do you want to buy? (Enter the item id)'
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many units do you want to buy?',

    }
]
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon_db',
    socketpath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});
connection.connect(function(e) {
    if (e) throw e;
    console.log('connected')
    var q1 = `SELECT * FROM products`
    connection.query(q1, function(e, r) {
        if (e) throw e;
        stock = r
        for (var i = 0; i <= r.length; i++) {
            display(r[i])
            console.log('------------------------------------')
        }

        pmpt(qs).then(function(rq) {
            console.log(rq)
        })



    })


})


function display(row) {
    for (key in row) {
        if (key != 'stock_quantity' && key != 'department_name') {
            console.log(key + ': ' + row[key])

        }
    }
}