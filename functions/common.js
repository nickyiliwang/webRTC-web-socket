const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
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

// all ids in the room
const sendToAll = async (items, body) => {
  console.log("ids", items);
  const users = items.Items;
  const shout = users.map(({ id }) => sendToOne(id, body));
  return Promise.all(shout);
};

const generateNewRoomId = () => {
  return uuid();
};

exports.sendToOne = sendToOne;
exports.sendToAll = sendToAll;
exports.response = response;
exports.db = db;
exports.TABLE_NAME = TABLE_NAME;
exports.generateNewRoomId = generateNewRoomId;
