import React from 'react'

const Node = props => {
	const { text, radius, phi, length } = props
	const cosPhi = Math.cos((phi * Math.PI) / 180)

	// Law of cosines to determine thickness at inner and outer radius
	const c1 = Math.sqrt(2 * Math.pow(radius, 2) * (1 - cosPhi))
	const c2 = Math.sqrt(2 * Math.pow(radius + length, 2) * (1 - cosPhi))

	const x1 = 0 //-c1 * Math.cos(alpha)
	const x2 = length //- c1 * Math.cos(alpha)
	const y1 = c1 / 2 //* Math.sin(alpha)
	const y2 = c2 / 2 //* Math.sin(alpha)

	return (
		<svg style={{ overflow: 'visible' }}>
			<path
				d={`
          M${x1} ${-y1}
          A ${radius} ${radius} 0 0 1 ${x1} ${y1} L${x2} ${y2} 
          A ${radius + length} ${radius + length} 0 0 0 ${x2} ${-y2} 
          Z
        `}
				fill="orange"
			/>
			<text>{text}</text>
		</svg>
	)
}

export default Node
