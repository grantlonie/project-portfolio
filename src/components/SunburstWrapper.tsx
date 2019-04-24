import React from 'react'

import Sunburst from './Sunburst'

const appBarHeight = 64

const SunburstWrapper = () => (
	<div style={{ height: `calc(100vh - ${appBarHeight}px)` }}>
		<Sunburst />
	</div>
)

export default SunburstWrapper
