# nermal
A testing ground for a Danula map

# Build instructions:
1.  **Install dependencies:**
    Make sure you have Node.js and npm installed. Then, run the following command in the project's root directory to install the necessary development dependencies (that is, TypeScript + the Sass compiler):
    ```sh
    npm install
    ```
2.  **Compile TypeScript:**
    Compile the TypeScript code (`scripts/nermal.ts`) into JavaScript (`scripts/nermal.js`). 
    The `npm run build` script uses the TypeScript compiler (`tsc`) as configured in the `package.json` file:
    ```sh
    npm run build
    ```
    Compile the SCSS styles (`styles/styles.scss`) into CSS (`styles/styles.css`):
    The `npm run sass:build` script uses the Sass compiler to process SCSS files into CSS:
    ```sh
    npm run sass:build
    ```
4.  **Run the application:**
    Open the `index.html` file in your web browser. You can either open it directly from the file system or use a local server (e.g., `npx serve` or any other HTTP server).

**Notes:**
*   To automatically recompile TypeScript on changes: `npm run watch` (uses `tsc --watch` to monitor and recompile TypeScript files).
*   To automatically recompile Sass on changes: `npm run sass` (uses the Sass compiler in watch mode to monitor and recompile SCSS files).