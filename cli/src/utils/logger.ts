/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

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
