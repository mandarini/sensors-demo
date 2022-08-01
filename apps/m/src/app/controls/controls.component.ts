import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'sensor-demo-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements AfterViewInit {
  logged: boolean;
  private uuid: string;

  constructor() {}

  ngAfterViewInit() {
    this.logged = false;
    window.addEventListener(
      'devicemotion',
      (event) => {
        const x = event.accelerationIncludingGravity.x;
        const y = event.accelerationIncludingGravity.y;
        const z = event.accelerationIncludingGravity.z;
        const rot = event.rotationRate;
        if (this.logged) {
          interfaceService.sendMsg({
            uuid: this.uuid,
            type: 'motion',
            x: x,
            y: y,
            z: z,
            rot: rot,
          });
        }
      },
      true
    );

    window.addEventListener(
      'deviceorientation',
      (event) => {
        const alpha = event.alpha;
        const beta = event.beta;
        const gamma = event.gamma;
        if (this.logged) {
          interfaceService.sendMsg({
            uuid: this.uuid,
            type: 'orientation',
            alpha: alpha,
            beta: beta,
            gamma: gamma,
          });
        }
      },
      true
    );

    window.addEventListener(
      'devicelight',
      (event) => {
        // console.log(event.value);
        if (this.logged) {
          interfaceService.sendMsg({
            uuid: this.uuid,
            type: 'light',
            light: event.value,
          });
        }
      },
      true
    );

    window.addEventListener('deviceproximity', (event) => {
      // console.log("value: " + event.value, "max: " + event.max, "min: " + event.min);
      if (this.logged) {
        interfaceService.sendMsg({
          uuid: this.uuid,
          type: 'proximity',
          proximity: event,
        });
      }
    });
  }

  login() {
    this.uuid = GuidService.newGuid();
    console.log(this.uuid);
    this.logged = true;
  }

  logout(): void {
    this.logged = false;
    this.interfaceService.sendMsg({
      uuid: this.uuid,
      type: 'logout',
    });
  }
}
