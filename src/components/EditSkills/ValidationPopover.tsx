import React from 'react'
import { Popover, Typography } from '@material-ui/core'

const ValidationPopover = ({ element, content, close }) => (
	<Popover
		open={Boolean(element)}
		anchorEl={element}
		onClose={() => close()}
		style={{ padding: '10px' }}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}>
		<Typography>{content}</Typography>
	</Popover>
)

export default ValidationPopover
