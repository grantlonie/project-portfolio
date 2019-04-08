import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import LinesEllipsis from 'react-lines-ellipsis'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { ProjectItem } from '../../types'
import { ProjectDetailsPositioning } from './types'
import '../../styles/ProjectDetails.css'

interface Props {
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills and overall width */
	projectDetailsPositioning: ProjectDetailsPositioning
	/** project selected to show additional details. If null, don't display */
	selectedProject: ProjectItem
	/** Array of projectSkills that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
}

class ProjectDetails extends Component<Props> {
	shouldComponentUpdate(nextProps) {
		const { selectedProject, selectedProjectSkills } = this.props
		// prevent render if no projects are selected
		if (!selectedProject && !nextProps.selectedProject) return false
		// prevent render if projectSkills haven't changed
		if (JSON.stringify(selectedProjectSkills) === JSON.stringify(nextProps.selectedProjectSkills)) {
			return false
		}

		return true
	}

	render() {
		const { projectDetailsPositioning, selectedProject, selectedProjectSkills } = this.props
		const { startX, startY, itemMargin, headerHeight, itemHeight, projectWidth, textWidth } = projectDetailsPositioning

		const Header = function() {
			if (!selectedProject) return null

			const { name, date, description } = selectedProject

			return (
				<CSSTransition timeout={500} classNames="header">
					<div
						style={{
							position: 'absolute',
							width: projectWidth + textWidth,
							transform: `translate3d(${startX}px, ${headerTransitionY}px, 0)`,
						}}
					>
						<Typography variant="h5">{name}</Typography>
						<Typography variant="body2">Project date: {date}</Typography>
						<Typography variant="body1">{description}</Typography>
					</div>
				</CSSTransition>
			)
		}

		const headerTransitionY = startY - headerHeight

		return (
			<div>
				<TransitionGroup>{Header()}</TransitionGroup>

				<div
					style={{
						position: 'absolute',
						width: textWidth + 'px',
						paddingLeft: '10px',
						transform: `translate3d(${startX + projectWidth}px, ${startY}px, 0)`,
					}}
				>
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
												style={{ height: itemHeight + itemMargin }}
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
}

export default ProjectDetails
