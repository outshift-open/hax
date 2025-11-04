const { execSync } = require('child_process');
const path = require('path');

describe('HAX CLI', () => {
  const cliPath = path.join(__dirname, '..', 'cli.js');

  test('CLI should show help when --help flag is used', () => {
    const output = execSync(`node ${cliPath} --help`, { encoding: 'utf8' });
    expect(output).toContain('Usage:');
  });

  test('CLI should show version when --version flag is used', () => {
    const output = execSync(`node ${cliPath} --version`, { encoding: 'utf8' });
    expect(output.trim()).toMatch(/\d+\.\d+\.\d+/);
  });

  test('CLI should handle invalid command gracefully', () => {
    try {
      execSync(`node ${cliPath} invalid-command`, { encoding: 'utf8', stdio: 'pipe' });
    } catch (error) {
      expect(error.status).toBe(1);
    }
  });

  test('CLI executable exists and is accessible', () => {
    expect(() => {
      execSync(`node ${cliPath} --help`, { encoding: 'utf8' });
    }).not.toThrow();
  });
});
