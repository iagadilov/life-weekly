/**
 * Reset AsyncStorage Script
 * Run: node reset-storage.js
 */

const { execSync } = require('child_process');

console.log('🗑️  Resetting app storage...\n');

try {
  // Method 1: Clear Metro bundler cache
  console.log('1. Clearing Metro bundler cache...');
  execSync('rm -rf /tmp/metro-*', { stdio: 'inherit' });
  console.log('✅ Metro cache cleared\n');

  // Method 2: Reset iOS simulator
  console.log('2. Resetting iOS Simulator...');
  console.log('   Note: This will erase ALL simulator data\n');

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('   Do you want to erase all simulator data? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('\n   Erasing all simulators...');
      execSync('xcrun simctl erase all', { stdio: 'inherit' });
      console.log('✅ All simulators erased\n');
    } else {
      console.log('\n⏭️  Skipping simulator reset\n');
    }

    // Method 3: Clean build
    console.log('3. Cleaning iOS build...');
    execSync('cd ios && xcodebuild clean', { stdio: 'inherit' });
    console.log('✅ Build cleaned\n');

    console.log('✨ Done! Run "npm run ios" to restart the app with fresh state.\n');
    readline.close();
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
