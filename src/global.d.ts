// Allow imports using the `@/...` alias in TypeScript checks
// This helps the editor/TS server recognize module paths when path mapping
// doesn't get picked up for some reason.

declare module '@/*';

declare module 'radix-ui';
