import React, { Component } from 'react'
import { connect } from 'react-redux'

import Node from './Node'

class Sunburst extends Component {
	// this method creates the sunburst data by looping through categories, skills and projects
	createData() {
		const { projects, allCategories } = this.props

		let data = allCategories.map(category => {
			const skills = category.skills.items.map(skill => {
				// find projects associated with skill
				const associatedProjects = projects
					.filter(project => {
						const skillIndex = project.skills.items.findIndex(projectSkill => {
							return projectSkill.skillId === skill.id
						})
						return skillIndex !== -1
					})
					.map(({ id, name }) => ({ id, name }))

				return { ...skill, projects: associatedProjects, projectCount: associatedProjects.length }
			})

			// Number of total projects in skills
			const projectCount = skills.reduce((acc, cur) => acc + cur.projectCount, 0)

			return { ...category, skills, projectCount }
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
		const data = this.createData()

		if (data.length === 0) return <h3>Loading...</h3>

		let categoryRotation = 0

		return (
			<div
				style={{
					position: 'absolute',
					transform: `translate(${400}px, ${400}px)`,
				}}>
				<Circle data={data} radius={100} length={100} itemRotation={0} />

				{data.map((category, categoryI) => {
					// Rotation logic to determine starting point for skills
					if (categoryI > 0) categoryRotation += data[categoryI - 1].phi / 2 + category.phi / 2

					let skillRotation = categoryRotation - category.phi / 2 + category.skills[0].phi / 2

					return (
						<React.Fragment key={category.id}>
							<Circle
								data={category.skills}
								radius={200}
								length={150}
								itemRotation={skillRotation}
							/>

							{category.skills.map((skill, skillI) => {
								// If no projects exist return null
								if (!skill.projects || skill.projects.length === 0) return null

								// Rotation logic to determine starting point for skills
								if (skillI > 0) skillRotation += category.skills[skillI - 1].phi / 2 + skill.phi / 2
								const itemRotation = skillRotation - skill.phi / 2 + skill.projects[0].phi / 2

								return (
									<React.Fragment key={skill.id}>
										<Circle
											data={skill.projects}
											radius={350}
											length={200}
											itemRotation={itemRotation}
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

const Circle = ({ data, radius, length, itemRotation }) => {
	return data.map((item, itemI) => {
		if (itemI > 0) itemRotation += data[itemI - 1].phi / 2 + item.phi / 2

		return (
			<div
				key={item.id}
				style={{
					position: 'absolute',
					transform: `rotate(${itemRotation}deg) translateX(${radius}px)`,
					transformOrigin: '0 0',
				}}>
				<Node text={item.name} radius={radius} phi={item.phi} length={length} fontSize={16} />
			</div>
		)
	})
}

const mapStateToProps = ({ projects, allCategories }) => ({ projects, allCategories })

export default connect(mapStateToProps)(Sunburst)
