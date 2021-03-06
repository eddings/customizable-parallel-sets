import { elementsProvider } from '../../utils/domUtils.js'
import storeUtils from '../redux/storeUtils.js'
import actions from './actions.js'
import Immutable from 'immutable'
import * as d3 from 'd3'

let viewState = Immutable.Map({})

export default () => {
  const innerRender = () => {
    const connectStates = ['dataset', 'featuresFilter']

    if (storeUtils.shouldUpdate(viewState, connectStates)) {
      viewState = storeUtils.updateViewState(viewState, connectStates)
      render()
    }
  }

  const store = storeUtils.getStore()

  d3.select(window).on('resize', render)
  store.subscribe(innerRender)
  innerRender()
}

const render = () => {
  const dataset = viewState.get('dataset')

  const features = getEntryFeatures(dataset)
  renderSideBar(elementsProvider.SIDEBAR_OPTIONS, features)
}

const renderSideBar = (selector, features) => {
  const sidebar = d3.select(selector)

  const options = sidebar
    .selectAll("input")
    .data(features)
    .enter()
    .append("div")
      .attr("class", "col s12")

  renderCheckboxes(options)
  renderLabels(options)
}

const renderCheckboxes = (options) => {
  options
    .append("input")
      .attr("type", "checkbox")
      .attr("checked", "checked")
      .attr("id", (d) => d)
      .on("click", (featureName) => {
        return toggleFeature(featureName)
      })
}

const renderLabels = (options) => {
  options
    .append("label")
      .attr("class", "tooltipped")
      .attr("data-position", "right")
      .attr("data-delay", 50)
      .attr("data-tooltip", (d) => d)
      .attr("for", (d) => d)
      .text((d) => d)

  initTooltips()
}

const initTooltips = () => {
  $('.tooltipped').tooltip({delay: 50})
}

const toggleFeature = (featureName) => {
  console.log(`INFO: Toggled ${featureName} checkbox.`)
  storeUtils.dispatch(actions.toggleSidebarFilter(featureName))
}

const getEntryFeatures = (dataset) => {
  return Object.keys(dataset.get(0))
}