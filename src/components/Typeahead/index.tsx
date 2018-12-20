import * as React from 'react'

import SmartInput from './SmartInput'
import DropdownList from './DropdownList'

interface Props {
	list: string[]
}

interface State {
	typedChars: string
	filteredList: string[]
	selectFocus: number
}

export default class Typeahead extends React.Component<Props, State> {
	private typeAheadStyle = {
		fontFamily: 'Helvetica',
		width: '100%',
		margin: 'auto',
	}

	state: State = {
		typedChars: '',
		filteredList: [],
		selectFocus: 0,
	}

	// Selected an item
	handleSelectedItem(typedChars: string) {
		this.setState({ typedChars, filteredList: [] })
	}

	// Update the typed characters and filter the list
	updateDropDown(typedChars: string) {
		const filteredList = typedChars
			? this.props.list.filter(item => item.toLowerCase().indexOf(typedChars.toLowerCase()) === 0)
			: []

		this.setState({ typedChars, filteredList, selectFocus: 0 })
	}

	// Handle navigating up and down on drop down list
	updateSelectFocus(direction: string) {
		const { selectFocus, filteredList } = this.state

		if (direction === 'up') {
			this.setState({ selectFocus: Math.max(selectFocus - 1, 0) })
		} else {
			this.setState({
				selectFocus: Math.min(selectFocus + 1, filteredList.length),
			})
		}
	}

	// Pressing enter on focused item to select it
	chooseFocused() {
		const { filteredList, selectFocus } = this.state
		if (selectFocus > 0) {
			this.handleSelectedItem(filteredList[selectFocus - 1])
		}
	}

	render() {
		const { typedChars, selectFocus, filteredList } = this.state

		return (
			<div style={this.typeAheadStyle}>
				<SmartInput
					typedChars={typedChars}
					updateDropDown={this.updateDropDown.bind(this)}
					updateSelectFocus={this.updateSelectFocus.bind(this)}
					chooseFocused={this.chooseFocused.bind(this)}
				/>

				<DropdownList
					filteredList={filteredList}
					typedCharsCount={typedChars.length}
					selectFocus={selectFocus - 1}
					handleSelectedItem={this.handleSelectedItem.bind(this)}
				/>
			</div>
		)
	}
}
