import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"
import { Parameter } from "@copilotkit/shared"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function zodToCopilotParameters<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  description?: string,
): Parameter[] {
  const shape = schema.shape

  return Object.entries(shape).map(([key, value]): Parameter => {
    const required = !value.isOptional()
    const zodDesc = value._def?.description
    const paramDesc = zodDesc || description

    if (value instanceof z.ZodString) {
      return {
        name: key,
        type: "string",
        description: paramDesc,
        required,
      }
    }

    if (value instanceof z.ZodNumber) {
      return {
        name: key,
        type: "number",
        description: paramDesc,
        required,
      }
    }

    if (value instanceof z.ZodBoolean) {
      return {
        name: key,
        type: "boolean",
        description: paramDesc,
        required,
      }
    }

    if (value instanceof z.ZodArray) {
      const elementType = value.element
      if (elementType instanceof z.ZodObject) {
        return {
          name: key,
          type: "object[]",
          description: paramDesc,
          required,
          attributes: zodToCopilotParameters(elementType),
        }
      }

      const arrayType =
        elementType instanceof z.ZodString
          ? "string[]"
          : elementType instanceof z.ZodNumber
            ? "number[]"
            : elementType instanceof z.ZodBoolean
              ? "boolean[]"
              : "string[]"

      return {
        name: key,
        type: arrayType,
        description: paramDesc,
        required,
      }
    }

    if (value instanceof z.ZodObject) {
      return {
        name: key,
        type: "object",
        description: paramDesc,
        required,
        attributes: zodToCopilotParameters(value),
      }
    }

    // Fallback to string for unknown types
    return {
      name: key,
      type: "string",
      description: paramDesc,
      required,
    }
  })
}

export function createLoggingWrapper<T extends object>(
  target: T,
  name: string = "OpenAIAdapter",
): T {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver)

      if (typeof originalValue === "function") {
        return async function (...args: unknown[]) {
          console.log(`[${name}] Calling method: ${String(prop)}`)
          console.log(`[${name}] Arguments:`, JSON.stringify(args, null, 2))

          try {
            const result = await originalValue.apply(target, args)
            console.log(`[${name}] Success:`, JSON.stringify(result, null, 2))
            return result
          } catch (error) {
            console.error(`[${name}] Error:`, error)
            throw error
          }
        }
      }

      return originalValue
    },
  })
}
