import React from 'react'

import Node from './Node'

const Circle = ({ data, radius, length, itemRotation, fontSize }) => {
	return data.map((item, itemI) => {
		if (itemI > 0) itemRotation += data[itemI - 1].phi / 2 + item.phi / 2

		return (
			<div
				key={item.id}
				style={{
					position: 'absolute',
					transform: `rotate(${itemRotation}deg) translateX(${radius}px)`,
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

export default Circle
