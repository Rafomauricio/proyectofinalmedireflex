// App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import PanelPage from './PanelPage';
import { app as firebaseApp } from './credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  // Declaración del estado 'usuario' para gestionar la información del usuario autenticado
  const [usuario, setUsuario] = useState(null);
  
  // Creación de una instancia de autenticación utilizando Firebase
  const auth = getAuth(firebaseApp);

  // Efecto secundario para gestionar cambios en el estado de autenticación del usuario
  useEffect(() => {
    // Función que se ejecuta cada vez que cambia el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      console.log('Cambio de estado de autenticación:', usuarioFirebase);

      // Actualización del estado 'usuario' con la información del usuario autenticado
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
      } else {
        setUsuario(null);
      }
    });
    // Estructura del componente principal de la aplicación
    return () => {
      unsubscribe();
    };
  }, [auth]);

  return (
    <>
      {/* Renderizado condicional: si hay un usuario autenticado, muestra el PanelPage; de lo contrario, muestra el componente Login */}
      {usuario ? <PanelPage correoUsuario={usuario.email} /> : <Login />}
    </>
  );
}

export default App;
