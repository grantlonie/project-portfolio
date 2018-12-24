import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Typography, TextField, Paper } from '@material-ui/core'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import API, { graphqlOperation } from '@aws-amplify/api'

import { createSkill, createTool } from '../../graphql/mutations'

class Skills extends Component {
	constructor(props) {
		super(props)

		this.typeaheadRef = React.createRef()
	}

	handleSelectedSkill(skill) {
		const { userId, addSkill, addSkillToStore } = this.props

		// New skill created
		if (skill[0].customOption) {
			API.graphql(
				graphqlOperation(createSkill, {
					input: { userId, name: skill[0].label },
				})
			).then(({ data: { createSkill } }) => {
				addSkillToStore(createSkill)
				addSkill(createSkill.id)
			})
		} else {
			addSkill(skill[0].id)
		}

		// clear typeahead input
		this.typeaheadRef.current.instanceRef.clear()
	}

	handleUpdateTools(skillId, tools) {
		const lastTool = tools[tools.length - 1]
		const { userId, addTool } = this.props

		// New tool created
		if (lastTool.customOption) {
			API.graphql(
				graphqlOperation(createTool, {
					input: { userId, name: lastTool.name, toolSkillId: skillId },
				})
			).then(({ data: { createTool } }) => {
				addTool(skillId, createTool.id)
			})
		} else {
			addTool(skillId, lastTool.id)
		}
	}

	render() {
		const { skills, allSkills, handleDescriptionChange } = this.props

		// Create nested skills inside respective categories
		let skillData = {}
		skills.forEach(skill => {
			const { name, category } = allSkills.find(i => i.id === skill.id)
			if (!skillData.hasOwnProperty(category.name)) skillData[category.name] = []

			skillData[category.name].push({ ...skill, name })
		})

		// List of skills that are not in project that can be added
		const unselectedSkills = allSkills.filter(
			category => (skills || []).findIndex(accCategory => accCategory.id === category.id) === -1
		)

		// If a skill exists, create skills component
		let skillsComponent = null
		const categoryNames = Object.keys(skillData)
		if (categoryNames.length > 0)
			skillsComponent = categoryNames.map(categoryName => {
				return (
					<Paper key={categoryName} style={{ padding: '10px' }} elevation={1}>
						<Typography color="primary" variant="h5">
							{categoryName}
						</Typography>

						<div>
							{skillData[categoryName].map(skill => {
								// Create lists of tools that are selected in skill and remaining unselected
								const allTools = allSkills.find(i => i.id === skill.id).tools.items
								let selectedTools = []
								let unselectedTools = []
								allTools.forEach(tool => {
									if (skill.toolIds && skill.toolIds.findIndex(toolId => toolId === tool.id) > -1) {
										selectedTools.push(tool)
									} else unselectedTools.push(tool)
								})

								return (
									<div key={skill.id}>
										<Typography variant="title">{skill.name}</Typography>

										<TextField
											fullWidth
											multiline
											variant="filled"
											label="Description"
											style={{ margin: '5px 0 20px 0' }}
											name="description"
											value={skill.description}
											onChange={({ target: { value } }) => handleDescriptionChange(skill.id, value)}
										/>

										<Typeahead
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
								)
							})}
						</div>
					</Paper>
				)
			})

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
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Skills)
