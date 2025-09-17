import { useState, useRef, useEffect, useCallback } from 'react';
import { useWindowSize } from './hooks/useWindowSize';
import {
  convertImageToASCII,
  loadImageToCanvas,
  loadVideoToCanvas,
  type ASCIIConfig,
} from '../utils/asciiConverter';

interface ASCIIArtProps {
  config: ASCIIConfig;
  glowIntensity: number;
  backgroundBlur: number;
}

export const ASCIIArt: React.FC<ASCIIArtProps> = ({
  config,
  glowIntensity,
  backgroundBlur,
}) => {
  useWindowSize(); // For responsive behavior
  const [asciiData, setAsciiData] = useState<string[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isVideo, setIsVideo] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (src: string) => {
    if (!canvasRef.current) return;

    setIsProcessing(true);
    try {
      await loadImageToCanvas(src, canvasRef.current);
      const ascii = convertImageToASCII(canvasRef.current, config);
      setAsciiData(ascii);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [config]);

  const processVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.paused) return;

    try {
      loadVideoToCanvas(videoRef.current, canvasRef.current);
      const ascii = convertImageToASCII(canvasRef.current, config);
      setAsciiData(ascii);
    } catch (error) {
      console.error('Error processing video frame:', error);
    }
  }, [config]);

  useEffect(() => {
    if (imageSrc && !isVideo) {
      processImage(imageSrc);
    }
  }, [imageSrc, isVideo, processImage]);

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;
    const processFrame = () => {
      processVideoFrame();
      if (!video.paused && !video.ended) {
        requestAnimationFrame(processFrame);
      }
    };

    const handlePlay = () => {
      processFrame();
    };

    video.addEventListener('play', handlePlay);
    return () => video.removeEventListener('play', handlePlay);
  }, [isVideo, processVideoFrame]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideoFile = file.type.startsWith('video/');
    setIsVideo(isVideoFile);

    const url = URL.createObjectURL(file);
    setImageSrc(url);

    if (isVideoFile && videoRef.current) {
      videoRef.current.src = url;
    }
  };

  const glowStyle = {
    textShadow: `0 0 ${glowIntensity}px #00ff00, 0 0 ${glowIntensity * 2}px #00ff00`,
  };

  const backgroundStyle = {
    backdropFilter: `blur(${backgroundBlur}px)`,
    WebkitBackdropFilter: `blur(${backgroundBlur}px)`,
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
      style={backgroundStyle}
    >
      {/* Hidden canvas for processing */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Hidden video element */}
      {isVideo && (
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          loop
          muted
        />
      )}

      {/* Small file input for when content is loaded */}
      {imageSrc && (
        <div className="absolute top-4 left-4 z-30">
          <label
            htmlFor="file-input-small"
            className="cursor-pointer bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors text-sm"
          >
            Change File
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-input-small"
          />
        </div>
      )}

      {/* ASCII Art Display */}
      {asciiData.length > 0 && (
        <div className="w-full h-full max-w-full max-h-full overflow-auto p-4 flex items-center justify-center">
          <div
            className="font-mono leading-none select-none"
            style={{
              fontSize: `${config.fontSize}px`,
              lineHeight: `${config.fontSize}px`,
              ...glowStyle,
            }}
          >
            {asciiData.map((row, y) => (
              <div key={y} className="whitespace-nowrap">
                {row.map((char, x) => (
                  <span key={`${x}-${y}`}>{char}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-xl">Processing...</div>
        </div>
      )}

      {/* Instructions */}
      {!imageSrc && (
        <div className="text-center text-white/70 max-w-lg mx-auto px-4">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            ASCII Art Generator
          </h1>

          {/* Large Choose File Button */}
          <div className="mb-8">
            <label
              htmlFor="file-input-main"
              className="inline-block cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Choose File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input-main"
            />
          </div>

          <p className="text-lg mb-3 text-white/80">Upload an image or video to convert to ASCII art</p>
          <p className="text-sm text-white/50 mb-8">Supports: JPG, PNG, GIF, MP4, WebM</p>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <p className="text-sm text-white/70 mb-4 font-medium">Use the controls below to adjust:</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Sparsity (density)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Glow effects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Font size</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Background blur</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};