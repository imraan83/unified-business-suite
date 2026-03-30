import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export data as CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the CSV file
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string
): void => {
  if (!data.length) {
    alert('No data to export');
    return;
  };

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export HTML element as PDF
 * @param element - HTML element to convert to PDF
 * @param filename - Name of the PDF file
 */
export const exportToPDF = async (
  element: HTMLElement,
  filename: string
): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export PDF. Please try again.');
  }
};

/**
 * Export chart data as CSV
 * @param labels - Array of labels (months, etc.)
 * @param datasets - Array of dataset objects with label and data
 * @param filename - Name of the CSV file
 */
export const exportChartToCSV = (
  labels: string[],
  datasets: { label: string; data: number[] }[],
  filename: string
): void => {
  if (!labels.length || !datasets.length) {
    alert('No chart data to export');
    return;
  };

  // Create header: Label + each dataset label
  const headers = ['Label', ...datasets.map(ds => ds.label)];
  
  // Create rows: each label + corresponding data from each dataset
  const rows = labels.map((label, index) => [
    label,
    ...datasets.map(ds => ds.data[index] ?? 0)
  ]);

  const csvString = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        if (cell === null || cell === undefined) return '';
        if (typeof cell === 'string') {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};