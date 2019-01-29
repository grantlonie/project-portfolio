import React from 'react'

import Node from './Node'

interface Props {
	data: any
	radius: number
	length: number
	itemRotation: number
	fontSize: number
	hoveringProjectId?: string
	startProjectHovering?: (id: string) => void
}

const SunburstCircle = (props: Props) => {
	const {
		data,
		radius,
		length,
		itemRotation,
		fontSize,
		hoveringProjectId,
		startProjectHovering,
	} = props

	let rotation = itemRotation

	return data.map((item, itemI) => {
		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + item.phi / 2

		let translate = radius
		if (hoveringProjectId && hoveringProjectId === item.id) translate += 50

		return (
			<div
				key={item.id}
				style={{
					position: 'absolute',
					transform: `rotate(${rotation}deg) translateX(${translate}px)`,
					transformOrigin: '0 0',
				}}>
				<Node
					text={item.name}
					radius={radius}
					phi={item.phi}
					length={length}
					fontSize={fontSize}
					fill={item.fill}
					id={item.id}
					startProjectHovering={startProjectHovering}
				/>
			</div>
		)
	})
}

export default SunburstCircle
