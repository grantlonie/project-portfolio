import React, { Component } from 'react'
import { connect } from 'react-redux'
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

import { ToolItem } from '../../types'
import { removeTool, mergeTool } from '../../js/actions'

interface Props {
	tool: ToolItem
	removeTool: (toolId: string) => void
	mergeTool: (fromId: string, toId: string) => void
	close: () => void
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

	removeTool() {
		const { removeTool, tool, close } = this.props
		removeTool(tool.id)
		close()
	}

	mergeTool() {
		this.props.mergeTool(this.props.tool.id, this.state.mergeToolId)
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

									<Button color="primary" style={{ marginLeft: '20px' }} onClick={this.mergeTool.bind(this)}>
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
								Delete <em>{tool.name}</em> and all relations within a project (not recommended)
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails style={{ display: 'block' }}>
							<Typography>
								Type <em>{tool.name}</em> and delete.
							</Typography>
							<TextField value={deleteTextValue} onChange={this.handleDeleteTextChange.bind(this)} />
							<Button
								color="primary"
								style={{ marginLeft: '20px' }}
								disabled={deleteTextValue !== tool.name}
								onClick={this.removeTool.bind(this)}
							>
								Delete
							</Button>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Paper>
			</Modal>
		)
	}
}

const mapStateToProps = ({ allTools, projects }) => ({ allTools, projects })

const mapDispatchToProps = dispatch => ({
	removeTool: toolId => dispatch(removeTool(toolId)),
	mergeTool: (fromId, toId) => dispatch(mergeTool(fromId, toId)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfirmationModal)
