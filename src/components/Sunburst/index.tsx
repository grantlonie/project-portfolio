import React, { Component } from 'react'
import { connect } from 'react-redux'

import Circle from './Circle'
import { ProjectItem, CategoryItem } from '../../types'

const colors = ['#6ff5fc', 'orange', 'gray', '#ff5959']

interface Props {
	projects: ProjectItem[]
	allCategories: CategoryItem[]
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
			fill: string
			phi: number
		}[]
	}[]
}

class Sunburst extends Component<Props> {
	// this method creates the sunburst data by looping through categories, skills and projects
	createData() {
		const { projects, allCategories } = this.props

		let data = allCategories.map((category, categoryI) => {
			const skills = category.skills.items
				.map(skill => {
					// find projects associated with skill
					const associatedProjects = projects
						.filter(project => {
							const skillIndex = project.skills.items.findIndex(projectSkill => {
								return projectSkill.skillId === skill.id
							})
							return skillIndex !== -1
						})
						.map(({ id, name }) => ({ id, name, phi: null, fill: colors[categoryI] }))

					// If no projects are associated with skill
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

		// Count total projects and calculate rotation angle for each category, skill and project
		const totalProjects = data.reduce((acc, cur) => acc + cur.projectCount, 0)
		data = data.map(category => {
			const skills = category.skills.map(skill => {
				const projects = skill.projects.map(project => ({ ...project, phi: 360 / totalProjects }))

				return { ...skill, projects, phi: (skill.projectCount * 360) / totalProjects }
			})

			return { ...category, skills, phi: (category.projectCount * 360) / totalProjects }
		})

		return data
	}

	render() {
		const data: SunburstData[] = this.createData()

		if (data.length === 0) return <h3>Loading...</h3>

		let categoryRotation = 0

		return (
			<div
				style={{
					position: 'absolute',
					transform: `translate(${300}px, ${400}px)`,
				}}>
				<Circle data={data} radius={50} length={75} itemRotation={0} fontSize={14} />

				{data.map((category, categoryI) => {
					// Rotation logic for skills
					if (categoryI > 0) categoryRotation += data[categoryI - 1].phi / 2 + category.phi / 2
					let skillRotation = categoryRotation - category.phi / 2 + category.skills[0].phi / 2

					return (
						<React.Fragment key={category.id}>
							<Circle
								data={category.skills}
								radius={125}
								length={75}
								itemRotation={skillRotation}
								fontSize={12}
							/>

							{category.skills.map((skill, skillI) => {
								// Rotation logic for projects
								if (skillI > 0) skillRotation += category.skills[skillI - 1].phi / 2 + skill.phi / 2
								const projectRotation = skillRotation - skill.phi / 2 + skill.projects[0].phi / 2

								return (
									<React.Fragment key={skill.id}>
										<Circle
											data={skill.projects}
											radius={200}
											length={50}
											itemRotation={projectRotation}
											fontSize={10}
										/>
									</React.Fragment>
								)
							})}
						</React.Fragment>
					)
				})}
			</div>
		)
	}
}

const mapStateToProps = ({ projects, allCategories }) => ({ projects, allCategories })

export default connect(mapStateToProps)(Sunburst)
