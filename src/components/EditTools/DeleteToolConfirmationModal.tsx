import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateTool, deleteTool, updateUser } from '../../graphql/mutations'
import API, { graphqlOperation } from '@aws-amplify/api'
import {
	Modal,
	Typography,
	TextField,
	Paper,
	Button,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Select,
	MenuItem,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { ToolItem, ProjectItem } from '../../types'

interface Props {
	userId: string
	tool: ToolItem
	projects: ProjectItem[]
	removeToolFromStore: (toolId: string) => null
	removeTool: (toolId: string) => null
	close: () => null
	showSpinner: (show: boolean) => null
	addProjectToolToStore: (tool: ToolItem) => null
	removeToolFromProject: (tool: ToolItem) => null
}

interface State {
	deleteTextValue: string
	mergeToolId: string
}

class ConfirmationModal extends Component<Props, State> {
	private mergeTools: ToolItem[]
	private modalStyle: React.CSSProperties

	constructor(props) {
		super(props)

		this.modalStyle = {
			position: 'absolute',
			width: '95%',
			maxWidth: '600px',
			padding: '20px',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			margin: '20px',
		}

		// Array of tools the user can merge existing tool with
		this.mergeTools = props.tools.filter(tool => tool.id !== props.tool.id)
		const mergeToolId = this.mergeTools.length > 0 ? this.mergeTools[0].id : null

		this.state = { deleteTextValue: '', mergeToolId }
	}

	deleteTool() {
		const { removeToolFromStore, removeTool, userId, tool, close } = this.props

		removeTool(tool.id)
		close()
		;(API.graphql(graphqlOperation(deleteTool, { input: { id: tool.id } })) as Promise<any>).then(
			({ data }) => {
				removeToolFromStore(data.deleteTool.id)
				API.graphql(graphqlOperation(updateUser, { input: { id: userId, dirtyTables: true } }))
			}
		)
	}

	// Method merges tool with the selected tool
	async mergeTool() {
		const { tool, projects, removeToolFromProject, addProjectToolToStore, showSpinner } = this.props
		const { mergeToolId } = this.state

		showSpinner(true)

		// TODO - add logic and update redux

		// for (const project of projects) {
		// 	for (const projectTool of project.tools.items) {
		// 		if (projectTool.toolId === tool.id) {
		// 			const data = await API.graphql(
		// 				graphqlOperation(updateTool, {
		// 					input: { id: projectTool.id, toolId: mergeToolId },
		// 				})
		// 			)

		// 			// Update redux
		// 			removeToolFromProject(data['data']['updateTool'])
		// 			addProjectToolToStore(data['data']['updateTool'])
		// 		}
		// 	}
		// }

		showSpinner(false)

		// Delete Tool
		this.deleteTool()
	}

	handleDeleteTextChange({ target }) {
		this.setState({ deleteTextValue: target.value })
	}

	handleMergeToolChange({ target }) {
		this.setState({
			mergeToolId: this.mergeTools.find(tool => tool.id === target.value).id,
		})
	}

	render() {
		const { close, tool } = this.props
		const { deleteTextValue, mergeToolId } = this.state

		return (
			<Modal open onClose={() => close()}>
				<Paper style={this.modalStyle} elevation={1}>
					<Typography variant="h6" gutterBottom>
						What would you like to do with <em>{tool.name}</em>?
					</Typography>

					<ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>
								Merge <em>{tool.name}</em> with another tool
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							{mergeToolId ? (
								<div>
									<Select value={mergeToolId} onChange={this.handleMergeToolChange.bind(this)}>
										{this.mergeTools.map(tool => (
											<MenuItem key={tool.id} value={tool.id}>
												{tool.name}
											</MenuItem>
										))}
									</Select>

									<Button
										color="primary"
										style={{ marginLeft: '20px' }}
										onClick={this.mergeTool.bind(this)}>
										Merge
									</Button>
								</div>
							) : (
								<Typography>No other tools to merge with</Typography>
							)}
						</ExpansionPanelDetails>
					</ExpansionPanel>

					<ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>
								Delete <em>{tool.name}</em> and all associated tools and relations within a project
								(not recommended)
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails style={{ display: 'block' }}>
							<Typography>
								Type <em>{tool.name}</em> and delete.
							</Typography>
							<TextField
								value={deleteTextValue}
								onChange={this.handleDeleteTextChange.bind(this)}
							/>
							<Button
								color="primary"
								style={{ marginLeft: '20px' }}
								disabled={deleteTextValue !== tool.name}
								onClick={this.deleteTool.bind(this)}>
								Delete
							</Button>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Paper>
			</Modal>
		)
	}
}

const mapStateToProps = ({ allTools, projects, userId }) => ({ allTools, projects, userId })

const mapDispatchToProps = dispatch => {
	return {
		removeToolFromStore: toolId => {
			dispatch({ type: 'REMOVE_SKILL', toolId })
		},
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
		addProjectToolToStore: tool => {
			dispatch({ type: 'ADD_SKILL_TO_PROJECT', tool })
		},
		removeToolFromProject: tool => {
			dispatch({ type: 'REMOVE_SKILL_FROM_PROJECT', tool })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfirmationModal)