/**
 * Process Manager for the Backend Server
 * This script keeps the server running and automatically restarts it if it crashes
 */

const { spawn } = require('child_process');
const path = require('path');

class ServerManager {
  constructor() {
    this.serverProcess = null;
    this.restartCount = 0;
    this.maxRestarts = 10;
    this.restartDelay = 5000; // 5 seconds
    this.isShuttingDown = false;
  }

  start() {
    console.log('🚀 Starting server manager...');
    console.log(`📁 Working directory: ${process.cwd()}`);
    console.log(`🔧 Node.js version: ${process.version}`);
    
    this.spawnServer();
    
    // Handle process termination
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
  }

  spawnServer() {
    if (this.isShuttingDown) return;

    console.log(`\n🔄 Starting server (attempt ${this.restartCount + 1}/${this.maxRestarts})...`);
    
    this.serverProcess = spawn('node', ['server.js'], {
      stdio: 'inherit',
      cwd: __dirname
    });

    this.serverProcess.on('error', (error) => {
      console.error('❌ Failed to start server:', error.message);
      this.handleServerExit(1);
    });

    this.serverProcess.on('exit', (code) => {
      console.log(`\n📊 Server exited with code ${code}`);
      this.handleServerExit(code);
    });

    // Handle server output
    this.serverProcess.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });

    this.serverProcess.stderr?.on('data', (data) => {
      process.stderr.write(data);
    });
  }

  handleServerExit(code) {
    if (this.isShuttingDown) {
      console.log('👋 Server manager shutting down...');
      process.exit(0);
    }

    if (code === 0) {
      console.log('✅ Server exited normally');
      process.exit(0);
    }

    this.restartCount++;
    
    if (this.restartCount >= this.maxRestarts) {
      console.error(`❌ Server crashed ${this.maxRestarts} times. Stopping restart attempts.`);
      console.error('💡 Check the server logs for errors and fix the issues.');
      process.exit(1);
    }

    console.log(`⏳ Restarting server in ${this.restartDelay / 1000} seconds...`);
    
    setTimeout(() => {
      this.spawnServer();
    }, this.restartDelay);
  }

  shutdown() {
    console.log('\n🛑 Shutting down server manager...');
    this.isShuttingDown = true;
    
    if (this.serverProcess) {
      console.log('📤 Sending SIGTERM to server process...');
      this.serverProcess.kill('SIGTERM');
      
      // Force kill after 10 seconds
      setTimeout(() => {
        if (this.serverProcess) {
          console.log('💥 Force killing server process...');
          this.serverProcess.kill('SIGKILL');
        }
        process.exit(0);
      }, 10000);
    } else {
      process.exit(0);
    }
  }
}

// Start the server manager
const manager = new ServerManager();
manager.start();











