import React from 'react'

const strokeStyle = {vectorEffect: 'non-scaling-stroke'}

const CloseIcon = () => (
  <svg
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    width="1em"
    height="1em"
  >
    <path d="M18 7L7 18M7 7L18 18" stroke="currentColor" style={strokeStyle} />
  </svg>
)

export default CloseIcon
