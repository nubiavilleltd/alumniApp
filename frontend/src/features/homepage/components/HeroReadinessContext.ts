import { createContext } from 'react';

export const HeroReadinessContext = createContext<() => void>(() => {});
