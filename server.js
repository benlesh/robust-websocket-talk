const WebSocketServer = require('ws').Server;
const Rx = require('rxjs/Rx');

const { Observable } = Rx;

const wss = new WebSocketServer({ port: 8081 });
console.log('server running on port 8081');

let i = 1;

wss.on('connection', ws => {
  const subscriptions = {};
  const id = i++;
  console.log(`${id}: connection`);

  ws.on('message', message => {
    console.log(`${id} <-`, message);
    const d = JSON.parse(message);
    if (d.sub && !subscriptions[d.sub]) {
      console.log('adding ', d.sub);
      subscriptions[d.sub] = Observable.interval(500)
        .map(() => ({ color: d.sub, size: Math.random() * 100 }))
        .subscribe(data => {
          if (ws.readyState === 1) {
            console.log(`${id} ->`, data);
            ws.send(JSON.stringify(data));
          }
        });
    }
    if (d.unsub && subscriptions[d.unsub]) {
      console.log('removing ', d.unsub);
      subscriptions[d.unsub].unsubscribe();
    }
  });

  ws.on('close', () => {
    console.log(`${id} CLOSED`);
    Object.keys(subscriptions)
      .forEach(key => subscriptions[key].unsubscribe());
  });

  ws.on('error', (err) => {
    console.log(`${id} ERROR ===`);
    console.error(err);
    Object.keys(subscriptions)
      .forEach(key => subscriptions[key].unsubscribe());
  });
});
