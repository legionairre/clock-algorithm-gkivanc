import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppState } from './app.state';

@Injectable()
export class ClockService {

  private count = 4;
  private frames = [];
  private charFrame = [];
  private pointer;
  private inputKey = '';
  private isFound = false;
  private diskPosition = 0;
  private isFindInitialize = false;

  constructor(private http: HttpClient, private state: AppState) {
    this.pointer = 0;
    this.initFrameBits();
    this.initFrameInput();
  }

  private initFrameBits() {
    for (let i = 0; i < this.count; i++) {
      this.frames[i] = null;
    }
  }

  private initFrameInput() {
    for (let i = 0; i < this.count; i++) {
      this.charFrame[i] = ' ';
    }
  }

  public getJSON() {
    let promise = new Promise((resolve, reject) => {
      this.http.get('./assets/data.txt', {responseType: 'text'})
        .toPromise()
        .then(
          res => { // Success
            resolve(res);
          }
        );
    });
    return promise;
  }

  public searchFromDisk() {
    let record = '';
    let isFound = false;
    let dataList = [];
    this.getJSON().then(data => {
      dataList = data.toString().split('\n');
      dataList.forEach(item => {
        if (item.toString() === this.inputKey) {
          isFound = true;
        }
      });
    }).then(() => {
      if (isFound) {
        if(this.isFindInitialize) {
          this.charFrame[this.pointer] = this.inputKey;
          this.frames[this.pointer] = 0;
          this.completeLoop();
          this.state.setFound(isFound);
        } else {
          this.charFrame[this.diskPosition] = this.inputKey;
          this.pointer = this.diskPosition;
          this.completeLoop();
          this.state.setFound(isFound);
        }
      } else {
        this.state.setFound(isFound);
        this.setAppState();
        return;
      }
      this.setAppState();
    });
  }

  private checkIsInBuffer() {
    this.isFound = false;
    for (let i = 0; i < this.count; i++) {
      if (this.charFrame[i].indexOf(this.inputKey) !== -1) {
        this.frames[i] = 1;
        this.isFound = true;
      }
    }
    if (this.isFound)
      return true;
    return false;
  }

  private completeLoop() {
    if (this.pointer == this.count - 1) {
      this.pointer = 0;
    } else {
      this.pointer = this.pointer + 1;
    }
    this.state.setIterationPointer(this.pointer);
  }

  private replacementPosition() {
    this.isFound = false;
    let i = 0;
    let temp = this.pointer;
    let backward_iterating_id = 0;
    if (this.pointer == this.count - 1 && this.frames[this.pointer] == 0) {
      return this.pointer;
    }

    if (this.pointer == this.count - 1 && this.frames[this.pointer] == 1) {
      this.frames[this.pointer] = 0;
      this.pointer = 0;
    }

    for (i = this.pointer; i < this.count; i++) {
      if (this.frames[i] == 0 && !this.isFound) {
        this.pointer = i;
        this.isFound = true;
        i = this.count;
      } else {
        this.frames[i] = 0;
      }
    }
    if (!this.isFound) {
      while (temp != -1) {
        if (this.frames[temp] == 0) {
          backward_iterating_id = temp;
          temp = 0;
        } else {
          this.frames[temp] = 0;
        }
        temp -= 1;
      }

      this.pointer = backward_iterating_id;
    }
    return this.pointer;
  }

  private setAppState() {
    this.state.setCharFrames(this.charFrame);
    this.state.setFrames(this.frames);
  }

  private notInPosition() {
    this.isFound = false;
    let foundPosition = null;
    for (let i = this.pointer; i < this.count; i++) {
      if (this.frames[i] == null && !this.isFound) {
        this.isFound = true;
        foundPosition = i;
      }
    }
    return foundPosition;
  }

  public clockReplacement(inputKey) {
    this.inputKey = inputKey;
    if (this.checkIsInBuffer()) {
      this.setAppState();
    } else if (this.notInPosition() != null) {
      this.pointer = this.notInPosition();
      this.isFindInitialize = true;
      this.searchFromDisk();
    } else {
      this.diskPosition = this.replacementPosition();
      this.isFindInitialize = false;
      this.searchFromDisk();
    }
  }

}
