import * as React from 'react'

import ListItem from './ListItem'

interface Props {
  filteredList: string[]
  typedCharsCount: number
  selectFocus: number
  handleSelectedItem: Function
}

const DropdownList = (props: Props) => {
  const { filteredList, typedCharsCount, selectFocus, handleSelectedItem } = props

  const dropdownStyle: object = {
    width: '100%',
    listStyleType: 'none',
    textAlign: 'left',
    margin: '0px',
    padding: '5px 0 5px 0',
    textIndent: '5px',
    borderStyle: filteredList.length > 0 ? 'solid' : '',
    borderColor: 'black',
    borderWidth: '0 1px 1px 1px',
    borderRadius: '0 0 4px 4px',
  }

  return (
    <ul style={dropdownStyle}>
      {filteredList.map((item, itemI) => (
        <ListItem
          key={item}
          item={item}
          itemNumber={itemI}
          selectFocus={selectFocus}
          typedCharsCount={typedCharsCount}
          handleSelectedItem={handleSelectedItem}
        />
      ))}
    </ul>
  )
}

export default DropdownList
