import React from 'react';

const DropzoneMessaging = ({ isDragActive, file }) => {
  if (isDragActive) {
    return <p className="self-center">Ok, drop it!</p>;
  }

  if (file) {
    return (
      <div className="">
        <div className="flex flex-row">
          <span className="self-center overflow-hidden text-gray-400 lowercase truncate">{file.name}</span>
        </div>
      </div>
    );
  }

  return <p className="self-center text-center text-gray-400">Drop a file here or</p>;
};

export default DropzoneMessaging;
