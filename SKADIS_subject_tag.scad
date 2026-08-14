// Parametric SKADIS Subject Tag (One-Part Stencil Cut-out Design)
// Designed for Easy Support-Free Face-Down Printing!
// The text is cut completely through the plate to show the background color.

/* [Tag settings] */
subject_text = "Toán"; // Subject name
tag_width = 38;        // Width of the tag (fits 40mm horizontal spacing)
tag_height = 15;       // Height of the tag
tag_thickness = 2.4;   // Base plate thickness (12 layers at 0.2mm)
corner_radius = 2.0;   // Rounded corner radius
text_size = 6.0;       // Text font size
font_name = "Arial:style=Bold";
stroke_offset = 0.35;  // Thickness offset to make text strokes thicker

/* [Inlay / Assembly settings] */
// "assembly" = plate + text inlay assembled (different colors, for preview / AMS)
// "plate" = only the plate with recessed text cavity
// "text" = only the text letters to be inlaid (with tolerance)
generate_mode = "assembly"; 
inlay_depth = 1.0;      // Depth of the cavity
inlay_tolerance = 0.15; // Clearance for loose fit when printing separately

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

// Assemble the tag
if (generate_mode == "plate") {
    // 1. Plate with cavity
    difference() {
        rounded_plate(tag_width, tag_height, tag_thickness, corner_radius);
        
        // Recessed cavity
        translate([0, -2.0, -0.1])
        linear_extrude(height=inlay_depth + 0.1) {
            mirror([1, 0, 0])
            offset(delta=stroke_offset)
            text(subject_text, size=text_size, font=font_name, halign="center", valign="center");
        }
    }
    
    // 2. Peg pointing UP from the back of plate
    translate([0, peg_y_offset, tag_thickness])
    split_snap_peg();
} else if (generate_mode == "text") {
    // Letters printed flat on bed, shrunk by tolerance
    linear_extrude(height=inlay_depth) {
        mirror([1, 0, 0])
        offset(delta=stroke_offset - inlay_tolerance)
        text(subject_text, size=text_size, font=font_name, halign="center", valign="center");
    }
} else {
    // Preview / Assembly (Default)
    union() {
        color("teal")
        difference() {
            rounded_plate(tag_width, tag_height, tag_thickness, corner_radius);
            
            // Recessed cavity
            translate([0, -2.0, -0.1])
            linear_extrude(height=inlay_depth + 0.1) {
                mirror([1, 0, 0])
                offset(delta=stroke_offset)
                text(subject_text, size=text_size, font=font_name, halign="center", valign="center");
            }
        }
        
        color("darkslategrey")
        translate([0, peg_y_offset, tag_thickness])
        split_snap_peg();
        
        // Text Inlay (perfect fit for preview/AMS)
        color("white")
        translate([0, 0, 0])
        linear_extrude(height=inlay_depth) {
            mirror([1, 0, 0])
            offset(delta=stroke_offset)
            text(subject_text, size=text_size, font=font_name, halign="center", valign="center");
        }
    }
}
