export const enumValuesToArray = (enumm: any): any => {
  return Object.keys(enumm).map(key => enumm[key]);
}
