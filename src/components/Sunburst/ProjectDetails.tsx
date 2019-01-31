import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { ProjectItem } from '../../types'
import '../../styles/ProjectDetails.css'

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

	// if (!selectedProject) return null

	const Header = function() {
		if (!selectedProject) return null

		const { name, date, description } = selectedProject

		return (
			<CSSTransition timeout={500} classNames="header">
				<div
					style={{
						position: 'absolute',
						width: projectDetailsPositioning.width,
						transform: `translate3d(${startX}px, ${headerTransitionY}px, 0)`,
					}}>
					<h3>{name}</h3>
					<p>Project date: {date}</p>
					<p>{description}</p>
				</div>
			</CSSTransition>
		)
	}

	const headerTransitionY = startY - projectHeaderHeight

	return (
		<div>
			<TransitionGroup>{Header()}</TransitionGroup>

			<div
				style={{
					position: 'absolute',
					width: projectDetailsPositioning.width - 120 + 'px',
					transform: `translate3d(${startX + 125}px, ${startY}px, 0)`,
				}}>
				<TransitionGroup>
					{!selectedProjectSkills
						? null
						: selectedProjectSkills.map(({ id }) => {
								let description = ''
								if (!selectedProject) return null
								description = selectedProject.skills.items.find(i => i.id === id).description

								return (
									<CSSTransition key={id} timeout={500} classNames="list">
										<LinesEllipsis
											style={{ height: spacing }}
											text={description || ''}
											maxLine={2}
											trimRight
											basedOn="letters"
										/>
									</CSSTransition>
								)
						  })}
				</TransitionGroup>
			</div>
		</div>
	)
}

export default ProjectDetails
