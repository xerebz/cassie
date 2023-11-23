cassie:
  @ clear && sudo OW=$OW node cassie.js || true

lint:
  npx eslint *.js --fix
