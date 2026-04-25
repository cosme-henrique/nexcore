type EnvEntry = {
  value: string | undefined;
  required?: boolean;
};

type EnvMap = Record<string, EnvEntry>;

let registeredEnvs: EnvMap = {};

export const EnvService = {
  register(envs: EnvMap): void {
    registeredEnvs = envs;
    EnvService.validate();
  },

  validate(): void {
    const missing: string[] = [];

    for (const [key, entry] of Object.entries(registeredEnvs)) {
      if (entry.required && !entry.value) {
        missing.push(key);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `[nexcore] Env obrigatória não encontrada: ${missing.map((k) => `"${k}"`).join(', ')}`,
      );
    }
  },

  get(key: string): string | undefined {
    return registeredEnvs[key]?.value;
  },

  isProduction(): boolean {
    return registeredEnvs.nodeEnv?.value === 'production';
  },

  isDevelopment(): boolean {
    return registeredEnvs.nodeEnv?.value === 'development';
  },
};
