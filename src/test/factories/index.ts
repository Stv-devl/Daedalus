/**
 * Central reset for every data factory, called by `src/test/setup.ts` before
 * each test. A factory added under `src/test/factories/` gets its export and
 * its reset call here, never a second setup file.
 */
export const resetAllFactories = (): void => {};
