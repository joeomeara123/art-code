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
      className="fixed inset-0 flex flex-col items-center justify-center"
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

      {/* File input */}
      <div className="absolute top-4 left-4 z-10">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
        >
          Choose File
        </label>
      </div>

      {/* ASCII Art Display */}
      {asciiData.length > 0 && (
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
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-xl">Processing...</div>
        </div>
      )}

      {/* Instructions */}
      {!imageSrc && (
        <div className="text-center text-white/70 max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">ASCII Art Generator</h1>
          <p className="text-lg mb-2">Upload an image or video to convert to ASCII art</p>
          <p className="text-sm text-white/50">Supports: JPG, PNG, GIF, MP4, WebM</p>
          <div className="mt-8">
            <p className="text-sm text-white/60">Use the controls panel to adjust:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-white/50">
              <div>• Sparsity (density)</div>
              <div>• Glow effects</div>
              <div>• Font size</div>
              <div>• Background blur</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};