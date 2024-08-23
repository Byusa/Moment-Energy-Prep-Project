const express = require("express");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Enable CORS for development
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the file upload server!");
});

app.post("/api/upload", (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "uploads");
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      res.status(500).send("Error uploading file");
      return;
    }

    // Log all keys in the files object
    console.log("files:", files);

    // Check for file fields with empty key
    const fileKey = Object.keys(files)[0];
    if (!fileKey) {
      console.error("No file key found");
      res.status(400).send("No file uploaded");
      return;
    }

    const uploadedFile = files[fileKey][0];
    console.log("Uploaded file:", uploadedFile);
    res.send(`File uploaded successfully: ${uploadedFile.originalFilename}`);
  });
});

// New endpoint to read the CSV file and return data
app.get("/api/batteries", (req, res) => {
  const batteryData = [];
  const filePath = path.join(uploadDir, "battery-data-access_accessKeys.csv"); // Adjust the file name as needed

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      // Assuming the CSV headers are Date, Capacity, Voltage, Temperature, StateOfHealth
      batteryData.push({
        Date: row.Date,
        Capacity: parseFloat(row.Capacity),
        Voltage: parseFloat(row.Voltage),
        Temperature: parseFloat(row.Temperature),
        StateOfHealth: parseFloat(row.StateOfHealth),
      });
    })
    .on("end", () => {
      res.json(batteryData);
    })
    .on("error", (err) => {
      console.error("Error reading the CSV file:", err);
      res.status(500).send("Error processing the file");
    });
});

const port = 5002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// //node-backend/index.js
// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const app = express();

// // const AWS = require("aws-sdk");
// // const { s3 } = require("./awsConfig");

// const upload = multer({ storage: multer.memoryStorage() });

// // app.use(cors({
// //   origin: 'http://localhost:3000', // Your frontend URL
// //   methods: ['GET', 'POST'],
// // }));

// // app.use(express.json()); // Ensure JSON payloads are correctly parsed

// // const athena = new AWS.Athena();

// app.post("/api/upload", upload.single("file"), async (req, res) => {

//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   // const params = {
//   //   Bucket: "moment-energy-battery-data",
//   //   Key: req.file.originalname,
//   //   Body: req.file.buffer,
//   // };
//   res.send("File received successfully");

// });

// const port = process.env.PORT || 5002;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// try {
//   console.log("Uploading file:", req.file.originalname);
//   const data = await s3.upload(params).promise();
//   console.log("File uploaded successfully", data);
//   console.log("File uploaded successfully", data.Location);
//   res.json({
//     message: "File uploaded successfully",
//     location: data.Location,
//   });
// } catch (error) {
//   console.error("Error uploading file", error);
//   res.status(500).send("Error uploading file");
// }

// app.get("/", (req, res) => {
//   res.send("Welcome to the file upload server!");
// });

// app.get("/api/batteries", async (req, res) => {
//   const params = {
//     QueryString: `
//       SELECT Date, Capacity, Voltage, Temperature, StateOfHealth
//       FROM batteries
//       WHERE Date >= date '2024-01-01' AND Date <= date '2024-12-31'
//       ORDER BY Date
//     `, // Example SQL query to select data within a date range
//     QueryExecutionContext: { Database: "your-database" },
//     ResultConfiguration: {
//       OutputLocation: "s3://moment-energy-battery-data/query-results/",
//     },
//   };

//   try {
//     const data = await athena.startQueryExecution(params).promise();
//     const queryExecutionId = data.QueryExecutionId;

//     // Poll for the query result
//     let result;
//     do {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
//       result = await athena
//         .getQueryExecution({ QueryExecutionId: queryExecutionId })
//         .promise();
//     } while (result.QueryExecution.Status.State === "RUNNING");

//     if (result.QueryExecution.Status.State === "SUCCEEDED") {
//       const resultData = await athena
//         .getQueryResults({ QueryExecutionId: queryExecutionId })
//         .promise();
//       // Parse Athena query results and map them to your data structure
//       const rows = resultData.ResultSet.Rows.map((row) =>
//         row.Data.map((cell) => cell.VarCharValue)
//       );

//       // Convert rows to an array of objects with keys matching your data fields
//       const formattedData = rows.slice(1).map((row) => ({
//         Date: row[0],
//         Capacity: parseFloat(row[1]),
//         Voltage: parseFloat(row[2]),
//         Temperature: parseFloat(row[3]),
//         StateOfHealth: parseFloat(row[4]),
//       }));

//       res.json(formattedData);
//     } else {
//       res.status(500).send("Query failed");
//     }
//   } catch (error) {
//     console.error("Error querying Athena", error);
//     res.status(500).send("Error querying Athena");
//   }
// });
