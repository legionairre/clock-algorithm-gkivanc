import { Component } from '@angular/core';
import { ClockService } from './clock.service';
import { AppState } from './app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private searchKey = '';
  private charFrames = [];
  private frames = [];
  private pointer = 0;
  private arrow1 = true;
  private arrow2 = false;
  private arrow3 = false;
  private arrow4 = false;
  private found = true;

  constructor(
    private service: ClockService,
    private state: AppState
  ) {}

  ngOnInit() {

    this.state.getCharFrames().subscribe(charFrames => {
      this.charFrames = charFrames;
    });

    this.state.getFrames().subscribe(frames => {
      this.frames = frames;
    });

    this.state.getIterationPointer().subscribe(pointer => {
      this.pointer = pointer;
      if(this.pointer == 0) {
        this.arrow1 = true;
        this.arrow2 = false;
        this.arrow3 = false;
        this.arrow4 = false;
      }
      else if (this.pointer == 1) {
        this.arrow1 = false;
        this.arrow2 = true;
        this.arrow3 = false;
        this.arrow4 = false;
      }
      else if (this.pointer == 2) {
        this.arrow1 = false;
        this.arrow2 = false;
        this.arrow3 = true;
        this.arrow4 = false;
      }
      else if (this.pointer == 3) {
        this.arrow1 = false;
        this.arrow2 = false;
        this.arrow3 = false;
        this.arrow4 = true;
      }
    });

    this.state.getFound().subscribe(found => {
      this.found = found;
    });

  }

  searchFromFile() {
    this.service.clockReplacement(this.searchKey);
    this.searchKey = '';
  }
}
