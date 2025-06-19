const { spawn } = require('child_process');
const path = require('path');

// Absolute paths to config and test directory
const testDir = path.resolve(__dirname, '../../Front/__tests__');
const jestConfig = path.resolve(__dirname, '../../front/jest.config.cjs');

// Run Jest with pretty options
const jest = spawn('npx', [
  'jest',
  '--config', jestConfig,
  '--colors',
  '--verbose',         // <- shows each test and status
  testDir
], { stdio: 'inherit', shell: true });

jest.on('exit', (code) => {
  if (code === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.error('\n❌ Some tests failed.');
    process.exit(code);
  }
});

