const { db, TABLE_NAME, sendToOne, response, sendToAll } = require("./common");

exports.handler = async (e, context, cb) => {
  let result;
  const roomId = "Room1";
  const { type, message } = JSON.parse(e.body);
  const id = e.requestContext.connectionId;

  try {
    result = await db
      .query({
        TableName: TABLE_NAME,
        IndexName: "RoomIdIndex",
        ExpressionAttributeNames: {
          "#roomId": "roomId",
          "#id": "id",
        },
        ExpressionAttributeValues: {
          ":id": id,
          ":roomId": roomId,
        },
        KeyConditionExpression: "#roomId = :roomId",
        FilterExpression: "#id <> :id",
      })
      .promise();
  } catch (error) {
    console.error(error);
  }

  console.log(result);

  switch (type) {
    case "offer":
      console.log(message);
      break;
    case "answer":
      console.log(message);
      break;

    default:
      break;
  }

  try {
    await sendToAll(result, { type, message });
  } catch (error) {}

  return cb(null, response(200, "welcome"));
};
