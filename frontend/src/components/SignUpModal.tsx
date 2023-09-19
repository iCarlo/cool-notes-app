import React, { useState } from 'react'
import { User } from '../models/user'
import { useForm } from 'react-hook-form'
import { SignUpCredentials, signUp } from '../service/users_api'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import TextInputField from './form/TextInputField'
import { ConflictError } from '../errors/http_errors'

interface SignUpModalProps {
  onDismiss: () => void,
  onSignUpSucessful: (user: User) => void,
}

const SignUpModal: React.FC<SignUpModalProps> = ({onDismiss, onSignUpSucessful}) => {

  const [errorText, setErrorText] = useState<string|null>(null)

  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignUpCredentials>()

  const onSubmit = async (credentials: SignUpCredentials) => {
    try {
      const newUser = await signUp(credentials);
      onSignUpSucessful(newUser);
      onDismiss();

    } catch (err) {

      if(err instanceof ConflictError){
        setErrorText(err.message)
      } else {
        alert(err);
      }

      console.log(err);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {
          errorText &&
          <Alert variant='danger'>
            {errorText}
          </Alert>
        }

        <Form onSubmit={handleSubmit(onSubmit)}>
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
            name='email'
            label='Email'
            placeholder="Email"
            type="email"
            register={register}
            registerOptions={{required: "Required"}}
            error={errors.email}
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


        <Button type='submit' disabled={isSubmitting} className='w-100'>
          Sign Up
        </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default SignUpModal