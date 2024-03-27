import {Color} from "../client/model/color";

export class Rgb {
  r: number = 0
  g: number = 0
  b: number = 0

  constructor(color: Color | undefined = undefined) {
    switch (color) {
      case Color.Red:
        this.r = 255
        break
      case Color.Green:
        this.g = 255
        break
      case Color.Blue:
        this.b = 255
        break
      case Color.Yellow:
        this.r = 255
        this.g = 255
        break
      case Color.Purple:
        this.r = 255
        this.b = 255
        break
      case Color.Orange:
        this.r = 255
        this.g = 165
        break
      case Color.Pink:
        this.r = 255
        this.g = 192
        this.b = 203
        break
      case Color.Brown:
        this.r = 165
        this.g = 42
        this.b = 42
        break
      case undefined:
        this.r = 255
        this.g = 255
        this.b = 255
        break
    }
  }

  set(r: number, g: number, b: number) {
    this.r = r
    this.g = g
    this.b = b
  }

  addLowDarkness() {
    this.r = Math.floor(this.r * 0.7)
    this.g = Math.floor(this.g * 0.7)
    this.b = Math.floor(this.b * 0.7)
  }

  addHighDarkness() {
    this.addLowDarkness()
    this.addLowDarkness()
  }

  toCssString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }
}
