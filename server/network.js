/*
network.js

Role: Simulated network layer.
Communicates with: fajax.js, authServer.js, recipesServer.js

Responsibilities:

Route request to correct server

Add random delay (1–3 sec)

Randomly drop request (e.g. 20%)

Important functions:

send(message)

deliver(message)

simulateDelay()

shouldDrop()
*/