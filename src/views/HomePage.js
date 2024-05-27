import React from 'react'
import { NavLink } from 'react-router-dom'

const HomePage = () => {
  return (
    <>
       <div className="container">
            <div className="pages"> 
                <NavLink className="__pagelink" to="/wish" end>Wish</NavLink>
                <NavLink className="__pagelink" to="/wishlist" end>WishList</NavLink>
            </div>
        </div>    
    </>
  )
}

export default HomePage