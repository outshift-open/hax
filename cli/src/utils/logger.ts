import boxen from "boxen"
import { cyan, green, red, yellow, blue, magenta, gray } from "kleur/colors"

export const highlighter = {
  error: red,
  warn: yellow,
  info: cyan,
  success: green,
  primary: blue,
  accent: magenta,
  debug: gray,
}

export const logger = {
  error: (msg: string) => console.log(red(msg)),
  warn: (msg: string) => console.log(yellow(msg)),
  info: (msg: string) => console.log(cyan(msg)),
  debug: (msg: string) => console.log(gray(msg)),
  success: (msg: string) => console.log(green(msg)),
  log: (msg: string) => console.log(msg),
  break: () => console.log(""),
}

export function printPanelBox(message: string) {
  console.log(
    boxen(message, {
      padding: 1,
      borderStyle: "round",
      borderColor: "green",
    }),
  )
}
