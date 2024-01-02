import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id='nav-bar'>
      <li id='home-link'>
        <NavLink to="/" id='nav-link'>
          <img id='logo' src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Animal_Crossing_Leaf.svg/1024px-Animal_Crossing_Leaf.svg.png' /> AwayRnR
        </NavLink>
      </li>
      <li>
        <ul id="nav-bar-right">
          {sessionUser && (
            <li>
              <NavLink to="/spots/new" id='nav-link-right'>
                Create a new Spot
              </NavLink>
            </li>
          )}
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}
        </ul>
      </li>
    </ul>
  );
}

export default Navigation;
