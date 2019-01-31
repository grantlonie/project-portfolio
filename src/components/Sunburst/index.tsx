import React, { Component } from 'react'
import { connect } from 'react-redux'

import Circle from './Circle'
import ProjectDetails from './ProjectDetails'
import { ProjectItem, CategoryItem, SkillItem } from '../../types'

/** Colors for the categories and associated skills and projects */
const colors = ['#6ff5fc', 'orange', 'gray', '#ff5959', '#f682ff']

interface Props {
	projects: ProjectItem[]
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
}

interface SunburstData {
	id: string
	name: string
	fill: string
	phi: number
	projectCount: number
	skills: {
		id: string
		name: string
		fill: string
		phi: number
		projectCount: number
		projects: {
			id: string
			name: string
			skillId: string
			fill: string
			phi: number
		}[]
	}[]
}

interface State {
	/** hold the sunburst data */
	sunburstData: SunburstData[]
	/** Project the user is hovering over */
	hoveringProjectId: string
	/** Selected project to show more details */
	selectedProject: ProjectItem
	/** Array of projectSkills that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
}

class Sunburst extends Component<Props, State> {
	/** Where the project details are positioned relative the sunburst center */
	private projectDetailsPositioning: {
		startX: number
		startY: number
		spacing: number
		width: number
	}
	/** Diameter of sunburst */
	private sunburstDiameter: number
	/** x and y sunburst center position */
	private sunburstPosition: { x: number; y: number }
	/** Inner radius for each circle of sunburst */
	private radiuses: { category: number; skill: number; project: number; outer: number }
	/** Height of the project details header with description and date */
	private projectHeaderHeight: number = 170

	constructor(props) {
		super(props)

		// Based on screen width, determine side by side or stacked view and size of sunburst
		const screenWidth = window.innerWidth
		const normalDiameter = 400
		const minSideBySideWidth = 800
		const sunburstMargin = 20

		let sunBurstXPosition
		if (screenWidth > minSideBySideWidth) {
			this.sunburstDiameter = Math.max(screenWidth * 0.4, normalDiameter)
			sunBurstXPosition = this.sunburstDiameter / 2 + sunburstMargin
			this.projectDetailsPositioning = {
				startX: sunBurstXPosition,
				startY: this.projectHeaderHeight - this.sunburstDiameter / 2,
				spacing: 60,
				width: screenWidth - this.sunburstDiameter - sunburstMargin * 4,
			}
		} else {
			this.sunburstDiameter = Math.min(normalDiameter, screenWidth - sunburstMargin * 2)
			sunBurstXPosition = screenWidth / 2
			this.projectDetailsPositioning = {
				startX: -sunBurstXPosition,
				startY: this.sunburstDiameter,
				spacing: 60,
				width: screenWidth,
			}
		}

		this.sunburstPosition = {
			x: sunBurstXPosition,
			y: this.sunburstDiameter / 2 + sunburstMargin,
		}

		this.radiuses = {
			category: (this.sunburstDiameter * 0.2) / 2,
			skill: (this.sunburstDiameter * 0.5) / 2,
			project: (this.sunburstDiameter * 0.8) / 2,
			outer: this.sunburstDiameter / 2,
		}

		this.state = {
			sunburstData: this.createData(),
			hoveringProjectId: null,
			selectedProject: null,
			selectedProjectSkills: [],
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.allCategories.length !== this.props.allCategories.length) {
			this.setState({ sunburstData: this.createData() })
		}
	}

	/**
	 * Returns the associated list of projects with a given skillId
	 * @param skillId - skillId to search for in projects
	 * @param categoryI - current category index for choosing color
	 */
	associatedProjects(skillId, categoryI) {
		const { projects } = this.props

		return projects
			.map(({ id, name, skills }) => {
				const projectSkill = skills.items.find(projectSkill => {
					return projectSkill.skillId === skillId
				})
				if (!projectSkill) return null
				return { id, name, skillId: projectSkill.id, phi: null, fill: colors[categoryI] }
			})
			.filter(project => project !== null)
	}

	// this method creates the sunburst data by looping through categories, skills and projects
	createData() {
		const { allCategories, allSkills } = this.props

		if (allCategories.length === 0) return []

		let sunburstData: SunburstData[] = allCategories.map((category, categoryI) => {
			const skills = category.skills.items
				.map(skill => {
					const associatedProjects = this.associatedProjects(skill.id, categoryI)
					if (associatedProjects.length === 0) return null

					return {
						...skill,
						projects: associatedProjects,
						projectCount: associatedProjects.length,
						phi: null,
						fill: colors[categoryI],
					}
				})
				.filter(skill => skill !== null)

			// Number of total projects in skills
			const projectCount = skills.reduce((acc, cur) => acc + cur.projectCount, 0)

			return { ...category, skills, projectCount, phi: null, fill: colors[categoryI] }
		})

		// Add general category (no category) skills
		const generalCategorySkills = allSkills
			.filter(skill => skill.category === null)
			.map(skill => {
				const associatedProjects = this.associatedProjects(skill.id, colors.length - 1)
				if (associatedProjects.length === 0) return null
				return {
					id: skill.id,
					name: skill.name,
					projects: associatedProjects,
					projectCount: associatedProjects.length,
					phi: null,
					fill: colors[colors.length - 1],
				}
			})
			.filter(skill => skill !== null)

		sunburstData.push({
			name: 'General',
			fill: colors[colors.length - 1],
			id: null,
			phi: null,
			projectCount: generalCategorySkills.reduce((acc, cur) => acc + cur.projectCount, 0),
			skills: generalCategorySkills,
		})

		// Count total projects and calculate rotation angle for each category, skill and project
		const totalProjects = sunburstData.reduce((acc, cur) => acc + cur.projectCount, 0)
		sunburstData = sunburstData.map(category => {
			const skills = category.skills.map(skill => {
				const projects = skill.projects.map(project => ({ ...project, phi: 360 / totalProjects }))

				return { ...skill, projects, phi: (skill.projectCount * 360) / totalProjects }
			})

			return { ...category, skills, phi: (category.projectCount * 360) / totalProjects }
		})

		return sunburstData
	}

