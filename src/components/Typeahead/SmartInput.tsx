import * as React from 'react'

const inputStyle = {
	width: '100%',
	fontSize: '1.2em',
	margin: '0px',
	textIndent: '5px',
	padding: '5px 0 5px 0',
}

interface Props {
	typedChars: string
	updateDropDown: Function
	updateSelectFocus: Function
	chooseFocused: Function
}

const SmartInput = (props: Props) => {
	const { typedChars, updateDropDown, updateSelectFocus, chooseFocused } = props

	// Update input text unless only whitespace
	function handleChangedInput({ target: { value } }: any) {
		if (value !== ' ') {
			updateDropDown(value)
		}
	}

	// Look for navigation key strokes and enter key
	function handleKeyDown(e: any) {
		const { key, shiftKey } = e

		if ((shiftKey && key === 'Tab') || key === 'ArrowUp') {
			e.preventDefault()
			updateSelectFocus('up')
		} else if ((!shiftKey && key === 'Tab') || key === 'ArrowDown') {
			e.preventDefault()
			updateSelectFocus('down')
		} else if (key === 'Enter') {
			chooseFocused()
		}
	}

	return (
		<input
			style={inputStyle}
			placeholder="Add a category"
			value={typedChars}
			onChange={handleChangedInput}
			onKeyDown={handleKeyDown}
		/>
	)
}

export default SmartInput
