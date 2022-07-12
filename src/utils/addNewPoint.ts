import { redrawPoint } from '../draw'
import {
  Coordinate,
  getOrCreateGameState,
  PointData,
  PointType,
} from '../gameState'
import { getCoordinateKey } from './getCoordinateKey'
import { getPointOnCoordinate } from './getPointOnCoordinate'

const updateCoordinate = (point: PointData, coordinateFrom: Coordinate, coordinateTo: Coordinate): void => {
  const state = getOrCreateGameState()
  delete state.pointsByCoordinate[getCoordinateKey(coordinateFrom)]
  state.pointsByCoordinate[getCoordinateKey(coordinateTo)] = point
}

const createPointObject = (coordinate: Coordinate, type: PointType): PointData => {
  let {x, y} = coordinate
  let localCoordinate = {
    get x() {
      return x
    },
    get y() {
      return y
    },
    set x(value) {
      updateCoordinate(point, {x, y}, {x: value, y})
      x = value
    },
    set y(value) {
      updateCoordinate(point, {x, y}, {x, y: value})
      y = value
    }
  }
  const point: PointData = {
    get coordinate() {
      return localCoordinate
    },
    set coordinate(newCoordinate: Coordinate) {
      if (newCoordinate.x !== localCoordinate.x) {
        localCoordinate.x = newCoordinate.x
      }
      if (newCoordinate.y !== localCoordinate.y) {
        localCoordinate.y = newCoordinate.y
      }
    },
    type
  }

  return point
}

export const addNewPoint = (coordinate: Coordinate, type?: PointType) => {
  const state = getOrCreateGameState()
  if (coordinate.x < 0 || coordinate.y < 0) {
    return
  }
  if (coordinate.x > state.borders.horizontal || coordinate.y > state.borders.vertical) {
    return
  }
  const typeToAdd = type || state.currentType
  if (typeToAdd === 'Eraser') {
    const pointThere = getPointOnCoordinate(coordinate)
    if (pointThere) {
      state.points = state.points.filter(point => point !== pointThere)
      delete state.pointsByCoordinate[getCoordinateKey(pointThere.coordinate)]
      redrawPoint(pointThere.coordinate)
    }
    return
  }
  const pointThere = getPointOnCoordinate(coordinate)
  if (pointThere) {
    return
  }
  const point = createPointObject(coordinate, typeToAdd)
  state.pointsByCoordinate[getCoordinateKey(coordinate)] = point
  redrawPoint(coordinate)
  state.points.push(point)
}
