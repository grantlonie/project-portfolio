import React from 'react'

import LinesEllipsis from 'react-lines-ellipsis'
import '../../styles/node.css'

interface Props {
	text: string
	radius: number
	phi: number
	length: number
	fontSize: number
	fill: string
}

const Node = (props: Props) => {
	const { text, radius, phi, length, fontSize, fill } = props
	const cosPhi = Math.cos((phi * Math.PI) / 180)

	const nodeMargin = 1

	// Law of cosines to determine thickness at inner and outer radius
	const c1 = Math.sqrt(2 * Math.pow(radius, 2) * (1 - cosPhi))
	const c2 = Math.sqrt(2 * Math.pow(radius + length, 2) * (1 - cosPhi))

	const alpha = (180 - phi / 2) / 2
	const tanAlpha = Math.tan((alpha * Math.PI) / 180)
	const x1 = -c1 / 2 / tanAlpha + nodeMargin
	const x2 = length - c2 / 2 / tanAlpha - nodeMargin
	const y1 = c1 / 2 - nodeMargin
	const y2 = c2 / 2 - nodeMargin

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
					fill={fill}
				/>
			</svg>
			<div
				className="text-wrapper"
				style={{
					top: Math.floor(-c1 / 2) + 'px',
					height: c1 + 'px',
					width: length + 'px',
					fontSize,
				}}>
				<LinesEllipsis
					className="text"
					style={{ lineHeight: fontSize + 'px' }}
					text={text}
					maxLine={Math.floor(c1 / fontSize)}
					trimRight
					basedOn="letters"
				/>
			</div>
		</div>
	)
}

export default Node
