declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_BASE_URL: string;
    BASE_URL: string;
    NEXT_PUBLIC_WEBSITE_URL: string;
    NEXT_PUBLIC_DB_NAME: string;
    NEXT_PUBLIC_STORE_NAME: string;
    NEXT_PUBLIC_DB_VERSION: number;
  }
}
