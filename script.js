// ==========================================
// SHARED GRID MANAGEMENT SYSTEM
// ==========================================

// Global variables for grid management
let pixelsPerRow = 0;
let pixelsPerColumn = 0;
let totalPixels = 0;
let pixelElements = [];

// Calculate how many pixels we need to fill the screen
function createPixelGrid() {
    const container = document.querySelector('.pixel-container');
    
    // Calculate the viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate how many pixels fit horizontally and vertically
    // Each pixel is 5px + 3px gap, except the last one which doesn't need a gap
    const pixelSize = 5;
    const gap = 3;
    const pixelWithGap = pixelSize + gap;
    
    // Calculate grid dimensions accounting for the initial padding
    const availableWidth = viewportWidth - (gap * 2); // Account for left and right padding
    const availableHeight = viewportHeight - (gap * 2); // Account for top and bottom padding
    
    pixelsPerRow = Math.floor((availableWidth + gap) / pixelWithGap);
    pixelsPerColumn = Math.floor((availableHeight + gap) / pixelWithGap);
    
    totalPixels = pixelsPerRow * pixelsPerColumn;
    
    // Clear existing pixels
    container.innerHTML = '';
    pixelElements = [];
    
    // Set the grid template columns and rows
    container.style.gridTemplateColumns = `repeat(${pixelsPerRow}, 5px)`;
    container.style.gridTemplateRows = `repeat(${pixelsPerColumn}, 5px)`;
    
    // Create pixel elements with data attributes for position tracking
    for (let i = 0; i < totalPixels; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        
        // Calculate row and column for this pixel
        const row = Math.floor(i / pixelsPerRow);
        const col = i % pixelsPerRow;
        
        pixel.dataset.row = row;
        pixel.dataset.col = col;
        pixel.dataset.index = i;
        
        container.appendChild(pixel);
        pixelElements.push(pixel);
    }
}

// Get pixel element by row and column
function getPixelAt(row, col) {
    if (row < 0 || row >= pixelsPerColumn || col < 0 || col >= pixelsPerRow) {
        return null;
    }
    const index = row * pixelsPerRow + col;
    return pixelElements[index];
}

// Illuminate a pixel with the specified color
function illuminatePixel(row, col, color) {
    const pixel = getPixelAt(row, col);
    if (pixel) {
        pixel.style.backgroundColor = color;
    }
}

// Reset a pixel to default color
function resetPixel(row, col) {
    const pixel = getPixelAt(row, col);
    if (pixel) {
        pixel.style.backgroundColor = '#191919';
    }
}

// Illuminate a pixel and its adjacent pixels with glow effect
function illuminateWithGlow(row, col) {
    // Main pixel - bright white
    illuminatePixel(row, col, '#eeeeee');
    
    // Adjacent pixels - dimmer glow
    const adjacent = [
        [row-1, col-1], [row-1, col], [row-1, col+1],
        [row, col-1],                 [row, col+1],
        [row+1, col-1], [row+1, col], [row+1, col+1]
    ];
    
    adjacent.forEach(([r, c]) => {
        illuminatePixel(r, c, '#3a3a3a');
    });
}

// Clear illumination from a pixel and its glow
function clearIllumination(row, col) {
    // Reset main pixel
    resetPixel(row, col);
    
    // Reset adjacent pixels
    const adjacent = [
        [row-1, col-1], [row-1, col], [row-1, col+1],
        [row, col-1],                 [row, col+1],
        [row+1, col-1], [row+1, col], [row+1, col+1]
    ];
    
    adjacent.forEach(([r, c]) => {
        resetPixel(r, c);
    });
}

// ==========================================
// ANIMATION TYPE 1: RADIATING ARC EXPLOSION
// ==========================================

// Animation system for exploding pixels with predetermined arc trajectories
class ExplodingPixel {
    constructor(startRow, startCol, directionX, directionY, speed = 1) {
        this.startRow = startRow;
        this.startCol = startCol;
        this.currentRow = startRow;
        this.currentCol = startCol;
        
        // Speed adjusted for 5-second animation
        this.speed = (speed * 1.6) * (0.8 + Math.random() * 0.4); // Random speed variation
        
        // Arc parameters - define the curve at creation time
        this.arcRadius = (Math.random() - 0.5) * 6; // How much the path curves (-3 to 3)
        this.baseAngle = Math.atan2(directionY, directionX); // Initial direction angle
        this.totalDistance = 0; // Distance traveled along the arc
        
        // Calculate perpendicular direction for the curve
        this.perpAngle = this.baseAngle + Math.PI / 2;
        
        this.active = true;
        this.frameCount = 0;
    }
    
