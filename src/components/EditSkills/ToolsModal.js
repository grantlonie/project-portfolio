import React, { Component } from 'react'
import { connect } from 'react-redux'
import API, { graphqlOperation } from '@aws-amplify/api'
import {
	Modal,
	Typography,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TextField,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { updateTool } from '../../graphql/mutations'

class ToolsModal extends Component {
	constructor(props) {
		super(props)

		this.modalStyle = {
			maxWidth: '600px',
			position: 'absolute',
			top: '20%',
			left: '50%',
			transform: 'translate(-50%, 50%)',
			padding: '20px',
		}

		this.state = { tools: props.skill.tools.items }
	}

	handleNameChange(id, { target }) {
		const tools = this.state.tools.map(tool => {
			if (tool.id === id) {
				tool.name = target.value
				tool.isUpdated = true
			}
			return tool
		})

		this.setState({ tools })
	}

	closeModal() {
		const { close, updateToolInStore } = this.props

		this.state.tools.forEach(tool => {
			if (tool.isUpdated) {
				const { id, name } = tool
				API.graphql(graphqlOperation(updateTool, { input: { id, name } })).then(({ data }) => {
					updateToolInStore(data.updateTool)
				})
			}
		})

		close()
	}

	render() {
		const { tools } = this.state

		return (
			<Modal open onClose={this.closeModal.bind(this)}>
				<Paper style={this.modalStyle} elevation={1}>
					<Typography variant="h6" gutterBottom>
						Tools
					</Typography>

					<Table aria-labelledby="tableTitle">
						<TableHead>
							<TableRow>
								<TableCell />
								<TableCell>ID</TableCell>
								<TableCell>Name</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{tools.map(tool => {
								return (
									<TableRow hover key={tool.id}>
										<TableCell>
											<DeleteIcon />
										</TableCell>
										<TableCell>{tool.id}</TableCell>
										<TableCell>
											<TextField
												value={tool.name}
												onChange={this.handleNameChange.bind(this, tool.id)}
											/>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</Paper>
			</Modal>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateToolInStore: tool => {
			dispatch({ type: 'UPDATE_TOOL', tool })
		},
	}
}

export default connect(
	null,
	mapDispatchToProps
)(ToolsModal)
