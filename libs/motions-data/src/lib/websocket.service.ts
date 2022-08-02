import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MotionMessage } from '@sensor-demo/utils';
import * as io from 'socket.io-client';
import { loadMotionsSuccess } from './+state/motions.actions';
import { MotionsPartialState } from './+state/motions.reducer';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket;

  constructor(private store: Store<MotionsPartialState>) {
    this.socket = io.connect('https://wsdemokat-lk52ivhmxa-lm.a.run.app');
  }

  sendMessage(message: MotionMessage) {
    this.socket.emit('drawing', message);
  }

  connect() {
    this.socket.on('drawing', (data) => {
      this.store.dispatch(
        loadMotionsSuccess({
          motion: data,
        })
      );
    });
  }

  close() {
    this.socket.close();
  }
}
