import React from 'react'

import { ProjectItem } from '../../types'

interface Props {
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills */
	projectDetailsPositioning: { startX: number; startY: number; spacing: number }
	/** project selected to show additional details. If null, don't display */
	selectedProject: ProjectItem
}

const ProjectDetails = (props: Props) => {
	const { projectDetailsPositioning, selectedProject } = props
	const { startX, startY, spacing } = projectDetailsPositioning

	if (!selectedProject) return null
	console.log('selectedProject: ', selectedProject)
	const { name, date, description } = selectedProject

	return (
		<div>
			<div
				style={{
					position: 'absolute',
					width: '400px',
					transform: `translate3d(${startX}px, ${startY - 200}px, 0)`,
				}}>
				<h3>{name}</h3>
				<p>Project date: {date}</p>
				<p>{description}</p>
			</div>

			<div
				style={{
					position: 'absolute',
					width: '250px',
					transform: `translate3d(${startX + 125}px, ${startY}px, 0)`,
				}}>
				{selectedProject.skills.items.map((skill, skillI) => {
					return (
						<div key={skill.id} style={{ transform: `translate3d(0, ${skillI * spacing}, 0)` }}>
							{skill.description}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default ProjectDetails
