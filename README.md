# webRTC-sls-web-socket

TODO:
1. (Setup docker image in Lambda with the PeerJS image.)[https://code.mendhak.com/lambda-docker-hello-world/]

Table setup:
1. roomId partition key <= UUID
2. ConnectionId sort key

<!-- Simple Version -->
How:
0. using static roomId for now, "Room1"
1. add => scans the db => shouts
2. {"action": "shout", "type": "offer", "message": "offer from client"}
3. {"action": "shout", "type": "answer", "message": "answer from remote"}

shouting will exclude the sender

<!-- Complex with Rooms -->
Check for roomId, and let the user be able to generate their own room name

DDB:
```
/functions/shout.js
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

We are using the GSI of RoomIdIndex to be able to query the database with roomId, and filter out the id that's not us, FilterExpression: "#id <> :id", so we exclude ourselves when we shout.
```
