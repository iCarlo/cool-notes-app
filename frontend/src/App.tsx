import { useEffect, useState } from 'react';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { User } from './models/user';
import { getLoggedInUser } from './service/users_api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import NoteFoundPage from './pages/NoteFoundPage';
import { Container } from 'react-bootstrap';

interface AuthenticationState {
  user: User | null,
  isLoading: boolean,
  showSignUpModal: boolean,
  showLoginModal: boolean
}

function App() {
  const [authenticationState, setAuthenticationState] = useState<AuthenticationState>({
    user: null,
    isLoading: true,
    showLoginModal: false,
    showSignUpModal: false,
  })

  useEffect(() => {
    async function getAuthenticatedUser(){
      try {
        const user = await getLoggedInUser();
        setAuthenticationState(prev => ({...prev, user, isLoading: false}))

      } catch (err) {
        console.log(err);
      } finally {
        setAuthenticationState(prev => ({...prev, isLoading: false}))
      }
    }
    
    getAuthenticatedUser();
    
  }, [])
  


  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={authenticationState.user}
          onSignUpClicked={() => setAuthenticationState(prev => ({...prev, showSignUpModal: true}))}
          onLoginClicked={() => setAuthenticationState(prev => ({...prev, showLoginModal: true}))}
          onLogoutSuccessful={() => setAuthenticationState(prev => ({...prev, user: null}))}
          
          />

          <Container className='py-5 px-0'>
            <Routes>
              <Route
                path='/'
                element={<NotesPage loggedInUser={authenticationState.user}/>}
              />
              <Route
                path='/privacy'
                element={<PrivacyPage/>}
              />
              <Route
                path='/*'
                element={<NoteFoundPage/>}
              />
            </Routes>
          </Container>

        {authenticationState.showSignUpModal && 
            <SignUpModal 
              onDismiss={() => setAuthenticationState(prev => ({...prev, showSignUpModal: false}))} 
              onSignUpSucessful={(user) => setAuthenticationState(prev => ({...prev, user: user}))} 
            />
          }

          {authenticationState.showLoginModal && 
            <LoginModal 
              onDismiss={() => setAuthenticationState(prev => ({...prev, showLoginModal: false}))} 
              onLoginSuccessful={(user) => setAuthenticationState(prev => ({...prev, user: user}))} 
            />
          }
      </div>
    </BrowserRouter>
  );
}

export default App;
