import React from 'react'
import { connect } from 'react-redux'
import { BarLoader } from 'react-spinners'
import { Modal, Paper } from '@material-ui/core'

const modalStyle = {
	maxWidth: '600px',
	position: 'absolute',
	top: '20%',
	left: '50%',
	transform: 'translate(-50%, 50%)',
	padding: '20px',
} as React.CSSProperties

const Spinner = ({ showSpinner }) => {
	return (
		<Modal open={showSpinner}>
			<Paper style={modalStyle} elevation={1}>
				<BarLoader heightUnit={'px'} height={150} color={'#123abc'} loading={showSpinner} />
			</Paper>
		</Modal>
	)
}

const mapStateToProps = ({ showSpinner }) => ({ showSpinner })

export default connect(mapStateToProps)(Spinner)
