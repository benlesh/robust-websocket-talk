const { Observable } = Rx;

const socket$ = Observable.webSocket('ws://localhost:8081');

const getColorStream = (color) =>
  socket$.multiplex(
    () => JSON.stringify({ sub: color }),
    () => JSON.stringify({ unsub: color }),
    d => d.color === color
  )
  .do(e => console.log(e))
  .retryWhen(
    error$ => error$.switchMap(err =>
      navigator.onLine ?
        Observable.timer(1000) :
        Observable.fromEvent(document, 'online')
    )
  );

const canvas = document.querySelector('#display');
const bounds = canvas.getBoundingClientRect();
const canvasWidth = bounds.width;
const canvasHeight = bounds.height;

const context = canvas.getContext('2d');

const drawCircle = (cx, cy, radius, color) => {
  context.beginPath();
  context.arc(cx, cy, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
};

const colorSelect$ =
  Observable.from(document.querySelectorAll('.color-select'))
    .mergeMap(element =>
      Observable.fromEvent(element, 'change')
        .map(e => ({
          color: e.target.value,
          selected: e.target.checked,
          element: e.target }))
    );

colorSelect$
  .filter(d => d.selected)
  .mergeMap(d =>
    getColorStream(d.color)
      .takeUntil(Observable.fromEvent(d.element, 'change'))
  )
  .map(({ color, size }) => ({
    color,
    radius: size,
    cx: Math.round(Math.random() * canvasWidth),
    cy: Math.round(Math.random() * canvasHeight),
  }))
  .subscribe(({ cx, cy, radius, color }) => drawCircle(cx, cy, radius, color));
