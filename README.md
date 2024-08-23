# Moment Energy Prep Project

## Overview

This project is designed to simulate a full-stack application for Moment Energy, a cleantech startup focused on energy storage solutions. The application consists of a frontend built with React and a backend powered by Node.js and Express. It integrates with AWS services, specifically S3 for file storage and Athena for querying data.

## Features

- **File Upload**: Allows users to upload battery data files to AWS S3.
- **Data Dashboard**: Displays battery data using charts and graphs.
- **Data Retrieval**: Fetches and displays battery data from a database using AWS Athena.

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Axios**: A promise-based HTTP client for making requests to the backend.
- **Chart.js**: A library for creating dynamic and interactive charts.
- **React Chart.js 2**: A wrapper for Chart.js in React.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 engine.
- **Express**: A web application framework for Node.js.
- **Multer**: Middleware for handling `multipart/form-data` used for uploading files.
- **AWS SDK**: Provides the tools for interacting with AWS services.

### AWS Services

- **Amazon S3**: Object storage service for storing uploaded files.
- **Amazon Athena**: Interactive query service to analyze data stored in S3.

## Setup

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend

1. Navigate to the `node-backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your AWS credentials are set up correctly.
4. Start the server:
   ```bash
   node index.js
   ```

### AWS Configuration

1. **Create an S3 Bucket**:
   - Bucket Name: `moment-energy-battery-data`
   - Region: `ap-southeast-2`
   - Ensure the bucket allows uploads and that your IAM user has the necessary permissions.

2. **Create an IAM User**:
   - User Name: `battery-data-access`
   - Access Key ID and Secret Access Key: Set these in your environment variables or AWS credentials file.

3. **Update `awsConfig.js`**:
   - Ensure the `region`, `accessKeyId`, and `secretAccessKey` match your AWS settings.

## Usage

- **Upload Files**: Use the upload form in the frontend to upload battery data files.
- **View Dashboard**: Check the dashboard to visualize battery data.

## Troubleshooting

- Ensure AWS credentials are correctly set up and have the necessary permissions.
- Verify that the S3 bucket name and region are correctly configured.
- Check backend logs for detailed error messages if file uploads or data retrieval fails.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
