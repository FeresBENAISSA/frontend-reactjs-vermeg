import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import Webcam from 'react-webcam';

const Scanner = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: webcamRef.current
      },
      decoder: {
        readers: ["qrcode_reader"]
      }
    }, (err) => {
      if (err) {
        console.error("Failed to initialize QuaggaJS", err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      setResult(data.codeResult.code);
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      {result && <p>QR code detected: {result}</p>}
    </>
  );
};

export default Scanner;