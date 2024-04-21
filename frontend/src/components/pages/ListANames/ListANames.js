import React from 'react'

const ListANames = () => {
    const pathName = window.location.pathname;
  const zoneName = pathName.split("/")[3];

  return (
    <div>Zone name: {zoneName}</div>
  )
}

export default ListANames