const esbuild = require('esbuild')

const isWatch = process.argv.includes('--watch')

const buildOptions = {
  entryPoints: ['electron/main.ts', 'electron/preload.ts'],
  bundle: true,
  platform: 'node',
  outdir: 'dist-electron',
  external: ['electron'],
  format: 'cjs',
}

if (isWatch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch()
    console.log('Watching electron files...')
  })
} else {
  esbuild.build(buildOptions)
}
