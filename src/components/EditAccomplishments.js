import React, { Component } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'
import { TextField, Button } from '@material-ui/core'

import { createAccomplishment } from '../graphql/mutations'

const emptyAccomplishment = { name: '', date: null, company: '', description: '' }

export default class ListAccomplishments extends Component {
	constructor(props) {
		super(props)

		this.state = { ...emptyAccomplishment }
	}

	updateInput({ target: { name, value } }) {
		this.setState({ [name]: value })
	}

	async handleAddAccomplishment() {
		const newAccomplishment = await API.graphql(
			graphqlOperation(createAccomplishment, { input: { ...this.state } })
		)
		console.log('newAccomplishment: ', newAccomplishment)
		this.setState({ ...emptyAccomplishment })
	}

	render() {
		const { name, date, company, description, categories } = this.state

		return (
			<div style={{ width: '250px' }}>
				<TextField
					label="name"
					type="text"
					name="name"
					value={name}
					onChange={this.updateInput.bind(this)}
				/>
				<TextField
					label="date"
					type="text"
					name="date"
					value={date}
					onChange={this.updateInput.bind(this)}
				/>
				<TextField
					label="company"
					type="text"
					name="company"
					value={company}
					onChange={this.updateInput.bind(this)}
				/>
				<TextField
					label="description"
					type="text"
					name="description"
					value={description}
					onChange={this.updateInput.bind(this)}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={this.handleAddAccomplishment.bind(this)}>
					Add Accomplishment
				</Button>
			</div>
		)
	}
}
