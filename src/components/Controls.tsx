import { type ASCIIConfig } from '../utils/asciiConverter';

interface ControlsProps {
  config: ASCIIConfig;
  glowIntensity: number;
  backgroundBlur: number;
  overlayOpacity: number;
  blendMode: string;
  onConfigChange: (config: ASCIIConfig) => void;
  onGlowChange: (intensity: number) => void;
  onBlurChange: (blur: number) => void;
  onOpacityChange: (opacity: number) => void;
  onBlendModeChange: (mode: string) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  config,
  glowIntensity,
  backgroundBlur,
  overlayOpacity,
  blendMode,
  onConfigChange,
  onGlowChange,
  onBlurChange,
  onOpacityChange,
  onBlendModeChange,
}) => {
  const handleSparsityChange = (value: number) => {
    onConfigChange({ ...config, sparsity: value });
  };

  const handleFontSizeChange = (value: number) => {
    onConfigChange({ ...config, fontSize: value });
  };

  const handleCharacterSetChange = (value: string) => {
    const presets: Record<string, string> = {
      default: '@%#*+=-:. ',
      dense: '█▉▊▋▌▍▎▏ ',
      simple: '█▓▒░ ',
      classic: '@#*+=-:. ',
    };
    onConfigChange({ ...config, characters: presets[value] || value });
  };

  return (
    <div className="w-full h-full bg-black/95 backdrop-blur-sm px-6 py-3 text-white border-t border-white/20 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
          {/* Sparsity Control */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-blue-400">
              Sparsity: {config.sparsity}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={config.sparsity}
              onChange={(e) => handleSparsityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-blue"
            />
          </div>

          {/* Font Size Control */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-yellow-400">
              Font: {config.fontSize}px
            </label>
            <input
              type="range"
              min="4"
              max="20"
              value={config.fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-yellow"
            />
          </div>

          {/* Glow Control */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-green-400">
              Glow: {glowIntensity}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={glowIntensity}
              onChange={(e) => onGlowChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-green"
            />
          </div>

          {/* Background Blur Control */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-purple-400">
              Blur: {backgroundBlur}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={backgroundBlur}
              onChange={(e) => onBlurChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-purple"
            />
          </div>

          {/* Character Set Preset */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-cyan-400">
              Character Set
            </label>
            <select
              onChange={(e) => handleCharacterSetChange(e.target.value)}
              className="w-full bg-gray-800 text-white text-xs p-2 rounded-md border border-gray-600 focus:border-cyan-400 focus:outline-none"
              defaultValue="default"
            >
              <option value="default">Default</option>
              <option value="dense">Dense Blocks</option>
              <option value="simple">Simple</option>
              <option value="classic">Classic</option>
            </select>
          </div>

          {/* Overlay Opacity Control */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-pink-400">
              Opacity: {Math.round(overlayOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-pink"
            />
          </div>

          {/* Blend Mode Control */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-indigo-400">
              Blend Mode
            </label>
            <select
              value={blendMode}
              onChange={(e) => onBlendModeChange(e.target.value)}
              className="w-full bg-gray-800 text-white text-xs p-2 rounded-md border border-gray-600 focus:border-indigo-400 focus:outline-none"
            >
              <option value="overlay">Overlay</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="soft-light">Soft Light</option>
              <option value="hard-light">Hard Light</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};