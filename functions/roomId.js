const { db, TABLE_NAME, sendToOne, response } = require("./common");

exports.handler = async (e, context, cb) => {
  if (e.requestContext) {
    const id = e.requestContext.connectionId;
    let result;
    let roomId;

    try {
      result = await db
        .query({
          TableName: TABLE_NAME,
          KeyConditionExpression: "#id = :id",
          ExpressionAttributeNames: {
            "#id": "id",
          },
          ExpressionAttributeValues: {
            ":id": id,
          },
        })
        .promise();
      roomId = result.Items[0].roomId;
    } catch (error) {
      console.error(error);
    }

    console.log(roomId);
    try {
      await sendToOne(id, { roomId: roomId });
    } catch (error) {
      console.error(error);
    }
  }

  return cb(null, response(200, "welcome"));
};
