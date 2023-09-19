import React, { useState } from 'react'
import { User } from '../models/user'
import { useForm } from 'react-hook-form'
import { LoginCredentials, login } from '../service/users_api'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import TextInputField from './form/TextInputField'
import { UnAuthorizedError } from '../errors/http_errors'

interface LoginModalProps {
  onDismiss: () => void,
  onLoginSuccessful: (user: User) => void,
}

const LoginModal: React.FC<LoginModalProps> = ({onDismiss, onLoginSuccessful}) => {

  const [errorText, setErrorText] = useState<string|null>(null)
 const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<LoginCredentials>();
 
  const onSubmit = async (credentials: LoginCredentials) => {
    try {
      const user = await login(credentials);
      onLoginSuccessful(user);
      onDismiss();

    } catch (err) {
      if(err instanceof UnAuthorizedError){
        setErrorText(err.message)
        
      } else {
        alert(err)
      }
      console.log(err)
    }
  }

  return (
    <Modal show onHide={onDismiss}>
    <Modal.Header closeButton>
      <Modal.Title>Login</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {
        errorText &&
        <Alert variant='danger'>
          {errorText}
        </Alert>
      }

      <Form id='signUpUserForm' onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name='username'
          label='Username'
          placeholder="Username"
          type="text"
          register={register}
          registerOptions={{required: "Required"}}
          error={errors.username}
        />

        <TextInputField
          name='password'
          label='Password'
          placeholder="password"
          type="password"
          register={register}
          registerOptions={{required: "Required"}}
          error={errors.password}
        />


      <Button type='submit' form='signUpUserForm' disabled={isSubmitting} className='w-100'>
        Login
      </Button>
      </Form>
    </Modal.Body>
  </Modal>
  )
}

export default LoginModal