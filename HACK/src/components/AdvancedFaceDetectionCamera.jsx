import React, { useEffect, useRef, useState } from 'react';
import { Camera, ScanLine, Loader2, Square } from 'lucide-react';

const AdvancedFaceDetectionCamera = ({ onCapture, title = 'Advanced Face Capture' }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Ready for face scan');
  const [cameraError, setCameraError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is unavailable. Open this page over HTTPS or localhost in a supported browser.');
      setStatus('Camera unavailable');
      return;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraReady(false);
    setCameraError('');
    setIsLoading(true);
    setStatus('Starting camera...');

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
      setStatus('Camera ready. Position your face in frame.');
    } catch (error) {
      console.error(error);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraError(
        error.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access in your browser settings, then try again.'
          : error.name === 'NotFoundError'
            ? 'No camera was found. Connect a camera or upload a photo instead.'
            : error.message || 'Could not start the camera. Please try again.'
      );
      setStatus('Could not start camera');
    } finally {
      setIsLoading(false);
    }
  };

  const capture = () => {
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
      setIsCaptured(true);
      setCameraError('');
      setStatus('Photo captured successfully');
    } catch (error) {
      console.error('Camera capture failed:', error);
      setCameraError(error.message || 'Could not capture the image. Please try again.');
    }
  };

  return (
    <div className="camera-capture rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500" role="status" aria-live="polite">{status}</p>
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
              setStatus('Camera stopped');
            }}
          >
            <Square className="h-4 w-4" />
            Stop
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={startCamera} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {isLoading ? 'Starting...' : 'Enable camera'}
          </button>
        )}
      </div>

      <div className="camera-preview">
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          muted
          playsInline
        />
        {isLoading && (
          <div className="camera-overlay">
            <Loader2 className="h-5 w-5 animate-spin" />
            Starting camera...
          </div>
        )}
        {!cameraReady && !isLoading && !cameraError && (
          <div className="camera-overlay camera-overlay-idle">
            Enable the camera to see a live preview
          </div>
        )}
        {cameraReady && <div className="camera-face-guide" aria-hidden="true" />}
        <div className="camera-live-label">
          <ScanLine className="h-4 w-4" />
          {cameraReady ? 'Camera ready' : 'Face capture'}
        </div>
      </div>

      {cameraError && <p className="mt-3 text-sm text-red-600" role="alert">{cameraError}</p>}
      <div className="camera-capture-actions">
        <button type="button" className="btn btn-primary" onClick={capture} disabled={!cameraReady || isLoading}>
          <Camera className="h-4 w-4" />
          {isCaptured ? 'Capture again' : 'Capture photo'}
        </button>
      </div>
    </div>
  );
};

export default AdvancedFaceDetectionCamera;
