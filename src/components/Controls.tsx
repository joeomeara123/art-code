import { type ASCIIConfig } from '../utils/asciiConverter';

interface ControlsProps {
  config: ASCIIConfig;
  glowIntensity: number;
  backgroundBlur: number;
  onConfigChange: (config: ASCIIConfig) => void;
  onGlowChange: (intensity: number) => void;
  onBlurChange: (blur: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  config,
  glowIntensity,
  backgroundBlur,
  onConfigChange,
  onGlowChange,
  onBlurChange,
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
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm p-4 text-white z-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
          {/* Sparsity Control */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              Sparsity: {config.sparsity}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={config.sparsity}
              onChange={(e) => handleSparsityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Font Size Control */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              Font: {config.fontSize}px
            </label>
            <input
              type="range"
              min="4"
              max="20"
              value={config.fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Glow Control */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              Glow: {glowIntensity}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={glowIntensity}
              onChange={(e) => onGlowChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Background Blur Control */}
          <div className="space-y-1">
            <label className="block text-xs font-medium">
              Blur: {backgroundBlur}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={backgroundBlur}
              onChange={(e) => onBlurChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Character Set Preset */}
          <div className="space-y-1 col-span-2 md:col-span-1 lg:col-span-1">
            <label className="block text-xs font-medium">
              Character Set
            </label>
            <select
              onChange={(e) => handleCharacterSetChange(e.target.value)}
              className="w-full bg-gray-700 text-white text-xs p-2 rounded border-none"
              defaultValue="default"
            >
              <option value="default">Default</option>
              <option value="dense">Dense</option>
              <option value="simple">Simple</option>
              <option value="classic">Classic</option>
            </select>
          </div>

          {/* Current Character Set Display */}
          <div className="space-y-1 col-span-2 md:col-span-1 lg:col-span-1">
            <div className="text-xs font-medium">Current:</div>
            <div className="font-mono text-xs bg-gray-800 p-2 rounded truncate">
              "{config.characters}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};