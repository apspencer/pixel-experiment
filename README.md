# Pixel Animation Experiment

Interactive pixel animation experiments featuring two different explosion effects.

## Live Demo

### GitHub Pages (Unlimited Free Access)
🏠 **[Main Hub](https://apspencer.github.io/pixel-experiment/index-main.html)** - Choose Your Animation  
🔄 **[Morphing Patterns](https://apspencer.github.io/pixel-experiment/morphing.html)** - Shape-Shifting Explosions  
🎆 **[In-Place Fireworks](https://apspencer.github.io/pixel-experiment/in-place.html)** - Bloom & Fade Effect  
🌟 **[Radiating Arcs](https://apspencer.github.io/pixel-experiment/radiating.html)** - Curved Trajectories  

### Vercel (Limited Sharing)
🎆 **[In-Place Fireworks](https://pixel-experiment-jo0s0npog-andrew-spencer.vercel.app)** (Main)
🌟 **[Radiating Arcs](https://pixel-experiment-jo0s0npog-andrew-spencer.vercel.app/radiating)** (Alternative)

## Features

### Animation Type 1: Morphing Pattern Explosion
**Files**: `morphing.html`
- 8 scattered explosions across the canvas
- 3-frame morphing sequence: square → plus → diamond
- Each pattern repeats twice (0.6 seconds per explosion)
- Staggered cascade timing with 2-frame delays
- Precise color control with lightest/mid pixel values

### Animation Type 2: Radiating Arc Explosion
**Files**: `radiating.html`, `index.html`
- 14 pixels radiate outward from center with curved trajectories
- Smooth arcing paths using physics-based movement
- 5-second animation duration
- Click anywhere to trigger

### Animation Type 3: In-Place Firework Explosion
**Files**: `in-place.html`, `index2.html`
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
