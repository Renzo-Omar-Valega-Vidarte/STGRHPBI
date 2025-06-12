import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import descargaImg from '../../assets/descarga.png';
import './BotonCaptura.css';

const BotonCaptura = () => {
  const capturarPDF = async () => {
    // Activa modo captura para remover fixed en header/footer
    document.body.classList.add('captura-mode');

    // Espera a que se apliquen los estilos
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(document.body, {
          useCORS: true,
          scale: 2,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`descarga_${new Date().toISOString()}.pdf`);
      } catch (error) {
        console.error("❌ Error al capturar la página:", error);
      } finally {
        document.body.classList.remove('captura-mode');
      }
    }, 300);
  };

  return (
    <button
      onClick={capturarPDF}
      title="Descargar PDF"
      className="boton-captura"
    >
      <img src={descargaImg} alt="Descargar" className="icono-descarga" />
    </button>
  );
};

export default BotonCaptura;
