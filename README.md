# Proyecto Liz (front-liz-ejercicio)

## Install the dependencies

```bash
pnpm install
# or: yarn/npm/bun install
```

### Start the app in development mode (HMR, error reporting, etc.)

```bash
quasar dev
```

### Format & Lint the files

```bash
pnpm run lint
# or: yarn/npm/bun run lint
```

...or just check formatting & linting:

```bash
pnpm run lint:check
# or: yarn/npm/bun run lint:check
```

### Build the app for production

```bash
quasar build
```

## Aplicación de escritorio con Electron

Este repositorio es la interfaz de escritorio. La API se ejecuta desde el
repositorio vecino `/Users/mac1/dev/api-liz-entrenamiento` y escucha, por
defecto, en `http://localhost:8838`.

En una terminal, inicie la API:

```bash
cd /Users/mac1/dev/api-liz-entrenamiento
npm start
```

En otra terminal, ejecute la aplicación de escritorio durante el desarrollo:

```bash
npm run dev:electron
```

Para crear el paquete de escritorio:

```bash
npm run build:electron
```

El resultado se genera en `dist/electron`. Para usar otra instancia de la API,
defina `API_URL` antes de iniciar o compilar el cliente:

```bash
API_URL=http://servidor:8838 npm run dev:electron
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-file).
