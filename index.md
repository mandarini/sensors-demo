# Generic Sensor API demo

_translate physical motion to virtual motion across devices_

This is a demo for the Generic Sensor API for the web. You can see its live version in the following link: [ws-pakotinia.web.app](https://ws-pakotinia.web.app).

You can view the slides of the presentation here: [mandarini.github.io/sensors/](https://mandarini.github.io/sensors/).

## Contents

- [Purpose](#purpose)
- [How it works](#how-it-works)
  - [The demo app](#the-demo-app)
  - [The ws app](#the-demo-app)
- [How to play](#how-to-play)
  - [On your computer](#on-your-computer)
  - [On your phone](#on-your-phone)
- [How to set up on your machine](#how-to-set-up-on-your-machine)
- [Useful links and acknowledgements](#useful-links-and-acknowledgements)

## Purpose

The general intention of this app is to demo the [Generic Sensor API](https://www.w3.org/TR/generic-sensor), showcase it's possibilities, and provide some code samples.

This is achieved in this specific demo, by showing how you can turn your phone (which has access to the sensors) to a remote control (a gamepad) for an application that's running on your computer (which - usually - does not have motion sensors).

The general idea is to **"translate physical motion to virtual motion"**, remotely.

_([back to contents](#contents))_

## How it works

This project exposes a web application, which reads sensor data from your phone/device, sends them to a [WebSocket](https://websockets.spec.whatwg.org/) server, which emits them right back. Then, the application receives these readings, and translates them into animations on the screen.

### The `demo` app

The `demo` app is an Angular application. It has two subroutes (sub-modules). The one module (route) is intented to be used on a mobile device (which has access to its sensors). The other is intented to be used on a desktop/laptop screen, which will receive the sensor readings and apply changes to different animations.

Both of the routes (modules), on the different devices, send data to and receive data from the same WebSocket server. That way, we establish a two-way real-time channel between the two instances of the running app, on the two different devices.

### The `ws` app

The "ws" WebSocket app, is a simple `express` server using [`socket.io`](https://socket.io/) that receives data, and sends it right back unchanged. It's using code from the examples directory in the [`socket.io` repository](https://github.com/socketio/socket.io), specifically the [whiteboard example](https://github.com/socketio/socket.io/blob/main/examples/whiteboard/index.js).

_([back to contents](#contents))_

## How to play

This demo works best on the Google Chrome browser. Go to the main page of the application: [ws-pakotinia.web.app](https://ws-pakotinia.web.app).

### On your computer

Click ok the "Playground" button, which will take you to the [playground page](https://ws-pakotinia.web.app/scene). You need to go to the playground first, before starting the Gamepad. The reason is that the playground page "chooses" how many users it can accept at a time. So, if the user limit has not been reached yet, it will emit a `login-success` even, which the Gamepad waits to receive, so that it can start sending the sensor readings.

#### User management

##### Allow users

This drop-down menu specifies which user's readings are taking effect in the animations on the screen. When you are in "Compete" mode, you want to choose "Open to all users".

##### Max users allowed

This number specifies how many simultaneous user connections the app allows. If the number of active users matches the number of max users allowed, someone who is trying to log in from their phone will get an error, telling them that too many users are active, and they will not be able to log in.

#### Games

##### Catwalk

This game uses the DeviceOrientation Event, which does not comply to the Generic Sensor API. It does however give us access to a device sensor, which we will be using. The orientation that this event provides, is based on the accelerometer and the gyroscope of the device.

In this case, to animate the cat, we are taking into account just the alpha attribute. Place your phone flat on a horizontal surface and spin it around. This change in orientation is only what's affecting the movement of the cat.

##### Gyrocat

This game uses the Gyroscope.

In this case, to animate the cat, we are taking into account just the x attribute of the Gyroscope, which represents the current angular velocity around X-axis. Place your phone flat on a horizontal surface and spin it around. The faster you move it, the further the cat will proceed.

We are taking the reading from the x attribute, we are taking its absolute value, we are mapping it between 0 and 100 (to be able to see the motion better, because the actual values are too low and it would be tiring). And then we adding the valu each time to the position of the cat.

##### Clock

This game uses the DeviceOrientation Event, which does not comply to the Generic Sensor API. It does however give us access to a device sensor, which we will be using. The orientation that this event provides, is based on the accelerometer and the gyroscope of the device.

In this case, to animate the clock hand, we are taking into account just the beta attribute. Hold your phone vertically. Then move it towards you, so that the screen faces down. Think as if the axis of rotation is along the bottom of your phone. This change in orientation is only what's affecting the movement of the clock hand.

##### Cube

This game uses the RelativeOrientationSensor. To provide the readings, it relies on the Gyroscope and the Accelerometer of the device.

The readings which the RelativeOrientationSensor gives us is in the form of a quartenion. A quartenion is a "four-element FrozenArray whose elements contain the components of the unit quaternion representing the device orientation" ([ref](https://www.w3.org/TR/orientation-sensor/#orientationsensor-quaternion)).

We are using a three.js cube model which accepts directly a quartenion to describe it's rotation matrix.

Hold your phone in your hand and move it around. You can see the cube responding to your movement.

##### Sunny day

Use your device's Ambient Light Sensor. The Ambient Light Sensor returns the current light level or illuminance. This is a value that represents the ambient light level around the hosting device. Its unit is the lux (lx) ([ref](https://www.w3.org/TR/ambient-light/#model)).

As the light decreases, the clouds cover this nice little house of the prairie.

To play this game, you will need to enable the `chrome://flags/#enable-generic-sensor-extra-classes` Chrome flag.

##### Compete

This is played with two users. It uses the device's Accelerometer. The faster a device accelerates, the more the kitty moves. Whoever accelerates more, wins. The game takes all 3 readings of the accelerometer (accelaration on the x, y and z axes), adds up their absolute values, and does a small adjustment to the resulting number - a calibration. Then, it uses the resulting number to increase the position of the cat horizontally.

The team who "accelarates" more (moves their phones faster), will add more distance covered to the kitty, and the kitty will reach the end faster. Then that team will be the winning team.

_([back to contents](#contents))_

### On your phone

On your phone, click ok the "Gamepad" button, which will take you to the [Gamepad page](https://ws-pakotinia.web.app/control).

#### Enable the flags

First, you may need to enable certain flags on Chrome that enable sensor access. These flags are the following:

- `chrome://flags/#enable-generic-sensor`
- `chrome://flags/#enable-generic-sensor-extra-classes`

#### Log in

Choose a username and click the log-in button. A number of alerts will show up, informing you that the access to the sensors has been granted. After you dismiss the alerts, start moving your phone, and see the effects on the playground. Your sensor readings will start emitting to the service (and eventually to the playground).

_([back to contents](#contents))_

## How to set up on your machine

### Clone + build

This project is using [Nx](https://nx.dev). You can clone the repo, install the dependencies and build each app very easily:

1. Clone the repo

```
git clone git@github.com:mandarini/sensors-demo.git
```

2. Install the dependecies

```
cd sensors-demo
yarn
```

3. Build the front end app

```
nx build demo
```

4. Build the WebSocket server

```
nx build ws
```

Notice how our new application is built and place inside this directory: `ws-server`, which is NOT ignored from git.

Actually, you don't really need to build the WebSocket server, since it's build artifacts are already in the repo you cloned, but in case you make any changes, you will need to build and push again.

### Deploy the front end app

It's very easy to deploy the `demo` app using Firebase, since it's already set up. If you're using the [`firebase` CLI](https://firebase.google.com/docs/cli), you can just do:

```
firebase deploy --only hosting
```

Of course, in order to do that, you need to do the following two things:

1. Change the target project in `.firebase.rc`. Change every instance of `ws-pakotinia` in that file with your Firebase project. If you don't have one, [create one](https://youtu.be/6juww5Lmvgo) and enable hosting.

2. Add your own credentials under in the environment files (`apps/demo/src/environments`). You will not be able to use mine, since you will have to log in through the Firebase CLI.

If you don't want to use Firebase, you can use any other hosting service. You can find the build artifacts under `dist/apps/demo`.

### Deploy the WebSocket server

You can easily deploy your WebSocket server on [Google Cloud Run](https://cloud.google.com/run/docs/triggering/websockets). The project you just created on Firebase exists on Google Cloud as well. We can use the same project to deploy a new Cloud Run service.

Go to the [Google Cloud Console](https://console.cloud.google.com/), choose your project from the navbar drop-down menu, and then, from the side-menu click on Cloud Run, to go to the [Cloud Run dashboard](https://console.cloud.google.com/run). Once there, click the "[Cloud Shell](https://cloud.google.com/shell)" button on the nav-bar to open [a Cloud Shell terminal for your project](https://console.cloud.google.com/run?cloudshell=true).

Now, we can clone (use HTTPS) the repository where you uploaded your project, install the dependencies of the `ws-server` app and then deploy it as a new Cloud Run service. Let's see the steps:

1. In your Cloud Shell terminal, clone the repo:

```
git clone https://github.com/<USERNAME>/<REPO-NAME>.git
```

You can use my repo for this, if you want:

```
git clone https://github.com/mandarini/sensors-demo.git
```

2. Navigate into the WebSocket server directory & install dependencies

```
cd ws-server
npm install
```

3. Deploy as a new Cloud Run service:

```
gcloud run deploy <SOME-NAME> --allow-unauthenticated --source=.
```

Now, you will see in your Cloud Run dashboard your new service, with the name you gave it. Click on the name of your new service to view its details. On the top of that page you will see a URL. This is the URL your services lives under, which you can use to access it. It will look something like this:

```
https://<SOME-NAME>-dfasdfas-fs.a.run.app
```

Let's copy it.

### Connect our new WebSocket server to our web app

Go to your [`websocket.service.ts`](libs/motions-data/src/lib/websocket.service.ts) and replace the `WEBSOCKET_URL` `const` with the URL of your new Google Cloud Run service.

Now, you're all set up!

### Notes

Once you set up and deploy your WebSocket server, you can test your web app from your localhost, too.

_([back to contents](#contents))_

## Useful Links and Acknowledgements

Building this app would not have been possible if I had not read the following articles:

- [https://www.w3.org/TR/generic-sensor/](https://www.w3.org/TR/generic-sensor/)
- [https://intel.github.io/generic-sensor-demos/](https://intel.github.io/generic-sensor-demos/)
- [https://web.dev/generic-sensor/](https://web.dev/generic-sensor/)

And also, thanks to my friend [Kenneth](https://github.com/kenchris) for answering my questions!

It's good to mention that the first time I demo'ed a version of this was in Vienna, on May 18th, 2018, at the WeAreDevelopers conference. [Here's the YouTube link](https://youtu.be/H6L4XT7alXs) of my talk!
