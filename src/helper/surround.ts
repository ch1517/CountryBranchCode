enum ZoomLevel {
  VERY_HIGH = 19,
  HIGH = 16,
  MEDIUM = 13,
  LOW = 10,
}

const xLabels = ['가', '나', '다', '라', '마', '바', '사'];
const yLabels = ['가', '나', '다', '라', '마', '바', '사', '아'];

export function getSurroundingGrid(centerGrid: [string, number, number], zoomLevel: ZoomLevel): string[] {

  const [gridLabel, gridX, gridY] = centerGrid;
  const formattedX = truncateNumber(String(gridX).padStart(4, '0'), zoomLevel);
  const formattedY = truncateNumber(String(gridY).padStart(4, '0'), zoomLevel);
  const [primaryLabel, secondaryLabel] = gridLabel.split('');

  const xIndex = xLabels.indexOf(primaryLabel);
  const yIndex = yLabels.indexOf(secondaryLabel);
  const boundary = getBoundaryValue(zoomLevel);

  const directions = [
    [-1, 1], [0, 1], [1, 1],
    [-1, 0], [0, 0], [1, 0],
    [-1, -1], [0, -1], [1, -1]
  ];

  const surroundingGrids = directions
    .map(([dx, dy]) => calculateNextCoords(xIndex, yIndex, formattedX, formattedY, dx, dy, boundary, zoomLevel))
    .filter((coord): coord is string => coord !== undefined);

  console.log(`
[Zoom Level]
${zoomLevel}

[Center Grid]
${centerGrid}

[Formatted Center]
${[gridLabel, formattedX, formattedY]}

[Surrounding Grids]
${surroundingGrids}`
  );

  return surroundingGrids;
}

function calculateNextCoords(xIndex: number, yIndex: number, x: number, y: number, dx: number, dy: number, boundary: number, zoomLevel: number): string | undefined {
  let newX = x + dx;
  let newY = y + dy;
  let newXIndex = xIndex;
  let newYIndex = yIndex;

  if (newX < 0) {
    newX = boundary;
    newXIndex--;
  } else if (newX > boundary) {
    newX = 0;
    newXIndex++;
  }

  if (newY < 0) {
    newY = boundary;
    newYIndex--;
  } else if (newY > boundary) {
    newY = 0;
    newYIndex++;
  }

  if (newXIndex < 0 || newXIndex >= xLabels.length ||
    newYIndex < 0 || newYIndex >= yLabels.length) {
    return undefined;
  }

  return `${xLabels[newXIndex] + yLabels[newYIndex]}${padNumber(newX, zoomLevel)}${padNumber(newY, zoomLevel)}`;
  // return [xLabels[newXIndex] + yLabels[newYIndex], padNumber(newX, zoomLevel), padNumber(newY, zoomLevel)];
}

function getBoundaryValue(zoomLevel: number): ZoomLevel {
  const boundaryValues = [9, 99, 999, 9999];
  if (zoomLevel > ZoomLevel.VERY_HIGH) {
    return boundaryValues[3];
  } else if (zoomLevel > ZoomLevel.HIGH) {
    return boundaryValues[2];
  } else if (zoomLevel > ZoomLevel.MEDIUM) {
    return boundaryValues[1];
  } else {
    return boundaryValues[0];
  }
}

function truncateNumber(value: string, zoomLevel: number): number {
  if (zoomLevel > ZoomLevel.VERY_HIGH) {
    return Number(value);
  }else if (zoomLevel > ZoomLevel.HIGH) {
    if (value.length > 1)
      return Number(value.slice(0, -1));
  } else if (zoomLevel > ZoomLevel.MEDIUM) {
    if (value.length > 2)
      return Number(value.slice(0, -2));
  } else {
    if (value.length > 3)
      return Number(value.slice(0, -3));
  }
  return Number(value);
}

function padNumber(value: number, zoomLevel: number): string {
  let targetLength: number = 4;

  if (zoomLevel > ZoomLevel.VERY_HIGH) {
    targetLength = 4;
  } else if (zoomLevel > ZoomLevel.HIGH) {
    targetLength = 3;
  } else if (zoomLevel > ZoomLevel.MEDIUM) {
    targetLength = 2;
  } else {
    targetLength = 1;
  }

  const stringValue = value.toString();
  return stringValue.padStart(targetLength, '0').slice(-targetLength);
}
