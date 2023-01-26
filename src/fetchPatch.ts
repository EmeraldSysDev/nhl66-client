/**
 * https://gist.github.com/jvdl/4319e9dc01713015e2ec6c9b9b8afe0c
 */
import process from 'process';
const originalEmit = process.emit;

export const patch = () => {
  // @ts-ignore
  process.emit = function (name, data) {
    if (
      name === 'warning' &&
      typeof data === 'object' &&
      data.name === 'ExperimentalWarning' &&
      data.message.includes('The Fetch API is an experimental feature')
    ) {
      return false;
    }
    return originalEmit.apply(process, arguments)
  };
};
