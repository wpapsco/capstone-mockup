import { NavLink } from 'react-router-dom'

export default function Navbar()  {
    return (
        <nav>
            <NavLink activeClassName="active" to='/'>Home</NavLink>
            <NavLink to='/cart'>Cart</NavLink>
            <NavLink to='/order'>Current Order</NavLink>
        </nav>
    )
}