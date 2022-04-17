const { db, TABLE_NAME, response } = require("./common");

exports.handler = async (event, context, cb) => {
  const id = event.requestContext.connectionId;
  // Using static roomId for now
  const roomId = "Room1";

  console.log(id, roomId);
  await db
    .put({
      TableName: TABLE_NAME,
      Item: { id, roomId },
    })
    .promise()
    .then(() => {
      console.log("put success!", id, roomId);
    })
    .catch((err) => {
      console.error(err);
    });

  return cb(null, response(200, { body: "Connected" }));
};
