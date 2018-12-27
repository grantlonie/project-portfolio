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

import { updateTool, deleteTool } from '../../graphql/mutations'

class ToolsModal extends Component {
	constructor(props) {
		super(props)

		this.modalStyle = {
			position: 'absolute',
			left: '0%',
			right: '0%',
			top: '0%',
			bottom: '0%',
			margin: 'auto',
			width: '95%',
			maxWidth: '600px',
			maxHeight: '80vh',
			padding: '20px',
			overflowY: 'scroll',
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

	handleRemoveTool(toolId) {
		const tools = this.state.tools.filter(tool => tool.id !== toolId)
		this.setState({ tools })

		API.graphql(graphqlOperation(deleteTool, { input: { id: toolId } })).then(({ data }) => {
			this.props.removeTool(data.deleteTool.id)
		})
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
											<DeleteIcon onClick={this.handleRemoveTool.bind(this, tool.id)} />
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

const mapStateToProps = ({ userId }) => ({ userId })

const mapDispatchToProps = dispatch => {
	return {
		updateToolInStore: tool => {
			dispatch({ type: 'UPDATE_TOOL', tool })
		},
		removeTool: toolId => {
			dispatch({ type: 'REMOVE_TOOL', toolId })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ToolsModal)
