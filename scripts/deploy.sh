rm -rf .svelte-kit
rm -rf node_modules
rm -rf package
rm package-lock.json
npm install
# npm install --save --legacy-peer-deps
# npm run build
npm run format
# linklocal
npm run dev:open
