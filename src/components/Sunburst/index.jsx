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
				return { ...skill, phi: (skill.projectCount * 360) / totalProjects }
			})

			return { ...category, skills, phi: (category.projectCount * 360) / totalProjects }
		})

		return data
	}

	render() {
		const data = this.createData()

		if (data.length === 0) return <h3>Loading...</h3>

		console.log('data: ', data)
		let categoryRotation = 0

		return (
			<div
				style={{
					position: 'absolute',
					transform: `translate(${400}px, ${400}px)`,
				}}>
				{data.map((category, categoryI) => {
					const radius = 100
					const length = 200
					categoryRotation += category.phi
					console.log('categoryRotation: ', categoryRotation)

					return (
						<div
							key={category.id}
							style={{
								position: 'absolute',
								transform: `rotate(${categoryRotation - category.phi}deg) translateX(${radius}px)`,
								transformOrigin: '0 0',
							}}>
							<Node text={category.name} radius={radius} phi={category.phi} length={length} />
						</div>
					)
				})}
			</div>
		)
	}
}

const mapStateToProps = ({ projects, allCategories }) => ({ projects, allCategories })

export default connect(mapStateToProps)(Sunburst)
