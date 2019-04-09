import React, { memo, useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Truncate from 'react-truncate'
import { Transition, TransitionGroup } from 'react-transition-group'

import { ProjectItem } from '../../types'
import { ProjectDetailsPositioning } from './types'

const transitionDuration = 500

interface Props {
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills and overall width */
	projectDetailsPositioning: ProjectDetailsPositioning
	/** project selected to show additional details. If null, don't display */
	selectedProject: ProjectItem
	/** Array of projectSkills that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
}

const ProjectDetails = (props: Props) => {
	const { projectDetailsPositioning, selectedProject, selectedProjectSkills } = props
	const { startX, startY, itemMargin, itemHeight, projectWidth, textWidth } = projectDetailsPositioning

	return (
		<div>
			<Transition in={!!selectedProject} timeout={transitionDuration}>
				{state => (
					<Header
						transitionState={state}
						selectedProject={selectedProject}
						projectDetailsPositioning={projectDetailsPositioning}
					/>
				)}
			</Transition>

			<div
				style={{
					position: 'absolute',
					width: textWidth + 'px',
					paddingLeft: '10px',
					transform: `translate3d(${startX + projectWidth}px, ${startY}px, 0)`,
				}}
			>
				<TransitionGroup>
					{(selectedProjectSkills || []).map(({ id }) => {
						let description = ''
						if (selectedProject) description = selectedProject.skills.items.find(i => i.id === id).description

						return (
							<Transition key={id} in={!!description} timeout={transitionDuration}>
								{state => (
									<SkillContent
										transitionState={state}
										itemHeight={itemHeight}
										itemMargin={itemMargin}
										description={description}
									/>
								)}
							</Transition>
						)
					})}
				</TransitionGroup>
			</div>
		</div>
	)
}

const headerTransitionStyles = {
	entering: { opacity: 1 },
	entered: { opacity: 1 },
}

const Header = memo<any>(({ transitionState, selectedProject, projectDetailsPositioning }) => {
	const { startX, startY, headerHeight, projectWidth, textWidth } = projectDetailsPositioning
	const headerTransitionY = startY - headerHeight

	const [header, setHeader] = useState({ name: '', date: '', description: '' })
	const { name, date, description } = header
	useEffect(() => {
		if (selectedProject) setHeader(selectedProject)
	}, [selectedProject])

	return (
		<div
			style={{
				position: 'absolute',
				width: projectWidth + textWidth,
				transform: `translate3d(${startX}px, ${headerTransitionY}px, 0)`,
				transition: `all ${transitionDuration}ms`,
				opacity: 0,
				...headerTransitionStyles[transitionState],
			}}
		>
			<Typography variant="h5">{name}</Typography>
			<Typography variant="body2">{date}</Typography>
			<Typography variant="body1">{description}</Typography>
		</div>
	)
})

const skillItemTransitionStyles = {
	entering: { opacity: 1, transform: 'translateX(0)' },
	entered: { opacity: 1, transform: 'translateX(0)' },
}

const SkillContent = memo<any>(({ transitionState, itemHeight, itemMargin, description }) => (
	<div
		style={{
			height: itemHeight + itemMargin,
			transition: `all ${transitionDuration}ms`,
			opacity: 0,
			transform: 'translateX(200px)',
			...skillItemTransitionStyles[transitionState],
		}}
	>
		<Truncate lines={2}>
			<Typography variant="body1">{description}</Typography>
		</Truncate>
	</div>
))

export default ProjectDetails
