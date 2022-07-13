import { getOrCreateGameState } from '../gameState'

import { redrawPoint } from '../draw'
import { getPointOnCoordinate } from '../utils/getPointOnCoordinate'
import { findNeighbours } from './utils/findNeighbours'
import { addNewPoint } from '../utils/addNewPoint'
import { getCoordinateKey } from '../utils/getCoordinateKey'

const processGameTick = (): void => {
  const state = getOrCreateGameState()
  for (let i = 0; i < state.borders.horizontal; i++) {
    for (let j = 0; j < state.borders.vertical; j++) {
      const coordinate = { x: i, y: j }
      const point = getPointOnCoordinate(coordinate)
      const neighbours = findNeighbours(state, coordinate)

      if (!point && neighbours.length === 3) {
        addNewPoint(coordinate, true)
        continue
      }

      if (point && ![2, 3].includes(neighbours.length)) {
        delete state.pointsByCoordinate[getCoordinateKey(point.coordinate)]
        redrawPoint(coordinate)
      }
    }
  }
}

const TICKS_PER_SECOND = 60

export const startEngine = async () => {
  while (true) {
    const state = getOrCreateGameState()
    processGameTick()
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 / TICKS_PER_SECOND / state.speed),
    )
  }
}