    update() {
        if (!this.active) return;
        
        // Clear current position
        clearIllumination(Math.round(this.currentRow), Math.round(this.currentCol));
        
        // Move forward along the predetermined arc
        this.totalDistance += this.speed;
        
        // Calculate position along the arc
        // The arc is defined as: straight line + perpendicular offset that increases over distance
        const straightX = Math.cos(this.baseAngle) * this.totalDistance;
        const straightY = Math.sin(this.baseAngle) * this.totalDistance;
        
        // Add curved offset that grows quadratically with distance for smooth arc
        const curveFactor = (this.totalDistance * this.totalDistance) * 0.001; // Quadratic curve
        const curveX = Math.cos(this.perpAngle) * this.arcRadius * curveFactor;
        const curveY = Math.sin(this.perpAngle) * this.arcRadius * curveFactor;
        
        // Final position is straight movement + curve offset
        this.currentRow = this.startRow + straightY + curveY;
        this.currentCol = this.startCol + straightX + curveX;
        
        this.frameCount++;
        
        // Check if pixel is still on canvas
        const roundedRow = Math.round(this.currentRow);
        const roundedCol = Math.round(this.currentCol);
        
        if (roundedRow < -3 || roundedRow > pixelsPerColumn + 2 || 
            roundedCol < -3 || roundedCol > pixelsPerRow + 2) {
            this.active = false;
            return;
        }
        
        // Illuminate new position
        illuminateWithGlow(roundedRow, roundedCol);
    }
    
    isActive() {
        return this.active;
    }
    
    cleanup() {
        if (!this.active) {
            clearIllumination(Math.round(this.currentRow), Math.round(this.currentCol));
        }
    }
}

// Radiating explosion animation manager
let explosionPixels = [];
let animationFrameId = null;

function createExplosion() {
    // Clear any existing explosion
    explosionPixels.forEach(pixel => pixel.cleanup());
    explosionPixels = [];
    
    // Calculate center of screen
    const centerRow = Math.floor(pixelsPerColumn / 2);
    const centerCol = Math.floor(pixelsPerRow / 2);
    
    // Create 8 pixels in different directions (8-directional explosion)
    const directions = [
        { x: 1, y: 0 },     // Right
        { x: -1, y: 0 },    // Left
        { x: 0, y: 1 },     // Down
        { x: 0, y: -1 },    // Up
        { x: 1, y: 1 },     // Down-Right
        { x: -1, y: 1 },    // Down-Left
        { x: 1, y: -1 },    // Up-Right
        { x: -1, y: -1 }    // Up-Left
    ];
    
    // Add the 8 directional pixels
    directions.forEach(dir => {
        const pixel = new ExplodingPixel(centerRow, centerCol, dir.x, dir.y, 1.5);
        explosionPixels.push(pixel);
    });
    
    // Add 6 more pixels with completely random directions and stronger arcs
    for (let i = 0; i < 6; i++) {
        // Generate random direction angles
        const angle = Math.random() * Math.PI * 2;
        const randomX = Math.cos(angle);
        const randomY = Math.sin(angle);
        
        const randomPixel = new ExplodingPixel(centerRow, centerCol, randomX, randomY, 1.5);
        
        // Give these random pixels more dramatic arcs
        randomPixel.arcRadius *= 2; // Double the arc radius for more dramatic curves
        
        explosionPixels.push(randomPixel);
    }
    
    // Start animation
    startExplosionAnimation();
}

function startExplosionAnimation() {
    function animate() {
        // Update all active pixels
        explosionPixels.forEach(pixel => pixel.update());
        
        // Remove inactive pixels
        explosionPixels = explosionPixels.filter(pixel => pixel.isActive());
        
        // Continue animation if there are still active pixels
        if (explosionPixels.length > 0) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            animationFrameId = null;
        }
    }
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animate();
}

// Trigger explosion on click or automatically
function triggerExplosion() {
    if (pixelsPerRow > 0 && pixelsPerColumn > 0) {
        createExplosion();
    }
}

// Create the initial grid
createPixelGrid();

// Recreate grid on window resize
window.addEventListener('resize', () => {
    createPixelGrid();
    // Clear any ongoing animations when resizing
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    explosionPixels = [];
});

// Click event is now handled by initializeAnimation() function

// ==========================================
// ANIMATION TYPE 2: IN-PLACE EXPANDING EXPLOSION
// ==========================================

// In-place explosion animation manager
let inPlaceExplosionsActive = false;
let inPlaceAnimationFrameId = null;
let activeExplosions = [];

