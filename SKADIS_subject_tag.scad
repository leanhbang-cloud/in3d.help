// Parametric SKADIS Subject Tag (One-Part Stencil Cut-out Design)
// Designed for Easy Support-Free Face-Down Printing!
// The text is cut completely through the plate to show the background color.

/* [Tag settings] */
subject_text = "Toán"; // Subject name
tag_width = 38;        // Width of the tag (fits 40mm horizontal spacing)
tag_height = 15;       // Height of the tag
tag_thickness = 3.0;   // Base plate thickness (15 layers at 0.2mm)
corner_radius = 2.0;   // Rounded corner radius
text_size = 6.0;       // Text font size
font_name = "Arial:style=Bold";
stroke_offset = 0.0;   // Thickness offset to make text strokes thicker

/* [Inlay / Assembly settings] */
// "assembly" = plate + text inlay assembled (different colors, for preview / AMS)
// "plate" = only the plate with recessed text cavity
// "text" = only the text letters to be inlaid (with tolerance)
generate_mode = "assembly"; 
inlay_depth = 1.2;      // Depth of the cavity
inlay_tolerance = 0.15; // Clearance for loose fit when printing separately
text_raised_height = 0.8; // Height of the raised text on the inlay plate
cavity_width = 30;     // Width of the rectangular cavity
cavity_height = 9;      // Height of the rectangular cavity
cavity_y_offset = 0.0;  // Centered vertically

/* [Mount settings] */
// Peg is placed at the center (Y = 0) of the plate
peg_width = 4.8;
peg_height = 6.0;        // Shorter peg (6mm) to stay at the center
peg_y_offset = 0.0;      // Centered vertically
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

module draw_text() {
    if (stroke_offset > 0) {
        offset(delta=stroke_offset)
        text(subject_text, size=text_size, font=font_name, halign="center", valign="center");
    } else {
        text(subject_text, size=text_size, font=font_name, halign="center", valign="center");
    }
}

// Assemble the tag
if (generate_mode == "plate") {
    // 1. Plate with rectangular cavity (centered at cavity_y_offset, depth = inlay_depth)
    difference() {
        rounded_plate(tag_width, tag_height, tag_thickness, corner_radius);
        
        // Rectangular cavity
        translate([0, cavity_y_offset, -0.1])
        rounded_plate(cavity_width, cavity_height, inlay_depth + 0.1, 1.0);
    }
    
    // 2. Peg pointing UP from the back of plate (Z starting at tag_thickness)
    translate([0, peg_y_offset, tag_thickness])
    split_snap_peg();
} else if (generate_mode == "text") {
    // Rectangular insert with raised text (printed face-up, flat on bed)
    translate([0, cavity_y_offset, 0])
    union() {
        // 1. Backing plate (shrunk by inlay_tolerance, centered at Y = 0 relative to translation)
        color("white")
        rounded_plate(cavity_width - 2 * inlay_tolerance, cavity_height - 2 * inlay_tolerance, inlay_depth, 1.0);
        
        // 2. Raised text on top (Z starts at inlay_depth, height = text_raised_height, centered at Y = 0, no mirror!)
        color("red")
        translate([0, 0, inlay_depth]) // Centered vertically on the backing plate!
        linear_extrude(height=text_raised_height) {
            draw_text();
        }
    }
} else {
    // Preview / Assembly (Default)
    union() {
        // Teal Plate with cavity
        color("teal")
        difference() {
            rounded_plate(tag_width, tag_height, tag_thickness, corner_radius);
            
            // Rectangular cavity
            translate([0, cavity_y_offset, -0.1])
            rounded_plate(cavity_width, cavity_height, inlay_depth + 0.1, 1.0);
        }
        
        // Grey Peg on the back
        color("darkslategrey")
        translate([0, peg_y_offset, tag_thickness])
        split_snap_peg();
        
        // Assembled Text Inlay (perfect fit, no tolerance for assembly preview/AMS)
        translate([0, cavity_y_offset, 0])
        union() {
            color("white")
            rounded_plate(cavity_width, cavity_height, inlay_depth, 1.0);
            
            color("red")
            translate([0, 0, -text_raised_height]) // Protrudes outwards (facing -Z) in assembly view!
            linear_extrude(height=text_raised_height) {
                mirror([1, 0, 0]) // Mirrored for assembly view facing -Z
                draw_text();
            }
        }
    }
}
