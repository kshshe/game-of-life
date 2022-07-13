export type Coordinate = {
  x: number
  y: number
}

export type PointData = {
  coordinate: Coordinate
}

export type GameState = {
  pointsByCoordinate: { [key: string]: PointData }
  borders: {
    horizontal: number
    vertical: number
  }
  brushSize: number
  currentType: 'point' | 'eraser'
  speed: number
}

let gameState: null | GameState = null

export const getOrCreateGameState = (): GameState => {
  if (!gameState) {
    gameState = {
      pointsByCoordinate: {},
      borders: {
        horizontal: 0,
        vertical: 0,
      },
      brushSize: 2,
      speed: 1,
      currentType: 'point',
    }
  }
  return gameState
}
