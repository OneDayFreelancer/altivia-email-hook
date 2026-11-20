import type { ServerProperty } from "@/shared/config/ServerProperty.js"

export const ServerConfig = {
  loadConfig(env: NodeJS.ProcessEnv = process.env): ServerProperty {
    return {
      port: Number(env.PORT ?? 3000),
    }
  },
}
