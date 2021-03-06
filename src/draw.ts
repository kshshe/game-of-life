import { Coordinate, getOrCreateGameState } from './gameState'
import { SCALE } from './constants'
import { getPointOnCoordinate } from './utils/getPointOnCoordinate'

const resetCanvasBg = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

let lastCtx: CanvasRenderingContext2D | null = null

export const redrawPoint = (coordinate: Coordinate) => {
  const ctx = lastCtx
  if (!ctx) {
    return
  }
  const point = getPointOnCoordinate(coordinate)
  const { x, y } = coordinate
  if (!point) {
    ctx.fillStyle = '#fff'
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
  } else {
    ctx.fillStyle = '#000'
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE)
  }
}

export function drawInitial(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not get context')
  }
  lastCtx = ctx
  resetCanvasBg(ctx)
  const state = getOrCreateGameState()
  Object.values(state.pointsByCoordinate).forEach((point) => {
    redrawPoint(point.coordinate)
  })
}

// @ts-ignore
window.drawInitial = drawInitial