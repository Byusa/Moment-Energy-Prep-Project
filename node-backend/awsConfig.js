const AWS = require('aws-sdk');

AWS.config.update({
    // region: 'us-east-1',
    region: 'ap-southeast-2', // Make sure this matches your bucket's region
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Set this in your environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // Set 
});

const s3 = new AWS.S3();
const athena = new AWS.Athena();

module.exports = { s3, athena };    