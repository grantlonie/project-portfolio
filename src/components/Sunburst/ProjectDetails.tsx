import React, { Component } from 'react'
import LinesEllipsis from 'react-lines-ellipsis'

import { ProjectItem } from '../../types'

interface Props {
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills and overall width */
	projectDetailsPositioning: { startX: number; startY: number; spacing: number; width: number }
	/** project selected to show additional details. If null, don't display */
	selectedProject: ProjectItem
	/** Array of projectSkills that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
	/** Height of the project details header with description and date */
	projectHeaderHeight: number
}

const ProjectDetails = (props: Props) => {
	const {
		projectDetailsPositioning,
		selectedProject,
		projectHeaderHeight,
		selectedProjectSkills,
	} = props
	const { startX, startY, spacing } = projectDetailsPositioning

	const { id, name, date, description } = selectedProject || {
		id: null,
		name: '',
		date: '',
		description: '',
	}

	const headerTransitionY = startY - projectHeaderHeight - (id ? 0 : 200)

	return (
		<div>
			<div
				style={{
					position: 'absolute',
					width: projectDetailsPositioning.width,
					transform: `translate3d(${startX}px, ${headerTransitionY}px, 0)`,
					opacity: id ? 1 : 0,
					transition: 'all 500ms',
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
				{!id ? (
					<div
						key="first-description"
						style={{
							position: 'absolute',
							transform: `translate3d(${200}px, 0px, 0)`,
							opacity: 0,
							transition: 'all 500ms',
						}}
					/>
				) : (
					selectedProject.skills.items.map((skill, skillI) => {
						const visible = selectedProjectSkills.findIndex(i => i.id === skill.id) > -1

						return (
							<div
								key={skillI === 0 ? 'first-description' : skill.id}
								style={{
									position: 'absolute',
									transform: `translate3d(${visible ? 0 : 200}px, ${skillI * spacing}px, 0)`,
									opacity: visible ? 1 : 0,
									transition: 'all 500ms',
								}}>
								<LinesEllipsis
									text={skill.description || ''}
									maxLine={2}
									trimRight
									basedOn="letters"
								/>
							</div>
						)
					})
				)}
			</div>
		</div>
	)
}

export default ProjectDetails
