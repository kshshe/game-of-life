import { redrawPoint } from '../draw'
import {
  Coordinate,
  getOrCreateGameState,
  PointData,
} from '../gameState'
import { getCoordinateKey } from './getCoordinateKey'
import { getPointOnCoordinate } from './getPointOnCoordinate'

const updateCoordinate = (
  point: PointData,
  coordinateFrom: Coordinate,
  coordinateTo: Coordinate,
): void => {
  const state = getOrCreateGameState()
  delete state.pointsByCoordinate[getCoordinateKey(coordinateFrom)]
  state.pointsByCoordinate[getCoordinateKey(coordinateTo)] = point
}

const createPointObject = (
  coordinate: Coordinate): PointData => {
  let { x, y } = coordinate
  let pauseUpdates = false
  let localCoordinate = {
    get x() {
      return x
    },
    get y() {
      return y
    },
    set x(value) {
      if (!pauseUpdates) {
        updateCoordinate(point, { x, y }, { x: value, y })
      }
      x = value
    },
    set y(value) {
      if (!pauseUpdates) {
        updateCoordinate(point, { x, y }, { x, y: value })
      }
      y = value
    },
  }
  const point: PointData = {
    get coordinate() {
      return localCoordinate
    },
    set coordinate(newCoordinate: Coordinate) {
      pauseUpdates = true
      const from = { x, y }
      if (newCoordinate.x !== localCoordinate.x) {
        localCoordinate.x = newCoordinate.x
      }
      if (newCoordinate.y !== localCoordinate.y) {
        localCoordinate.y = newCoordinate.y
      }
      updateCoordinate(point, from, {
        x: newCoordinate.x,
        y: newCoordinate.y,
      })
      pauseUpdates = false
    },
  }

  return point
}

export const addNewPoint = (coordinate: Coordinate, force: boolean = false) => {
  const state = getOrCreateGameState()
  if (coordinate.x < 0 || coordinate.y < 0) {
    return
  }
  if (
    coordinate.x > state.borders.horizontal ||
    coordinate.y > state.borders.vertical
  ) {
    return
  }
  const isEraserEnabled = state.currentType === 'eraser'
  if (isEraserEnabled && !force) {
    const pointThere = getPointOnCoordinate(coordinate)
    if (pointThere) {
      delete state.pointsByCoordinate[getCoordinateKey(pointThere.coordinate)]
      redrawPoint(pointThere.coordinate)
    }
    return
  }
  if (Object.keys(state.pointsByCoordinate).length > 3000) {
    return
  }
  const pointThere = getPointOnCoordinate(coordinate)
  if (pointThere) {
    return
  }
  const point = createPointObject(coordinate)
  state.pointsByCoordinate[getCoordinateKey(coordinate)] = point
  redrawPoint(coordinate)
}

// @ts-ignore
window.addNewPoint = addNewPoint
