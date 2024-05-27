import React from 'react'
import { NavLink } from 'react-router-dom'

const HomePage = () => {
  return (
    <>
       <div className="container">
            <div className="pages"> 
                <NavLink className="__pagelink" to="/wish" end>TILLÖNSKAN</NavLink>
                <NavLink className="__pagelink" to="/wishlist" end>ÖNSKELISTA</NavLink>
            </div>
        </div>    
    </>
  )
}

export default HomePage