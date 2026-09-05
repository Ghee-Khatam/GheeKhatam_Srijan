from docxtpl import DocxTemplate
import os

def export_docx(sections_dict, template_path, output_path):
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template not found at {template_path}")
        
    doc = DocxTemplate(template_path)
    
    # Map the generated sections to the template placeholders
    # Ensure these keys match the placeholders in your template (e.g. {{ abstract }}, {{ introduction }})
    context = {
        'title': sections_dict.get('title', 'Generated Research Paper'),
        'author': sections_dict.get('author', 'Author Name'),
        'abstract': sections_dict.get('abstract', ''),
        'introduction': sections_dict.get('introduction', ''),
        'literature_review': sections_dict.get('literature_review', ''),
        'methodology': sections_dict.get('methodology', ''),
        'results': sections_dict.get('results', ''),
        'conclusion': sections_dict.get('conclusion', ''),
        'references': sections_dict.get('references', '')
    }
    
    doc.render(context)
    
    output_dir = os.path.dirname(output_path)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    doc.save(output_path)
    return output_path
