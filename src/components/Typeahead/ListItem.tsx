import * as React from 'react'
import { number } from 'prop-types'

interface Props {
  item: string
  itemNumber: number
  selectFocus: number
  typedCharsCount: number
  handleSelectedItem: Function
}

interface State {
  hoveredItem: number
}

export default class ListItem extends React.Component<Props, State> {
  state: State = { hoveredItem: null }

  // Update hover effect with mouse events
  handleMouseEnter() {
    this.setState({ hoveredItem: this.props.itemNumber })
  }
  handleMouseLeave() {
    this.setState({ hoveredItem: null })
  }

  render() {
    const { item, itemNumber, selectFocus, typedCharsCount, handleSelectedItem } = this.props

    // ListItem's background color is combination of mouse highlight and key focused
    // Use hsl colors to vary background color from white to darker grey
    let hslLight = 100
    if (selectFocus === itemNumber) hslLight -= 20
    if (this.state.hoveredItem === itemNumber) hslLight -= 40

    const liStyle = {
      backgroundColor: `hsl(0, 0%, ${hslLight}%)`,
      color: this.state.hoveredItem === itemNumber ? 'white' : 'black',
      cursor: 'pointer',
    }

    return (
      <li
        style={liStyle}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        onClick={() => handleSelectedItem(item)}
      >
        <b>{item.slice(0, typedCharsCount)}</b>
        {item.slice(typedCharsCount)}
      </li>
    )
  }
}
