const express = require("express");
const router = express.Router();

// authMiddleware
const authMiddleware = require("../middleware/authMiddleware");

// import models here
const UserModel = require("../model/UserModel");
const ServiceModel = require("../model/ServiceModel");
const WorkerUserModel = require("../model/WorkerUserModel");

// POST SERVICE ROUTE
// @route       /api/v1/service/post-service
// @method      post
// PRIVATE TOKEN NEEDED auth-token
// 5e5f703bb1f2070afc56c302
router.post("/post-service", authMiddleware, (req, res) => {
  const {
    serviceTitle,
    serviceDesc,
    serviceCateg,
    servicePrice,
    serviceLocation
  } = req.body;

  const newService = new ServiceModel({
    serviceTitle,
    serviceDesc,
    serviceCateg,
    servicePrice,
    serviceLocation
  });

  //   TODO: make id Dynamic
  UserModel.findById("5e5fc1b69285ae15d80cf9a4")
    .then(user => {
      const { email, fullName } = user;
      //   TODO: add contact
      newService.owner = { email, fullName };
      newService
        .save()
        .then(service => {
          user.postedServices.push(service);
          user
            .save()
            .then(data => res.status(200).json({ service }))
            .catch(err => res.status(500).json({ err }));
        })
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => console.log(err));
});

// WORKER AVAIL SERVICE ROUTE
// @route       /api/v1/service/avail-service/:serviceId
// @method      post
// PRIVATE TOKEN NEEDED auth-token
// static workerID : 5e5fc06c9285ae15d80cf9a3
// static serviceID : 5e5fc57517c2c72c7434dafe
router.post("/avail-service/:serviceId/", authMiddleware, (req, res) => {
  const { serviceId } = req.params;
  ServiceModel.findById("5e5fc57517c2c72c7434dafe")
    .then(service => {
      if (service.isOccupied) {
        res
          .status(400)
          .json({ msg: "Sorry, this is already occupied by some worker" });
      } else {
        WorkerUserModel.findById("5e5fc06c9285ae15d80cf9a3")
          .then(worker => {
            //   res.status(200).json({ data: { worker, service } });
            worker.workingOn = service.id;
            worker
              .save()
              .then(worker => {
                service.isOccupied = true;
                service
                  .save()
                  .then(service => {
                    res.status(200).json({ data: worker, service });
                  })
                  .catch(err => res.status(500).json({ err }));
              })
              .catch(err => res.status(400).json({ err }));
          })
          .catch(err => res.status(500).json({ err }));
      }
    })
    .catch(err => res.status(500).json({ err }));
});

// GET ALL SERVICES
// @route       /api/v1/service/
// @method      get
router.get("/", (req, res) => {
  ServiceModel.find()
    .then(data => res.status(200).json({ data }))
    .catch(err => res.status(500).json({ err }));
});

module.exports = router;
