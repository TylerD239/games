import React from 'react'

export const Loader = () => {
	return (
		<div className="d-flex justify-content-center">
			<div className="spinner-border text-warning mt-5" style={{width: "4rem", height: "4rem"}} role="status">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	)
}