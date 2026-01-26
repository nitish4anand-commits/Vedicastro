import fs from 'fs'
import path from 'path'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const inputPath = path.join(__dirname, '../README_REPO.md')
const outputPath = path.join(__dirname, '../README_REPO.pdf')

const md = fs.readFileSync(inputPath, 'utf-8')

const doc = new jsPDF({ unit: 'pt', format: 'a4' })
const margin = 36
let y = margin
const lineHeight = 16
const maxWidth = 520

function addTextBlock(text: string) {
  const lines: string[] = doc.splitTextToSize(text, maxWidth)
  lines.forEach((line: string) => {
    if (y > 780 - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(line, margin, y)
    y += lineHeight
  })
  y += 4
}

function addTable(headers: string[], rows: string[][]) {
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [80, 80, 160] },
    didDrawPage: (data) => { y = (data.cursor?.y ?? y) + 10 }
  })
}

const lines = md.split(/\r?\n/)
for (let i = 0; i < lines.length; i++) {
  let line = lines[i]
  if (line.startsWith('# ')) {
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    addTextBlock(line.replace('# ', ''))
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
  } else if (line.startsWith('## ')) {
    doc.setFontSize(15)
    doc.setFont('helvetica', 'bold')
    addTextBlock(line.replace('## ', ''))
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
  } else if (line.startsWith('|') && lines[i+1] && lines[i+1].startsWith('|')) {
    // Markdown table
    const header = line.split('|').map(s => s.trim()).filter(Boolean)
    const rows = []
    i++ // skip header separator
    while (lines[i+1] && lines[i+1].startsWith('|')) {
      i++
      const row = lines[i].split('|').map(s => s.trim()).filter(Boolean)
      rows.push(row)
    }
    addTable(header, rows)
  } else if (line.startsWith('```')) {
    // Code block
    let code = ''
    i++
    while (i < lines.length && !lines[i].startsWith('```')) {
      code += lines[i] + '\n'
      i++
    }
    doc.setFont('courier', 'normal')
    doc.setFontSize(10)
    addTextBlock(code.trim())
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
  } else if (line.trim() !== '') {
    addTextBlock(line)
  } else {
    y += 6
  }
}

doc.save(outputPath)
console.log('PDF created:', outputPath)
