/*
 * Copyright 2021, GFXFundamentals.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of GFXFundamentals. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const gopt: any = getQueryParams()

type SliderOptions = {
  precision?: number
  min?: number
  step?: number
  value?: number
  max?: number
  name: string
  uiPrecision?: number
  uiMult?: number
  slide: (evt: Event, data: { value: number }) => void
}

type SliderType = {
  elem: Element
  updateValue: (newValue: number) => void
}

export function setupSlider(
  parentSelector: string,
  options: SliderOptions
): SliderType {
  const uiParent = document.querySelector(parentSelector)
  if (!uiParent) {
    // like jquery don't fail on a bad selector
    return
  }
  const parent = document.createElement('div')
  uiParent.appendChild(parent)

  return createSlider(parent, options) // eslint-disable-line
}

function createSlider(parent: Element, options: SliderOptions): SliderType {
  const precision = options.precision || 0
  let min = options.min || 0
  const step = options.step || 1
  let value = options.value || 0
  let max = options.max || 1
  const fn = options.slide
  const name = gopt['ui-' + options.name] || options.name
  const uiPrecision =
    options.uiPrecision === undefined ? precision : options.uiPrecision
  const uiMult = options.uiMult || 1

  min /= step
  max /= step
  value /= step

  parent.innerHTML = `
      <div class="gman-widget-outer">
        <div class="gman-widget-label">${name}</div>
        <div class="gman-widget-value"></div>
        <input class="gman-widget-slider" type="range" min="${min}" max="${max}" value="${value}" />
      </div>
    `
  const valueElem = parent.querySelector('.gman-widget-value')
  const sliderElem: HTMLInputElement = parent.querySelector(
    '.gman-widget-slider'
  )

  function updateValue(value: number) {
    valueElem.textContent = (value * step * uiMult).toFixed(uiPrecision)
  }

  updateValue(value)

  function handleChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value)
    updateValue(value)
    fn(event, { value: value * step })
  }

  sliderElem.addEventListener('input', handleChange)
  sliderElem.addEventListener('change', handleChange)

  return {
    elem: parent,
    updateValue: (v: number) => {
      v /= step
      sliderElem.value = String(v)
      updateValue(v)
    },
  }
}

export function makeSlider(options: SliderOptions): SliderType {
  const div = document.createElement('div')
  return createSlider(div, options)
}

let widgetId = 0
function getWidgetId() {
  return '__widget_' + widgetId++
}

type CheckboxOptions = {
  name: string
  value: boolean
  change: (evt: Event, val: { value: boolean }) => void
}

type CheckboxType = {
  elem: Element
  updateValue: (v: any) => void
}

export function makeCheckbox(options: CheckboxOptions): CheckboxType {
  const div = document.createElement('div')
  div.className = 'gman-widget-outer'
  const label = document.createElement('label')
  const id = getWidgetId()
  label.setAttribute('for', id)
  label.textContent = gopt['ui-' + options.name] || options.name
  label.className = 'gman-checkbox-label'
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.checked = options.value
  input.id = id
  input.className = 'gman-widget-checkbox'
  div.appendChild(label)
  div.appendChild(input)
  input.addEventListener('change', function (e) {
    options.change(e, {
      value: (e.target as HTMLInputElement).checked,
    })
  })

  return {
    elem: div,
    updateValue: function (v: any) {
      input.checked = !!v
    },
  }
}

function makeOption(options: any) {
  const div = document.createElement('div')
  div.className = 'gman-widget-outer'
  const label = document.createElement('label')
  const id = getWidgetId()
  label.setAttribute('for', id)
  label.textContent = gopt['ui-' + options.name] || options.name
  label.className = 'gman-widget-label'
  const selectElem = document.createElement('select')
  options.options.forEach((name: string, ndx: any) => {
    const opt = document.createElement('option')
    opt.textContent = gopt['ui-' + name] || name
    opt.value = ndx
    opt.selected = ndx === options.value
    selectElem.appendChild(opt)
  })
  selectElem.className = 'gman-widget-select'
  div.appendChild(label)
  div.appendChild(selectElem)
  selectElem.addEventListener('change', function (e) {
    options.change(e, {
      value: selectElem.selectedIndex,
    })
  })

  return {
    elem: div,
    updateValue: function (v: any) {
      selectElem.selectedIndex = v
    },
  }
}

function noop() {}

function genSlider(object: any, ui: any) {
  const changeFn = ui.change || noop
  ui.name = ui.name || ui.key
  ui.value = object[ui.key]
  ui.slide =
    ui.slide ||
    function (event: any, uiInfo: any) {
      object[ui.key] = uiInfo.value
      changeFn()
    }
  return makeSlider(ui)
}

function genCheckbox(object: any, ui: any) {
  const changeFn = ui.change || noop
  ui.value = object[ui.key]
  ui.name = ui.name || ui.key
  ui.change = function (event: any, uiInfo: any) {
    object[ui.key] = uiInfo.value
    changeFn()
  }
  return makeCheckbox(ui)
}

function genOption(object: any, ui: any) {
  const changeFn = ui.change || noop
  ui.value = object[ui.key]
  ui.name = ui.name || ui.key
  ui.change = function (event: any, uiInfo: any) {
    object[ui.key] = uiInfo.value
    changeFn()
  }
  return makeOption(ui)
}

const uiFuncs: any = {
  slider: genSlider,
  checkbox: genCheckbox,
  option: genOption,
}

type UI = {
  type: 'slider' | 'checkbox' | 'option'
}

export function setupUI(
  parent: Element,
  object: Record<string, any>,
  uiInfos: [UI]
): any {
  const widgets: any = {}
  uiInfos.forEach(function (ui: any) {
    const widget: any = uiFuncs[ui.type](object, ui)
    parent.appendChild(widget.elem)
    widgets[ui.key] = widget
  })
  return widgets
}

export function updateUI(
  widgets: Record<string, any>,
  data: Record<string, any>
): void {
  Object.keys(widgets).forEach((key) => {
    const widget = widgets[key]
    widget.updateValue(data[key])
  })
}

declare global {
  interface Window {
    hackedParams: any
  }
}

function getQueryParams() {
  const params: any = {}
  if (window.hackedParams) {
    Object.keys(window.hackedParams).forEach(function (key) {
      params[key] = window.hackedParams[key]
    })
  }
  if (window.location.search) {
    window.location.search
      .substring(1)
      .split('&')
      .forEach(function (pair) {
        const keyValue = pair.split('=').map(function (kv) {
          return decodeURIComponent(kv)
        })
        params[keyValue[0]] = keyValue[1]
      })
  }
  return params
}
