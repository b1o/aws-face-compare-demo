const express = require("express");
const path = require("path");
const atob = require("atob");
const multer = require("multer");
const fs = require('fs');
const {
  RekognitionClient,
  CompareFacesCommand,
} = require("@aws-sdk/client-rekognition");

const accessKey = "AKIAWKVGW3MWJEJXTLJW";
const secret = "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";

const app = express();
const port = 3000;
const rekognitionClient = new RekognitionClient({
  region: "us-east-1",
  credentials: { secretAccessKey: secret, accessKeyId: accessKey },
});

const angular_built_app = path.join(__dirname, "..", "dist", "photos-app");

function getBinary(base64Image) {
  var binaryImg = atob(base64Image);
  var length = binaryImg.length;
  var ab = new ArrayBuffer(length);
  var ua = new Uint8Array(ab);
  for (var i = 0; i < length; i++) {
    ab[i] = base64Image.charCodeAt(i);
  }

  return ab;
}

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
    SimilarityThreshold: 70,
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
