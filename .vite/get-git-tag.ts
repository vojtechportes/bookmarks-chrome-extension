import { execSync } from 'node:child_process';

export const getGitTag = (): string | null => {
  try {
    return execSync('git describe --tags --abbrev=0').toString().trim();
  } catch {
    return null;
  }
};
