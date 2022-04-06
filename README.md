# webRTC-sls-web-socket

Table setup:
1. roomId partition key <= UUID
2. ConnectionId sort key

<!-- Simple Version -->
Routes:
1. add => scans the db => shouts
2. {"action": "shout", "type": "offer", "message": "offer from client"}
3. {"action": "shout", "type": "answer", "message": "answer from remote"}

<!-- Complex with Rooms -->