import React, { useState } from 'react';
import Uno from '../images/1.jpg';
import Dos from '../images/2.jpg';
import Tres from '../images/3.jpg';
import '../App.css'; 
import { app, auth } from '../credenciales';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Creación de una instancia de autenticación utilizando Firebase
const authInstance = getAuth(app);


// Definición del componente funcional Login
const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');


  // Función manejadora de envío del formulario de inicio de sesión o registro
  const handlerSubmit = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;
    

    try {
      if (registrando) {
         // Proceso de registro de usuario
        if (contraseña !== confirmarContraseña) {
          setErrorMessage('Las contraseñas no coinciden');
          setSuccessMessage('');
        } else {
          
          const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
    
          // Actualizar el perfil del usuario con el nombre
          await updateProfile(userCredential.user, {
            displayName: `${nombre} ${apellidos}`, // Aquí estableces el nombre del usuario
          });
    
          setSuccessMessage('Cuenta creada exitosamente. ¡Ahora puedes iniciar sesión!');
          setErrorMessage('');
        }
      } else {
         // Proceso de inicio de sesión
        await signInWithEmailAndPassword(auth, correo, contraseña);
        setSuccessMessage('Inicio de sesión exitoso.');
        setErrorMessage('');
      }
    } catch (error) {
       // Manejo de errores durante el proceso de autenticación
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('La dirección de correo electrónico ya está en uso. Por favor, inicia sesión.');
      } else {
        setErrorMessage(`Error en el inicio de sesión o registro: ${error.message}`);
      }
      setSuccessMessage('');
    }
     // Restablecer los campos del formulario
    setNombre('');
    setApellidos('');
    setConfirmarContraseña('');
  };


  // Estructura del componente que incluye un formulario y un carrusel de imágenes
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <div
            id="carouselExampleFade"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={Uno} alt="" className="tamaño-imagen img-fluid" />
              </div>
              <div className="carousel-item">
                <img src={Dos} alt="" className="tamaño-imagen img-fluid" />
              </div>
              <div className="carousel-item">
                <img src={Tres} alt="" className="tamaño-imagen img-fluid" />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleFade"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleFade"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <h1 className="mb-4">{registrando ? "Regístrate" : "Inicia sesión"}</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            

            {registrando ? (
            <form className="card card-body" onSubmit={handlerSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apellidos"
                  id="apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Correo electrónico"
                  id="email"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  id="password"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirmar contraseña"
                  id="confirmarContraseña"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                {registrando ? "Regístrate" : "Inicia sesión"}
              </button>
            </form>
            ) : (
              <form className="card card-body" onSubmit={handlerSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Correo electrónico"
                    id="email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    id="password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Inicia sesión
                </button>
              </form>
            )}
            <div className="form-group mt-3">
              <button
                className="btn btn-secondary btn-block"
                onClick={() => {
                  setRegistrando(!registrando);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}          
              >
                {registrando
                  ? "¿Ya tienes cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login