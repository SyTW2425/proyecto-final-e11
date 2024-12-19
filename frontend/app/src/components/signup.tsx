import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/actions/userActions';
import styles from '../assets/styles/signup.module.css';
import { AppDispatch } from '../redux/store';  // Importa el tipo AppDispatch
import { useNavigate } from 'react-router-dom';  // Importar el hook useNavigate

export interface User {
  id_: string;
  nombre_: string;
  contacto_: number;
  claves_: [string, string];
  rol_: string;
}

const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();  // Usa AppDispatch para tipar dispatch
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<User>({
    id_: '',
    nombre_: '',
    contacto_: 0,
    claves_: ['', ''],
    rol_: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'nombre_usuario') {
      setFormData((prevData) => ({
        ...prevData,
        claves_: [value, prevData.claves_[1]],  // Actualizar el primer valor de la tupla
      }));
    } else if (name === 'contraseña') {
      setFormData((prevData) => ({
        ...prevData,
        claves_: [prevData.claves_[0], value],  // Actualizar el segundo valor de la tupla
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const goToLogin = () => {
    navigate('/login');  // Redirige a la ruta /login
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Llamar a la acción `registerUser` y pasar `formData`
      const isSignUpSuccessful = await dispatch(registerUser(formData));
      if (isSignUpSuccessful) {
        alert('¡SignUP exitoso!');
      } else {
        alert('Parámetros no válidos.');
      }
    } catch (error) {
      console.error('Error al enviar los datos', error);
      alert('Hubo un error al registrar el usuario');
    }
  };

  return (
    <div className={styles.backgroundContainer}>
    <form onSubmit={handleSubmit}>
      <div className={styles.signupContainer}>
        <h1>Connectory</h1>
        <div className={styles.signupBox}>
          <h2>Sign up</h2>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="id_"
              placeholder="DNI"
              value={formData.id_}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="nombre_"
              placeholder="Nombre"
              value={formData.nombre_}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="number"
              name="contacto_"
              placeholder="Número de teléfono"  
              value={formData.contacto_}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="nombre_usuario"
              placeholder="Nombre de usuario"
              value={formData.claves_[0]}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña"
              value={formData.claves_[1]}
              onChange={handleChange}
              required
            />
             </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="rol_"
              placeholder="Rol"
              value={formData.rol_}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.signupButton}>Sign Up</button>
          <p className={styles.loginLink}>Already have an account? <span onClick={goToLogin} className={styles.loginRedirect}>Login</span></p>
        </div>
      </div>
    </form>
    </div>
  );
};

export default SignUp;
