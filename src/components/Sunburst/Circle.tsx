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
	/** callback triggered when hovering starts over a node */
	hoverNode: (id: string) => void
	/** Fires when node is clicked */
	selectNode: (id: string) => void
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
	} = props

	let rotation = itemRotation

	return data.map((item, itemI) => {
		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + item.phi / 2

		let translate = radius
		if (hoveringProjectId && hoveringProjectId === item.id) translate += 10

		return (
			<div
				key={item.id}
				style={{
					position: 'absolute',
					transform: `rotate(${rotation}deg) translateX(${translate}px)`,
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
