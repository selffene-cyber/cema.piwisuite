import jsPDF from 'jspdf';

export async function generateEvaluationPDF(result: any, formData: any, chartRef: any) {
  // Get chart image from canvas
  let chartImage = '';
  if (chartRef?.current?.canvas) {
    chartImage = chartRef.current.canvas.toDataURL('image/png');
  } else if (chartRef?.current?.toBase64Image) {
    chartImage = chartRef.current.toBase64Image();
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Colors
  const primaryColor: [number, number, number] = [94, 114, 228]; // #5e72e4
  const textColor: [number, number, number] = [50, 50, 93]; // #32325d
  const grayColor: [number, number, number] = [108, 117, 125]; // #6c757d
  const successColor: [number, number, number] = [45, 206, 137]; // #2dce89
  const dangerColor: [number, number, number] = [245, 54, 92]; // #f5365c

  // Header with colored bar
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 8, 'F');
  
  pdf.setFontSize(16);
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('REPORTE DE EVALUACIÓN CEMA 576', margin, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...grayColor);
  pdf.text(`Fecha: ${new Date().toLocaleString()}`, pageWidth - margin - 60, yPos);

  // Client Info
  yPos += 15;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  pdf.setFontSize(11);
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Cliente: ${formData.clientName}`, margin, yPos);
  yPos += 7;
  pdf.text(`Código TAG: ${formData.tag}`, margin, yPos);
  yPos += 7;
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Faena: ${formData.faena}`, margin, yPos);
  yPos += 7;
  pdf.text(`Tipo Correa: ${formData.tipo_correa}`, margin, yPos);
  yPos += 7;
  pdf.text(`Capacidad: ${formData.capacidad}`, margin, yPos);
  yPos += 7;
  pdf.text(`Tipo Material: ${formData.tipo_material}`, margin, yPos);

  // Summary Box
  yPos += 15;
  pdf.setFillColor(248, 249, 254);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RESUMEN GENERAL', margin + 5, yPos);
  
  yPos += 10;
  pdf.setFontSize(18);
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Score Total: ${result.total} pts`, margin + 5, yPos);
  
  yPos += 8;
  const severityColor = result.severityClass > 3 ? dangerColor : successColor;
  pdf.setTextColor(...severityColor);
  pdf.text(`Clase ${result.severityClass}`, margin + 5, yPos);

  // Variables Table
  yPos += 20;
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETALLE DE VARIABLES', margin, yPos);
  
  yPos += 8;
  // Table header
  pdf.setFillColor(233, 236, 239);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(...grayColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Variable', margin + 3, yPos + 5.5);
  pdf.text('Valor', margin + 80, yPos + 5.5);
  pdf.text('Puntaje', margin + 130, yPos + 5.5);
  
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...textColor);
  
  const variables = [
    ['Faena', formData.faena, ''],
    ['Tipo Correa', formData.tipo_correa, ''],
    ['Capacidad', formData.capacidad, ''],
    ['Tipo Material', formData.tipo_material, ''],
    ['Ancho de Banda', `${formData.beltWidthValue} ${formData.beltWidthUnit || 'in'}`, result.breakdown?.beltWidth || 0],
    ['Velocidad', `${formData.beltSpeedValue} ${formData.beltSpeedUnit || 'fpm'}`, result.breakdown?.beltSpeed || 0],
    ['Empalme', formData.spliceType, result.breakdown?.spliceType || 0],
    ['Abrasividad', formData.abrasiveness, result.breakdown?.abrasiveness || 0],
    ['Humedad', formData.moisture, result.breakdown?.moisture || 0],
  ];
  
  variables.forEach((row, index) => {
    if (index % 2 === 1) {
      pdf.setFillColor(248, 249, 250);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
    }
    pdf.text(row[0], margin + 3, yPos + 5);
    pdf.text(row[1], margin + 80, yPos + 5);
    pdf.text(String(row[2]), margin + 130, yPos + 5);
    yPos += 7;
  });

  // Chart
  yPos += 15;
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GRÁFICO RADAR', pageWidth / 2, yPos, { align: 'center' });
  
  if (chartImage) {
    const chartSize = 80;
    const chartX = (pageWidth - chartSize) / 2;
    pdf.addImage(chartImage, 'PNG', chartX, yPos + 5, chartSize, chartSize);
  } else {
    pdf.setFontSize(9);
    pdf.setTextColor(...grayColor);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Gráfico no disponible', pageWidth / 2, yPos + 40, { align: 'center' });
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(...grayColor);
  pdf.text('Cálculo basado en norma CEMA 576-2021 • Asistente CEMA • Ingeniería de Limpieza', pageWidth / 2, 280, { align: 'center' });

  // Save
  pdf.save(`Evaluacion_CEMA_${formData.tag}.pdf`);
}

export async function generateEvaluationPDFSimple(result: any, formData: any) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Colors
  const primaryColor: [number, number, number] = [94, 114, 228]; // #5e72e4
  const textColor: [number, number, number] = [50, 50, 93]; // #32325d
  const grayColor: [number, number, number] = [108, 117, 125]; // #6c757d
  const successColor: [number, number, number] = [45, 206, 137]; // #2dce89
  const dangerColor: [number, number, number] = [245, 54, 92]; // #f5365c

  // Header with colored bar
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 8, 'F');
  
  pdf.setFontSize(16);
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('REPORTE DE EVALUACIÓN CEMA 576', margin, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...grayColor);
  pdf.text(`Fecha: ${new Date().toLocaleString()}`, pageWidth - margin - 60, yPos);

  // Client Info
  yPos += 15;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  pdf.setFontSize(11);
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Cliente: ${formData.clientName}`, margin, yPos);
  yPos += 7;
  pdf.text(`Código TAG: ${formData.tag}`, margin, yPos);
  yPos += 7;
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Faena: ${formData.faena}`, margin, yPos);
  yPos += 7;
  pdf.text(`Tipo Correa: ${formData.tipo_correa}`, margin, yPos);
  yPos += 7;
  pdf.text(`Capacidad: ${formData.capacidad}`, margin, yPos);
  yPos += 7;
  pdf.text(`Tipo Material: ${formData.tipo_material}`, margin, yPos);

  // Summary Box
  yPos += 15;
  pdf.setFillColor(248, 249, 254);
  pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 25, 3, 3, 'F');
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RESUMEN GENERAL', margin + 5, yPos);
  
  yPos += 10;
  pdf.setFontSize(18);
  pdf.setTextColor(...textColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Score Total: ${result.total} pts`, margin + 5, yPos);
  
  yPos += 8;
  const severityColor = result.severityClass > 3 ? dangerColor : successColor;
  pdf.setTextColor(...severityColor);
  pdf.text(`Clase ${result.severityClass}`, margin + 5, yPos);

  // Variables Table
  yPos += 20;
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETALLE DE VARIABLES', margin, yPos);
  
  yPos += 8;
  // Table header
  pdf.setFillColor(233, 236, 239);
  pdf.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(...grayColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Variable', margin + 3, yPos + 5.5);
  pdf.text('Valor', margin + 80, yPos + 5.5);
  pdf.text('Puntaje', margin + 130, yPos + 5.5);
  
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...textColor);
  
  const variables = [
    ['Faena', formData.faena, ''],
    ['Tipo Correa', formData.tipo_correa, ''],
    ['Capacidad', formData.capacidad, ''],
    ['Tipo Material', formData.tipo_material, ''],
    ['Ancho de Banda', `${formData.beltWidthValue} ${formData.beltWidthUnit || 'in'}`, result.breakdown?.beltWidth || 0],
    ['Velocidad', `${formData.beltSpeedValue} ${formData.beltSpeedUnit || 'fpm'}`, result.breakdown?.beltSpeed || 0],
    ['Empalme', formData.spliceType, result.breakdown?.spliceType || 0],
    ['Abrasividad', formData.abrasiveness, result.breakdown?.abrasiveness || 0],
    ['Humedad', formData.moisture, result.breakdown?.moisture || 0],
  ];
  
  variables.forEach((row, index) => {
    if (index % 2 === 1) {
      pdf.setFillColor(248, 249, 250);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
    }
    pdf.text(row[0], margin + 3, yPos + 5);
    pdf.text(row[1], margin + 80, yPos + 5);
    pdf.text(String(row[2]), margin + 130, yPos + 5);
    yPos += 7;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(...grayColor);
  pdf.text('Cálculo basado en norma CEMA 576-2021 • Asistente CEMA • Ingeniería de Limpieza', pageWidth / 2, 280, { align: 'center' });

  // Save
  pdf.save(`Evaluacion_CEMA_${formData.tag}.pdf`);
}
