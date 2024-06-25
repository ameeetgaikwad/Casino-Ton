export const cutDecimal = (x: number, r: number) => {
  if (x === 0) return 0;
  const c = parseFloat(x.toString()).toFixed(r);
  return parseFloat(c).toString();
};




export const stringFormat = (x: string | undefined | null) => {
  if (x === undefined || x === null) return '';

  let t = x.toString();
  let decimalPosition = t.indexOf('.');
  if (decimalPosition < 0) decimalPosition = t.length;

  if (decimalPosition > 0) {
    let i;
    for (i = decimalPosition - 3; i > 0; i -= 3) {
      t = t.slice(0, i) + ',' + t.slice(i);
      decimalPosition += 1;
    }
    for (i = decimalPosition + 4; i < t.length; i += 4) {
      t = t.slice(0, i) + ',' + t.slice(i);
    }
  }
  return t;
};