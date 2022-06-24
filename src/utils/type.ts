const isString = (s: any): s is string => typeof s === 'string';

const isArray = (a: any): a is Array<any> => Array.isArray(a);

export default {
  isString,
  isArray,
};
