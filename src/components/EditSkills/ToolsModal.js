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
	Button,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import ValidationPopover from './ValidationPopover'
import { createTool, updateTool, deleteTool, updateUser } from '../../graphql/mutations'

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

		this.state = {
			tools: props.skill.tools.items,
			newTool: '',
			popoverElement: null,
			popoverContent: '',
		}
	}

	componentDidUpdate(prevProps) {
		// if skills change in parent component, update state
		if (prevProps.skill.tools.items.length !== this.props.skill.tools.items.length) {
			this.setState({ tools: this.props.skill.tools.items })
		}
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
			API.graphql(
				graphqlOperation(updateUser, { input: { id: this.props.userId, dirtyTables: true } })
			)
		})
	}

	handleNewTool(e) {
		const { showSpinner, userId, skill, addToolToAllSkills } = this.props
		const { tools, newTool } = this.state

		if (tools.findIndex(tool => tool.name === newTool) !== -1) {
			this.setState({
				popoverElement: e.currentTarget,
				popoverContent: `Tool name ${newTool} is already used. Choose another..`,
			})
		} else {
			showSpinner(true)

			API.graphql(
				graphqlOperation(createTool, {
					input: { userId, name: this.state.newTool, toolSkillId: skill.id },
				})
			).then(({ data: { createTool } }) => {
				const { id: toolId, name, userId } = createTool
				const newTool = { id: toolId, name, userId }

				addToolToAllSkills(skill.id, newTool)
				showSpinner(false)
				this.setState({ newTool: '' })
			})
		}
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

	handleNewToolChange({ target }) {
		this.setState({ newTool: target.value })
	}

	handleNewToolKeyPress(e) {
		// check for enter key
		if (e.key === 'Enter') this.handleNewTool(e)
	}

	handleClosePopover() {
		this.setState({ popoverElement: null })
	}

	render() {
		const { tools, newTool, popoverElement, popoverContent } = this.state

		return (
			<Modal open onClose={this.closeModal.bind(this)}>
				<Paper style={this.modalStyle} elevation={1}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography variant="h6" gutterBottom>
							Tools
						</Typography>
						<Button color="primary" onClick={this.handleNewTool.bind(this)}>
							New
						</Button>
					</div>

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

							<TableRow>
								<TableCell />
								<TableCell>
									<Button
										color="secondary"
										disabled={!Boolean(newTool)}
										onClick={this.handleNewTool.bind(this)}>
										Create
									</Button>
								</TableCell>
								<TableCell>
									<TextField
										value={newTool}
										placeholder="New Tool"
										onChange={this.handleNewToolChange.bind(this)}
										onKeyUp={this.handleNewToolKeyPress.bind(this)}
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<ValidationPopover
						element={popoverElement}
						content={popoverContent}
						close={this.handleClosePopover.bind(this)}
					/>
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
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
		addToolToAllSkills: (skillId, tool) => {
			dispatch({ type: 'ADD_TOOL_TO_SKILL', skillId, tool })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ToolsModal)
