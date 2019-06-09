import React from 'react'
import { connect } from 'react-redux'

import Sunburst from './Sunburst'

const appBarHeight = 64

const SunburstWrapper = ({ projects, allCategories, allSkills }) => (
	<div style={{ height: `calc(100vh - ${appBarHeight}px)` }}>
		<Sunburst projects={projects} allCategories={allCategories} allSkills={allSkills} />
	</div>
)

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(SunburstWrapper)
