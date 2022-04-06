const AWS = require("aws-sdk");
const TABLE_NAME = process.env.TABLE_NAME;

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

const db = process.env.IS_OFFLINE
  ? new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    })
  : new AWS.DynamoDB.DocumentClient();

const client = process.env.IS_OFFLINE
  ? new AWS.ApiGatewayManagementApi({
      endpoint: "http://localhost:3001",
    })
  : new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: process.env.ENDPOINT,
    });

const sendToOne = async (id, body) => {
  try {
    await client
      .postToConnection({
        ConnectionId: id,
        Data: JSON.stringify(body),
      })
      .promise();
  } catch (error) {
    console.log(error);
  }
};

exports.sendToOne = sendToOne;
exports.response = response;
exports.db = db;
exports.TABLE_NAME = TABLE_NAME;
