import { useState } from 'react';
import { ASCIIArt } from './components/ASCIIArt';
import { Controls } from './components/Controls';
import { defaultConfig, type ASCIIConfig } from './utils/asciiConverter';

function App() {
  const [config, setConfig] = useState<ASCIIConfig>(defaultConfig);
  const [glowIntensity, setGlowIntensity] = useState(5);
  const [backgroundBlur, setBackgroundBlur] = useState(0);

  return (
    <div className="w-screen h-screen grid grid-rows-[1fr_120px] overflow-hidden">
      <div className="w-full h-full overflow-hidden">
        <ASCIIArt
          config={config}
          glowIntensity={glowIntensity}
          backgroundBlur={backgroundBlur}
        />
      </div>
      <div className="w-full h-[120px] flex-shrink-0">
        <Controls
          config={config}
          glowIntensity={glowIntensity}
          backgroundBlur={backgroundBlur}
          onConfigChange={setConfig}
          onGlowChange={setGlowIntensity}
          onBlurChange={setBackgroundBlur}
        />
      </div>
    </div>
  );
}

export default App;
