import React from 'react'

const Node = props => {
	const { text, radius, phi, thick } = props

	// prettier-ignore
	const c1 = Math.sqrt(2 * radius^2 * (1 - Math.cos(phi/2)))
	// prettier-ignore
	const c2 = Math.sqrt(2 * (radius + thick)^2 * (1 - Math.cos(phi/2)))

	const alpha = (Math.PI - phi / 2) / 2

	const x1 = -c1 * Math.cos(alpha)
	const x2 = thick - c1 * Math.cos(alpha)
	const y1 = c1 * Math.sin(alpha)
	const y2 = c2 * Math.sin(alpha)

	return (
		<svg style={{ overflow: 'visible' }}>
			<path
				d={`M${x1} -${y1} L${x2} ${-y2} L${x2} ${y2} L${x1} ${y1} Z`}
				fill="transparent"
				stroke="black"
			/>
		</svg>
	)
}

export default Node
