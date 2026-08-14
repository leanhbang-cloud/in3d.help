import subprocess
import os

scad_file = "/Users/bangle-macmini/Projects/in3d-help/SKADIS_subject_tag.scad"
output_dir = "/Users/bangle-macmini/Projects/in3d-help/stl_outputs"

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# List of all subjects, weekdays, and periods to generate
items_to_generate = [
    # Thứ trong tuần
    "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật", "SÁNG", "CHIỀU",
    # Tiết học
    "Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5", "Tiết 6", "Tiết 7", "Tiết 8", "Tiết 9", "Tiết 10",
    # Môn học phổ thông
    "Toán", "T.Việt", "N.Văn", "English", "Đạo đức", "TN&XH", "Sử - Địa", "Khoa học",
    "KHTN", "Công nghệ", "Tin học", "Thể dục", "Âm nhạc", "Mĩ thuật", "Trải nghiệm",
    "Vật lí", "Hóa học", "Sinh học", "Lịch sử", "Địa lí", "GDCD", "GDKT&PL", "GDQP&AN", "GDĐP"
]

def remove_vietnamese_accents(text):
    # Mapping table for Vietnamese letters with accents to unsigned English letters
    char_map = {
        'à':'a','á':'a','ả':'a','ã':'a','ạ':'a','ă':'a','ằ':'a','ắ':'a','ẳ':'a','ẵ':'a','ặ':'a','â':'a','ầ':'a','ấ':'a','ẩ':'a','ẫ':'a','ậ':'a',
        'đ':'d','Đ':'D',
        'è':'e','é':'e','ẻ':'e','ẽ':'e','ẹ':'e','ê':'e','ề':'e','ế':'e','ể':'e','ễ':'e','ệ':'e',
        'ì':'i','í':'i','ỉ':'i','ĩ':'i','ị':'i',
        'ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o','ô':'o','ồ':'o','ố':'o','ổ':'o','ỗ':'o','ộ':'o','ơ':'o','ờ':'o','ớ':'o','ở':'o','ỡ':'o','ợ':'o',
        'ù':'u','ú':'u','ủ':'u','ũ':'u','ụ':'u','ư':'u','ừ':'u','ứ':'u','ử':'u','ự':'u',
        'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y',
        'À':'A','Á':'A','Ả':'A','Ã':'A','Ạ':'A','Ă':'A','Ằ':'A','Ắ':'A','Ẳ':'A','Ẵ':'A','Ặ':'A','Â':'A','Ầ':'A','Ấ':'A','Ẩ':'A','Ẫ':'A','Ậ':'A',
        'È':'E','É':'E','Ẻ':'E','Ẽ':'E','Ẹ':'E','Ê':'E','Ề':'E','Ế':'E','Ể':'E','Ễ':'E','Ệ':'E',
        'Ì':'I','Í':'I','Ỉ':'I','Ĩ':'I','Ị':'I',
        'Ò':'O','Ó':'O','Ỏ':'O','Õ':'O','Ọ':'O','Ô':'O','Ồ':'O','Ố':'O','Ổ':'O','Ỗ':'O','Ộ':'O','Ơ':'O','Ờ':'O','Ớ':'O','Ở':'O','Ỡ':'O','Ợ':'O',
        'Ù':'U','Ú':'U','Ủ':'U','Ũ':'U','Ụ':'U','Ư':'U','Ừ':'U','Ứ':'U','Ử':'U','Ữ':'U','Ự':'U',
        'Ỳ':'Y','Ý':'Y','Ỷ':'Y','Ỹ':'Y','Ỵ':'Y'
    }
    res = ""
    for c in text:
        res += char_map.get(c, c)
    return res

print(f"Bắt đầu xuất file STL vào thư mục: {output_dir}")

# Clear old STL files in the output directory
if os.path.exists(output_dir):
    for f in os.listdir(output_dir):
        if f.endswith('.stl'):
            try:
                os.remove(os.path.join(output_dir, f))
            except Exception:
                pass

# Export all the stencil tag plates
for item in items_to_generate:
    clean_text = item.replace("&", "and")
    unsigned_text = remove_vietnamese_accents(clean_text)
    
    # Standardize filename format to prevent Bambu Studio import/path issues
    safe_filename = unsigned_text.replace(" ", "_").replace(".", "_").replace("-", "_")
    output_stl = os.path.join(output_dir, f"Tag_{safe_filename}.stl")
    
    # Adjust text size depending on text length
    text_size = 6.0
    if len(item) > 6:
        text_size = 4.8
    if len(item) > 8:
        text_size = 3.8
        
    cmd = [
        "openscad",
        "-o", output_stl,
        "-D", f'subject_text="{item}"',
        "-D", f'text_size={text_size}',
        scad_file
    ]
    
    print(f"Đang xuất Nhãn đục lỗ môn học: {item} -> {os.path.basename(output_stl)}...")
    try:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode == 0:
            print(f"  ✓ Thành công!")
        else:
            print(f"  ✗ Thất bại! Lỗi: {result.stderr.strip()}")
    except Exception as e:
        print(f"  ✗ Lỗi hệ thống: {e}")

print("\nHoàn tất! Tất cả các file STL đã được tạo thành công.")
