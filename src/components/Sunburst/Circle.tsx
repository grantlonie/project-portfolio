import React, { Component } from 'react'

import { ProjectItem } from '../../types'
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
	selectedProjectSkillIds?: string[]
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
		selectedProjectSkillIds,
	} = props

	let rotation = itemRotation

	return data.map((item, itemI) => {
		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + item.phi / 2
		if (rotation > 180) rotation -= 360

		let translate = radius
		let corrRotation = rotation

		if (
			selectedProjectSkillIds &&
			selectedProjectSkillIds.findIndex(i => i === item.skillId) > -1
		) {
			translate = 600
			corrRotation = 0
		} else if (hoveringProjectId && hoveringProjectId === item.id) translate += 10

		return (
			<div
				key={item.id}
				style={{
					position: 'absolute',
					transform: `rotate(${corrRotation}deg) translateX(${translate}px)`,
					transition: 'all 500ms',
					transformOrigin: '0 0',
				}}>
				<Node
					location={null}
					text={item.name}
					radius={radius}
					phi={item.phi}
					length={length}
					fontSize={fontSize}
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
