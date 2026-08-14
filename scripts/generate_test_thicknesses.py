import subprocess
import os
import shutil

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scad_file = os.path.join(workspace_dir, "SKADIS_subject_tag.scad")
output_dir = os.path.join(workspace_dir, "stl_outputs_test")

os.makedirs(output_dir, exist_ok=True)

def find_openscad():
    try:
        path = shutil.which("openscad")
        if path:
            return path
    except Exception:
        pass
    mac_path = "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD"
    if os.path.exists(mac_path):
        return mac_path
    return "openscad"

openscad_bin = find_openscad()

# 3 test thickness configurations: (tag_thickness, inlay_depth)
configs = [
    {"label": "2_0mm", "thickness": 2.0, "inlay_depth": 0.8},
    {"label": "2_4mm", "thickness": 2.4, "inlay_depth": 1.0},
    {"label": "3_0mm", "thickness": 3.0, "inlay_depth": 1.2}
]

subject = "Chủ Nhật"
text_size = 6.0
stroke_offset = 0.35 # (6.0 size => 0.35 offset)

print(f"Bắt đầu xuất các mẫu thử độ dày của nhãn '{subject}' vào thư mục: {output_dir}")

for conf in configs:
    label = conf["label"]
    t = conf["thickness"]
    d = conf["inlay_depth"]
    
    # Export Plate
    output_plate = os.path.join(output_dir, f"Tag_Chu_Nhat_{label}_Plate.stl")
    cmd_plate = [
        openscad_bin,
        "-o", output_plate,
        "-D", f'subject_text="{subject}"',
        "-D", f'text_size={text_size}',
        "-D", f'stroke_offset={stroke_offset}',
        "-D", f'tag_thickness={t}',
        "-D", f'inlay_depth={d}',
        "-D", f'generate_mode="plate"',
        scad_file
    ]
    
    print(f"Đang xuất: {os.path.basename(output_plate)}...")
    subprocess.run(cmd_plate, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Export Text Inlay
    output_text = os.path.join(output_dir, f"Tag_Chu_Nhat_{label}_Text.stl")
    cmd_text = [
        openscad_bin,
        "-o", output_text,
        "-D", f'subject_text="{subject}"',
        "-D", f'text_size={text_size}',
        "-D", f'stroke_offset={stroke_offset}',
        "-D", f'tag_thickness={t}',
        "-D", f'inlay_depth={d}',
        "-D", f'generate_mode="text"',
        "-D", 'inlay_tolerance=0.15',
        scad_file
    ]
    
    print(f"Đang xuất: {os.path.basename(output_text)}...")
    subprocess.run(cmd_text, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

print("\nHoàn tất! Các file mẫu thử đã được xuất thành công.")
