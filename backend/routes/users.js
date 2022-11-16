const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const db = require("../config/connections");
const collections = require("../config/collections");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../middlewares/auth");
var objectid = require("mongodb").ObjectId;

// router.get("/",(req,res)=>{

// })
dotenv.config();
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ email: email });

      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      let userdata = req.body;
      const salt = await bcrypt.genSalt(10);

      // //Encrypt Password

      userdata.password = await bcrypt.hash(password, salt);
      let result = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .insertOne(userdata);
      console.log(result);

      // await user.save();
      let { insertedId } = result;

      //Return jsonwebtoken
      const payload = {
        user: {
          id: insertedId.toString(),
        },
      };

      jwt.sign(
        payload,
        process.env.ACCESS_TOKEN,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/login", auth, async (req, res) => {
  try {
    const user = await db
      .get()
      .collection(collections.USER_COLLECTION)
      .findOne({ _id: objectid(req.user.id) });
    console.log(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ email: email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Return jsonwebtoken

      const payload = {
        user: {
          id: user._id.toString(),
        },
      };

      jwt.sign(
        payload,
        process.env.ACCESS_TOKEN,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
