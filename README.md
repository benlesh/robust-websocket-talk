# robust-websocket-talk

Example code demonstrating a very simple multiplexed web socket for robust web socket talk.

To run app, you'll need a local http server. I recommend `http-server`:

```sh
npm i -g http-server
```

Run `http-server` in one terminal, and open a second terminal. Then, after you `npm install`, run the following to start the web socket server:

```sh
node server.js
```

Now you can navigate to the `demo.html` file with http://localhost:8080/demo.html and try it out. See what happens if you kill the server and restart it.


