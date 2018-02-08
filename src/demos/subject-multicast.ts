import { interval } from 'rxjs/observable/interval';
import { Observer } from 'rxjs/Observer';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { publish, takeWhile, tap } from "rxjs/operators";
import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";

import "rxjs/add/observable/interval";
import "rxjs/add/operator/publish";

/* Component state. */
let alive = true;

/* create a new observable, providing the observer. */
let i = 0;
const observable = new Observable(observer => {
  
  console.log('%cNew subscription created', 'background: #222; color: #bada55');
  i++;
  
  const interval = setInterval(() => {
    observer.next(i);
  }, 1000);

  return () => {
    clearInterval(interval);
  }
})
.pipe(
  takeWhile(() => alive)
);

const multicasted = observable.publish();

/* Each subscription receives a copy of Observer. */
multicasted.subscribe(value => console.log('First subscription', value));
multicasted.subscribe(value => console.log('Second subscription', value));

/* Connect the subject to the observabe. */
const connection = multicasted.connect();

/* Complete the observable after 5 seconds. */
setTimeout(() => alive = false, 5000);

/* TAKEAWAY */
// A multicasted observable emits the results to multiple observers
// using a single subscription to the underlying stream.
