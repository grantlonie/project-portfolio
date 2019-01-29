import React from 'react'

import Node from './Node'

interface Props {
	data: any
	radius: number
	length: number
	itemRotation: number
	fontSize: number
}

const SunburstCircle = (props: Props) => {
	const { data, radius, length, itemRotation, fontSize } = props
	let rotation = itemRotation

	return data.map((item, itemI) => {
		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + item.phi / 2

		return (
			<div
				key={item.id}
				style={{
					position: 'absolute',
					transform: `rotate(${rotation}deg) translateX(${radius}px)`,
					transformOrigin: '0 0',
				}}>
				<Node
					text={item.name}
					radius={radius}
					phi={item.phi}
					length={length}
					fontSize={fontSize}
					fill={item.fill}
				/>
			</div>
		)
	})
}

export default SunburstCircle
