var mysql = require('mysql');
var inq = require('inquirer')
var pmpt = inq.createPromptModule()

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

        for (var i = 0; i <= r.length; i++) {
            display(r[i])
            console.log('------------------------------------')
        }
        var inStock = 0
        var qs = [{
                type: 'input',
                name: 'id',
                message: 'What item do you want to buy? (Enter the item id)',
                validate: function(input) {
                    inStock = r[input - 1].stock_quantity
                    if (inStock > 0) {
                        console.log(' Available: ' + inStock)
                        return true
                    } else {
                        return 'The item is not available'
                    }

                }
            },
            {
                type: 'input',
                name: 'quantity',
                message: 'How many units do you want to buy?',
                validate: function(input) {
                    if (parseInt(input) > parseInt(inStock)) {
                        return 'Insufficient quantity'
                    } else {
                        return true
                    }
                }
            }
        ]

        pmpt(qs).then(function(rq) {
            console.log('You order item_id: ' + rq.id + ', Quantity: ' + rq.quantity)
            var q2 = `UPDATE products SET? WHERE?`
            var values = [{
                    stock_quantity: parseInt(r[rq.id - 1].stock_quantity) - parseInt(rq.quantity)
                },
                {
                    item_id: parseInt(rq.id)
                }
            ]
            connection.query(q2, values, function(err, res) {
                if (err) throw err
                var total = parseFloat(r[rq.id - 1].price) * parseInt(rq.quantity)
                console.log('Your total cost: ' + total)
            })
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