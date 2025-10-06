import React from "react";
import html2canvas from "html2canvas";
import copiar from '../../assets/copiar.png';
import descargar from '../../assets/descargar.png';
import "./copiar.css";

const Copiar = ({ idElemento, nombreArchivo }) => {
  const copiarGrafico = async () => {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;

    try {
      const canvas = await html2canvas(elemento, { scale: 2 });
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          alert("✅ Gráfico copiado al portapapeles");
        }
      });
    } catch (err) {
      console.error("Error al copiar gráfico:", err);
    }
  };

  const descargarGrafico = async () => {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;

    try {
      const canvas = await html2canvas(elemento, { scale: 2 });
      const link = document.createElement("a");
      link.download = `${nombreArchivo || "grafico"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error al descargar gráfico:", err);
    }
  };

  return (
    <div className="copiar-container">
      <button className="copiar-boton" onClick={copiarGrafico}>
        <img src={copiar} alt="Copiar" />
      </button>
      <button className="copiar-boton" onClick={descargarGrafico}>
        <img src={descargar} alt="Descargar" />
      </button>
    </div>
  );
};

export default Copiar;
