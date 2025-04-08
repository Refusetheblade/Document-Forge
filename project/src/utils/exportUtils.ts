import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Header, Footer, AlignmentType, BorderStyle } from 'docx';
import type { DocumentComponent, DocumentTheme } from '../types';

const addWatermark = (doc: jsPDF, text: string) => {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.setFont('helvetica', 'italic');
    doc.text(text, 30, doc.internal.pageSize.height / 2, {
      angle: 45,
    });
  }
};

export async function exportToPDF(components: DocumentComponent[], theme: DocumentTheme) {
  const doc = new jsPDF();
  
  // Set default font
  doc.setFont('helvetica');
  
  let yOffset = 20;
  
  // Add logo and header
  if (theme.logo) {
    doc.addImage(theme.logo, 'PNG', 20, yOffset, 40, 40);
    yOffset += 50;
  }

  // Add decorative header line
  doc.setDrawColor(theme.primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, yOffset, 190, yOffset);
  yOffset += 10;

  components.forEach((component) => {
    switch (component.type) {
      case 'heading':
        doc.setFontSize(24);
        doc.setTextColor(theme.primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text(component.content, 20, yOffset);
        yOffset += 15;
        break;
      case 'text':
        doc.setFontSize(12);
        doc.setTextColor(theme.secondaryColor);
        doc.setFont('helvetica', 'normal');
        
        // Handle text wrapping
        const splitText = doc.splitTextToSize(component.content, 170);
        doc.text(splitText, 20, yOffset);
        yOffset += 10 * splitText.length;
        break;
      case 'image':
        doc.addImage(component.content, 'PNG', 20, yOffset, 170, 100);
        yOffset += 110;
        break;
    }

    // Add some spacing between components
    yOffset += 5;

    // Check if we need a new page
    if (yOffset > 270) {
      doc.addPage();
      yOffset = 20;
    }
  });

  // Add footer to all pages
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pages}`, 20, 290);
  }

  return doc.output('blob');
}

export async function exportToDOCX(components: DocumentComponent[], theme: DocumentTheme) {
  const doc = new Document({
    sections: [{
      properties: {},
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: new Date().toLocaleDateString(),
                  size: 20,
                  color: theme.secondaryColor.replace('#', ''),
                }),
              ],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: '© ' + new Date().getFullYear() + ' Your Company',
                  size: 20,
                  color: theme.secondaryColor.replace('#', ''),
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
      children: components.map((component) => {
        switch (component.type) {
          case 'heading':
            return new Paragraph({
              children: [
                new TextRun({
                  text: component.content,
                  size: 36,
                  bold: true,
                  color: theme.primaryColor.replace('#', ''),
                }),
              ],
              spacing: {
                before: 400,
                after: 200,
              },
              border: {
                bottom: {
                  color: theme.primaryColor.replace('#', ''),
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
            });
          case 'text':
            return new Paragraph({
              children: [
                new TextRun({
                  text: component.content,
                  size: 24,
                  color: theme.secondaryColor.replace('#', ''),
                }),
              ],
              spacing: {
                before: 200,
                after: 200,
              },
            });
          default:
            return new Paragraph({
              children: [new TextRun({ text: '' })],
            });
        }
      }),
    }],
  });

  return await Packer.toBlob(doc);
}