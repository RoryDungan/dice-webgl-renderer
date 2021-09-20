import * as _ from 'lodash'

function component() {
  console.log('hello!')
  const element = document.createElement('div')

  element.innerHTML = _.join(['Hullo', 'webpack'], ' ')

  return element
}

document.body.appendChild(component())
