import { NavLink } from 'react-router-dom'
import Cart from '../features/cart/Cart'

export default function Navbar()  {
    return (
        <nav>
            <NavLink activeClassName="active" to='/'>Home</NavLink>
            <NavLink to='/order'>Current Order</NavLink>
        </nav>
    )
}