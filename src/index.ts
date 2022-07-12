import { getOrCreateGameState, PointType } from './gameState'
import { setBorders } from './utils/setBorders'
import { startEngine } from './process'
import { SCALE } from './constants'
import { drawInitial } from './draw'
import { initControls } from './controls/initControls'
import { getColor } from './utils/getColor'

const init = () => {
  const root = document.getElementById('root')
  const controls = document.querySelector('.controls')
  if (!root) {
    throw new Error('Root element not found')
  }
  if (!controls) {
    throw new Error('Controls element not found')
  }
  const proportions = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
  const canvas = document.createElement('canvas')
  canvas.width = proportions.width
  canvas.height = proportions.height
  root.appendChild(canvas)

  const state = getOrCreateGameState()

  const controlTypes = [...Object.values(PointType), 'Eraser'] as Array<PointType | "Eraser">
  controlTypes.forEach((type) => {
    const button = document.createElement('button')
    button.classList.add('control')
    if (state.currentType === type) {
      button.classList.add('control--selected')
    }
    button.classList.add(`control--${type}`)
    button.style.backgroundColor = type === 'Eraser' ? 'white' : getColor(type)
    button.addEventListener('click', () => {
      const state = getOrCreateGameState()
      document.querySelectorAll('.control').forEach((control) => {
        control.classList.remove('control--selected')
      });
      button.classList.add('control--selected')
      state.currentType = type
    })
    controls.appendChild(button)
  })

  const input = document.createElement('input')
  input.type = 'range'
  input.min = '1'
  input.max = '10'
  input.value = '1'
  input.addEventListener('change', () => {
    const state = getOrCreateGameState()
    state.brushSize = input.valueAsNumber
  });
  controls.appendChild(input)

  setBorders(proportions.width / SCALE, proportions.height / SCALE)

  initControls(canvas)

  // @ts-ignore
  window.gameState = state

  drawInitial(canvas)
  startEngine()
}

window.addEventListener('load', init)
