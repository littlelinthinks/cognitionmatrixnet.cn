/// <reference types="vite/client" />

declare global {
  interface Window {
    __CONFIG__?: {
      siteId?: string;
      [key: string]: string | undefined;
    };
  }
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
