import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '@sensor-demo/motions-data';

@Component({
  selector: 'sensor-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.websocketService.connect();
  }
}
