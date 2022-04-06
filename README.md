# webRTC-web-socket
1. Learning webRTC with SocketIO and PeerJS
2. Convert it into serverless with PeerJS

Table setup:
1. roomId partition key <= UUID
2. ConnectionId sort key

The process is as follows:
1. User A connects to the WebsSocket, publishing their unique conversationId and connectionId to a database (this is published via the $OnConnect action provided out of the box by AWS WebSocket API).
2. User B is invited to the frontend with a url containing the conversationId. The $OnConnect action now publishes User B’s ConnectionId and also returns a scan of all active users filtered by conversationId from the url parameters. This scan discovers User A’s data enriched with application metadata.
3. User B is now aware that User A is awaiting connections, so sends an offer (as MASTER) through the websocket directly to User A’s connectionId. This is now inline with a vanilla flow.
4. User A receives this offer through the WebSocket.
5. Users A & B are now aware of each other’s connectionId which can be used as the key for a NEGOTIATE action.
6. The NEGOTIATE action is a P2P message handler between only two peers (no broadcasting), where the offer/answer and ICE candidates are streamed directly through the websockets and handled with code on the frontend (React).

Credits:
1. [Tutorial#1 outdated, ref-1.js contains the code for reference](https://www.youtube.com/watch?v=DvlyzDZDEq4)
2. [Learning about Offer exchange, ref-2](https://www.youtube.com/watch?v=8I2axE6j204)
3. [blog](https://webrtchacks.com/leverage-aws-websocket-api-for-webrtc-signaling/)