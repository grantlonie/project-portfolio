import React, { Component } from 'react'
import { connect } from 'react-redux'
import API, { graphqlOperation } from '@aws-amplify/api'
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Button,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { createTool, updateTool } from '../../graphql/mutations'
import DeleteToolConfirmationModal from './DeleteToolConfirmationModal'
import { ToolItem } from '../../types'

const headers = [{ id: 'name', label: 'Name' }, { id: 'website', label: 'Website' }]

let updateTimeout // used for timeout to edit project database and redux
const updateCheckTime = 5000 // [ms] how long to wait after editting to update the component

interface Props {
	allTools: ToolItem[]
	userId: string
	showSpinner: (show: boolean) => null
	addToolToStore: (tool: ToolItem) => null
	updateToolInStore: (tool: ToolItem) => null
}

interface State {
	modalTool: ToolItem
	tools: (ToolItem & { isUpdated?: boolean })[]
	newTool: string
	modal: string
}

class EditTools extends Component<Props, State> {
	constructor(props) {
		super(props)

		this.state = {
			tools: this.props.allTools,
			newTool: '',
			modal: '',
			modalTool: null,
		}
	}

	componentDidUpdate(prevProps) {
		// if tools change in redux, update state
		if (JSON.stringify(prevProps.allTools) !== JSON.stringify(this.props.allTools)) {
			let modalTool = this.state.modalTool
				? this.props.allTools.find(i => i.id === this.state.modalTool.id)
				: null

			this.setState({ tools: this.props.allTools, modalTool })
		}
	}

	componentWillUnmount() {
		this.updateTools()
	}

	handleAddTool() {
		const { userId, showSpinner, addToolToStore } = this.props

		showSpinner(true)
		;(API.graphql(
			graphqlOperation(createTool, {
				input: { userId, name: this.state.newTool },
			})
		) as Promise<any>).then(({ data: { createTool } }) => {
			addToolToStore(createTool)
			showSpinner(false)
		})

		this.setState({ newTool: '' })
	}

	updateTools() {
		clearTimeout(updateTimeout)

		this.state.tools.forEach(tool => {
			const { id, name, isUpdated } = tool

			if (isUpdated) {
				delete tool.isUpdated

				const input: any = { id, name }
				;(API.graphql(graphqlOperation(updateTool, { input })) as Promise<any>).then(({ data }) => {
					this.props.updateToolInStore(data.updateTool)
				})
			}
		})
	}

	handleNameChange(id, { target }) {
		const tools = JSON.parse(JSON.stringify(this.state.tools)).map(tool => {
			if (tool.id === id) {
				tool.name = target.value
				tool.isUpdated = true
			}
			return tool
		})

		clearTimeout(updateTimeout)
		updateTimeout = setTimeout(() => this.updateTools(), updateCheckTime)

		this.setState({ tools })
	}

	handleEditTools(tool: ToolItem) {
		this.setState({ modalTool: tool, modal: 'tools' })
	}

	closeModal() {
		this.setState({ modalTool: null, modal: '' })
	}

	handleNewToolChange({ target }) {
		this.setState({ newTool: target.value })
	}

	handleOpenDeleteModal(tool) {
		this.setState({ modalTool: tool, modal: 'delete' })
	}

	removeTool(toolId) {
		const tools = this.state.tools.filter(tool => tool.id !== toolId)
		this.setState({ tools })
	}

	render() {
		const { tools, modalTool, modal, newTool } = this.state

		// Render a modal
		let renderedModal
		switch (modal) {
			case 'delete':
				renderedModal = (
					<DeleteToolConfirmationModal
						tools={tools}
						tool={modalTool}
						removeTool={this.removeTool.bind(this)}
						close={this.closeModal.bind(this)}
					/>
				)
				break

			default:
				renderedModal = null
		}

		return (
			<div>
				{renderedModal}

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant="h4" gutterBottom>
						Edit Tools
					</Typography>
				</div>

				<Table aria-labelledby="tableTitle">
					<TableHead>
						<TableRow>
							<TableCell />
							{headers.map(header => {
								return <TableCell key={header.id}>{header.label}</TableCell>
							})}
						</TableRow>
					</TableHead>

					<TableBody>
						{tools.map(tool => {
							return (
								<TableRow hover key={tool.id}>
									<TableCell padding="dense">
										<DeleteIcon onClick={this.handleOpenDeleteModal.bind(this, tool)} />
									</TableCell>
									<TableCell padding="dense">
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
							<TableCell padding="dense">
								<TextField
									value={newTool}
									placeholder="New Tool"
									onChange={this.handleNewToolChange.bind(this)}
								/>
							</TableCell>
							<TableCell>
								<Button
									color="secondary"
									variant="contained"
									disabled={!Boolean(this.state.newTool)}
									onClick={this.handleAddTool.bind(this)}>
									Create
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		)
	}
}

const mapStateToProps = ({ allTools, userId }) => ({ allTools, userId })

const mapDispatchToProps = dispatch => {
	return {
		updateToolInStore: updatedTool => {
			dispatch({ type: 'UPDATE_SKILL', updatedTool })
		},
		addToolToStore: tool => {
			dispatch({ type: 'ADD_SKILL', tool })
		},
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditTools)