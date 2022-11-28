const express = require('express')
const connection = require("../Configuration/DbConnection")
const router = express.Router()
const {ROLES, STATUS} = require("../Configuration/Enums")
const bcrypt = require("bcryptjs");
const { pager } = require("../Configuration/Pager");


// add employee
router.post('/',async (req,res) => {
    try{
        let employee = req.body
        let encryptedPassword = await bcrypt.hash(employee.password, 10);

        if (!(req.body.name && req.body.email && req.body.password)) {
            res.status(400).send("Fill all details");
          }else{
            let queryGet = 'select email from employee where email = ?'
            await connection.query(queryGet,[employee.email.toLowerCase()],(err,results) => {
                if(results.length===0){
                    let query = 'insert into employee (name,role,status,email,password) values(?,?,?,?,?)'
                    connection.query(query,[employee.name,1,STATUS.ACTIVE,employee.email.toLowerCase(),encryptedPassword],(err,results) =>{
                        if(!err){
                            res.status(200).json(results)
                        }else{
                            res.status(500).json(err)
                        }
                    })
                }else{
                    res.status(404).json('employee Exists')
                };
            })
          }
    }catch(err){
        res.send(err)
    }
}) 

// get all employees
// router.get('/',(req,res) => {
//     try{
//     let query = 'select * from employee'
//     connection.query(query,(err,results) => {
//         if(!err){
//             res.status(200).json(results)
//         }else{
//             res.status(500).json(err)
//         }
//     })
//     }catch(err){
//         res.send(err)
//     }
// }) 

router.get('/',async(req,res) => {
    try{
        const result = await pager(
            employee,
            req.query.page,
            req.query.limit,
          );
          res.json(result);
    }catch(err){
        res.send(err)
    }
}) 

// get employees by id
router.get('/:id',(req,res) => {
    try{
    let query = 'select * from employee where employeeId = ?'
    connection.query(query,[req.params.id],(err,results) => {
        if(!err){
            res.status(200).json(results)
        }else{
            res.status(500).json(err)
        }
    })  
    }catch(err){
        res.send(err)
    }
}) 

// soft delete employee
router.put('/:id',(req,res) => {
    try{
    let query = 'update employee set status =? where employeeId =?'
    connection.query(query,[STATUS.INACTIVE, req.params.id],(err,results) => {
        if(!err){
            res.status(200).json(results)
        }else{
            res.status(500).json(err)
        }
    })
    }catch(err){
        res.send(err)
    }
}) 

// hard delete employee
router.delete('/:id',(req,res) => {
    try{
    let query = 'delete from employee where employeeId =?'
    connection.query(query,[req.params.id],(err,results) => {
        if(!err){
            res.status(200).json(results)
        }else{
            res.status(500).json(err)
        }
    })
    }catch(err){
        res.send(err)
    }
}) 

module.exports = router