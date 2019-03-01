import React, { useMemo } from 'react'
import LinesEllipsis from 'react-lines-ellipsis'

import '../../styles/node.css'

interface Props {
	/** Type of Node */
	type: 'category' | 'skill' | 'project'
	/** If used, the change node into rectangle with given values, else take the shape to fit in Sunburst */
	rectangleShape?: { width: number; height: number }
	/** The displayed text */
	text: string
	/** Inner radius of the node */
	innerRadius: number
	/** The arc angle that determines the Node's width */
	phi: number
	/** Outer radius of the node */
	outerRadius: number
	/** For text */
	fontSize: number
	/** Color of Node */
	fill: string
	/** id of the Node - category, skill or project */
	id: string
	/** Fires when hovering starts over project */
	hoverNode: (id: string, type: this['type']) => void
	/** Fires when node is clicked */
	selectNode: (id: string, type: this['type']) => void
}

const Node = (props: Props) => {
	const { type, text, innerRadius, phi, outerRadius, fontSize, fill, id, hoverNode, selectNode, rectangleShape } = props

	const width = outerRadius - innerRadius

	let x1, x2, y1, y2, c1, c2
	let adjInnerRadius = innerRadius
	let adjOuterRadius = outerRadius

	if (rectangleShape) {
		x1 = 0
		x2 = rectangleShape.width
		c1 = rectangleShape.height
		c2 = c1
		y1 = c1 / 2
		y2 = c2 / 2
		adjInnerRadius = 100000
		adjOuterRadius = 100000
	} else {
		const cosPhi = Math.cos((phi * Math.PI) / 180)
		const nodeMargin = 1

		// Law of cosines to determine thickness at inner and outer radius
		c1 = Math.sqrt(2 * Math.pow(adjInnerRadius, 2) * (1 - cosPhi))
		c2 = Math.sqrt(2 * Math.pow(outerRadius, 2) * (1 - cosPhi))

		const alpha = (180 - phi / 2) / 2
		const tanAlpha = Math.tan((alpha * Math.PI) / 180)
		x1 = -c1 / 2 / tanAlpha + nodeMargin
		x2 = width - c2 / 2 / tanAlpha - nodeMargin
		y1 = c1 / 2 - nodeMargin
		y2 = c2 / 2 - nodeMargin
	}

	const displayText = useMemo(
		() => (
			<LinesEllipsis
				className="text"
				style={{ lineHeight: fontSize + 'px' }}
				text={text}
				maxLine={Math.floor(c1 / fontSize)}
				trimRight
				basedOn="letters"
			/>
		),
		[fontSize, text]
	)

	return (
		<div>
			<svg width={width} height={c2} style={{ position: 'absolute', overflow: 'visible' }}>
				<path
					d={`
							M${x1} ${-y1}
							A ${adjInnerRadius} ${adjInnerRadius} 0 0 1 ${x1} ${y1} L${x2} ${y2} 
							A ${adjOuterRadius} ${adjOuterRadius} 0 0 0 ${x2} ${-y2} 
							Z
						`}
					fill={fill}
					style={{ transition: 'all 500ms' }}
				/>
			</svg>
			<div
				className="text-wrapper"
				onMouseOver={() => hoverNode(id, type)}
				onMouseUp={() => selectNode(id, type)}
				style={{
					top: Math.floor(-c1 / 2) + 'px',
					height: c1 + 'px',
					width: width + 'px',
					fontSize,
				}}
			>
				{displayText}
			</div>
		</div>
	)
}

export default Node
