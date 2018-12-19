import React, { Component } from 'react'
import { connect } from 'react-redux'

class ListAccomplishments extends Component {
	render() {
		const { accomplishments } = this.props

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

const mapStateToProps = ({ accomplishments }) => ({ accomplishments })

export default connect(mapStateToProps)(ListAccomplishments)
