import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

const PieChart = ({ aciertos, porcentajeAciertos }) => {

  // Declaración de estados locales para gestionar datos del gráfico y mensajes
  const [chartData, setChartData] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Efecto secundario useEffect para actualizar el gráfico y el mensaje al cambiar el porcentaje de aciertos
  useEffect(() => {

    // Calcular el porcentaje de fallas complementario al porcentaje de aciertos
    const porcentajeFallas = 100 - porcentajeAciertos;

    // Definir los datos del gráfico utilizando el porcentaje de aciertos y fallas
    const data = {
      labels: ['Aciertos', 'Fallas'],
      datasets: [
        {
          data: [porcentajeAciertos, porcentajeFallas],
          backgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };

    // Actualizar el estado 'chartData' con los datos del gráfico
    setChartData(data);

    // Asignar un mensaje según el rango de porcentaje de aciertos
    if (porcentajeAciertos >= 0 && porcentajeAciertos <= 40) {
        setMensaje('Reflejos muy bajos, eso es malo');
      } else if (porcentajeAciertos > 40 && porcentajeAciertos <= 60) {
        setMensaje('Buenos reflejos, pero puede ser mejor');
      } else {
        setMensaje('Muy buenos reflejos');
      }
  }, [porcentajeAciertos]);


  // Estructura del componente que incluye el gráfico Doughnut y un mensaje
  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      
    {/* Renderizar el gráfico solo si los datos están disponibles */}
    {chartData && <Doughnut data={chartData} />}

    {/* Renderizar el mensaje */}
    {mensaje && (
      <center><p style={{ fontSize: '40px', fontWeight: 'bold' }}>{mensaje}</p>  </center>
    )}
  </div>
  );
};

export default PieChart;
