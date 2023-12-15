import React, { useEffect, useState } from "react";
import { ButtonGroup, Button, Modal } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaPinterest,
  FaSnapchat,
  FaWhatsapp,
  FaEnvelope,
  FaLinkedin,
} from "react-icons/fa";
import {  ref, onValue, set } from 'firebase/database';
import 'react-vis/dist/style.css';
import { db } from "./firebase";
import './PanelPage.css';
import { getAuth, signOut } from 'firebase/auth';
import { Navigate } from 'react-router-dom'; 
import { onAuthStateChanged } from 'firebase/auth';
import PieChart from './PieChart';
import 'chart.js/auto';
import Speedometer from "react-d3-speedometer";

// Definición del componente funcional PanelPage
const PanelPage = () => {
  // Estados locales para gestionar la visibilidad de modales, sugerencias, resultados, lecturas, etc.

  const [showUserModal, setShowUserModal] = useState(false);
  const [lectura, setLectura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const [showChart, setShowChart] = useState(false); 
  const [tiempoReaccion, settiempoReaccion] = useState(null);


  // Función para manejar el clic en el icono de usuario
  const handleUserIconClick = () => {
    setShowUserModal(true);
  };

  // Función para cerrar el modal de usuario
  const handleCloseUserModal = () => {
    setShowUserModal(false);
  };


  // Función para generar la gráfica
  const handleGenerateChart = () => {
    // Verifica si hay datos de lectura antes de mostrar la gráfica
    if (lectura) {
      setShowChart(true);
    } else {
      console.error('No hay datos disponibles para generar la gráfica.');
      // Puedes mostrar un mensaje de error en la interfaz de usuario si lo deseas
    }
  };

  // Efecto secundario useEffect para obtener datos iniciales y suscribirse a cambios de autenticación
  useEffect(() => {
    const authStateChanged = onAuthStateChanged(auth, (user) => {
      console.log("Usuario actual:", user);
      setUser(user);
  
      if (user) {
        const uid = user.uid;
        const userLecturaRef = ref(db, `${uid}/lectura`);
  
        // Función para manejar cambios en los datos
        const handleDataChange = (snapshot) => {
          const data = snapshot.val();
          setLectura(data);
          settiempoReaccion(data?.tiempoReaccion); 
          setLoading(false);
        };
  
        // Establecer la suscripción a cambios en los datos del usuario
        onValue(userLecturaRef, handleDataChange);
      } else {
        setLoading(false);
      }
    });
  
    return () => {
      // Desvincular la suscripción al cambiar de usuario o al desmontar el componente
      authStateChanged();
    };
  }, [auth]);

  // Función para manejar el cierre de sesión
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      return <Navigate to="/login" />;
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };


  // Función para manejar el clic en la dificultad
  const handleDifficultyClick = async (difficulty) => {
    try {
      const authUser = auth.currentUser;
      if (!authUser) {
        console.error('Usuario no autenticado.');
        return;
      }
  
      const uid = authUser.uid;
  
      // Obtener una referencia al nodo 'UID' y utilizar child para apuntar al nodo 'dificultad'
      const difficultyRef = ref(db, `${uid}/dificultad`);
  
      // Determinar la cantidad según la dificultad
      let cantidad;
      if (difficulty === 'Facil') {
        cantidad = 5000;
      } else if (difficulty === 'Medio') {
        cantidad = 3000;
      } else if (difficulty === 'Avanzado') {
        cantidad = 2000;
      }
  
      // Enviar la cantidad al nodo 'dificultad' y manejar después de la escritura
      await set(difficultyRef, cantidad);
      console.log(`Se enviaron ${cantidad} a la dificultad '${difficulty}'`);
  
      // Puedes realizar acciones adicionales después de enviar los datos si es necesario
    } catch (error) {
      console.error('Error al enviar la cantidad a la base de datos:', error.message);
    }
  };

  


  return (
    <div class="wrapper">
    <div className="container mt-5 panel-container" style={{ backgroundColor: '#f2f2f2', padding: '20px' }}>
      <h1 className="text-center mb-4">Bienvenido {user ? user.displayName : 'Cargando...'}, selecciona tu dificultad 👀</h1>
      <div className="d-flex justify-content-between align-items-center">
      
      <ButtonGroup>
        <Button variant="outline-primary" className="mx-2" onClick={() => handleDifficultyClick('Facil')}>
          Fácil
        </Button>
        <Button variant="outline-warning" className="mx-2" onClick={() => handleDifficultyClick('Medio')}>
          Medio
        </Button>
        <Button variant="outline-danger" className="mx-2" onClick={() => handleDifficultyClick('Avanzado')}>
          Avanzado
        </Button>
      </ButtonGroup>
        <FaUserCircle className="user-icon" onClick={handleUserIconClick} />
        <Modal show={showUserModal} onHide={handleCloseUserModal}>
          <Modal.Header closeButton>
            <Modal.Title>Datos del Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <p>Hola, {user?.displayName}!</p>
              <p>Correo electrónico: <b> {user?.email}</b></p> 
          </Modal.Body>
        </Modal>
      </div>

{/* Sección para mostrar el tiempo de respuesta */}
        <div className="mt-4 suggestion-container" style={{ backgroundColor: '#b4c6d7', color: '#333', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4>Su Tiempo de Respuesta es de: <b> {tiempoReaccion} segundos</b></h4>
          <Speedometer
            value={tiempoReaccion || 0}
            minValue={0}
            maxValue={10000}
            segments={5}
            valueTextMargin={1000}
            segmentColors={['green', 'lightgreen', 'yellow', 'orange', 'red']}
            width={500} // Ajusta el ancho según tus necesidades
            height={300} // Ajusta la altura según tus necesidades
            textColor="black" // Color del texto
            valueTextFontSize={35} // Tamaño de la fuente del valor
            labelFontSize={14} // Tamaño de la fuente de las etiquetas
            currentValueText={tiempoReaccion ? tiempoReaccion.toString() : ''}
          />
        </div>

      {/* Sección de estadísticas */}
      <div className="mt-4 suggestion-container" style={{ backgroundColor: '#b4c6d7', color: '#333', padding: '20px' }}>
        <h2><b> Estadísticas:</b></h2>
        {lectura ? (
          <div>
            <p className="text-primary"><b>Acertado: </b>{lectura.aciertos}</p>
            <p className="text-danger"><b>Fallos: </b>{lectura.fallos}</p>
            <p className="text-dark"><b>Estadisticas: </b>{lectura.porcentajeAciertos}%</p>
          </div>
          
        ) : (
          loading ? <p>Cargando estadísticas...</p> : <p>No hay datos disponibles para generar la gráfica.</p>
          )}
        {/* Renderizado condicional de la gráfica */}
        {showChart && (
            <PieChart
              aciertos={lectura.aciertos}
              fallas={lectura.fallos}
              porcentajeAciertos={lectura.porcentajeAciertos}
            />
          )}
        {/* Botón para generar la gráfica */}
        <button  type="button" class="btn btn-outline-dark" onClick={handleGenerateChart}>Hacer Gráfica</button>

      </div>

      {/* Sección de redes sociales */}
      <div className="mt-4 social-container" style={{ backgroundColor: '#b4c6d7', color: '#333', padding: '20px' }}>
        <h3>Nuestras Redes Sociales:</h3>
        {/* Iconos de redes sociales */}
        <FaFacebook size="2em" className="mx-3" />
        <FaInstagram size="2em" className="mx-3" />
        <FaGithub size="2em" className="mx-3" />
        <FaPinterest size="2em" className="mx-3" />
        <FaSnapchat size="2em" className="mx-3" />
        <FaWhatsapp size="2em" className="mx-3" />
        <FaEnvelope size="2em" className="mx-3" />
        <FaLinkedin size="2em" className="mx-3" />

        {/* Sección para cerrar sesión */}
        <div className="mt-4 social-container" style={{ backgroundColor: '#cae0f5', color: '#222', padding: '20px' }}>
          <div className="d-flex align-items-center">
            <Button variant="outline-danger" onClick={handleSignOut}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
};

export default PanelPage;
