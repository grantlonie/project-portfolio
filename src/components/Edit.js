import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Typography } from '@material-ui/core'

class Edit extends Component {
	constructor(props) {
		super(props)

		const accomplishment = this.getAccomplishment()

		this.bodyStyle = {
			margin: 'auto',
			maxWidth: '1000px',
			padding: '20px',
		}

		this.contentStyle = {
			display: 'grid',
			justifyContent: 'center',
			gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr)',
			gridGap: '20px 20px',
		}

		this.state = { ...accomplishment }
	}

	getAccomplishment() {
		const {
			match: {
				params: { id },
			},
			accomplishments,
		} = this.props

		let accomplishment
		if (id) accomplishment = accomplishments.find(i => i.id === id)

		if (!accomplishment) {
			accomplishment = {
				id: null,
				name: '',
				date: Date.now(),
				company: '',
				description: '',
			}
		}

		return accomplishment
	}

	componentDidUpdate(prevProps) {
		// if accomplishments list length changes, update accomplishment
		if (prevProps.accomplishments.length !== this.props.accomplishments.length) {
			this.setState({ ...this.getAccomplishment() })
		}
	}

	handleChange({ target: { name, value } }) {
		this.setState({ [name]: value })
	}

	render() {
		const { id, name, company, date, description, categories } = this.state
		console.log('date: ', date)

		return (
			<div style={this.bodyStyle}>
				<Typography variant="h3" gutterBottom>
					Edit Accomplishment
				</Typography>

				<div style={this.contentStyle}>
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
							onChange={this.handleChange.bind(this)}
						/>

						<TextField
							required
							fullWidth
							label="Date"
							type="date"
							margin="normal"
							name="date"
							value={date}
							onChange={this.handleChange.bind(this)}
						/>

						<TextField
							required
							fullWidth
							label="Company"
							margin="normal"
							name="company"
							value={company}
							onChange={this.handleChange.bind(this)}
						/>

						<TextField
							required
							fullWidth
							multiline
							label="Description"
							margin="normal"
							name="description"
							value={description}
							onChange={this.handleChange.bind(this)}
						/>
					</div>

					<div id="col1">hello</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ accomplishments }) => ({ accomplishments })

const mapDispatchToProps = dispatch => {
	return {
		doSomething: data => {
			dispatch({ type: 'ACTION', data })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Edit)
