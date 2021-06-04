const mysql = require('mysql');
const express = require('express')
var app= express();
const bodyparser = require('body-parser');



app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysql@123',
    database: 'crudoperation' 
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('db connected')
    else
        console.log('error'+JSON.stringify(err, undefined,2));
});

app.listen(3000,() => console.log('running'));
//get all employee
app.get('/employee',(req,res)=> {
    mysqlConnection.query('SELECT * FROM employee',(err,rows,fields)=> {
        if(!err){
            res.send(rows);
        }
        else
            console.log(err);
    })
})

//get a employee
app.get('/employee/:id',(req,res)=> {
    mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?',[req.params.id],(err,rows,fields)=> {
        if(!err){
            res.send(rows);
        }
        else
            console.log(err);
    })
})
 
//delete a exmployee
app.delete('/employeedelete/:id',(req,res)=> {
    mysqlConnection.query('DELETE FROM employee WHERE EmpID = ?',[req.params.id],(err,rows,fields)=> {
        if(!err){
            res.send("deleted succesfully" );
        }
        else
            res.send(err);
    })
})



// app.post('/insert',(req,res)=>{
//     EmpID = req.body.values,
//     Name = req.body.values,
//     EmpCode = req.body.values,
//     Salary = req.body.values
//     var sql = "INSERT INTO `employee` (EmpID, Name ,EmpCode ,Salary) VALUES (?,?, ?, ?)";
//   mysqlConnection.query(sql, [EmpID, Name ,EmpCode ,Salary], function (err, result) {
//     if(!err) 
//          res.send("User successfully added");
//        else 
//          console.log(err);
//   });

// })

// app.patch('/update/:id',(req,res)=>{
//     var id= req.params.id;
//     var updateData=req.body
//     var sql = "UPDATE employee SET ? WHERE id ?";
//   mysqlConnection.query(sql, [updateData, id], function (err, result) {
//     if(!err) 
//          res.send("Updated successfully");
//        else 
//          console.log(err);
//   });

// })

//Insert an employees
app.post('/insert/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].EmpID);
            });
        else
            console.log(err);
    })
});

//Update an employees
app.put('/update/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});