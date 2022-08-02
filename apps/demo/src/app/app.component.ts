import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Store } from '@ngrx/store';
import { loadMotionsSuccess, MotionsState } from '@sensor-demo/motions-data';

@Component({
  selector: 'sensor-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private socket;

  constructor(private store: Store<MotionsState>) {
    this.socket = io.connect('https://wsdemokat-lk52ivhmxa-lm.a.run.app');
  }

  ngOnInit() {
    this.socket.on('drawing', (data) => {
      this.store.dispatch(
        loadMotionsSuccess({
          motion: data,
        })
      );
    });
  }
}
