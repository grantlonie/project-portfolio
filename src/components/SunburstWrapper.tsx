import React, { useEffect, useState, useRef } from 'react'
import { FormControlLabel, Switch, Fab, Popover, makeStyles, Typography } from '@material-ui/core'
import CodeIcon from '@material-ui/icons/CodeOutlined'
import { connect } from 'react-redux'

import Sunburst from './Sunburst'
import { getSampleData } from '../js/sampleData'

const appBarHeight = 64
const footerHeight = 60

const emptyData = { projects: [], allCategories: [], allSkills: [] }

const useStyles = makeStyles(theme => ({
	sunburst: { height: `calc(100vh - ${appBarHeight + footerHeight}px)` },
	footer: { height: footerHeight, display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 20px' },
	toggle: { marginBottom: 0 },
	codePopper: { whiteSpace: 'pre-wrap' },
}))

const SunburstWrapper = ({ user, projects, allCategories, allSkills }) => {
	const [wantSampleData, setWantSampleData] = useState(false)
	const [sunburstData, setSunburstData] = useState(emptyData as any)
	const [showCode, setShowCode] = useState(false)
	const codeRef = useRef()

	useEffect(() => {
		if (!wantSampleData) {
			setSunburstData({ projects, allCategories, allSkills })
		} else {
			getSampleData().then(data => {
				setSunburstData(data)
			})
		}
	}, [wantSampleData, projects, allCategories, allSkills])

	const handleCodeClick = () => {
		setShowCode(true)
	}

	const { id: userId, APIkey } = user || { id: null, APIkey: null }
	const { sunburst, footer, toggle, codePopper } = useStyles({})

	return (
		<div>
			<div className={sunburst}>
				<Sunburst {...sunburstData} />
			</div>

			<div className={footer}>
				<FormControlLabel
					className={toggle}
					control={<Switch checked={wantSampleData} onChange={() => setWantSampleData(s => !s)} />}
					label="Sample Data"
				/>

				<Fab ref={codeRef} size="small" color="secondary" onClick={handleCodeClick}>
					<CodeIcon />
				</Fab>

				<Popover
					open={showCode}
					className={codePopper}
					anchorEl={codeRef.current}
					onClose={() => setShowCode(false)}
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
					transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				>
					<CodeString userId={userId} APIkey={APIkey} />
				</Popover>
			</div>
		</div>
	)
}

const useCodePopperStyles = makeStyles(theme => ({
	wrapper: { margin: '10px' },
	code: { backgroundColor: 'gray', color: 'white' },
}))

const CodeString = ({ userId, APIkey }) => {
	const { wrapper, code } = useCodePopperStyles({})

	return (
		<div className={wrapper}>
			<Typography variant="h5">Sample script</Typography>
			<Typography>
				Here is a sample snippet on how to include the sunburst into your project. The content will be contained within the
				sunburst-mount node, so you have to at least specify the height of the node.
			</Typography>
			<Typography className={code}>
				{`<html>
	<head>...</head>
	<body>
		<div id="sunburst-mount" style="height: 500px"></div>

		<script src="TODO-PUT CDN PATH HERE"></script>
		<script>
			sunburst.render('${userId}', '${APIkey || 'Your API Key'}', 'sunburst-mount')
		</script>
	</body>
</html>`}
			</Typography>
		</div>
	)
}

const mapStateToProps = ({ user, projects, allCategories, allSkills }) => ({
	user,
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(SunburstWrapper)
