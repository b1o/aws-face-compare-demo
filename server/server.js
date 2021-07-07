const express = require("express");
const path = require("path");
const atob = require("atob");
const multer = require("multer");
const fs = require('fs');
const {
  RekognitionClient,
  CompareFacesCommand,
} = require("@aws-sdk/client-rekognition");
const { secretAccessKey, accessKeyId } = require("./credentials.json");

const app = express();
const port = 3000;
const rekognitionClient = new RekognitionClient({
  region: "us-east-1",
  credentials: { secretAccessKey, accessKeyId },
});

const angular_built_app = path.join(__dirname, "..", "dist", "photos-app");
app.use(express.static(angular_built_app));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/compare", upload.any(), (req, res) => {
  const body = req.files;
  const command = new CompareFacesCommand({
    SourceImage: {
      Bytes: fs.readFileSync('./uploads/' + body[0].filename),
    },
    TargetImage: {
      Bytes: fs.readFileSync('./uploads/' + body[1].filename),
    },
    SimilarityThreshold: 95,
  });
  rekognitionClient
    .send(command)
    .then((awsRes) => {
      res.json(awsRes);
      console.log(awsRes);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log("server running");
});
