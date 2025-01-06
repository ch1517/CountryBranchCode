export function getSurroundingCbcGrid(centerCbc: [string, number, number]): [string, string, string][] {
  const hangeulX = ['가', '나', '다', '라', '마', '바', '사'];
  const hangeulY = ['가', '나', '다', '라', '마', '바', '사', '아'];
  
  const [cbcHangeul, cbcX, cbcY] = centerCbc;
  const [firstChar, secondChar] = cbcHangeul.split('');
  
  const xIndex = hangeulX.indexOf(firstChar);
  const yIndex = hangeulY.indexOf(secondChar);

  function getNextCoords(x: number, y: number, dx: number, dy: number): [string, string, string] | undefined {
    let newX = x + dx;
    let newY = y + dy;
    let newXIndex = xIndex;
    let newYIndex = yIndex;

    if (newX < 0) {
      newX = 9999;
      newXIndex--;
    } else if (newX > 9999) {
      newX = 0;
      newXIndex++;
    }

    if (newY < 0) {
      newY = 9999;
      newYIndex--;
    } else if (newY > 9999) {
      newY = 0;
      newYIndex++;
    }

    if (newXIndex < 0 || newXIndex >= hangeulX.length || 
        newYIndex < 0 || newYIndex >= hangeulY.length) {
      return undefined;
    }

    const paddedX = String(newX).padStart(4, '0');
    const paddedY = String(newY).padStart(4, '0');

    return [hangeulX[newXIndex] + hangeulY[newYIndex], paddedX, paddedY];
  }

  const directions = [
    [-1, 1],  [0, 1],  [1, 1],
    [-1, 0],           [1, 0],
    [-1, -1], [0, -1], [1, -1]
  ];

  return directions
    .map(([dx, dy]) => getNextCoords(cbcX, cbcY, dx, dy))
    .filter((coord): coord is [string, string, string] => coord !== undefined);
}