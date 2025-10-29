
import React, { useState, useCallback } from 'react';
import { ImageFile } from './types';
import { ImageUploader } from './components/ImageUploader';
import { PersonIcon, ShirtIcon, SpinnerIcon, DownloadIcon } from './components/IconComponents';
import { generateTryOnImage } from './services/geminiService';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageFile | null>(null);
  const [garmentImage, setGarmentImage] = useState<ImageFile | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTryOn = useCallback(async () => {
    if (!personImage || !garmentImage) {
      setError('Please upload both a person and a garment image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const generatedImage = await generateTryOnImage(personImage, garmentImage);
      setResultImage(generatedImage);
    } catch (err: unknown) {
        if (typeof err === 'string') {
            setError(err);
        } else if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  }, [personImage, garmentImage]);

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'tryfy-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isButtonDisabled = !personImage || !garmentImage || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            TryFy
          </h1>
          <p className="text-lg text-gray-400 mt-2">AI Virtual Try-On with Nano Banana</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <ImageUploader
                id="person-uploader"
                label="Upload Person"
                icon={<PersonIcon />}
                image={personImage}
                onImageSelect={setPersonImage}
                onImageRemove={() => setPersonImage(null)}
              />
              <ImageUploader
                id="garment-uploader"
                label="Upload Garment"
                icon={<ShirtIcon />}
                image={garmentImage}
                onImageSelect={setGarmentImage}
                onImageRemove={() => setGarmentImage(null)}
              />
            </div>
            <button
              onClick={handleTryOn}
              disabled={isButtonDisabled}
              className={`w-full flex items-center justify-center text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out ${
                isButtonDisabled
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/50'
              }`}
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Generating...
                </>
              ) : (
                'Try On'
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm flex flex-col items-center justify-center min-h-[300px] md:min-h-0 aspect-square">
            {isLoading && (
               <div className="text-center text-gray-400">
                <SpinnerIcon className="animate-spin h-10 w-10 mx-auto text-indigo-400 mb-4" />
                <p className="font-semibold text-lg text-gray-300">Generating Try-On...</p>
                <p className="text-sm">Please wait, this may take a moment ⏳</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-400 bg-red-900/50 border border-red-700 p-4 rounded-lg">
                <p className="font-bold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {!isLoading && resultImage && (
              <div className="w-full h-full flex flex-col">
                <div className="flex-grow relative mb-4">
                     <img
                        src={resultImage}
                        alt="Generated try-on result"
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  <DownloadIcon />
                  Download Result
                </button>
              </div>
            )}
             {!isLoading && !resultImage && !error && (
                <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">Your result will appear here</p>
                    <p className="text-sm">Upload images and click "Try On" to begin</p>
                </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