	/**
	 * Method called after user hovers over a node
	 * @param type - Type of node - category, skill or project
	 * @param id - Node id
	 */
	hoverNode(type, id) {
		if (type === 'project') this.setState({ hoveringProjectId: id })
	}

	/**
	 * Method called after user clicks a node
	 * @param type - Type of node - category, skill or project
	 * @param id - Node id
	 */
	selectNode(type: string, id: string) {
		if (type !== 'project') return

		if (this.state.selectedProject) {
			this.setState({ selectedProject: null, selectedProjectSkills: null })
			setTimeout(() => {
				this.selectNode(type, id)
			}, 500)
			return
		}

		// Find selected project and create list of project skills from selected project
		const selectedProject = this.props.projects.find(project => project.id === id)

		const projectSkills = selectedProject.skills.items.map(projectSkill => {
			const name = this.props.allSkills.find(skill => skill.id === projectSkill.skillId).name
			return { id: projectSkill.id, name }
		})

		// Add first project skill to selectedProjectSkills
		let selectedProjectSkills: State['selectedProjectSkills'] = []
		selectedProjectSkills.push(projectSkills[0])
		this.setState({ selectedProject, selectedProjectSkills, hoveringProjectId: null })

		// Slowly add project skills to selectedProjectSkills
		if (projectSkills.length < 2) return
		let i = 1
		let projectSkillInterval = setInterval(() => {
			selectedProjectSkills.push(projectSkills[i])
			this.setState({ selectedProjectSkills })
			i++
			if (i === projectSkills.length) clearInterval(projectSkillInterval)
		}, 100)
	}

	render() {
		const { sunburstData, hoveringProjectId, selectedProject, selectedProjectSkills } = this.state

		if (sunburstData.length === 0) return <h3>Loading...</h3>

		let categoryRotation = 0

		return (
			<div
				style={{
					position: 'absolute',
					transform: `translate(${this.sunburstPosition.x}px, ${this.sunburstPosition.y}px)`,
				}}>
				<Circle
					data={sunburstData}
					innerRadius={this.radiuses.category}
					outerRadius={this.radiuses.skill}
					itemRotation={0}
					fontSize={14}
					hoveringProjectId={this.state.hoveringProjectId}
					hoverNode={this.hoverNode.bind(this, 'category')}
					selectNode={this.selectNode.bind(this, 'category')}
				/>

				{sunburstData.map((category, categoryI) => {
					// Rotation logic for skills
					if (categoryI > 0)
						categoryRotation += sunburstData[categoryI - 1].phi / 2 + category.phi / 2
					let skillRotation = categoryRotation - category.phi / 2 + category.skills[0].phi / 2

					return (
						<React.Fragment key={category.id}>
							<Circle
								data={category.skills}
								innerRadius={this.radiuses.skill}
								outerRadius={this.radiuses.project}
								itemRotation={skillRotation}
								fontSize={12}
								hoveringProjectId={this.state.hoveringProjectId}
								hoverNode={this.hoverNode.bind(this, 'skill')}
								selectNode={this.selectNode.bind(this, 'skill')}
							/>

							{category.skills.map((skill, skillI) => {
								// Rotation logic for projects
								if (skillI > 0) skillRotation += category.skills[skillI - 1].phi / 2 + skill.phi / 2
								const projectRotation = skillRotation - skill.phi / 2 + skill.projects[0].phi / 2

								return (
									<React.Fragment key={skill.id}>
										<Circle
											data={skill.projects}
											innerRadius={this.radiuses.project}
											outerRadius={this.radiuses.outer}
											itemRotation={projectRotation}
											fontSize={10}
											hoveringProjectId={hoveringProjectId}
											hoverNode={this.hoverNode.bind(this, 'project')}
											selectNode={this.selectNode.bind(this, 'project')}
											selectedProjectSkills={selectedProjectSkills}
											projectDetailsPositioning={this.projectDetailsPositioning}
										/>
									</React.Fragment>
								)
							})}
						</React.Fragment>
					)
				})}

				<ProjectDetails
					projectDetailsPositioning={this.projectDetailsPositioning}
					selectedProject={selectedProject}
					selectedProjectSkills={selectedProjectSkills}
					projectHeaderHeight={this.projectHeaderHeight}
				/>
			</div>
		)
	}
}

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(Sunburst)
