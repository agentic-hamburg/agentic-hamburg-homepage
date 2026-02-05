import kebabCase from "lodash.kebabcase";

export const slugifyStr = (str: string): string => kebabCase(str);

export const slugifyAll = (arr: string[]): string[] => arr.map(slugifyStr);
