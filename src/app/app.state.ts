import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppState {
  private charFrames = new Subject<any>();
  private frames = new Subject<any>();
  private pointer = new Subject<any>();
  private isFound = new Subject<any>();

  setCharFrames(charFrames) {
    this.charFrames.next(charFrames);
  }

  getCharFrames(): Observable<any> {
    return this.charFrames.asObservable();
  }

  setFrames(frames) {
    this.frames.next(frames);
  }

  getFrames(): Observable<any> {
    return this.frames.asObservable();
  }

  setIterationPointer(pointer) {
    this.pointer.next(pointer);
  }

  getIterationPointer(): Observable<any> {
    return this.pointer.asObservable();
  }

  setFound(isFound) {
    this.isFound.next(isFound);
  }

  getFound(): Observable<any> {
    return this.isFound.asObservable();
  }
}
