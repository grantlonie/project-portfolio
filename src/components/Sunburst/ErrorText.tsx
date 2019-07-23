import React from 'react'
import { Typography } from '@material-ui/core'

export default ({ status }) => {
	let Content = null
	switch (status) {
		case 'loading':
			Content = () => <Typography variant="h4">Loading...</Typography>
			break

		case 'empty':
			Content = () => (
				<div>
					<Typography variant="h4">Insufficient data</Typography>
					<Typography variant="body1">Create more projects and skills and connect to at least one category..</Typography>
					<Typography variant="body1">Alternatively, toggle sample data below</Typography>
				</div>
			)
			break
	}

	return (
		<div style={{ width: '50%', margin: '50px auto' }}>
			<Content />
		</div>
	)
}
