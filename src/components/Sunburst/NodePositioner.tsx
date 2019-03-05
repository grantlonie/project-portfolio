import React from 'react'

import { ProjectItem } from '../../types'
import Node from './Node'

interface Props {
	/** Type of circle */
	type: 'category' | 'skill' | 'project'
	/** Contains data needed to make Sunburst Circle */
	data: any
	/** Distance to inner radius of Node */
	innerRadius: number
	/** Distance to the outer radius of Node */
	outerRadius: number
	/** Initial Node center rotation angle in degrees */
	itemRotation: number
	fontSize: number
	/** Id of project that is being hovered */
	hoveringProjectId?: string
	/** List of all projects needed for projects circle */
	hoverNode: (id: string, type: this['type']) => void
	/** Fires when node is clicked */
	selectNode: (id: string, type: this['type']) => void
	/** project selected to show additional details. If null, don't display */
	selectedProject?: ProjectItem
	/** Array of projectSkillIds that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills */
	projectDetailsPositioning?: { startX: number; startY: number; spacing: number }
}

const NodePositioner = (props: Props) => {
	const {
		type,
		data,
		innerRadius,
		outerRadius,
		itemRotation,
		fontSize,
		hoveringProjectId,
		hoverNode,
		selectNode,
		selectedProject,
		selectedProjectSkills,
		projectDetailsPositioning,
	} = props

	let rotation = itemRotation

	return data.map((item, itemI) => {
		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + item.phi / 2
		if (rotation > Math.PI) rotation -= Math.PI * 2

		let translateX = innerRadius
		let translateY = 0
		let corrRotation = rotation
		let rectangleShape = null
		let text = item.name
		let displayFontSize = fontSize

		// Determine if project skill is selected, hovering or in queue to be selected
		let skillItemIndex = -1
		let projectIsSelected = false
		if (selectedProjectSkills) {
			skillItemIndex = selectedProjectSkills.findIndex(i => i.id === item.skillId)
		}
		if (skillItemIndex === -1 && selectedProject) projectIsSelected = item.id === selectedProject.id

		if (skillItemIndex > -1) {
			const { startX, startY, spacing } = projectDetailsPositioning
			text = selectedProjectSkills[skillItemIndex].name
			rectangleShape = { width: 100, height: 50 }
			translateX = startX
			translateY = startY + rectangleShape.height / 2 + spacing * skillItemIndex
			corrRotation = 0
			displayFontSize = 14
		} else if (projectIsSelected) translateX += 30
		else if (hoveringProjectId && hoveringProjectId === item.id) translateX += 10

		return (
			<div
				key={item.id}
				style={{
					position: 'absolute',
					transform: `rotate(${corrRotation}rad) translate3d(${translateX}px, ${translateY}px, 0)`,
					transition: 'all 500ms',
					transformOrigin: '0 0',
				}}
			>
				<Node
					type={type}
					rectangleShape={rectangleShape}
					text={text}
					innerRadius={innerRadius}
					phi={item.phi}
					outerRadius={outerRadius}
					fontSize={displayFontSize}
					fill={item.fill}
					id={item.id}
					hoverNode={hoverNode}
					selectNode={selectNode}
				/>
			</div>
		)
	})
}

export default NodePositioner
