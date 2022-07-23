import React from "react";
import PropTypes from "prop-types";

const ImageUpload = ({
  name,
  className = "",
  image = "",
  progress = 0,
  handleDeleteImage = () => {},
  ...rest
}) => {
  return (
    <label
      className={`cursor-pointer flex items-center justify-center border border-dashed w-full min-h-[200px] rounded-lg ${className} relative overflow-hidden group`}
    >
      <input
        type="file"
        name={name}
        className="hidden-input"
        onChange={() => {}}
        {...rest}
      />
      {progress !== 0 && !image && (
        <div className="loading w-16 h-16 border-8 border-green-500 border-t-transparent animate-spin rounded-full absolute z-10"></div>
      )}
      {!image && (
        <div className="flex flex-col items-center text-center justify-center pointer-events-none">
          <img
            src="/img-upload.png"
            alt="img-upload"
            className="max-w-[80px] mb-5"
          />
          <p className="font-semibold">Choose photo</p>
        </div>
      )}
      {image && (
        <>
          <img
            src={image}
            alt="img-upload"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            className="absolute z-10 flex items-center justify-center w-16 h-16 text-red-500 transition-all bg-white rounded-full cursor-pointer opacity-0 invisible group-hover:opacity-100 group-hover:visible"
            onClick={handleDeleteImage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </>
      )}

      {!image && (
        <div
          className="absolute w-0 h-1 bg-green-400 bottom-0 left-0 transition-all image-upload-progress"
          style={{ width: `${Math.ceil(progress)}%` }}
        ></div>
      )}
    </label>
  );
};
ImageUpload.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  progress: PropTypes.number,
  image: PropTypes.string,
};

export default ImageUpload;