// Class for managing an in-place explosion pattern with fade effect
class InPlaceExplosion {
    constructor(centerRow, centerCol) {
        this.centerRow = centerRow;
        this.centerCol = centerCol;
        this.phase = 0; // 0: single pixel, 1: cross pattern, 2: expanding, 3: fade out
        this.frameCount = 0;
        this.fadeIntensity = 1.0; // 1.0 = full bright, 0.0 = dark
        this.active = true;
        
        // Pattern definitions for each phase - very compact
        this.patterns = {
            0: [[0, 0]], // Single center pixel
            1: [ // Tiny cross pattern
                [0, 0],   // Center
                [-1, 0],  // Up
                [1, 0],   // Down
                [0, -1],  // Left
                [0, 1]    // Right
            ],
            2: [ // Small final pattern - only 9 pixels total
                [0, 0],   // Center
                [-1, 0], [1, 0], [0, -1], [0, 1], // Cross
                [-1, -1], [-1, 1], [1, -1], [1, 1] // Corners
            ]
        };
    }
    
    update() {
        if (!this.active) return;
        
        // Skip if we haven't reached start time yet
        if (this.frameCount < 0) {
            this.frameCount++;
            return;
        }
        
        // Clear previous pattern
        this.clearCurrentPattern();
        
        // Phase timing - very fast with more fade frames
        if (this.frameCount < 4) {
            // Phase 0: Single pixel (frames 0-3)
            this.phase = 0;
            this.fadeIntensity = 1.0;
        } else if (this.frameCount < 8) {
            // Phase 1: Cross pattern (frames 4-7)
            this.phase = 1;
            this.fadeIntensity = 1.0;
        } else if (this.frameCount < 12) {
            // Phase 2: Full expanded pattern (frames 8-11)
            this.phase = 2;
            this.fadeIntensity = 1.0;
        } else if (this.frameCount < 36) {
            // Phase 3: Fade out (frames 12-35) - 24 frames of fade
            this.phase = 2; // Keep the same pattern, just fade it
            // Gradual fade from 1.0 to 0.0 over 24 frames
            const fadeProgress = (this.frameCount - 12) / 24;
            this.fadeIntensity = 1.0 - fadeProgress;
        } else {
            // Animation ends
            this.active = false;
        }
        
        // Display current pattern with fade effect
        if (this.frameCount >= 0) {
            this.displayCurrentPattern();
        }
        
        this.frameCount++;
    }
    
    // No longer needed since patterns are predefined
    
    displayCurrentPattern() {
        const pattern = this.patterns[this.phase];
        
        pattern.forEach(([rowOffset, colOffset]) => {
            const row = this.centerRow + rowOffset;
            const col = this.centerCol + colOffset;
            
            // Calculate faded colors while maintaining glow relationship
            const brightColor = this.getFadedBrightColor();
            const glowColor = this.getFadedGlowColor();
            
            // Always maintain the glow effect - bright pixel with darker adjacent
            illuminatePixel(row, col, brightColor);
            this.illuminateAdjacentDim(row, col, glowColor);
        });
    }
    
    // Get the faded bright color based on fade intensity
    getFadedBrightColor() {
        const intensity = this.fadeIntensity;
        
        if (intensity >= 0.9) return '#eeeeee'; // Full bright
        if (intensity >= 0.8) return '#dddddd';
        if (intensity >= 0.7) return '#cccccc';
        if (intensity >= 0.6) return '#bbbbbb';
        if (intensity >= 0.5) return '#aaaaaa';
        if (intensity >= 0.4) return '#999999';
        if (intensity >= 0.3) return '#888888';
        if (intensity >= 0.2) return '#777777';
        if (intensity >= 0.1) return '#555555';
        if (intensity > 0) return '#333333';
        return '#191919'; // Background color
    }
    
    // Get the faded glow color - always darker than bright color
    getFadedGlowColor() {
        const intensity = this.fadeIntensity;
        
        if (intensity >= 0.9) return '#3a3a3a'; // Normal glow
        if (intensity >= 0.8) return '#353535';
        if (intensity >= 0.7) return '#303030';
        if (intensity >= 0.6) return '#2b2b2b';
        if (intensity >= 0.5) return '#262626';
        if (intensity >= 0.4) return '#212121';
        if (intensity >= 0.3) return '#1e1e1e';
        if (intensity >= 0.2) return '#1b1b1b';
        if (intensity >= 0.1) return '#1a1a1a';
        if (intensity > 0) return '#191919';
        return '#191919'; // Background color
    }
    
    // Helper function for dimmer adjacent pixel illumination
    illuminateAdjacentDim(row, col, color) {
        const adjacent = [
            [row-1, col-1], [row-1, col], [row-1, col+1],
            [row, col-1],                 [row, col+1],
            [row+1, col-1], [row+1, col], [row+1, col+1]
        ];
        
        adjacent.forEach(([r, c]) => {
            illuminatePixel(r, c, color);
        });
    }
    
