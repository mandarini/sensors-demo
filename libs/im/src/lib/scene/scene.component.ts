import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { mapNumber, MotionMessage } from '@sensor-demo/utils';
import { getMotion, MotionsState } from '@sensor-demo/motions-data';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sensor-demo-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements AfterViewInit, OnDestroy {
  title = 'app';
  kitty = false;
  clock: boolean;
  three = false;
  compete: boolean;
  startCompeting: boolean;
  clouds = true;
  maxusers = 4;
  devices: string[] = [];
  groupA: string[] = [];
  groupB: string[] = [];
  winner: string;

  @ViewChild('container') elementRef: ElementRef;
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Mesh;
  private subscription: Subscription;

  constructor(private store: Store<MotionsState>) {}

  ngAfterViewInit() {
    this.container = this.elementRef.nativeElement;
    this.init();

    this.subscription = this.store
      .select(getMotion)
      .pipe(filter((motion) => !!motion))
      .subscribe((motion: MotionMessage | null) => {
        if (!motion) {
          return;
        }

        if (this.devices.length < this.maxusers) {
          if (!this.devices.includes(motion.username)) {
            this.devices.push(motion.username);
          }
        }
        if (this.devices.includes(motion.username)) {
          switch (motion.type) {
            case 'orientation':
              // Move the cat or the clock
              this.move(
                Math.round(motion.beta as number),
                Math.round(motion.gamma as number),
                Math.round(motion.alpha as number)
              );
              break;
            case 'light':
              // bring the clouds
              this.darken(Math.round(motion.light as number));
              break;
            case 'relative-orientation':
              // move the cube
              this.rotateCube(motion.quaternion as number[]);
              break;
            case 'accelerometer':
              // move the cube
              this.acceleration(
                motion.x as number,
                motion.y as number,
                motion.z as number,
                motion.username
              );
              break;
            case 'logout':
              this.devices.splice(this.devices.indexOf(motion.username), 1);
              break;
            default:
              break;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  init() {
    const screen = {
        width: 500,
        height: 500,
      },
      view = {
        angle: 45,
        aspect: screen.width / screen.height,
        near: 0.1,
        far: 1000,
      };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      view.angle,
      view.aspect,
      view.near,
      view.far
    );
    this.renderer = new THREE.WebGLRenderer();

    this.scene.add(this.camera);
    this.scene.add(new THREE.AxesHelper(20));

    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.setSize(screen.width, screen.height);
    this.container.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry(5, 5, 5),
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      });

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(-50, -50, -50);

    this.scene.add(this.cube);

    this.render();
  }

  render() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: SceneComponent = this;

    (function render() {
      requestAnimationFrame(render);
      self.renderer.render(self.scene, self.camera);
    })();
  }

  acceleration(x: number, y: number, z: number, userName: string) {
    (document.getElementById('x') as HTMLElement).innerHTML = Math.round(
      x as number
    ).toString();
    (document.getElementById('y') as HTMLElement).innerHTML = Math.round(
      y as number
    ).toString();
    (document.getElementById('z') as HTMLElement).innerHTML = Math.round(
      z as number
    ).toString();
    if (this.compete && document?.getElementById('cat')?.getAttribute('x')) {
      const current = parseInt(
        (
          (document as Document).getElementById('cat') as HTMLElement
        ).getAttribute('x') as string
      );
      this.groupA = this.devices?.slice(0, Math.ceil(this.devices?.length / 2));
      this.groupB = this.devices?.slice(Math.ceil(this.devices?.length / 2));
      const addedMotion = Math.abs(x) + Math.abs(y) + Math.abs(z);
      // console.log('ADDED MOTOON', addedMotion);
      const normalizedNumber = mapNumber(addedMotion, 0, 130, 0, 1080);
      console.log('normalizedNumber', normalizedNumber);

      if (this.startCompeting) {
        if (this.groupA.includes(userName)) {
          console.log('NEW ATTR', current - normalizedNumber / 10);
          document
            ?.getElementById('cat')
            ?.setAttribute('x', (current - normalizedNumber / 10).toString());
          if (current - normalizedNumber / 10 <= 0) {
            // this.compete = false;
            this.startCompeting = false;
            this.winner = 'Group A';
          }
        } else if (this.groupB.includes(userName)) {
          console.log('NEW ATTR', current + normalizedNumber / 10);
          document
            ?.getElementById('cat')
            ?.setAttribute('x', (current + normalizedNumber / 10).toString());
          if (current + normalizedNumber / 10 >= 1080) {
            // this.compete = false;
            this.startCompeting = false;
            this.winner = 'Group B';
          }
        }
      }
    }
  }

  rotateCube(quaternion: number[]) {
    this.cube.quaternion.fromArray(quaternion).invert();
    (document.getElementById('quaternion1') as HTMLElement).innerHTML =
      Math.round(quaternion[0] as number).toString();
    (document.getElementById('quaternion2') as HTMLElement).innerHTML =
      Math.round(quaternion[1] as number).toString();
    (document.getElementById('quaternion3') as HTMLElement).innerHTML =
      Math.round(quaternion[2] as number).toString();
    (document.getElementById('quaternion4') as HTMLElement).innerHTML =
      Math.round(quaternion[3] as number).toString();
  }

  move(b: number, g: number, a: number) {
    (document.getElementById('alpha') as HTMLElement).innerHTML = Math.round(
      a as number
    ).toString();
    (document.getElementById('beta') as HTMLElement).innerHTML = Math.round(
      b as number
    ).toString();
    (document.getElementById('gamma') as HTMLElement).innerHTML = Math.round(
      g as number
    ).toString();

    if (this.kitty) {
      document
        ?.getElementById('cat')
        ?.setAttribute('x', (1080 - a * 3).toString());
    }
    if (this.clock) {
      document
        ?.getElementById('clockhand')
        ?.setAttribute('transform', `rotate(${360 - a} 300 300)`);
    }
  }

  darken(light: number) {
    (document.getElementById('light') as HTMLElement).innerHTML = Math.round(
      light as number
    ).toString();
    if (this.clouds) {
      document
        ?.getElementById('cloud-1')
        ?.setAttribute('transform', `translate(${light})`);
      document
        ?.getElementById('cloud-2')
        ?.setAttribute('transform', `translate(${light})`);
      document
        ?.getElementById('cloud-3')
        ?.setAttribute('transform', `translate(${light})`);
      document
        ?.getElementById('cloud-4')
        ?.setAttribute('transform', `translate(${light})`);
      document
        ?.getElementById('cloud-5')
        ?.setAttribute('transform', `translate(${light})`);
      document
        ?.getElementById('cloud-6')
        ?.setAttribute('transform', `translate(${light})`);
      if (light <= 500) {
        const color = Math.round(mapNumber(light, 20, 500, 80, 200));
        document
          ?.getElementById('sky')
          ?.setAttribute('style', `fill: rgb(${color}, ${color}, ${color})`);
      } else {
        document?.getElementById('sky')?.setAttribute('style', 'fill: #9dceff');
      }
    }
  }

  showAnimation(elem: string) {
    if (elem === 'kitty') {
      this.kitty = true;
      this.clock = false;
      this.three = false;
      this.compete = false;
      this.startCompeting = false;
      this.clouds = false;
    }
    if (elem === 'clock') {
      this.kitty = false;
      this.clock = true;
      this.three = false;
      this.compete = false;
      this.startCompeting = false;
      this.clouds = false;
    }
    if (elem === 'cube') {
      this.kitty = false;
      this.clock = false;
      this.three = true;
      this.compete = false;
      this.startCompeting = false;
      this.clouds = false;
    }
    if (elem === 'compete') {
      this.compete = true;
      this.kitty = false;
      this.clock = false;
      this.three = false;
      this.clouds = false;
      setTimeout(() => {
        document?.getElementById('cat')?.setAttribute('x', `${1080 / 2 - 45}`);
      }, 300);
    }
    if (elem === 'clouds') {
      this.kitty = false;
      this.clock = false;
      this.three = false;
      this.compete = false;
      this.startCompeting = false;
      this.clouds = true;
    }
  }

  onEnter(value: string) {
    this.maxusers = parseInt(value, 10);
  }
}
