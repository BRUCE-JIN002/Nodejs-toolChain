import { filter, map, Subject } from "rxjs";

const stream$ = new Subject<number>();

const result$ = stream$
  .pipe(map((x) => x * x))
  .pipe(filter((x) => x % 2 !== 0));

result$.subscribe((v) => {
  console.log(`监听者1: ${v}`);
});

result$.subscribe((v) => {
  console.log(`监听者2: ${v}`);
});

stream$.next(1);

setTimeout(() => {
  stream$.next(2);
}, 1000);

setTimeout(() => {
  stream$.next(3);
}, 2000);
