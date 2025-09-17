# Pixel Animation Experiment

Interactive pixel animation experiments featuring two different explosion effects.

## Live Demo

🎆 **[In-Place Fireworks](https://pixel-experiment-6fprf6n7l-andrew-spencer.vercel.app)** (Main)
🌟 **[Radiating Arcs](https://pixel-experiment-6fprf6n7l-andrew-spencer.vercel.app/radiating)** (Alternative)

## Features

### Animation Type 1: Radiating Arc Explosion
**URL**: `/radiating` or `index.html`
- 14 pixels radiate outward from center with curved trajectories
- Smooth arcing paths using physics-based movement
- 5-second animation duration
- Click anywhere to trigger

### Animation Type 2: In-Place Firework Explosion
**URL**: `/` or `/in-place` or `index2.html`
- 6 distributed explosions across the canvas
- 3-phase animation: single pixel → cross → expanded pattern
- Realistic fade-out effect with maintained glow
- Staggered timing for wave effect

## Technical Details

- **Grid System**: Dynamic pixel grid that adapts to screen size
- **Pixel Size**: 5px pixels with 3px gaps
- **Colors**: 
  - Background: `#070707`
  - Default pixels: `#191919`
  - Bright pixels: `#eeeeee`
  - Glow effect: `#3a3a3a`
- **Performance**: 60fps using `requestAnimationFrame`

## Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd pixel-experiment

# Start local server
npm start
# or
python3 -m http.server 3000

# Open browser to:
# http://localhost:3000/index.html - Radiating explosion
# http://localhost:3000/index2.html - In-place firework
```

## Deployment

This project is deployed on Vercel with automatic deployments from the main branch.

## Browser Compatibility

- Modern browsers with ES6+ support
- Tested on Chrome, Firefox, Safari, Edge
- Mobile responsive

## Controls

- **Click anywhere**: Trigger explosion animation
- **Auto-start**: Animation begins 1 second after page load
- **Window resize**: Grid automatically adjusts
