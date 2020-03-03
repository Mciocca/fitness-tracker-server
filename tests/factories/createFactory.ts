export default (klass: any, params: any, fixtureData: any) => {
  const instance = new klass();
  const data = params ? { ...fixtureData, ...params } : { ...fixtureData };

  Object.keys(data).forEach((key) => {
    instance[key] = data[key];
  });

  return instance;
};