    clearCurrentPattern() {
        // Clear only the 3x3 area around the center (much smaller)
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                const row = this.centerRow + rowOffset;
                const col = this.centerCol + colOffset;
                clearIllumination(row, col);
            }
        }
    }
    
    isActive() {
        return this.active;
    }
    
    cleanup() {
        this.clearCurrentPattern();
    }
}

// Generate well-distributed random positions across the canvas
function generateDistributedPositions(count) {
    const positions = [];
    
    // Divide canvas into a grid to ensure good distribution
    const gridCols = Math.ceil(Math.sqrt(count * (pixelsPerRow / pixelsPerColumn)));
    const gridRows = Math.ceil(count / gridCols);
    
    const cellWidth = Math.floor(pixelsPerRow / gridCols);
    const cellHeight = Math.floor(pixelsPerColumn / gridRows);
    
    // Add margin to avoid edge explosions
    const margin = 5;
    
    for (let i = 0; i < count; i++) {
        const gridRow = Math.floor(i / gridCols);
        const gridCol = i % gridCols;
        
        // Random position within each grid cell
        const minRow = gridRow * cellHeight + margin;
        const maxRow = Math.min((gridRow + 1) * cellHeight - margin, pixelsPerColumn - margin);
        const minCol = gridCol * cellWidth + margin;
        const maxCol = Math.min((gridCol + 1) * cellWidth - margin, pixelsPerRow - margin);
        
        const row = Math.floor(Math.random() * (maxRow - minRow)) + minRow;
        const col = Math.floor(Math.random() * (maxCol - minCol)) + minCol;
        
        positions.push({ row, col });
    }
    
    return positions;
}

// Create multiple in-place explosions
function createInPlaceExplosions() {
    if (inPlaceExplosionsActive) return;
    
    // Generate 6 well-distributed positions
    const positions = generateDistributedPositions(6);
    
    // Create explosions with staggered start times
    positions.forEach((pos, index) => {
        const explosion = new InPlaceExplosion(pos.row, pos.col);
        
        // Stagger the start of each explosion slightly for more organic feel
        explosion.startDelay = index * 3; // 3 frame delay between each explosion
        explosion.frameCount = -explosion.startDelay; // Start with negative frame count
        
        activeExplosions.push(explosion);
    });
    
    inPlaceExplosionsActive = true;
    
    function animate() {
        // Update all active explosions
        activeExplosions.forEach(explosion => explosion.update());
        
        // Remove finished explosions
        activeExplosions = activeExplosions.filter(explosion => {
            if (!explosion.isActive()) {
                explosion.cleanup();
                return false;
            }
            return true;
        });
        
        // Continue animation if there are still active explosions
        if (activeExplosions.length > 0) {
            inPlaceAnimationFrameId = requestAnimationFrame(animate);
        } else {
            inPlaceExplosionsActive = false;
            inPlaceAnimationFrameId = null;
        }
    }
    
    animate();
}

// Trigger in-place explosions
function triggerInPlaceExplosion() {
    if (pixelsPerRow > 0 && pixelsPerColumn > 0 && !inPlaceExplosionsActive) {
        createInPlaceExplosions();
    }
}

// ==========================================
// ANIMATION SELECTION AND INITIALIZATION
// ==========================================

// Determine which animation to use based on the page
function initializeAnimation() {
    const pathname = window.location.pathname;
    const title = document.title;
    const filename = pathname.split('/').pop() || 'index.html';
    
    // Check for in-place animation indicators
    const isInPlaceAnimation = filename.includes('index2') || 
                              filename.includes('in-place') || 
                              title.includes('In-Place') ||
                              title.includes('Firework');
    
    // Check for radiating animation indicators  
    const isRadiatingAnimation = filename.includes('index.html') ||
                                filename.includes('radiating') ||
                                title.includes('Radiating') ||
                                title.includes('Arc');
    
    console.log('Animation Detection:', {
        pathname,
        filename,
        title,
        isInPlaceAnimation,
        isRadiatingAnimation
    });
    
    if (isInPlaceAnimation && !isRadiatingAnimation) {
        // Use in-place explosion
        console.log('Loading: In-Place Firework Explosions');
        document.addEventListener('click', triggerInPlaceExplosion);
        
        setTimeout(() => {
            triggerInPlaceExplosion();
        }, 1000);
    } else if (isRadiatingAnimation || filename === 'index.html') {
        // Use radiating explosion (default for index.html)
        console.log('Loading: Radiating Arc Explosions');
        document.addEventListener('click', triggerExplosion);
        
        setTimeout(() => {
            triggerExplosion();
        }, 1000);
    } else {
        // Fallback to radiating explosion
        console.log('Loading: Default Radiating Arc Explosions');
        document.addEventListener('click', triggerExplosion);
        
        setTimeout(() => {
            triggerExplosion();
        }, 1000);
    }
}

// Initialize the appropriate animation
initializeAnimation();
