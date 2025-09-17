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
    <div className="fixed top-4 right-4 bg-black/90 backdrop-blur-sm p-4 rounded-lg text-white space-y-3 w-[280px] z-20 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Controls</h3>

      {/* Sparsity Control */}
      <div>
        <label className="block text-sm mb-1">
          Sparsity: {config.sparsity}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={config.sparsity}
          onChange={(e) => handleSparsityChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-xs text-gray-400 mt-1">
          Higher = more sparse/faster
        </div>
      </div>

      {/* Font Size Control */}
      <div>
        <label className="block text-sm mb-1">
          Font Size: {config.fontSize}px
        </label>
        <input
          type="range"
          min="4"
          max="20"
          value={config.fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Glow Control */}
      <div>
        <label className="block text-sm mb-1">
          Glow Intensity: {glowIntensity}
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={glowIntensity}
          onChange={(e) => onGlowChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Background Blur Control */}
      <div>
        <label className="block text-sm mb-1">
          Background Blur: {backgroundBlur}px
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={backgroundBlur}
          onChange={(e) => onBlurChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Character Set Preset */}
      <div>
        <label className="block text-sm mb-1">
          Character Set
        </label>
        <select
          onChange={(e) => handleCharacterSetChange(e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded border-none"
          defaultValue="default"
        >
          <option value="default">Default (@%#*+=-:. )</option>
          <option value="dense">Dense Blocks (█▉▊▋▌▍▎▏ )</option>
          <option value="simple">Simple (█▓▒░ )</option>
          <option value="classic">Classic (@#*+=-:. )</option>
        </select>
      </div>

      {/* Current Character Set Display */}
      <div>
        <div className="text-xs text-gray-400">Current set:</div>
        <div className="font-mono text-sm bg-gray-800 p-2 rounded">
          "{config.characters}"
        </div>
      </div>
    </div>
  );
};