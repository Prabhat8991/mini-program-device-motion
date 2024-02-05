import React, { useEffect, useState } from 'react';

const MotionOrientationComponent = () => {
  const [moApi, setMoApi] = useState('');
  const [moAccel, setMoAccel] = useState('');
  const [moAccelGrav, setMoAccelGrav] = useState('');
  const [moRotation, setMoRotation] = useState('');
  const [moInterval, setMoInterval] = useState('');

  useEffect(() => {
    const initSensors = () => {
      if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
        setMoApi('Generic Sensor API');

        let lastReadingTimestamp;
        let accelerometer = new LinearAccelerationSensor();
        accelerometer.addEventListener('reading', (e) => {
          if (lastReadingTimestamp) {
            intervalHandler(Math.round(accelerometer.timestamp - lastReadingTimestamp));
          }
          lastReadingTimestamp = accelerometer.timestamp;
          accelerationHandler(accelerometer, 'moAccel');
        });
        accelerometer.start();

        if ('GravitySensor' in window) {
          let gravity = new GravitySensor();
          gravity.addEventListener('reading', (e) => accelerationHandler(gravity, 'moAccelGrav'));
          gravity.start();
        }

        let gyroscope = new Gyroscope();
        gyroscope.addEventListener('reading', (e) =>
          rotationHandler({
            alpha: gyroscope.x,
            beta: gyroscope.y,
            gamma: gyroscope.z,
          })
        );
        gyroscope.start();
      } else if ('DeviceMotionEvent' in window) {
        setMoApi('Device Motion API');
        window.addEventListener('devicemotion', onDeviceMotion, false);
      } else {
        setMoApi('No Accelerometer & Gyroscope API available');
      }
    };

    const accelerationHandler = (acceleration, targetId) => {
      const xyz = "[X, Y, Z]";
      let info = xyz.replace("X", acceleration.x && acceleration.x.toFixed(3));
      info = info.replace("Y", acceleration.y && acceleration.y.toFixed(3));
      info = info.replace("Z", acceleration.z && acceleration.z.toFixed(3));
      setMotionState(targetId, info);
    };

    const rotationHandler = (rotation) => {
      const xyz = "[X, Y, Z]";
      let info = xyz.replace("X", rotation.alpha && rotation.alpha.toFixed(3));
      info = info.replace("Y", rotation.beta && rotation.beta.toFixed(3));
      info = info.replace("Z", rotation.gamma && rotation.gamma.toFixed(3));
      setMoRotation(info);
    };

    const intervalHandler = (interval) => {
      setMoInterval(interval);
    };

    const onDeviceMotion = (eventData) => {
      accelerationHandler(eventData.acceleration, 'moAccel');
      accelerationHandler(eventData.accelerationIncludingGravity, 'moAccelGrav');
      rotationHandler(eventData.rotationRate);
      intervalHandler(eventData.interval);
    };

    const setMotionState = (targetId, value) => {
      switch (targetId) {
        case 'moAccel':
          setMoAccel(value);
          break;
        case 'moAccelGrav':
          setMoAccelGrav(value);
          break;
        default:
          break;
      }
    };

    initSensors();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>API used</td>
            <td id="moApi">{moApi}</td>
          </tr>
          <tr>
            <td>linear acceleration (excl. gravity)</td>
            <td id="moAccel">{moAccel}</td>
          </tr>
          <tr>
            <td>acceleration incl. gravity</td>
            <td id="moAccelGrav">{moAccelGrav}</td>
          </tr>
          <tr>
            <td>rotation rate</td>
            <td id="moRotation">{moRotation}</td>
          </tr>
          <tr>
            <td>interval (ms)</td>
            <td id="moInterval">{moInterval}</td>
          </tr>
        </tbody>
      </table>
      <p>
        <small>
          Demo based on <a href="https://www.html5rocks.com/en/tutorials/device/orientation/" target="_blank" rel="noopener">HTML5 Rocks</a> article.
        </small>
      </p>
    </div>
  );
};

export default MotionOrientationComponent;
