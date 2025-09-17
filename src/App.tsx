import { useState } from 'react';
import { ASCIIArt } from './components/ASCIIArt';
import { Controls } from './components/Controls';
import { defaultConfig, ASCIIConfig } from './utils/asciiConverter';

function App() {
  const [config, setConfig] = useState<ASCIIConfig>(defaultConfig);
  const [glowIntensity, setGlowIntensity] = useState(5);
  const [backgroundBlur, setBackgroundBlur] = useState(0);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <ASCIIArt
        config={config}
        glowIntensity={glowIntensity}
        backgroundBlur={backgroundBlur}
      />
      <Controls
        config={config}
        glowIntensity={glowIntensity}
        backgroundBlur={backgroundBlur}
        onConfigChange={setConfig}
        onGlowChange={setGlowIntensity}
        onBlurChange={setBackgroundBlur}
      />
    </div>
  );
}

export default App;
