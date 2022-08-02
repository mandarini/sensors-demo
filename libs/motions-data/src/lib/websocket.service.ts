import { Injectable } from '@angular/core';
import { MotionMessage } from '@sensor-demo/utils';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket;

  constructor() {
    this.socket = io.connect('https://wsdemokat-lk52ivhmxa-lm.a.run.app');
  }

  sendMessage(message: MotionMessage) {
    this.socket.emit('drawing', message);
  }
}
