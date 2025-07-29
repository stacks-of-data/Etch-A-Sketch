const Status = {
    INPUT_EMPTY: 0,
    SUCCESS: 1,
    INVALID_INT: 2
}

const Colors = {
    WHITE: 0,
    RED: 1,
    BLACK: 2,
    GREEN: 3,
    BLUE: 4,
    MAGENTA: 5,
    YELLOW: 6,
    CYAN: 7,
}

sizeSpan = document.getElementById("size")
brightnessRange = document.getElementById("brightnessRange")
randomColors = document.getElementById("randomColors")
canvas = document.getElementById("sketch")
ctx = this.canvas.getContext("2d")

function unpackRGB(raw) {
    return [raw >> 16, raw >> 8 & 0xFF, raw & 0xFF]
}

function packRGB(rgb) {
    return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]
}

function multiRGB(rgb, val) {
    return [rgb[0] * val, rgb[1] * val, rgb[2] * val]
}

class Sketch {
    constructor() {
        this.sketchSize = 0;
        this.pixelsData = new Uint32Array();
        this.selectedColor = Colors.RED
        this.colors = [
            0xFFFFFF,
            0xFF0000,
            0x000000,
            0x008000,
            0x0000FF,
            0xFF00FF,
            0xFFFF00,
            0x00FFFF
        ]
        this.pixelRowSize = 0
        this.pixelColSize = 0
        this.randColor = randomColors.checked
        console.log(randomColors.value)
        this.brightness = brightnessRange.value / 100
    }
    updateSizes() {
        if (this.sketchSize === 0) {
            canvas.style.width = (window.innerWidth / 2) + "px"
            canvas.style.height = (window.innerHeight / 2) + "px"
            canvas.width = (window.innerWidth / 2)
            canvas.height = (window.innerHeight / 2)
        }
        else {
            const trueWidth = Math.floor((window.innerWidth / 2) / this.sketchSize) * this.sketchSize
            const trueHeight = Math.floor((window.innerHeight / 2) / this.sketchSize) * this.sketchSize
            canvas.style.width = trueWidth + "px"
            canvas.style.height = trueHeight + "px"
            canvas.width = trueWidth
            canvas.height = trueHeight
            this.pixelRowSize = canvas.height / sketch.sketchSize
            this.pixelColSize = canvas.width / sketch.sketchSize
        }
        sizeSpan.innerHTML = this.sketchSize + " x " + this.sketchSize
    }
    setColor(val) {
        this.selectedColor = val
    }
    getPixel(row, col) {
        return this.pixelsData[row * this.sketchSize + col]
    }
    setPixel(row, col, val) {
        this.pixelsData[row * this.sketchSize + col] = val
    }
    setColor(color) {
        this.selectedColor = color
    }
    renderSketch() {
        if (this.sketchSize === 0)
        {
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
            return
        }
        for (let row = 0; row < this.sketchSize; row++) {
            for (let col = 0; col < this.sketchSize; col++) {
                ctx.fillStyle = "#" + this.getPixel(row, col).toString(16).padStart(6, '0')
                ctx.fillRect(col * this.pixelColSize, row * this.pixelRowSize, this.pixelColSize, this.pixelRowSize)
            }
        }
    }
    clearSketch() {
        this.pixelsData.fill(this.colors[Colors.WHITE])
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    }
    validateSketchSize(input) {
        if (input === "")
            return Status.INPUT_EMPTY
        const inputNum = Number(input)
        if (Number.isInteger(inputNum) && inputNum > -1 && inputNum < 101)
            return Status.SUCCESS
        return Status.INVALID_INT
    }
    generateSketch() {
        let msg = "Enter canvas size"

        while (true)
        {
            const input = prompt(msg)
            if (input === null)
                return
            const status = this.validateSketchSize(input)
            if (status === Status.SUCCESS)
            {
                this.sketchSize = Number(input);
                this.pixelsData = new Uint32Array(this.sketchSize ** 2)
                this.updateSizes()
                this.clearSketch()
                return
            }
            if (status == Status.INPUT_EMPTY)
                msg = "Input is empty, try again"
            else
                msg = "Invalid Int or invalid number range, try again"
        }
    }
    colorPixel(y, x) {
        if (this.sketchSize === 0)
            return

        const row = Math.floor(y / this.pixelRowSize)
        const col = Math.floor(x / this.pixelColSize)

        if (this.selectedColor !== this.getPixel(row, col))
        {
            let color;
            if (this.randColor)
                color = Math.floor(Math.random() * 0xFFFFFF)
            else
                color = this.colors[this.selectedColor]
            const rgb = unpackRGB(color)
            color = packRGB(multiRGB(rgb, this.brightness))
            this.setPixel(row, col, color)
            ctx.fillStyle = "#" + color.toString(16).padStart(6, '0')
            ctx.fillRect(col * this.pixelColSize, row * this.pixelRowSize, this.pixelColSize, this.pixelRowSize)
        }
    }
}

let sketch = new Sketch()

sketch.updateSizes()
sketch.clearSketch();

canvas.addEventListener("mousemove", function(event) {
    sketch.colorPixel(event.offsetY, event.offsetX)
})

window.addEventListener("resize", function(event) {
    sketch.updateSizes()
    sketch.renderSketch()
})

brightnessRange.addEventListener("change", function(event) {
    sketch.brightness = event.target.value / 100
})

randomColors.addEventListener("change", function(event) {
    sketch.randColor = !sketch.randColor
})