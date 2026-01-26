import re
from fpdf import FPDF

# Read the markdown file
with open(r"C:\Users\nitis\OneDrive\Desktop\Astro\README_REPO.md", "r", encoding="utf-8") as f:
    content = f.read()

# Create PDF
pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

# Add a Unicode font (DejaVu is bundled with fpdf2)
pdf.add_font("DejaVu", "", "DejaVuSans.ttf", uni=True)
pdf.add_font("DejaVu", "B", "DejaVuSans-Bold.ttf", uni=True)

lines = content.split("\n")
in_code_block = False
in_table = False
table_rows = []

i = 0
while i < len(lines):
    line = lines[i]
    
    # Code block handling
    if line.startswith("```"):
        if in_code_block:
            in_code_block = False
        else:
            in_code_block = True
        i += 1
        continue
    
    if in_code_block:
        pdf.set_font("Courier", size=9)
        pdf.set_text_color(60, 60, 60)
        pdf.multi_cell(0, 5, line)
        pdf.set_text_color(0, 0, 0)
        i += 1
        continue
    
    # Table handling
    if line.startswith("|"):
        if not in_table:
            in_table = True
            table_rows = []
        # Skip separator row
        if re.match(r"^\|[\s\-:|]+\|$", line):
            i += 1
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        table_rows.append(cells)
        i += 1
        continue
    elif in_table:
        # End of table, render it
        in_table = False
        if table_rows:
            pdf.set_font("DejaVu", size=9)
            col_count = len(table_rows[0]) if table_rows else 1
            col_width = (pdf.w - 20) / col_count
            for row_idx, row in enumerate(table_rows):
                for cell in row:
                    if row_idx == 0:
                        pdf.set_font("DejaVu", "B", 9)
                        pdf.set_fill_color(80, 80, 160)
                        pdf.set_text_color(255, 255, 255)
                    else:
                        pdf.set_font("DejaVu", "", 9)
                        pdf.set_fill_color(245, 245, 245)
                        pdf.set_text_color(0, 0, 0)
                    pdf.cell(col_width, 7, cell[:40], border=1, fill=True)
                pdf.ln()
            pdf.set_text_color(0, 0, 0)
            pdf.ln(3)
            table_rows = []
    
    # Headers
    if line.startswith("# "):
        pdf.set_font("DejaVu", "B", 20)
        pdf.ln(5)
        pdf.multi_cell(0, 10, line[2:])
        pdf.ln(3)
    elif line.startswith("## "):
        pdf.set_font("DejaVu", "B", 15)
        pdf.ln(4)
        pdf.multi_cell(0, 8, line[3:])
        pdf.ln(2)
    elif line.startswith("### "):
        pdf.set_font("DejaVu", "B", 12)
        pdf.ln(3)
        pdf.multi_cell(0, 7, line[4:])
        pdf.ln(2)
    elif line.startswith("- "):
        pdf.set_font("DejaVu", "", 11)
        pdf.multi_cell(0, 6, "  • " + line[2:])
    elif line.strip():
        pdf.set_font("DejaVu", "", 11)
        pdf.multi_cell(0, 6, line)
    else:
        pdf.ln(3)
    
    i += 1

# Handle any remaining table
if in_table and table_rows:
    pdf.set_font("DejaVu", size=9)
    col_count = len(table_rows[0]) if table_rows else 1
    col_width = (pdf.w - 20) / col_count
    for row_idx, row in enumerate(table_rows):
        for cell in row:
            if row_idx == 0:
                pdf.set_font("DejaVu", "B", 9)
                pdf.set_fill_color(80, 80, 160)
                pdf.set_text_color(255, 255, 255)
            else:
                pdf.set_font("DejaVu", "", 9)
                pdf.set_fill_color(245, 245, 245)
                pdf.set_text_color(0, 0, 0)
            pdf.cell(col_width, 7, cell[:40], border=1, fill=True)
        pdf.ln()
    pdf.set_text_color(0, 0, 0)

# Save PDF
output_path = r"C:\Users\nitis\OneDrive\Desktop\Astro\README_REPO.pdf"
pdf.output(output_path)
print(f"PDF created: {output_path}")
