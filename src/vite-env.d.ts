/// <reference types="vite/client" />

// Allow importing JSON files
declare module "*.json" {
  const value: any;
  export default value;
}
