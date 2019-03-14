import React from 'react'

const totalHeight = 400
const itemTopMargin = 2
const itemLeftMargin = 3

const categoryWidth = 175
const skillWidth = 150
const projectWidth = 200
const categoryTranslate = 175

const skillTranslate = categoryTranslate + categoryWidth + itemLeftMargin
const projectTranslate = skillTranslate + skillWidth + itemLeftMargin

export const categoryInfo = {
	totalHeight,
	itemTopMargin,
	category: {
		width: categoryWidth,
		translate: categoryTranslate,
	},
	skill: {
		width: skillWidth,
		translate: skillTranslate,
	},
	project: {
		width: projectWidth,
		translate: projectTranslate,
	},
}

interface Props {
	show: any
}

const CategoryDetails = (props: Props) => {
	if (!props.show) return null

	return <div>hi</div>
}

export default CategoryDetails
