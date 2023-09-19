import React from 'react'
import { User } from '../models/user'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import {logout as logoutUser} from '../service/users_api';
import {Link} from 'react-router-dom';

interface NavBarProps {
  loggedInUser: User | null,
  onSignUpClicked: () => void,
  onLoginClicked: () => void,
  onLogoutSuccessful: () => void,
}

const NavBar: React.FC<NavBarProps> = ({loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful}) => {
  return (
    <Navbar bg='primary' variant='dark' sticky='top' expand="sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Cool Notes App
        </Navbar.Brand>

        <Navbar.Toggle aria-controls='main-navbar' />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            <Nav.Link as={Link} to="/privacy">
              Privacy
            </Nav.Link>
          </Nav>
          <Nav className='ms-auto'>
            { loggedInUser 
              ? <NavBarLoggedInView user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful} />
              : <NavBarLogoutView onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked} />
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}


interface NavBarLoggedInViewProps {
  user: User,
  onLogoutSuccessful: () => void,
}

const NavBarLoggedInView: React.FC<NavBarLoggedInViewProps> = ({user, onLogoutSuccessful}) => {
  
  const logout = async () => {
    try {
      await logoutUser();
      onLogoutSuccessful();

    } catch (err) {
      console.log(err);
      alert(err);
    }
  }
  
  return (
    <>
      <Navbar.Text className='me-2'>Sign in as: {user.username}</Navbar.Text>
      <Button onClick={logout}>Log out</Button>
    </>
  )
}



interface NavBarLogoutViewProps {
  onSignUpClicked: ()=> void,
  onLoginClicked: ()=> void,
}

const NavBarLogoutView: React.FC<NavBarLogoutViewProps> = ({onSignUpClicked, onLoginClicked}) => {
  return (
    <>
      <Button onClick={onSignUpClicked}>Sign Up</Button>
      <Button onClick={onLoginClicked}>Log in</Button>
    </>
  )
}



export default NavBar