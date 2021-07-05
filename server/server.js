const express = require("express");
const path = require("path");
const atob = require("atob");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const ProfileService = require("./profiles.js");
const { secretAccessKey, accessKeyId } = require("./credentials.json");
const {
  RekognitionClient,
  CompareFacesCommand,
} = require("@aws-sdk/client-rekognition");

const accessKey = "";
const secret = "u1pRL2VqRRMJT7zTnXpZqk4AwQ+FSAsTTZbwwAJr";

const app = express();
const port = 3000;

const rekognitionClient = new RekognitionClient({
  region: "us-east-1",
  credentials: { secretAccessKey, accessKeyId },
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
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/login", (req, res) => {
  const { password, email } = req.body;

  const result = ProfileService.checkEmailPassword(email, password);
  res.json(result);
});

app.post(
  "/register",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "email" },
    { name: "username" },
    { name: "password" },
  ]),
  (req, res) => {
    console.log(req.files);
    const created = ProfileService.createProfile(
      req.body.username,
      req.body.email,
      req.files.image[0].filename,
      req.body.password
    );

    if (created) {
      res.json({ success: true, result: created });
    }
  }
);

app.post("/face-check", upload.any(), (req, res) => {
  console.log(req.body, req.files);
  const filename = req.files[0].filename;
  const profile = ProfileService.getProfile(req.body.email);

  const TargetImage = fs.readFileSync(`./uploads/${profile.photo}`);
  const SourceImage = fs.readFileSync(`./uploads/${filename}`);

  const command = new CompareFacesCommand({
    SourceImage: {
      Bytes: SourceImage,
    },
    TargetImage: {
      Bytes: TargetImage,
    },
    SimilarityThreshold: 90,
  });

  rekognitionClient
    .send(command)
    .then((awsRes) => {
      console.log(awsRes);
      fs.unlinkSync(`./uploads/${filename}`);
      if (awsRes.FaceMatches[0].Similarity > 90) {
        res.json({ success: true, result: profile });
      } else {
        res.json({ success: false, result: { error: "Face check fail." } });
      }
    })
    .catch((err) => res.status(403).json(err));
});

app.post("/compare", upload.any(), (req, res) => {
  const body = req.files;
  const command = new CompareFacesCommand({
    SourceImage: {
      Bytes: fs.readFileSync("./uploads/" + body[0].filename),
    },
    TargetImage: {
      Bytes: fs.readFileSync("./uploads/" + body[1].filename),
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
