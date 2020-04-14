cd ..
echo "Pulling from Stage"
git commit -m "auto commit"
git pull origin stage
npm install
npm run build
pm2 restart zerogravity-backoffice
