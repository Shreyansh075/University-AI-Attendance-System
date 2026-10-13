import React, { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Square } from 'lucide-react';

const FaceDetectionCamera = ({ onCapture, title = 'Face Verification' }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is unavailable. Open this page over HTTPS or localhost in a supported browser.');
      return;
    }

    setCameraReady(false);
    setCameraError('');
    setIsLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      const video = videoRef.current;

      if (!video) {
        throw new Error('Camera preview is not available.');
      }
      video.srcObject = stream;
      await video.play();

      if (!video.videoWidth || !video.videoHeight) {
        throw new Error('The camera is on, but no video frame is available yet. Please try again.');
      }

      setCameraReady(true);
    } catch (error) {
      console.error('Camera access failed:', error);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraError(
        error.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access in your browser settings, then try again.'
          : error.name === 'NotFoundError'
            ? 'No camera was found. Connect a camera and try again.'
            : error.message || 'Could not start the camera. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!cameraReady || !video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      setCameraError('Wait for the live camera preview before capturing.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('Could not prepare the captured image. Please try again.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      if (dataUrl === 'data:,') {
        throw new Error('The camera returned an empty image. Please try again.');
      }
      onCapture?.({
        url: dataUrl,
        capturedAt: new Date().toISOString(),
        width: canvas.width,
        height: canvas.height
      });
      setCameraError('');
    } catch (error) {
      console.error('Camera capture failed:', error);
      setCameraError(error.message || 'Could not capture the image. Please try again.');
    }
  };

  return (
    <div className="camera-capture rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500" role="status" aria-live="polite">
            {cameraReady ? 'Camera ready. Position your face in frame.' : 'Start the camera to capture a photo.'}
          </p>
        </div>
        {cameraReady ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              streamRef.current?.getTracks().forEach((track) => track.stop());
              streamRef.current = null;
              if (videoRef.current) videoRef.current.srcObject = null;
              setCameraReady(false);
            }}
          >
            <Square className="h-4 w-4" />
            Stop
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={startCamera} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {isLoading ? 'Starting...' : 'Start camera'}
          </button>
        )}
      </div>

      <div className="camera-preview">
        <video ref={videoRef} className="camera-video" autoPlay muted playsInline />
        {isLoading && (
          <div className="camera-overlay">
            <Loader2 className="h-5 w-5 animate-spin" />
            Accessing camera...
          </div>
        )}
        {!cameraReady && !isLoading && (
          <div className="camera-overlay camera-overlay-idle">
            Live camera preview will appear here
          </div>
        )}
        {cameraReady && <div className="camera-face-guide" aria-hidden="true" />}
      </div>

      {cameraError && <p className="mt-3 text-sm text-red-600" role="alert">{cameraError}</p>}
      <div className="mt-3 flex justify-end">
        <button type="button" className="btn btn-primary" onClick={handleCapture} disabled={!cameraReady || isLoading}>
          Capture Face
        </button>
      </div>
    </div>
  );
};

export default FaceDetectionCamera;
