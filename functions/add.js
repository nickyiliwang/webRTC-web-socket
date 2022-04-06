const { db, TABLE_NAME, sendToOne, response } = require("./common");

exports.handler = async (e, context, cb) => {
  let result;
  const body = JSON.parse(e.body);
  const roomId = body.roomId;
  try {
    result = await db
      .query({
        TableName: TABLE_NAME,
        IndexName: "RoomIdIndex",
        KeyConditionExpression: "#roomId = :roomId",
        ExpressionAttributeNames: {
          "#roomId": "roomId",
        },
        ExpressionAttributeValues: {
          ":roomId": roomId,
        },
      })
      .promise();
  } catch (error) {
    console.error(error);
  }

  console.log(result);

  // await db
  //   .get({
  //     TableName: TABLE_NAME,
  //     Key: {
  //       id,
  //     },
  //   })
  //   .promise()
  //   .then(async ({ Item }) => {
  //     console.log("get success!", Item);
  //     await sendToOne(id, `Hello there ${Item.username}!`);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  return cb(null, response(200, "welcome"));
};
