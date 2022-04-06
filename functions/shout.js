const { db, TABLE_NAME, sendToOne, response, sendToAll } = require("./common");

exports.handler = async (e, context, cb) => {
  let result;
  const { type, message } = JSON.parse(e.body);

  try {
    result = await db
      .scan({
        TableName: TABLE_NAME,
      })
      .promise();
  } catch (error) {
    console.error(error);
  }

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
