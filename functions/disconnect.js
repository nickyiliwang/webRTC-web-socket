const { db, TABLE_NAME, response } = require("./common");

exports.handler = async (e, context, cb) => {
  if (e.requestContext) {
    const id = e.requestContext.connectionId;
    let result;
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
    } catch (error) {
      console.error(error);
    }

    const roomId = result.Items[0].roomId;

    try {
      await db
        .delete({
          TableName: TABLE_NAME,
          Key: {
            id: id,
            roomId,
          },
        })
        .promise()
        .then(() => {
          console.log("delete success!", id);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error(error);
    }
  }

  return cb(null, response(200, "default"));
};
