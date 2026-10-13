import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

const VideoUpload = ({ onUpload }) => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onUpload?.({ fileName: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString() });
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <UploadCloud className="mx-auto h-10 w-10 text-primary-600" />
      <p className="mt-3 text-sm text-gray-600">Upload a demo video for attendance testing</p>
      <button type="button" className="btn btn-primary mt-4" onClick={() => inputRef.current?.click()}>
        Choose File
      </button>
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleChange} />
      {fileName && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          {fileName}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
