import React from 'react'

import Node from './Node'

interface Props {
	/** Contains data needed to make Sunburst Circle */
	data: any
	/** Distance to inner radius of Node */
	radius: number
	/** Length of the Node */
	length: number
	/** Initial Node center rotation angle in degrees */
	itemRotation: number
	fontSize: number
	/** Id of project that is being hovered */
	hoveringProjectId?: string
	/** List of all projects needed for projects circle */
	hoverNode: (id: string) => void
	/** Fires when node is clicked */
	selectNode: (id: string) => void
	/** Array of projectSkillIds that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
	/** Where the project details list x and y position are wrt to Sunburst center */
	projectDetailsListStart?: { x: number; y: number }
}

const SunburstCircle = (props: Props) => {
	const {
		data,
		radius,
		length,
		itemRotation,
		fontSize,
		hoveringProjectId,
		hoverNode,
		selectNode,
		selectedProjectSkills,
		projectDetailsListStart,
	} = props

	let rotation = itemRotation

	return data.map((item, itemI) => {
		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + item.phi / 2
		if (rotation > 180) rotation -= 360

		let translateX = radius
		let translateY = 0
		let corrRotation = rotation
		let rectangleShape = null
		let text = item.name
		let displayFontSize = fontSize

		const skillItemIndex = selectedProjectSkills
			? selectedProjectSkills.findIndex(i => i.id === item.skillId)
			: -1

		if (skillItemIndex > -1) {
			text = selectedProjectSkills[skillItemIndex].name
			translateX = projectDetailsListStart.x
			translateY = projectDetailsListStart.y + 60 * skillItemIndex
			corrRotation = 0
			rectangleShape = { width: 100, height: 50 }
			displayFontSize = 14
		} else if (hoveringProjectId && hoveringProjectId === item.id) translateX += 10

		return (
			<div
				key={item.id}
				style={{
					position: 'absolute',
					transform: `rotate(${corrRotation}deg) translate3d(${translateX}px, ${translateY}px, 0)`,
					transition: 'all 500ms',
					transformOrigin: '0 0',
				}}>
				<Node
					rectangleShape={rectangleShape}
					text={text}
					radius={radius}
					phi={item.phi}
					length={length}
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

export default SunburstCircle
