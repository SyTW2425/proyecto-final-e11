import React, { useState } from 'react';
import styles from './signup.module.css'; // Importar el módulo CSS
import axios from 'axios';

// Define una interfaz para el estado del formulario
interface SignUpForm {
  id_: string;
  nombre_: string;
  contacto_: number;
  claves_: [string, string];
  rol_: string;
}

const SignUp: React.FC = () => {
  // Define el estado con el tipo SignUpForm
  const [formData, setFormData] = useState<SignUpForm>({
    id_: '',
    nombre_: '',
    contacto_: 0,
    claves_: ['', ''],
    rol_: '',
  });

  // Manejador de cambios de entrada
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    // Verificar si el campo pertenece a "claves"
    if (name === 'nombre_usuario') {
      setFormData((prevData) => ({
        ...prevData,
        claves_: [value, prevData.claves_[1]], // Actualizar el primer elemento de la tupla
      }));
    } else if (name === 'contraseña') {
      setFormData((prevData) => ({
        ...prevData,
        claves_: [prevData.claves_[0], value], // Actualizar el segundo elemento de la tupla
      }));
    } else {
      // Para otros campos que no sean "claves"
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Previene el comportamiento predeterminado del formulario (recarga de la página)
    alert('Formulario enviado con los datos: ' + JSON.stringify(formData));
    try {
      // Realizar solicitud POST a la API usando axios
      const response = await axios.post('http://localhost:5000/usuarios', formData);
      console.log('Respuesta del servidor:', response.data);
      alert('¡Registro exitoso!');
    } catch (error) {
      console.error('Error al enviar los datos', error);
      alert('Hubo un error al registrar el usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.signupContainer}>
        <h1>Connectory</h1>
        <div className={styles.signupBox}>
          <h2>Sign up</h2>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="id_"
              placeholder="id_"
              value={formData.id_}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="nombre_"
              placeholder="nombre_"
              value={formData.nombre_}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="number"
              name="contacto_"
              placeholder="contacto_"  
              value={formData.contacto_}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="nombre_usuario"
              placeholder="nombre de usuario"
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
              placeholder="rol_"
              value={formData.rol_}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.signupButton}>Sign Up</button>
          <p className={styles.loginLink}>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </form>
  );
};

export default SignUp;