import express from "express";
import cors from "cors";
import AWS from "aws-sdk";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new AWS.S3();
const BUCKET = process.env.AWS_S3_BUCKET || "";


app.get(/.*/ , async (req ,res) => {
    const host = req.hostname;      //entire url
    const id = host.split(".")[0];
    const filepath = req.path;
    const key = `main/${id}/${filepath}`

    const contents = await s3.getObject({
    Bucket : BUCKET,
    Key: key || ""
}).promise()

const type = filepath.endsWith("html") ? "text/html" : filepath.endsWith("css") ? "text/css" : "application/javascript"

res.set("Content-Type" , type);
res.send(contents.Body);


})




app.listen(PORT , ()=>{
    console.log(`App is up and running on port ${PORT}`);
});