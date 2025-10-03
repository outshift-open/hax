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

/**
 * Utility functions for processing file content during component addition
 */

/**
 * Strip license headers only from the TOP of the file, preserving BOM, shebang, and EOL style.
 * Supports block (/* *\/) comments, line (//, #) comments, and HTML (<!-- -->) comments.
 * The header region is removed only if it contains license indicators (incl. SPDX).
 */
export function stripLicenseHeaders(content: string): string {
  if (!content) return content

  // Preserve BOM if present
  const hasBOM = content.charCodeAt(0) === 0xfeff
  let text = hasBOM ? content.slice(1) : content

  const shebangMatch = text.match(/^#![^\r\n]*(\r?\n)/)
  const shebangLine = shebangMatch ? shebangMatch[0] : ""
  if (shebangLine) {
    text = text.slice(shebangLine.length)
  }

  const headerRegionPattern =
    /^(?:\s*(?:\/\*[\s\S]*?\*\/\s*|<!--[\s\S]*?-->\s*|(?:(?:\/\/|#)[^\r\n]*\r?\n))+)+/

  const headerMatch = text.match(headerRegionPattern)
  if (headerMatch) {
    const header = headerMatch[0]
    // Indicators that suggest the header is a license notice
    const licenseIndicators =
      /(spdx-license-identifier|copyright|license|licensed|apache|mit|bsd|gpl|lgpl|agpl|mpl|epl|isc|unlicense|cc0)/i

    if (licenseIndicators.test(header)) {
      text = text.slice(header.length)
    }
  }

  const rebuilt = (hasBOM ? "\uFEFF" : "") + (shebangLine || "") + text
  return rebuilt
}

export function cleanFileContent(content: string): string {
  if (!content) return content

  const eol = content.includes("\r\n") ? "\r\n" : "\n"

  let cleanContent = stripLicenseHeaders(content)

  const leadingBlankLinesPattern = /^(?:\s*(?:\r?\n)){3,}/
  cleanContent = cleanContent.replace(leadingBlankLinesPattern, eol + eol)

  return cleanContent
}
