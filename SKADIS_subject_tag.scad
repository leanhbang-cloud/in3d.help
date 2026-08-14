// Parametric SKADIS Subject Tag (One-Part Stencil Cut-out Design)
// Designed for Easy Support-Free Face-Down Printing!
// The text is cut completely through the plate to show the background color.

/* [Tag settings] */
subject_text = "Toán"; // Subject name
tag_width = 38;        // Width of the tag (fits 40mm horizontal spacing)
tag_height = 15;       // Height of the tag
tag_thickness = 1.6;   // Base plate thickness (8 layers at 0.2mm)
corner_radius = 2.0;   // Rounded corner radius
text_size = 6.0;       // Text font size
font_name = "Arial:style=Bold";

/* [Printing Orientation] */
// true = Face-down engraving (Flat on bed, peg points up, no supports!)
// false = Face-up raised text (Peg points down, requires support)
face_down = true; 

/* [Mount settings] */
// Peg is placed at the top to avoid intersecting with the cut-out text
peg_width = 4.8;
peg_height = 6.0;        // Shorter peg (6mm) to stay at the top edge
peg_y_offset = 4.5;      // Shift peg to the top edge
board_thickness = 5.24;
slit_width = 1.0;

$fn = 32;

module rounded_plate(w, h, t, r) {
    linear_extrude(height=t) {
        hull() {
            translate([-w/2 + r, -h/2 + r]) circle(r=r);
            translate([w/2 - r, -h/2 + r]) circle(r=r);
            translate([-w/2 + r, h/2 - r]) circle(r=r);
            translate([w/2 - r, h/2 - r]) circle(r=r);
        }
    }
}

module oval_profile(w, h) {
    hull() {
        translate([0, (h - w)/2]) circle(d=w);
        translate([0, -(h - w)/2]) circle(d=w);
    }
}

module split_snap_peg() {
    difference() {
        union() {
            // Main peg shaft (height 5.3mm)
            linear_extrude(height=5.3) {
                oval_profile(peg_width, peg_height);
            }
            
            // Latching lip (height 0.4mm)
            translate([0, 0, 5.3])
            linear_extrude(height=0.4) {
                oval_profile(peg_width + 0.6, peg_height + 0.6);
            }
            
            // Tapered insertion tip (height 0.7mm)
            translate([0, 0, 5.7])
            linear_extrude(height=0.7, scale=[0.7, 0.7]) {
                oval_profile(peg_width + 0.6, peg_height + 0.6);
            }
        }
        
        // Compression slit (centered, vertical split)
        translate([-slit_width/2, -peg_height, -1])
        cube([slit_width, peg_height*2, 8]);
    }
}

// Assemble the tag (Face-Down stencil design)
union() {
    if (face_down) {
        // Face-down engraving/stencil (Flat on bed, peg points up, no supports!)
        difference() {
            // 1. Base Plate (Z from 0 to tag_thickness)
            color("teal")
            rounded_plate(tag_width, tag_height, tag_thickness, corner_radius);
            
            // 2. Stencil Cut-out Text (Cut all the way through Z=-0.5 to Z=tag_thickness+0.5)
            // We mirror it horizontally so it reads correctly from the front (Z=0, facing -Z)
            color("red")
            translate([0, -2.0, -0.5])
            linear_extrude(height=tag_thickness + 1.0) {
                mirror([1, 0, 0]) // Fix mirrored text for face-down print
                text(subject_text, size=text_size, font=font_name, halign="center", valign="center");
            }
        }
        
        // 3. Peg pointing UP from the back of plate (Z starting at tag_thickness)
        color("darkslategrey")
        translate([0, peg_y_offset, tag_thickness])
        split_snap_peg();
    } else {
        // Face-up raised text (Peg points down, requires support)
        difference() {
            // 1. Base Plate (Z from 0 to tag_thickness)
            color("teal")
            rounded_plate(tag_width, tag_height, tag_thickness, corner_radius);
            
            // 2. Stencil Cut-out Text (without mirror since it is face-up)
            color("red")
            translate([0, -2.0, -0.5])
            linear_extrude(height=tag_thickness + 1.0) {
                text(subject_text, size=text_size, font=font_name, halign="center", valign="center");
            }
        }
        
        // 3. Peg pointing DOWN (Z starting at 0, mirrored to negative Z)
        color("darkslategrey")
        translate([0, peg_y_offset, 0])
        mirror([0, 0, 1])
        split_snap_peg();
    }
}
