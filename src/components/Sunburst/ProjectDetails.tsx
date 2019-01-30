import React from 'react'

interface Props {
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills */
	projectDetailsPositioning: { startX: number; startY: number; spacing: number }
	/** project selected to show additional details. If null, don't display */
	selectedProject
}

const ProjectDetails = (props: Props) => {
	const { projectDetailsPositioning, selectedProject } = props
	const { startX, startY, spacing } = projectDetailsPositioning

	if (!selectedProject) return null

	return (
		<div
			style={{
				position: 'absolute',
				transform: `translate(${startX}px, ${startY - 100}px)`,
			}}>
			{selectedProject.name}
		</div>
	)
}

export default ProjectDetails
