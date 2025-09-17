# ASCII Art Component Development Plan

## Project Overview
Creating a React component that converts static images and videos into ASCII art with real-time effect controls, inspired by the 21st.dev codex art implementation.

## Setup Strategy (5 mins)
- **Vite + React + TypeScript** (fastest dev setup, hot reload)
- **Tailwind CSS** (matches original code style)
- **Minimal dependencies** (just React, no heavy libraries)

## Component Structure (Clean & Modular)
```
src/
├── components/
│   ├── ASCIIArt.tsx          # Main component
│   ├── Controls.tsx          # Effect controls panel
│   └── hooks/
│       └── useWindowSize.ts  # Existing responsive hook
├── utils/
│   └── asciiConverter.ts     # Core ASCII logic
└── App.tsx                   # Simple container
```

## Technical Approach (Performance + Simplicity)

### ASCII Conversion
- Canvas API to read image/video pixels
- Configurable pixel sampling (sparsity control)
- Character brightness mapping
- Render to DOM elements (easier styling than canvas text)

### Effects System
- **Glow**: CSS `text-shadow` (simple, performant)
- **Background blur**: CSS `backdrop-filter` (native browser)
- **Sparsity**: Skip pixels during sampling (performance boost)

## Progressive Implementation (Risk Reduction)

### Phase 1: Static Image + Basic ASCII ✅
- Basic image upload and ASCII conversion
- Canvas-based pixel sampling
- Simple character mapping

### Phase 2: Add Control Sliders ✅
- Real-time sparsity adjustment
- Glow intensity control
- Background blur control

### Phase 3: Video Support ✅
- Same algorithm applied to video frames
- Real-time video processing
- Performance optimizations

### Phase 4: Effect Polish ✅
- Fine-tune visual effects
- Optimize performance
- Add additional character sets

## Key Advantages
- Uses existing responsive pattern from original code
- Pure web standards (no external dependencies)
- Real-time controls via React state
- Easy video upgrade path
- CSS handles heavy lifting for effects

## Implementation Details

### Core Algorithm
1. Load image/video into hidden canvas
2. Sample pixels at configurable intervals (sparsity)
3. Convert brightness to ASCII characters
4. Render as styled DOM elements
5. Apply CSS effects (glow, blur)

### Character Mapping
```javascript
const ASCII_CHARS = '@%#*+=-:. ';
// Map pixel brightness (0-255) to character index
```

### Performance Considerations
- Use requestAnimationFrame for video processing
- Implement pixel sampling to reduce computation
- Debounce control updates
- Use CSS transforms for smooth effects

## Files to Create
- **Total files:** ~6 files
- **External dependencies:** 0 (beyond React setup)
- **Estimated build time:** 30-45 minutes

## Development Workflow
1. Set up Vite project with TypeScript
2. Create basic component structure
3. Implement ASCII conversion utility
4. Build main ASCIIArt component
5. Add effect controls
6. Test with static images
7. Add video support
8. Polish and optimize