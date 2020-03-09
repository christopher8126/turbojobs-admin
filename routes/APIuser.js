const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// import model here
const UserModel = require("../model/UserModel");
const WorkerUserModel = require("../model/WorkerUserModel");

// EMPLOYER REGISTER ROUTE
// @route       www.google.com/api/v1/user/employer-register/
// @method      post
router.post("/employer-register/", (req, res) => {
  const { fullName, email, password, userType } = req.body;

  if (!fullName || !password || !email) {
    return res.status(400).json({ msg: "Please Enter All Fields." });
  }

  UserModel.findOne({ email })
    .then(user => {
      if (user) {
        res.status(400).json({ err: "User Already Exist" });
      } else {
        const newUser = new UserModel({
          userType,
          fullName,
          email,
          password
        });
        newUser
          .save()
          .then(data => res.status(200).json({ data }))
          .catch(err => res.status(500).json({ err }));
      }
    })
    .catch(err => console.log("this??"));
});

// EMPLOYER LOG IN ROUTE
// @route       /api/v1/user/employer-login/
// @method      post
router.post("/employer-login/", (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(400).json({ msg: "Please Enter All Fields." });
  }

  // check if email exist
  UserModel.findOne({ email })
    .then(user => {
      // return error if it doesn't
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      // if exist | check password
      UserModel.find({ password })
        .then(pwd => {
          // return error of it doesn't
          if (!pwd) res.status(400).json({ msg: "Invalid Credentials" });

          // if exist generate token
          jwt.sign(
            { id: user.id },
            "turbojobs",
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({ data: { user, token } });
            }
          );
        })
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

// ----------------------------WORKER----------------------

// WORKER REGISTER ROUTE
// @route       /api/v1/user/worker-register/
// @method      post
router.post("/worker-register", (req, res) => {
  const { fullName, email, password, userType } = req.body;
  if (!fullName || !password || !email) {
    return res.status(400).json({ msg: "Please Enter All Fields." });
  }

  WorkerUserModel.findOne({ email })
    .then(user => {
      if (user) res.status(400).json({ msg: "User Already Exist" });

      const newWorker = new WorkerUserModel({
        fullName,
        email,
        password,
        userType
      });
      newWorker
        .save()
        .then(user => res.status(200).json({ user }))
        .catch(err => res.status(400).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
});

// WORKER LOG IN ROUTE
// @route       /api/v1/user/worker-login/
// @method      post
router.post("/worker-login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res.status(400).json({ msg: "Please Enter All Fields." });

  WorkerUserModel.findOne({ email })
    .then(user => {
      if (!user) res.status(400).json({ msg: "Me" });

      if (user.password !== password)
        res.status(400).json({ msg: "Invalid Credentials" });

      jwt.sign(
        { id: user.id },
        "turbojobs",
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ data: { user, token } });
        }
      );
    })
    .catch(err => res.status(500).json({ err }));
});

//test
router.get("/test", (req, res) => {
  UserModel.findOne({ email: "employer@test.com" })
    .populate("postedServices")
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ err }));
});
router.get("/workertest", (req, res) => {
  WorkerUserModel.findOne({ email: "worker@test.com" })
    .populate("workingOn")
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
