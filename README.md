# webRTC-sls-web-socket

Table setup:
1. roomId partition key <= UUID
2. ConnectionId sort key

<!-- Simple Version -->
Routes:
1. default => scans the db

<!-- Complex with Rooms -->