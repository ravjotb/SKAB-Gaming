var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "SKAB-Gaming" });
});

router.get("/play", function (req, res, next) {
  res.render("question", {
    title: "SKAB-Gaming",
    question: "What is the capital of Canada?",
    imgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Canada_flag_map.svg/1000px-Canada_flag_map.svg.png",
    optionA: "Vancouver",
    optionB: "Toronto",
    optionC: "Ottawa",
    optionD: "Calgary",
  });
});
module.exports = router;
