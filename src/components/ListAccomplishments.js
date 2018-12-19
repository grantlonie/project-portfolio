import React, { Component } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api'

import { listAccomplishments } from '../graphql/queries'

export default class ListAccomplishments extends Component {
	constructor(props) {
		super(props)

		this.updateData()

		this.state = { accomplishments: [] }
	}

	async updateData() {
		const { data } = await API.graphql(
			graphqlOperation(listAccomplishments, {
				filter: { userId: { eq: this.props.userId } },
			})
		)
		this.setState({ accomplishments: data.listAccomplishments.items })
	}

	render() {
		const { accomplishments } = this.state

		if (accomplishments.length === 0) return <h3>Loading...</h3>

		return (
			<ul>
				{accomplishments.map(accomplishment => (
					<li key={accomplishment.id}>{accomplishment.name}</li>
				))}
			</ul>
		)
	}
}
