import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { Typography, TextField, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { addSkill, addTool } from '../../js/actions'
import { SkillItem, ProjectSkillItem, CategoryItem, ToolItem } from '../../types'

interface Props {
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
	allTools: ToolItem[]
	skills: ProjectSkillItem[]
	addProjectSkill: (skillId: string) => null
	updateTools: (skillId: string, tools: ToolItem[]) => null
	removeProjectSkill: (skillId: string) => null
	handleDescriptionChange: (id: string, value: string) => null
	addSkill: (name: string) => Promise<any>
	addTool: (name: string) => Promise<any>
}

interface State {
	modalSkill: SkillItem
	skills: (SkillItem & { isUpdated?: boolean; skillCategoryId: '' })[]
	newSkill: string
	modal: string
}

class Skills extends Component<Props, State> {
	private typeaheadRef: any = createRef()

	async handleSelectedSkill(skill) {
		const { allSkills, addProjectSkill, addSkill } = this.props

		const { id, name, customOption } = skill[0]

		// Create new skill (only if existing skill name doesn't exist)
		if (customOption) {
			if (allSkills.findIndex(skill => skill.name === name) !== -1) {
				this.forceUpdate() // HACK: prevents skills typeaway from adding already selected skill to list
			} else {
				const skill = await addSkill(name)
				addProjectSkill(skill.id)
			}
		} else {
			addProjectSkill(id)
		}

		// clear typeahead input
		this.typeaheadRef.current.clear()
	}

	async handleUpdateTools(id, tools) {
		const { allTools, addTool, updateTools } = this.props

		const lastTool = tools[tools.length - 1] || {}
		const { name, customOption } = lastTool

		// Create new tool (only if existing tool name doesn't exist)
		if (customOption) {
			if (allTools.findIndex(tool => tool.name === name) !== -1) {
				this.forceUpdate() // HACK: prevents tools typeaway from adding already selected tool to list
			} else {
				addTool(name).then(tool => {
					tools[tools.length - 1] = tool
					updateTools(id, tools)
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
		const unselectedSkills = allSkills.filter(i => (skills || []).findIndex(skill => skill.skillId === i.id) === -1)

		// If a skill exists, create skills component
		let skillsComponent = null
		const categoryNames = Object.keys(skillData)
		if (categoryNames.length > 0)
			skillsComponent = (
				<div>
					{categoryNames.map(categoryName => {
						return (
							<Paper key={categoryName} style={{ padding: '10px', marginBottom: '20px' }} elevation={1}>
								<Typography color="primary" variant="h5">
									{categoryName}
								</Typography>

								<div>
									{skillData[categoryName].map(skill => {
										// Create lists of tools that are selected in skill and remaining unselected
										let selectedTools = []
										let unselectedTools = []
										allTools.forEach(tool => {
											if (skill.toolIds && skill.toolIds.findIndex(toolId => toolId === tool.id) > -1) {
												selectedTools.push(tool)
											} else unselectedTools.push(tool)
										})

										return (
											<div key={skill.id}>
												<div style={{ display: 'flex' }}>
													<Typography variant="h4">{skill.name}</Typography>
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
														onChange={({ target: { value } }) => handleDescriptionChange(skill.id, value)}
													/>

													<Typeahead
														id={skill.id}
														options={unselectedTools}
														selected={selectedTools}
														multiple
														labelKey="name"
														onChange={selected => this.handleUpdateTools(skill.id, selected)}
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
					id={'add-skill'}
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

const mapStateToProps = ({ allSkills, allTools }) => ({ allSkills, allTools })

const mapDispatchToProps = dispatch => ({
	addSkill: name => dispatch(addSkill(name)),
	addTool: name => dispatch(addTool(name)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Skills)
