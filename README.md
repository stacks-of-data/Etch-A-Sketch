# Etch-A-Sketch
In the following project I had to implement basic grid based drawing with HTML and Javascript.
# Implementation
A canvas element is created then its size is modified in script based on window size so it can be flexable,
then to draw the grid elements fillRect was used to fill an area in the canvas with specific color, grid elements colors
are stored in Uint32Array for optimized access, For brightness control color channels are extracted then multipled
with the brightness properity then all the color channels are packed in single raw value, For color randomization
Math.random was used and its value is clamped at 0xFFFFFF.
# Supported Features
* Basic color selector: The ability to select multiple defined colors.
* Color brightness control: The multiplication of color channels with brightness properity.
* Color randomizer: The generation of random colors with Math.random.
