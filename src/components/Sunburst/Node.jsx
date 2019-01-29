import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis'

const Node = props => {
	const { text, radius, phi, length, fontSize } = props
	const cosPhi = Math.cos((phi * Math.PI) / 180)

	const nodeMargin = 1

	// Law of cosines to determine thickness at inner and outer radius
	const c1 = Math.sqrt(2 * Math.pow(radius, 2) * (1 - cosPhi))
	const c2 = Math.sqrt(2 * Math.pow(radius + length, 2) * (1 - cosPhi))

	const alpha = (180 - phi / 2) / 2
	const tanAlpha = Math.tan((alpha * Math.PI) / 180)
	const x1 = -c1 / 2 / tanAlpha
	const x2 = length - c2 / 2 / tanAlpha
	const y1 = c1 / 2 - nodeMargin //* Math.sin(alpha)
	const y2 = c2 / 2 - nodeMargin //* Math.sin(alpha)

	return (
		<div>
			<svg style={{ position: 'absolute', overflow: 'visible' }}>
				<path
					d={`
            M${x1} ${-y1}
            A ${radius} ${radius} 0 0 1 ${x1} ${y1} L${x2} ${y2} 
            A ${radius + length} ${radius + length} 0 0 0 ${x2} ${-y2} 
            Z
          `}
					fill="orange"
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					top: Math.floor(-fontSize) + 'px',
					width: length + 'px',
					paddingLeft: '5px',
					fontSize,
					margin: 'auto',
				}}>
				<LinesEllipsis text={text} maxLine="2" trimRight basedOn="letters" />
			</div>
		</div>
	)
}

export default Node
