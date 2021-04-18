declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    NODE_ENV: string;
    GITHUB_PERSONAL_ACCESS_TOKEN: string;
  }
}
