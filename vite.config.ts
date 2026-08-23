import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const getBase = () => {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) {
    return "/";
  }

  const [, repositoryName] = repository.split("/");
  return repositoryName.endsWith(".github.io") ? "/" : `/${repositoryName}/`;
};

// https://vite.dev/config/
export default defineConfig({
  base: getBase(),
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
