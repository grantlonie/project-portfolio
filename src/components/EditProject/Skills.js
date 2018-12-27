import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import API, { graphqlOperation } from '@aws-amplify/api'
import { Typography, TextField, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { createSkill, createTool } from '../../graphql/mutations'

class Skills extends Component {
	constructor(props) {
		super(props)

		this.typeaheadRef = React.createRef()
	}

	handleSelectedSkill(skill) {
		const { userId, addProjectSkill, addSkillToStore } = this.props

		// New skill created
		if (skill[0].customOption) {
			API.graphql(
				graphqlOperation(createSkill, {
					input: { userId, name: skill[0].label },
				})
			).then(({ data: { createSkill } }) => {
				addSkillToStore(createSkill)
				addProjectSkill(createSkill.id)
			})
		} else {
			addProjectSkill(skill[0].id)
		}

		// clear typeahead input
		this.typeaheadRef.current.instanceRef.clear()
	}

	handleUpdateTools(id, skillId, tools) {
		const lastTool = tools[tools.length - 1] || {}
		const { userId, updateTools, addToolToAllSkills } = this.props

		// New tool created
		if (lastTool.customOption) {
			API.graphql(
				graphqlOperation(createTool, {
					input: { userId, name: lastTool.name, toolSkillId: skillId },
				})
			).then(({ data: { createTool } }) => {
				const { id: toolId, name, userId } = createTool

				const newTool = { id: toolId, name, userId }
				tools[tools.length - 1] = newTool
				updateTools(id, tools)
				addToolToAllSkills(skillId, newTool)
			})
		} else {
			updateTools(id, tools)
		}
	}

	render() {
		const { skills, allSkills, handleDescriptionChange, removeProjectSkill } = this.props

		// Create nested skills inside respective categories
		let skillData = {}
		skills.forEach(skill => {
			const { name, category } = allSkills.find(i => i.id === skill.skillId)
			if (!skillData.hasOwnProperty(category.name)) skillData[category.name] = []

			skillData[category.name].push({ ...skill, name })
		})

		// List of skills that are not in project that can be added
		const unselectedSkills = allSkills.filter(
			i => (skills || []).findIndex(skill => skill.skillId === i.id) === -1
		)

		// If a skill exists, create skills component
		let skillsComponent = null
		const categoryNames = Object.keys(skillData)
		if (categoryNames.length > 0)
			skillsComponent = (
				<div>
					{categoryNames.map(categoryName => {
						return (
							<Paper
								key={categoryName}
								style={{ padding: '10px', marginBottom: '20px' }}
								elevation={1}>
								<Typography color="primary" variant="h5">
									{categoryName}
								</Typography>

								<div>
									{skillData[categoryName].map(skill => {
										// Create lists of tools that are selected in skill and remaining unselected
										const allTools = allSkills.find(i => i.id === skill.skillId).tools.items
										let selectedTools = []
										let unselectedTools = []
										allTools.forEach(tool => {
											if (
												skill.toolIds &&
												skill.toolIds.findIndex(toolId => toolId === tool.id) > -1
											) {
												selectedTools.push(tool)
											} else unselectedTools.push(tool)
										})

										return (
											<div key={skill.id}>
												<div style={{ display: 'flex' }}>
													<Typography variant="title">{skill.name}</Typography>
													<DeleteIcon onClick={() => removeProjectSkill(skill.id)} />
												</div>

												<Typeahead
													options={unselectedTools}
													selected={selectedTools}
													multiple
													labelKey="name"
													onChange={selected =>
														this.handleUpdateTools(skill.id, skill.skillId, selected)
													}
													placeholder="Add a tool..."
													allowNew
													clearButton
												/>

												<TextField
													fullWidth
													multiline
													variant="filled"
													label="Description"
													style={{ margin: '5px 0 20px 0' }}
													name="description"
													value={skill.description || ''}
													onChange={({ target: { value } }) =>
														handleDescriptionChange(skill.id, value)
													}
												/>
											</div>
										)
									})}
								</div>
							</Paper>
						)
					})}
				</div>
			)

		return (
			<div>
				<Typography variant="h4" gutterBottom>
					Skills
				</Typography>

				{skillsComponent}

				<Typeahead
					options={unselectedSkills}
					labelKey="name"
					onChange={selected => this.handleSelectedSkill(selected)}
					ref={this.typeaheadRef}
					placeholder="Add a skill..."
					allowNew
					clearButton
				/>
			</div>
		)
	}
}

const mapStateToProps = ({ allCategories, allSkills, userId }) => ({
	allCategories,
	allSkills,
	userId,
})

const mapDispatchToProps = dispatch => {
	return {
		addSkillToStore: skill => {
			dispatch({ type: 'ADD_SKILL', skill })
		},
		addToolToAllSkills: (skillId, tool) => {
			dispatch({ type: 'ADD_TOOL_TO_SKILL', skillId, tool })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Skills)
