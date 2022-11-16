// const db = require("../config/connections");
// var collection = require("../config/collections");
// const objectid = require("mongodb").ObjectId;
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// module.exports = {
//   doSignup: (userData) => {
//     return new Promise(async (resolve, reject) => {
//       userData.password = await bcrypt.hash(userData.password, 10);
//       db.get()
//         .collection(collection.USER_COLLECTION)
//         .insertOne(userData)
//         .then((data) => {
//             // Retunr(JWT)
//             const payload ={
//                 user:{
//                     id:data.insertedId,

//                 }
//             }
//           jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "360000" },(err,token)=>{
//             if(!err) resolve({token });
//         });
        


          
//         });



//     });
//   },
//   chekingAlredyExists: (email) => {
//     return new Promise(async (resolve, reject) => {
//       let user = await db.findOne({ email });
//       if (user) {
//         resolve({ status: true });
//       } else {
//         resolve({status:false})
//       }
//     });
//   },
// };
