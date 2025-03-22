import { jsPDF } from 'jspdf';

export interface CalculationHistory {
  id: string;
  input: string;
  result: string;
  timestamp: Date;
  type: 'basic' | 'financial' | 'scientific' | 'graphing';
}

// Export calculation history to PDF
export function exportToPDF(history: CalculationHistory[], title: string = 'Calculation History'): void {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  // Add content
  doc.setFontSize(12);
  let y = 50;
  
  history.forEach((item, index) => {
    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    const timestamp = item.timestamp.toLocaleString();
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${item.type.toUpperCase()} - ${timestamp}`, 20, y);
    y += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Input: ${item.input}`, 30, y);
    y += 10;
    
    doc.text(`Result: ${item.result}`, 30, y);
    y += 20;
  });
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

// Export calculation history to CSV
export function exportToCSV(history: CalculationHistory[], filename: string = 'calculation-history'): void {
  // Create CSV headers
  let csvContent = 'Type,Timestamp,Input,Result\n';
  
  // Add rows
  history.forEach(item => {
    const timestamp = item.timestamp.toLocaleString();
    // Escape commas and quotes in content
    const row = [
      item.type,
      timestamp,
      `"${item.input.replace(/"/g, '""')}"`,
      `"${item.result.replace(/"/g, '""')}"`
    ].join(',');
    
    csvContent += row + '\n';
  });
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.display = 'none';
  
  // Add to document, trigger download, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export graph as image
export function exportGraphAsImage(canvasElement: HTMLCanvasElement, filename: string = 'graph'): void {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvasElement.toDataURL('image/png');
  link.click();
}
