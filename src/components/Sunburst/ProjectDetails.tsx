import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis'

import { ProjectItem } from '../../types'

interface Props {
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills and overall width */
	projectDetailsPositioning: { startX: number; startY: number; spacing: number; width: number }
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
					width: projectDetailsPositioning.width,
					transform: `translate3d(${startX}px, ${startY - 200}px, 0)`,
				}}>
				<h3>{name}</h3>
				<p>Project date: {date}</p>
				<p>{description}</p>
			</div>

			<div
				style={{
					position: 'absolute',
					width: projectDetailsPositioning.width - 120 + 'px',
					transform: `translate3d(${startX + 125}px, ${startY}px, 0)`,
				}}>
				{selectedProject.skills.items.map((skill, skillI) => {
					return (
						<div
							key={skill.id}
							style={{
								position: 'absolute',
								transform: `translate3d(0, ${skillI * spacing}px, 0)`,
							}}>
							<LinesEllipsis text={skill.description} maxLine={2} trimRight basedOn="letters" />
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default ProjectDetails
