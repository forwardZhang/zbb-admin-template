import { createContext } from '@/helper/context.ts';

export const [injectFormApi, provideFormApi] = createContext('schema-form-api');
export const [injectSlotCtx, provideSlotCtx] = createContext('schema-form-slot');
