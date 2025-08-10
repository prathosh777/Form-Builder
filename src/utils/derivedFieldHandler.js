export const computeDerivedValue = (formula, parentValues) => {
  if (!formula) return '';
  
  try {
    const func = new Function(...Object.keys(parentValues), `return (${formula})`);
    return func(...Object.values(parentValues));
  } catch (error) {
    console.error('Error computing derived value:', error);
    return 'Error in computation';
  }
};