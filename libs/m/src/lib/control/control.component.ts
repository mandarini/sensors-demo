import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getMotion,
  MotionsState,
  WebsocketService,
} from '@sensor-demo/motions-data';
import { MotionMessage } from '@sensor-demo/utils';
import {
  Gyroscope,
  Sensor,
  RelativeOrientationSensor,
  AbsoluteOrientationSensor,
  Accelerometer,
} from 'motion-sensors-polyfill';
import { filter, Subscription } from 'rxjs';

declare class AmbientLightSensor extends Sensor {
  constructor(options?: { frequency?: number });
  readonly illuminance?: number | undefined;
}

@Component({
  selector: 'sensor-demo-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements AfterViewInit, OnDestroy {
  logged = false;
  lightSensor: AmbientLightSensor | undefined;
  gyroscope: Gyroscope | undefined;
  accelerometer: Accelerometer | undefined;
  relativeOrientationSensor: RelativeOrientationSensor | undefined;
  absoluteOrientationSensor: AbsoluteOrientationSensor | undefined;

  @ViewChild('username') userName: ElementRef;
  username: string;
  private subscription: Subscription;

  constructor(
    private websocketService: WebsocketService,
    private store: Store<MotionsState>
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.subscription = this.store
      .select(getMotion)
      .pipe(filter((motion) => !!motion))
      .subscribe((motion: MotionMessage | null) => {
        if (motion?.type === 'deny' && motion.username === this.username) {
          window.alert('Too many users - try again later');
          this.websocketService.close();
        }
        if (
          motion?.type === 'login-success' &&
          motion.username === this.username
        ) {
          this.loginSuccess();
        }

        if (motion?.type === 'winner' && motion.username === this.username) {
          window.navigator.vibrate(1000);
        }

        if (motion?.type === 'loser' && motion.username === this.username) {
          window.navigator.vibrate([300, 100, 300]);
        }
      });
  }

  login() {
    this.username = (this.userName.nativeElement as HTMLInputElement).value;
    this.username = this.username.trim();
    if (!this.username || this.username.length === 0) {
      window.alert('Please enter a username');
      return;
    }
    this.websocketService.connect();
    this.websocketService.sendMessage({
      username: this.username,
      type: 'login',
    });
  }

  loginSuccess() {
    this.logged = true;
    window.alert('Will request permission to access sensors');
    this.startAmbientLightSensor();
    this.startGyroscope();
    this.startRelativeOrientation();
    this.startAbsoluteOrientation();
    this.startAccelerometer();
    this.startDeviceOrientation();
  }

  logout(): void {
    this.logged = false;
    this.websocketService.sendMessage({
      username: this.username,
      type: 'logout',
    });
    this.lightSensor?.stop();
    this.gyroscope?.stop();
    this.accelerometer?.stop();
    this.relativeOrientationSensor?.stop();
    this.absoluteOrientationSensor?.stop();
  }

  startDeviceOrientation() {
    window.addEventListener(
      'deviceorientation',
      (event) => {
        const alpha = event.alpha;
        const beta = event.beta;
        const gamma = event.gamma;
        if (this.logged) {
          this.websocketService.sendMessage({
            username: this.username,
            type: 'orientation',
            alpha: alpha as number,
            beta: beta as number,
            gamma: gamma as number,
          });
        }
      },
      true
    );
  }

  startAmbientLightSensor() {
    if ('AmbientLightSensor' in window) {
      navigator.permissions
        .query({ name: 'ambient-light-sensor' as PermissionName })
        .then((result) => {
          if (result.state === 'denied') {
            console.log('Permission to use Ambient Light Sensor is denied.');
            return;
          }

          window.alert('AmbientLightSensor granted access');

          this.lightSensor = new AmbientLightSensor();

          this.lightSensor.addEventListener('reading', () => {
            this.websocketService.sendMessage({
              username: this.username,
              type: 'light',
              light: this.lightSensor?.illuminance,
            });
          });

          this.lightSensor.start();
        })
        .catch(() => {
          console.log('Integration with Permissions API is not enabled');
        });
    }
  }

  startGyroscope() {
    if (typeof Gyroscope === 'function') {
      navigator.permissions
        .query({ name: 'gyroscope' as PermissionName })
        .then((result) => {
          if (result.state === 'denied') {
            console.log('Permission to use gyroscope is denied.');
            return;
          }

          window.alert('Gyroscope granted access');
          this.gyroscope = new Gyroscope();
          this.gyroscope.addEventListener('reading', (e) => {
            this.websocketService.sendMessage({
              username: this.username,
              type: 'gyroscope',
              x: this.gyroscope?.x as number,
              y: this.gyroscope?.y as number,
              z: this.gyroscope?.z as number,
            });
          });
          this.gyroscope?.start();
        })
        .catch(() => {
          console.log('Integration with Permissions API is not enabled');
        });
    }
  }

  startAccelerometer() {
    navigator.permissions
      .query({ name: 'accelerometer' as PermissionName })
      .then((result) => {
        if (result.state === 'denied') {
          console.log('Permission to use accelerometer is denied.');
          return;
        }
        window.alert('Accelerometer granted access');

        this.accelerometer = new Accelerometer();
        this.accelerometer.addEventListener('reading', (e) => {
          this.websocketService.sendMessage({
            username: this.username,
            type: 'accelerometer',
            x: this.accelerometer?.x as number,
            y: this.accelerometer?.y as number,
            z: this.accelerometer?.z as number,
          });
        });
        this.accelerometer?.start();
      })
      .catch(() => {
        console.log('Integration with Permissions API is not enabled');
      });
  }

  startRelativeOrientation() {
    Promise.all([
      navigator.permissions.query({ name: 'accelerometer' as PermissionName }),
      navigator.permissions.query({ name: 'gyroscope' as PermissionName }),
    ])
      .then((results) => {
        if (results.every((result) => result.state === 'granted')) {
          window.alert('RelativeOrientationSensor activated');

          this.relativeOrientationSensor = new RelativeOrientationSensor({
            referenceFrame: 'device',
          });

          this.relativeOrientationSensor.addEventListener('reading', () => {
            this.websocketService.sendMessage({
              username: this.username,
              type: 'relative-orientation',
              quaternion: this.relativeOrientationSensor?.quaternion,
            });
          });

          this.relativeOrientationSensor.start();
        }
      })
      .catch(() => {
        console.log('Integration with Permissions API is not enabled');
      });
  }

  startAbsoluteOrientation() {
    Promise.all([
      navigator.permissions.query({ name: 'accelerometer' as PermissionName }),
      navigator.permissions.query({ name: 'magnetometer' as PermissionName }),
      navigator.permissions.query({ name: 'gyroscope' as PermissionName }),
    ])
      .then((results) => {
        if (results.every((result) => result.state === 'granted')) {
          window.alert('AbsoluteOrientationSensor activated');

          this.absoluteOrientationSensor = new AbsoluteOrientationSensor({
            referenceFrame: 'device',
          });

          this.absoluteOrientationSensor.addEventListener('reading', () => {
            this.websocketService.sendMessage({
              username: this.username,
              type: 'absolute-orientation',
              quaternion: this.relativeOrientationSensor?.quaternion,
            });
          });

          this.absoluteOrientationSensor.start();
        } else {
          console.log('Permission to use sensor was denied.');
        }
      })
      .catch(() => {
        console.log('Integration with Permissions API is not enabled');
      });
  }

  copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    });
  }
}
