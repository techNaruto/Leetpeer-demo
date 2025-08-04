#!/usr/bin/env node

/**
 * Complete build script for deployment
 * Runs the full build process and sets up files for any deployment platform
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Handle different Node.js environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    const child = spawn(command, args, { stdio: 'inherit', shell: true });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    console.log('🚀 Starting complete build for deployment...\n');
    
    // Step 1: Install dependencies
    console.log('📦 Installing dependencies...');
    await runCommand('npm', ['install']);
    
    // Step 2: Build the application
    console.log('\n🔨 Building application...');
    await runCommand('npm', ['run', 'build']);
    
    // Step 3: Set up deployment files
    console.log('\n📁 Setting up deployment files...');
    await runCommand('node', ['deploy-universal.js']);
    
    console.log('\n✅ Build complete! Ready for deployment.');
    console.log('\nTo deploy:');
    console.log('- Render: Use "node build-for-deploy.js" as build command');
    console.log('- Manual: Run "npm start" to start production server');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

main();