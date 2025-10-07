cd /var/www/americaworking.co || {
  echo "❌ Failed to change directory. Exiting..."
  exit 1
}

echo "📥 Pulling latest code..."
GIT_SSH_COMMAND="ssh -i /var/www/my_ssh_key" git reset --hard HEAD && \
GIT_SSH_COMMAND="ssh -i /var/www/my_ssh_key" git clean -fd && \
GIT_SSH_COMMAND="ssh -i /var/www/my_ssh_key" git pull || {
  echo "❌ Git pull failed. Restarting PM2 with previous version..."
  exit 1
}

echo "📦 Installing dependencies..."
pnpm install || {
  echo "❌ pnpm install failed. Restarting PM2 with previous version..."
  exit 1
}

echo "🔧 Running Prisma commands..."
npx prisma db push || {
  echo "❌ Prisma DB push failed. Restarting PM2 with previous version..."
  exit 1
}
npx prisma generate || {
  echo "❌ Prisma generate failed. Restarting PM2 with previous version..."
  exit 1
}

echo "🔄 Backing up current .next..."
cp -r .next .next_backup || echo "⚠️ No .next folder to back up, continuing..."

echo "🧹 Cleaning .next folder..."
rm -rf .next

echo "⚙️ Building project..."
pnpm run build || {
  echo "❌ Build failed. Restoring previous .next folder..."
  rm -rf .next
  mv .next_backup .next || echo "⚠️ Failed to restore .next from backup."
  pm2 restart americaworking.co.ports=3001
  exit 1
}

echo "🧹 Removing .next_backup backup..."
rm -rf .next_backup

echo "🟢 Restarting PM2 apps..."
pm2 restart americaworking.co.ports=3001

echo "💾 Saving PM2 process list..."
pm2 save

echo "✅ Deployment finished!"
