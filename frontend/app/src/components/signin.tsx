import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { verifyUser } from '../redux/actions/userActions';
import styles from '../assets/styles/signup.module.css';
import { AppDispatch } from '../redux/store';  // Importa el tipo AppDispatch
import { useNavigate } from 'react-router-dom';  // Importar el hook useNavigate

export interface UserLogIn {
  nombre_usuario: string;
  contrasena: string;
}

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();  // Usa AppDispatch para tipar dispatch
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<UserLogIn>({
    nombre_usuario: '',
    contrasena: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'nombre_usuario') {
      setFormData((prevData) => ({
        ...prevData,
        nombre_usuario: value, 
      }));
    } else if (name === 'contraseña') {
      setFormData((prevData) => ({
        ...prevData,
        contrasena: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const goToSignUp = () => {
    navigate('/');  
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Llamar a la acción `verifyUser` y verificar el resultado
      const isLoginSuccessful = await dispatch(verifyUser(formData));
  
      if (isLoginSuccessful) {
        alert('¡Login exitoso!');
        navigate('/template');
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al enviar los datos', error);
      alert('Hubo un error al loggear el usuario');
    }
  };
  
  return (
    <div className={styles.backgroundContainer}>
    <form onSubmit={handleSubmit}>
      <div className={styles.signupContainer}>
        <h1>Connectory</h1>
        <div className={styles.signupBox}>
          <h2>Sign in</h2>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="nombre_usuario"
              placeholder="nombre de usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
             </div>
          <button type="submit" className={styles.signupButton}>Sign In</button>
          <p className={styles.loginLink}>Don't have an account yet? <span onClick={goToSignUp} className={styles.loginRedirect}>Sign Up</span></p>
        </div>
      </div>
    </form>
    </div>
  );
};

export default SignIn;
