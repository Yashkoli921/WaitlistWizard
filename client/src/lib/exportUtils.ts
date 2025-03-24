import { jsPDF } from 'jspdf';

export interface CalculationHistory {
  id: string;
  type: string;
  input: string;
  result: string;
  timestamp: Date;
}

// Export to PDF function
export function exportToPDF(history: CalculationHistory[]): void {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  let y = 20;

  doc.setFontSize(16);
  doc.text('Calculation History', 20, y);
  y += 10;

  doc.setFontSize(12);
  history.forEach((item) => {
    if (y >= pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${item.type}: ${item.input} = ${item.result}`, 20, y);
    doc.text(`Time: ${new Date(item.timestamp).toLocaleString()}`, 20, y + 5);
    y += 15;
  });

  doc.save('calculation-history.pdf');
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