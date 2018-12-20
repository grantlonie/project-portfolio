import React from 'react'
import { TextField } from '@material-ui/core'

const MainProps = ({ category, handleChange }) => {
	const { id, name, company, date, description } = category

	return (
		<div id="col1">
			<TextField
				InputLabelProps={{
					shrink: true,
				}}
				fullWidth
				disabled
				label="Id"
				margin="normal"
				name="id"
				value={id}
			/>

			<TextField
				required
				fullWidth
				placeholder="Id name"
				label="Name"
				margin="normal"
				name="name"
				value={name}
				onChange={e => handleChange(e)}
			/>

			<TextField
				required
				fullWidth
				label="Date"
				type="date"
				margin="normal"
				name="date"
				value={date}
				onChange={e => handleChange(e)}
			/>

			<TextField
				required
				fullWidth
				label="Company"
				margin="normal"
				name="company"
				value={company}
				onChange={e => handleChange(e)}
			/>

			<TextField
				required
				fullWidth
				multiline
				label="Description"
				margin="normal"
				name="description"
				value={description}
				onChange={e => handleChange(e)}
			/>
		</div>
	)
}

export default MainProps
