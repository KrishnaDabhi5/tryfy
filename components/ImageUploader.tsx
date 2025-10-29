
import React, { useRef } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  image: ImageFile | null;
  onImageSelect: (imageFile: ImageFile) => void;
  onImageRemove: () => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  label,
  icon,
  image,
  onImageSelect,
  onImageRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const imageFile: ImageFile = {
        file,
        previewUrl: URL.createObjectURL(file),
        base64: base64.split(',')[1], // remove data:image/...;base64,
      };
      onImageSelect(imageFile);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageRemove();
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="cursor-pointer block bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors duration-300 relative aspect-square flex flex-col items-center justify-center"
      >
        {image ? (
          <>
            <img
              src={image.previewUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={handleRemoveClick}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-colors"
              aria-label="Remove image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
            {icon}
            <span className="font-semibold text-gray-300">{label}</span>
            <p className="text-xs">JPG or PNG</p>
          </div>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="hidden"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
