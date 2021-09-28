import React from 'react';

const DropzoneMessaging = ({ isDragActive, file }) => {
  if (isDragActive) {
    return <p className="self-center">Ok, drop it!</p>;
  }

  if (file) {
    return (
      <div className="">
        <div className="flex flex-row">
          <h2 className="self-center text-gray-400 lowercase truncate">{file.name}</h2>
        </div>
      </div>
    );
  }

  return <h2 className="self-center text-center text-gray-400 uppercase">Drop files here</h2>;
};

export default DropzoneMessaging;
