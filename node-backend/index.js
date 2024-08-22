const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const { s3 } = require("./awsConfig");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const athena = new AWS.Athena();

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const params = {
    Bucket: "moment-energy-battery-data",
    Key: req.file.originalname,
    Body: req.file.buffer,
  };

  try {
    const data = await s3.upload(params).promise();
    res.json({
      message: "File uploaded successfully",
      location: data.Location,
    });
  } catch (error) {
    console.error("Error uploading file", error);
    res.status(500).send("Error uploading file");
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the file upload server!");
});

app.get("/api/batteries", async (req, res) => {
  const params = {
    QueryString: `
      SELECT Date, Capacity, Voltage, Temperature, StateOfHealth 
      FROM batteries
      WHERE Date >= date '2024-01-01' AND Date <= date '2024-12-31' 
      ORDER BY Date
    `, // Example SQL query to select data within a date range
    QueryExecutionContext: { Database: "your-database" },
    ResultConfiguration: { OutputLocation: "s3://moment-energy-battery-data/query-results/" },
  };

  try {
    const data = await athena.startQueryExecution(params).promise();
    const queryExecutionId = data.QueryExecutionId;

    // Poll for the query result
    let result;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      result = await athena
        .getQueryExecution({ QueryExecutionId: queryExecutionId })
        .promise();
    } while (result.QueryExecution.Status.State === "RUNNING");

    if (result.QueryExecution.Status.State === "SUCCEEDED") {
      const resultData = await athena
        .getQueryResults({ QueryExecutionId: queryExecutionId })
        .promise();
      // Parse Athena query results and map them to your data structure
      const rows = resultData.ResultSet.Rows.map((row) =>
        row.Data.map((cell) => cell.VarCharValue)
      );

      // Convert rows to an array of objects with keys matching your data fields
      const formattedData = rows.slice(1).map(row => ({
        Date: row[0],
        Capacity: parseFloat(row[1]),
        Voltage: parseFloat(row[2]),
        Temperature: parseFloat(row[3]),
        StateOfHealth: parseFloat(row[4]),
      }));

      res.json(formattedData);
    } else {
      res.status(500).send("Query failed");
    }
  } catch (error) {
    console.error("Error querying Athena", error);
    res.status(500).send("Error querying Athena");
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
