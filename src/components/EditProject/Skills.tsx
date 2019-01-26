import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import API, { graphqlOperation } from '@aws-amplify/api'
import { Typography, TextField, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { createSkill, createTool } from '../../graphql/mutations'
import { SkillItem, ProjectSkillItem, CategoryItem, ToolItem } from '../../types'

interface Props {
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
	allTools: ToolItem[]
	userId: string
	skills: ProjectSkillItem[]
	addProjectSkill: (skillId: string) => null
	updateTools: (skillId: string, tools: ToolItem[]) => null
	removeProjectSkill: (skillId: string) => null
	handleDescriptionChange: (id: string, value: string) => null
	showSpinner: (show: boolean) => null
	addSkillToStore: (skill: SkillItem) => null
}

interface State {
	modalSkill: SkillItem
	skills: (SkillItem & { isUpdated?: boolean; skillCategoryId: '' })[]
	newSkill: string
	modal: string
}

class Skills extends Component<Props, State> {
	private typeaheadRef: any = createRef()

	handleSelectedSkill(skill) {
		const { userId, allSkills, addProjectSkill, addSkillToStore, showSpinner } = this.props

		const { id, name, customOption } = skill[0]

		// Create new skill (only if existing skill name doesn't exist)
		if (customOption) {
			if (allSkills.findIndex(skill => skill.name === name) !== -1) {
				this.forceUpdate() // HACK: prevents skills typeaway from adding already selected skill to list
			} else {
				showSpinner(true)
				;(API.graphql(
					graphqlOperation(createSkill, {
						input: { userId, name: name },
					})
				) as Promise<any>).then(({ data: { createSkill } }) => {
					addSkillToStore(createSkill)
					addProjectSkill(createSkill.id)
					showSpinner(false)
				})
			}
		} else {
			addProjectSkill(id)
		}

		// clear typeahead input
		this.typeaheadRef.current.instanceRef.clear()
	}

	handleUpdateTools(id, skillId, tools) {
		const { userId, allTools, updateTools, showSpinner } = this.props

		const lastTool = tools[tools.length - 1] || {}
		const { name, customOption } = lastTool

		// Create new tool (only if existing tool name doesn't exist)
		if (customOption) {
			if (allTools.findIndex(tool => tool.name === name) !== -1) {
				this.forceUpdate() // HACK: prevents tools typeaway from adding already selected tool to list
			} else {
				showSpinner(true)
				;(API.graphql(
					graphqlOperation(createTool, {
						input: { userId, name: name, toolSkillId: skillId },
					})
				) as Promise<any>).then(({ data: { createTool } }) => {
					const { id: toolId, name, userId } = createTool
					const newTool: any = { id: toolId, name, userId }
					tools[tools.length - 1] = newTool

					updateTools(id, tools)
					showSpinner(false)
				})
			}
		} else {
			updateTools(id, tools)
		}
	}

	render() {
		const { skills, allSkills, allTools, handleDescriptionChange, removeProjectSkill } = this.props

		// Create nested skills inside respective categories
		let skillData = {}
		skills.forEach(skill => {
			const foundSkill = allSkills.find(i => i.id === skill.skillId)

			if (!foundSkill) return // skip if skill no longer exists

			const { name, category } = foundSkill
			const categoryName = category ? category.name : 'General'

			if (!skillData.hasOwnProperty(categoryName)) skillData[categoryName] = []
			skillData[categoryName].push({ ...skill, name })
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

												<div style={{ margin: '0 0 20px 5px' }}>
													<TextField
														fullWidth
														style={{ margin: '5px 0 5px 0' }}
														multiline
														variant="filled"
														label="Description"
														name="description"
														value={skill.description || ''}
														onChange={({ target: { value } }) =>
															handleDescriptionChange(skill.id, value)
														}
													/>

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
												</div>
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

const mapStateToProps = ({ allSkills, allTools, userId }) => ({ allSkills, allTools, userId })

const mapDispatchToProps = dispatch => {
	return {
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
		addSkillToStore: skill => {
			dispatch({ type: 'ADD_SKILL', skill })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Skills)
