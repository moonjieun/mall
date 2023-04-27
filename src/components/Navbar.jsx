import { Link } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import User from './User';
import Button from './ui/Button';
import { useAuthContext } from '../context/AuthContext';
import CartStatus from './CartStatus';

export default function Navbar() {
  const { user, login, logout } = useAuthContext();

  return (
    <header className='flex justify-between p-4'>
      <Link to='/' className='flex items-center text-4xl'>
        <h1 id='logo' className='text-main font-bold'>runz.</h1>
      </Link>
      <nav className='flex items-center gap-4 font-semibold'>
        <Link className='text-sub font-[outfit]' to='/products'>Products</Link>
        {user && <Link to='/carts'><CartStatus size='28' color='#594839'/></Link>}
        {user && user.isAdmin && (
          <Link to='/products/new'>
          <AiOutlinePlus size='28' color='#594839' />
        </Link>
        )}
        {user && <User user={user}/>}
        {!user && <Button 
        className='text-white font-[outfit] py-2 px-4 rounded-md hover:brightness-110 bg-[#594839]' 
        text={'Login'} 
        onClick={login} />}
        {user && <Button 
        className='text-sub font-[outfit] py-2 px-4 rounded-md hover:brightness-110 border-2 border-[#594839]' 
        text={'Logout'} 
        onClick={logout} />}
      </nav>
    </header>
  );
}


