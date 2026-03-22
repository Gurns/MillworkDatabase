-- ============================================================
-- MillworkDatabase.com — Sample Designs Seed Data
-- Migration 007: Insert 20 realistic millwork designs with metadata
-- ============================================================

DO $$
DECLARE
  v_admin_id UUID;
  v_design_id UUID;
  v_cat_crown_molding UUID;
  v_cat_baseboards UUID;
  v_cat_door_casings UUID;
  v_cat_window_trim UUID;
  v_cat_chair_rail UUID;
  v_cat_panel_molding UUID;
  v_cat_newel_posts UUID;
  v_cat_balusters UUID;
  v_cat_handrails UUID;
  v_cat_fireplace_surrounds UUID;
  v_cat_mantel_shelves UUID;
  v_cat_wainscoting UUID;
  v_cat_shelving_units UUID;
  v_cat_wall_paneling UUID;
  v_cat_cabinet_doors UUID;
  v_style_victorian UUID;
  v_style_craftsman UUID;
  v_style_colonial UUID;
  v_style_georgian UUID;
  v_style_art_deco UUID;
  v_style_gothic_revival UUID;
  v_style_federal UUID;
  v_style_queen_anne UUID;
  v_style_mission UUID;
  v_style_prairie UUID;
  v_style_tudor UUID;
  v_style_greek_revival UUID;
  v_style_contemporary UUID;
  v_style_rustic UUID;
  v_style_traditional UUID;
  v_style_mid_century UUID;

BEGIN
  -- Look up the Admin user (case-insensitive)
  SELECT id INTO v_admin_id FROM users WHERE LOWER(username) = 'admin' LIMIT 1;

  -- If Admin doesn't exist, skip the entire block
  IF v_admin_id IS NULL THEN
    RAISE NOTICE 'Admin user not found. Skipping sample designs seed.';
    RETURN;
  END IF;

  -- Look up all category IDs
  SELECT id INTO v_cat_crown_molding FROM categories WHERE slug = 'crown-molding';
  SELECT id INTO v_cat_baseboards FROM categories WHERE slug = 'baseboards';
  SELECT id INTO v_cat_door_casings FROM categories WHERE slug = 'door-casings';
  SELECT id INTO v_cat_window_trim FROM categories WHERE slug = 'window-trim';
  SELECT id INTO v_cat_chair_rail FROM categories WHERE slug = 'chair-rail';
  SELECT id INTO v_cat_panel_molding FROM categories WHERE slug = 'panel-molding';
  SELECT id INTO v_cat_newel_posts FROM categories WHERE slug = 'newel-posts';
  SELECT id INTO v_cat_balusters FROM categories WHERE slug = 'balusters';
  SELECT id INTO v_cat_handrails FROM categories WHERE slug = 'handrails';
  SELECT id INTO v_cat_fireplace_surrounds FROM categories WHERE slug = 'fireplace-surrounds';
  SELECT id INTO v_cat_mantel_shelves FROM categories WHERE slug = 'mantel-shelves';
  SELECT id INTO v_cat_wainscoting FROM categories WHERE slug = 'wainscoting';
  SELECT id INTO v_cat_shelving_units FROM categories WHERE slug = 'shelving-units';
  SELECT id INTO v_cat_wall_paneling FROM categories WHERE slug = 'wall-paneling';
  SELECT id INTO v_cat_cabinet_doors FROM categories WHERE slug = 'cabinet-doors';

  -- Look up all style IDs
  SELECT id INTO v_style_victorian FROM styles WHERE slug = 'victorian';
  SELECT id INTO v_style_craftsman FROM styles WHERE slug = 'craftsman';
  SELECT id INTO v_style_colonial FROM styles WHERE slug = 'colonial';
  SELECT id INTO v_style_georgian FROM styles WHERE slug = 'georgian';
  SELECT id INTO v_style_art_deco FROM styles WHERE slug = 'art-deco';
  SELECT id INTO v_style_gothic_revival FROM styles WHERE slug = 'gothic-revival';
  SELECT id INTO v_style_federal FROM styles WHERE slug = 'federal';
  SELECT id INTO v_style_queen_anne FROM styles WHERE slug = 'queen-anne';
  SELECT id INTO v_style_mission FROM styles WHERE slug = 'mission';
  SELECT id INTO v_style_prairie FROM styles WHERE slug = 'prairie';
  SELECT id INTO v_style_tudor FROM styles WHERE slug = 'tudor';
  SELECT id INTO v_style_greek_revival FROM styles WHERE slug = 'greek-revival';
  SELECT id INTO v_style_contemporary FROM styles WHERE slug = 'contemporary';
  SELECT id INTO v_style_rustic FROM styles WHERE slug = 'rustic';
  SELECT id INTO v_style_traditional FROM styles WHERE slug = 'traditional';
  SELECT id INTO v_style_mid_century FROM styles WHERE slug = 'mid-century-modern';

  -- ============================================================
  -- Design 1: Victorian Crown Molding
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Victorian Crown Molding with Egg & Dart Detail',
    'victorian-crown-molding-egg-dart',
    'An ornate crown molding featuring traditional egg and dart relief carving. The profile includes both concave and convex curves for dynamic shadow play. Perfect for period-correct Victorian restorations.',
    'This elegant crown molding design captures the essence of Victorian-era craftsmanship with its symmetrical egg and dart motif. The profile uses a combination of curved cuts and relief elements to create visual depth and sophisticated ornamentation typical of 19th-century architectural styles.

Traditional mahogany or cherry wood showcases the intricate details best, though poplar works well when painted. The build requires careful layout work for the egg and dart repeats and access to specialized router bits. The concave cove above the ornamental band creates dramatic shadow lines that are essential to the design aesthetic.

This molding is ideal for dining rooms, formal living spaces, and period restoration projects. CNC carving can streamline production significantly for the relief work. Hand-routing the main profile using a large panel bit is feasible for shorter runs. The design is historically accurate for homes built between 1880-1920.',
    true, NULL, 'Mahogany', 'advanced', 8,
    '{"width_inches": 6.75, "depth_inches": 5.25, "relief_height": 1.125, "horizontal_repeat": 4.0}',
    'published', NOW(), 2847, 312, 156, 28, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_crown_molding);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_victorian);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'ornate', 'manual'),
    (v_design_id, 'relief-carving', 'manual'),
    (v_design_id, 'period-accurate', 'manual'),
    (v_design_id, 'formal', 'manual'),
    (v_design_id, 'egg-and-dart', 'manual');

  -- ============================================================
  -- Design 2: Craftsman Baseboard Profile
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Craftsman Baseboard Profile',
    'craftsman-baseboard-profile',
    'A simple yet refined baseboard with clean lines and subtle chamfered edges. Perfect for Craftsman and Mission-style homes with a minimalist aesthetic.',
    'The Craftsman movement emphasized simplicity and honest joinery, and this baseboard profile embodies those principles. The straightforward geometry uses a single 45-degree chamfer on top edges and a gentle quarter-round at the base. The profile stands 4.5 inches tall—a classic proportion for early 1900s homes.

Poplar is ideal for this profile due to cost-effectiveness and paint compatibility. The simple geometry requires only a basic router setup with a chamfer bit and quarter-round bit, making this an excellent beginner project. A table saw can handle the straight edge bevels without any special equipment.

The design pairs beautifully with craftsman-style crown moldings and integrates seamlessly with both painted and stained finishes. Production is efficient due to the minimal setup time. This profile works equally well in Bungalow, Prairie, and contemporary spaces that value understated elegance.',
    true, NULL, 'Poplar', 'beginner', 3,
    '{"width_inches": 4.5, "depth_inches": 1.25, "chamfer_angle": 45, "base_radius": 0.375}',
    'published', NOW(), 3456, 287, 189, 34, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_baseboards);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_craftsman);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'simple-lines', 'manual'),
    (v_design_id, 'beginner-friendly', 'manual'),
    (v_design_id, 'clean-design', 'manual'),
    (v_design_id, 'painted-finish', 'manual'),
    (v_design_id, 'authentic', 'manual');

  -- ============================================================
  -- Design 3: Colonial Door Casing
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Colonial Door Casing with Rosette Blocks',
    'colonial-door-casing-rosette',
    'A traditional colonial door casing featuring symmetrical ogee and bead details with matching rosette corner blocks. Ideal for classic American home interiors.',
    'This colonial-era door casing represents the refined proportions and moderate ornamentation typical of 17th and 18th-century American homes. The design incorporates an ogee profile with a delicate bead detail, complemented by traditional square rosette blocks at the head and corner joints.

White pine or poplar are the classic wood choices for colonial casings, particularly when painted in period colors. The ogee and bead details require a quality ogee bit and small roundover bit. The rosette blocks add visual interest while serving a practical purpose in concealing wood movement joints.

This casing works perfectly with colonial-style doors and hardware. The 3-inch-wide profile is proportionate to standard colonial door openings. Precision cuts and tight joinery are essential for authentic period appearance. The design pairs well with colonial crown molding and traditional baseboard profiles for complete room continuity.',
    true, NULL, 'Pine', 'intermediate', 5,
    '{"casing_width": 3.25, "casing_depth": 1.75, "rosette_block_size": 3.5, "profile_curves": "ogee-bead"}',
    'published', NOW(), 2134, 215, 98, 19, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_door_casings);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_colonial);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'rosette-blocks', 'manual'),
    (v_design_id, 'traditional', 'manual'),
    (v_design_id, 'american-colonial', 'manual'),
    (v_design_id, 'period-trim', 'manual'),
    (v_design_id, 'painted-finish', 'manual');

  -- ============================================================
  -- Design 4: Georgian Fireplace Surround
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Georgian Fireplace Surround with Classical Proportions',
    'georgian-fireplace-surround-classical',
    'A complete fireplace surround design featuring classical pilasters, entablature, and a dentil cornice. Requires advanced woodworking skills and precise joinery.',
    'This Georgian fireplace surround embodies the classical principles of proportion and symmetry that define 18th-century architecture. The design features paired pilasters with classical capitals supporting a detailed entablature with dentil molding—creating an architecturally authentic focal point.

Oak or cherry wood showcases the refined detailing and takes stain beautifully. Mahogany is the historically authentic choice for formal Georgian interiors. The project requires careful math for classical proportions, fluted column detailing, and precision mitering of the entablature components.

The surround is designed for opening sizes from 30 to 48 inches wide, with scalable proportions maintained throughout. Production involves creating compound miters, routing fluted details, and assembling multiple wood species if desired. This is a multi-week project best approached by experienced woodworkers or CNC-equipped shops. The finished product becomes a statement focal point in any room.',
    true, NULL, 'Oak', 'advanced', 12,
    '{"opening_width_min": 30, "opening_width_max": 48, "surround_height": 72, "pilaster_depth": 1.5, "cornice_height": 8.5}',
    'published', NOW(), 1876, 142, 87, 15, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_fireplace_surrounds);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_georgian);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'classical-proportions', 'manual'),
    (v_design_id, 'architectural', 'manual'),
    (v_design_id, 'fireplace-focal-point', 'manual'),
    (v_design_id, 'advanced-joinery', 'manual'),
    (v_design_id, 'formal-spaces', 'manual');

  -- ============================================================
  -- Design 5: Art Deco Chair Rail
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Art Deco Chair Rail with Geometric Details',
    'art-deco-chair-rail-geometric',
    'A striking Art Deco chair rail featuring bold geometric patterns and streamlined forms. The design uses stylized linear details to create a modern yet vintage aesthetic.',
    'Art Deco embraces bold geometric forms and rich materials, and this chair rail design captures that spirit with its streamlined profile and angular detailing. The design features repeating geometric patterns executed through precise routing and relief carving, creating visual dynamism along the wall.

Walnut or cherry wood provides the richness that Art Deco demands. The geometric patterns require precision tool work—either CNC carving or skilled hand-routing with edge-forming bits and router tables. The repeating module is 6 inches, allowing for flexible installation heights and room proportions.

This rail works beautifully in dining rooms, living rooms, and even bathrooms renovated with Art Deco aesthetic. The profile is designed to sit at the traditional 36-inch height, serving a dual purpose of both protection and design statement. The geometric details reflect influences from both Egyptology and machine-age modernism.',
    true, NULL, 'Walnut', 'intermediate', 7,
    '{"height_inches": 2.5, "depth_inches": 1.625, "pattern_repeat": 6.0, "geometric_relief": 0.375}',
    'published', NOW(), 2341, 178, 124, 22, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_chair_rail);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_art_deco);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'geometric-patterns', 'manual'),
    (v_design_id, 'bold-design', 'manual'),
    (v_design_id, 'art-deco', 'manual'),
    (v_design_id, 'vintage-modern', 'manual'),
    (v_design_id, 'statement-detail', 'manual');

  -- ============================================================
  -- Design 6: Gothic Revival Window Trim
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Gothic Revival Window Trim with Pointed Arch Pediment',
    'gothic-revival-window-trim-arch',
    'A dramatic window trim featuring Gothic-inspired pointed arch pediment with delicate tracery details. Perfect for Victorian-era homes or eclectic period designs.',
    'Gothic Revival architecture introduced medieval-inspired elements to 19th-century buildings, and this window trim captures the essence of pointed arches and ornamental tracery. The design features a pronounced pointed arch pediment atop traditional casings, with geometric tracery patterns routed into the arch faces.

Cherry or mahogany work beautifully for this dramatic design. The pointed arch requires careful angle calculations and precision cuts, ideally executed with a CNC machine for the tracery details. Hand-routing is possible but time-consuming given the geometric complexity of the intersecting arches.

This trim works especially well in libraries, studies, bedrooms, and formal living spaces. The design is scalable for different window sizes from 28 to 48 inches wide. The dramatic vertical emphasis of the pointed arch draws the eye upward, making ceilings feel higher and rooms feel more spacious. Installation requires careful attention to symmetry and level.',
    true, NULL, 'Cherry', 'advanced', 9,
    '{"window_width_min": 28, "window_width_max": 48, "arch_height": 8.5, "pediment_projection": 2.0, "tracery_depth": 0.75}',
    'published', NOW(), 2156, 201, 118, 26, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_window_trim);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_gothic_revival);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'pointed-arch', 'manual'),
    (v_design_id, 'gothic-revival', 'manual'),
    (v_design_id, 'tracery-details', 'manual'),
    (v_design_id, 'dramatic-design', 'manual'),
    (v_design_id, 'architectural-statement', 'manual');

  -- ============================================================
  -- Design 7: Federal Mantel Shelf
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Federal Mantel Shelf with Delicate Inlay',
    'federal-mantel-shelf-inlay',
    'An elegant Federal-period mantel shelf featuring delicate proportions and optional inlay details. The design celebrates refined neoclassical ornamentation and light curves.',
    'The Federal period refined and lightened the earlier Colonial aesthetic, emphasizing delicate proportions and subtle ornamentation. This mantel shelf design incorporates curved brackets, inlay-ready channels, and refined molding details characteristic of 1790-1810 era craftsmanship.

Mahogany with maple or light wood inlay represents the authentic Federal approach. The shelf is 48 inches long with elegant curved brackets that support both structurally and aesthetically. The inlay channels are routed to accept contrasting wood strips, creating visual interest without heavy ornamentation.

This mantel works beautifully on fireplaces of modest to generous proportions. The curved bracket profiles require patient router work or CNC execution. The inlay details showcase craftsmanship and period authenticity. The overall design remains timeless enough to work in contemporary homes that appreciate historical detailing.',
    true, NULL, 'Mahogany', 'intermediate', 6,
    '{"shelf_length": 48, "shelf_depth": 12, "bracket_height": 6, "bracket_curve_radius": 8.5, "inlay_width": 0.375}',
    'published', NOW(), 1945, 167, 92, 18, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_mantel_shelves);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_federal);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'federal-style', 'manual'),
    (v_design_id, 'curved-brackets', 'manual'),
    (v_design_id, 'inlay-details', 'manual'),
    (v_design_id, 'refined-proportions', 'manual'),
    (v_design_id, 'fireplace-display', 'manual');

  -- ============================================================
  -- Design 8: Queen Anne Newel Post
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Queen Anne Newel Post with Turned Details',
    'queen-anne-newel-post-turned',
    'An ornate Queen Anne newel post featuring complex turned profiles and decorative finials. This showpiece requires lathe work and advanced wood turning skills.',
    'Queen Anne style celebrates ornament, asymmetry, and rich detailing, embodied perfectly in this dramatic newel post. The design combines turned elements, tapered sections, and a decorative finial that captures the exuberance of the Victorian era while maintaining structural soundness.

Cherry or walnut are ideal for this showpiece project due to their ability to showcase the turning details in warm tones. The design requires a substantial lathe and skilled turning experience to execute properly. The multiple turned sections must transition smoothly, requiring patience in layout and execution.

This newel post makes a dramatic focal point at the base of a staircase. The design is scalable from 3.5 to 4.5 inches square to accommodate different stair widths. The decorative finial can be customized in complexity based on turner skill level. Production time spans multiple weeks due to the extensive turning and finishing work required.',
    true, NULL, 'Cherry', 'advanced', 11,
    '{"post_base": 4.0, "post_height": 40, "turning_diameter_max": 3.75, "finial_height": 8, "sections_count": 6}',
    'published', NOW(), 1623, 139, 76, 14, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_newel_posts);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_queen_anne);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'turned-details', 'manual'),
    (v_design_id, 'lathe-work', 'manual'),
    (v_design_id, 'queen-anne', 'manual'),
    (v_design_id, 'staircase-focal-point', 'manual'),
    (v_design_id, 'ornamental', 'manual');

  -- ============================================================
  -- Design 9: Mission Style Baluster
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Mission Style Baluster with Rectilinear Profile',
    'mission-style-baluster-rectilinear',
    'A straightforward Mission-style baluster emphasizing simple geometric forms and honest joinery. Perfect for craftsman-inspired staircases.',
    'Mission style draws inspiration from Spanish Colonial missions and celebrates honest construction with simple rectilinear forms. This baluster design features a square profile with subtle chamfers and tapered sections that create visual interest without ornamental excess.

Oak is the classic Mission material, with its straight grain perfectly suiting the aesthetic. Douglas fir offers an economical alternative while maintaining authentic appearance. The design uses simple joinery and straightforward cuts, making production efficient for stair runs.

The baluster measures 1.5 inches square at the top where it meets the handrail, and tapers to 1.25 inches at the base. Standard length is 34 inches for typical stair heights. Spacing of 4 inches on-center creates both safety and visual rhythm. This design pairs beautifully with Mission crown molding and baseboards for room-wide consistency.',
    true, NULL, 'Oak', 'beginner', 4,
    '{"top_width": 1.5, "base_width": 1.25, "length": 34, "chamfer_angle": 45, "taper_style": "linear"}',
    'published', NOW(), 3234, 287, 145, 31, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_balusters);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_mission);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'mission-style', 'manual'),
    (v_design_id, 'rectilinear', 'manual'),
    (v_design_id, 'simple-joinery', 'manual'),
    (v_design_id, 'craftsman-inspired', 'manual'),
    (v_design_id, 'production-friendly', 'manual');

  -- ============================================================
  -- Design 10: Prairie Handrail Profile
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Prairie Handrail Profile with Horizontal Emphasis',
    'prairie-handrail-profile',
    'A striking handrail profile emphasizing horizontal lines and organic curves. Inspired by Frank Lloyd Wright\'s Prairie School architecture.',
    'Prairie School architecture emphasizes horizontal lines, organic curves, and integration with natural materials—principles beautifully expressed in this handrail design. The profile features subtle curves that create visual movement while maintaining the essential horizontal emphasis characteristic of the style.

Oak or walnut showcase the grain patterns that complement Prairie aesthetics. The handrail measures 2 inches wide and 1.75 inches tall, providing comfortable gripping while minimizing visual bulk. The underside features gentle curves that appear to flow along the staircase length.

This handrail works especially well paired with Prairie-style balusters and newel posts. The profile can be routed using a combination of roundovers and cove bits. The design emphasizes the natural wood grain rather than applied ornamentation, making finishing straightforward. Production efficiency is good due to the moderate complexity of the routing setup.',
    true, NULL, 'Oak', 'intermediate', 5,
    '{"width": 2.0, "height": 1.75, "grip_radius": 1.0, "curve_depth": 0.375, "horizontal_emphasis": true}',
    'published', NOW(), 1834, 156, 88, 16, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_handrails);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_prairie);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'prairie-school', 'manual'),
    (v_design_id, 'horizontal-emphasis', 'manual'),
    (v_design_id, 'organic-curves', 'manual'),
    (v_design_id, 'frank-lloyd-wright', 'manual'),
    (v_design_id, 'architectural-principle', 'manual');

  -- ============================================================
  -- Design 11: Tudor Panel Molding
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Tudor Panel Molding with Carved Details',
    'tudor-panel-molding-carved',
    'A distinctive Tudor panel molding featuring carved details and substantial proportions. The design captures the medieval timber framing influence of Tudor architecture.',
    'Tudor Revival brought medieval timber framing aesthetic to modern homes, and this panel molding celebrates that heritage with substantial profile dimensions and carved detailing. The molding frames interior wall panels, typically 2 to 4 feet square, creating geometric visual rhythm.

Walnut or dark stained oak authentically represent Tudor aesthetics. The profile is 2 inches wide and 1.375 inches deep with carved floral or geometric details on the face. The design works as both a structural frame and decorative element, dividing large wall areas into manageable visual units.

This molding is ideal for dining rooms, libraries, and bedrooms seeking Tudor atmosphere. Installation creates a grid pattern on walls that can visually reduce apparent room size while adding richness. Hand-carving the details requires skilled artisanship, though CNC carving streamlines production. The design establishes strong visual character and complements heavy timber framing or beamed ceilings.',
    true, NULL, 'Walnut', 'advanced', 8,
    '{"width": 2.0, "depth": 1.375, "carved_relief": 0.5, "panel_size_typical": 36, "carving_detail_type": "floral"}',
    'published', NOW(), 1712, 144, 79, 13, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_panel_molding);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_tudor);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'tudor-style', 'manual'),
    (v_design_id, 'carved-details', 'manual'),
    (v_design_id, 'panel-frame', 'manual'),
    (v_design_id, 'medieval-inspired', 'manual'),
    (v_design_id, 'formal-spaces', 'manual');

  -- ============================================================
  -- Design 12: Greek Revival Wainscoting
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Greek Revival Wainscoting with Bold Moldings',
    'greek-revival-wainscoting-bold',
    'A substantial wainscoting system featuring bold classical moldings inspired by Greek architecture. Creates dramatic visual division and structural interest.',
    'Greek Revival architecture introduced American architecture to classical Greek elements including bold cornices, pronounced moldings, and strong horizontal divisions. This wainscoting system captures that aesthetic with a heavy chair rail (5 inches tall) and substantial base molding (4 inches tall).

White pine or poplar, typically painted, form the traditional construction. The system is designed for a 36-inch wainscoting height (a classical proportion), using raised panel inserts below the chair rail and smooth boards or panels above. The bold moldings create dramatic shadow lines that add visual richness to the space.

This wainscoting works beautifully in entryways, living rooms, dining rooms, and libraries. The height of 36 inches protects walls from chair damage while establishing strong horizontal visual lines that can visually widen narrow rooms. Installation requires careful layout and level work to ensure the chair rail height remains consistent throughout the space. The design pairs excellently with Greek Revival cornice molding for coordinated classical character.',
    true, NULL, 'Pine', 'intermediate', 7,
    '{"wainscoting_height": 36, "chair_rail_height": 5, "base_molding_height": 4, "molding_projection": 2.5, "panel_module": 24}',
    'published', NOW(), 2056, 188, 106, 19, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_wainscoting);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_greek_revival);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'greek-revival', 'manual'),
    (v_design_id, 'wainscoting-system', 'manual'),
    (v_design_id, 'classical-moldings', 'manual'),
    (v_design_id, 'wall-protection', 'manual'),
    (v_design_id, 'bold-design', 'manual');

  -- ============================================================
  -- Design 13: Contemporary Floating Shelf Profile
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Contemporary Floating Shelf with Hidden Bracket',
    'contemporary-floating-shelf-hidden',
    'A minimalist floating shelf design with concealed mounting system. Clean lines and hidden structure showcase modern design principles.',
    'Contemporary design emphasizes simplicity, functionality, and the exposure of structural concepts—or their concealment for clean aesthetics. This floating shelf design opts for complete concealment, creating the illusion of impossibility with a clean, rectangular profile.

Walnut, oak, or painted MDF work beautifully for contemporary shelving. The shelf measures 24 to 48 inches long and 10 inches deep with a refined 1-inch thickness. The mounting system uses a steel bracket epoxied and mechanically fastened behind the shelf, completely hidden from view.

Installation requires accurate wall stud location and substantial fastening hardware rated for the weight load. The design accepts loads up to 50 pounds when properly installed into solid framing. The clean profile pairs well with modern hardware and minimalist interior design. Multiple shelves can create floating shelf clusters for visual interest while maintaining clean lines.',
    true, NULL, 'Walnut', 'intermediate', 4,
    '{"length_min": 24, "length_max": 48, "depth": 10, "thickness": 1.0, "weight_capacity": 50}',
    'published', NOW(), 3567, 412, 234, 47, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_shelving_units);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_contemporary);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'floating-shelf', 'manual'),
    (v_design_id, 'contemporary', 'manual'),
    (v_design_id, 'minimalist', 'manual'),
    (v_design_id, 'clean-lines', 'manual'),
    (v_design_id, 'hidden-hardware', 'manual');

  -- ============================================================
  -- Design 14: Rustic Barn Door Trim
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Rustic Barn Door Trim with Heavy Stock',
    'rustic-barn-door-trim',
    'A substantial barn-door style casing using heavy solid wood stock. Celebrates wood grain and natural character with minimal finishing.',
    'Rustic design celebrates natural wood in its most honest form—thick stock, visible grain, and minimal finish. This barn door trim uses 2-inch-thick solid wood formed into a simple rectangular casing that emphasizes wood character rather than profile complexity.

Reclaimed wood, rough-sawn new lumber, or hand-planed stock all work beautifully for authentic rustic character. The 2-inch thickness creates substantial visual presence and structural authenticity. Finish with natural oil or minimal stain to showcase grain patterns. Hand-hewn or distressed surfaces add to the rustic aesthetic.

This trim works perfectly for barn conversions, rustic cabins, farmhouse renovations, and contemporary spaces seeking organic character. The simple rectangular profile is straightforward to produce, making this an economical design for extensive installations. The substantial stock visually grounds door openings while complementing heavy timber framing, beams, and rustic hardware.',
    true, NULL, 'Walnut', 'beginner', 3,
    '{"width": 3.5, "depth": 2.0, "stock_thickness": 2.0, "corner_treatment": "simple-miter", "grain_celebration": true}',
    'published', NOW(), 2834, 267, 149, 28, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_door_casings);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_rustic);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'rustic', 'manual'),
    (v_design_id, 'barn-door', 'manual'),
    (v_design_id, 'heavy-timber', 'manual'),
    (v_design_id, 'natural-character', 'manual'),
    (v_design_id, 'farmhouse', 'manual');

  -- ============================================================
  -- Design 15: Traditional Crown with Dentil Detail
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Traditional Crown Molding with Dentil Block Details',
    'traditional-crown-dentil-blocks',
    'A refined traditional crown molding enhanced with applied dentil block details. Combines classical influences with accessible production methods.',
    'Dentils are small rectangular blocks arranged in a row, a detail borrowed from classical Greek and Roman architecture. This traditional crown design combines a substantial curved profile with routed dentil molding applied to the lower edges, creating layered visual interest without extreme complexity.

Poplar or pine serve as economical base materials, particularly for painted finishes. The crown measures 5.5 inches tall with a deep cove profile that creates dramatic shadow lines. The dentil detail consists of 0.75-inch blocks spaced 1.5 inches apart, creating visual rhythm without overwhelming visual presence.

This molding works beautifully in living rooms, dining rooms, libraries, and formal spaces. The combination of substantial base profile with dentil detailing adds visual interest while remaining more accessible for production than fully carved profiles. Installation at ceiling line requires precise angle cuts and careful layout, but construction is straightforward. The design pairs elegantly with traditional baseboard and door casing designs.',
    true, NULL, 'Poplar', 'advanced', 7,
    '{"height": 5.5, "depth": 4.25, "dentil_size": 0.75, "dentil_spacing": 1.5, "cove_depth": 2.0}',
    'published', NOW(), 2401, 198, 112, 21, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_crown_molding);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_traditional);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'dentil-blocks', 'manual'),
    (v_design_id, 'classical-detail', 'manual'),
    (v_design_id, 'traditional', 'manual'),
    (v_design_id, 'shadow-lines', 'manual'),
    (v_design_id, 'timeless-design', 'manual');

  -- ============================================================
  -- Design 16: Mid-Century Modern Baseboard
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Mid-Century Modern Baseboard Profile',
    'mid-century-modern-baseboard',
    'A sleek mid-century baseboard with minimal profile and clean lines. Perfect for 1950s-60s homes and contemporary minimalist spaces.',
    'Mid-century modern rejected excessive ornamentation in favor of clean lines, honest materials, and functionality. This baseboard profile measures only 2.5 inches tall with a simple stepped profile that creates minimal visual obstruction while serving protective purposes.

Walnut, teak, or natural-finish plywood work beautifully for authentic mid-century character. The profile uses two simple rabbets and a small roundover to create visual interest without complexity. The understated design allows wall colors and furnishings to take visual priority while maintaining design integrity.

This baseboard works beautifully in mid-century modern spaces and contemporary minimalist homes. The modest height preserves sight lines and visual openness that characterize mid-century design principles. The profile is highly efficient for production due to simple routing operations. Natural or light-stain finishes showcase wood grain and emphasize the honest material approach fundamental to the style.',
    true, NULL, 'Walnut', 'beginner', 2,
    '{"height": 2.5, "depth": 0.875, "rabbet_depth": 0.25, "roundover_radius": 0.375}',
    'published', NOW(), 4012, 456, 267, 52, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_baseboards);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_mid_century);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'mid-century-modern', 'manual'),
    (v_design_id, 'minimalist', 'manual'),
    (v_design_id, 'clean-lines', 'manual'),
    (v_design_id, 'authentic-1950s', 'manual'),
    (v_design_id, 'beginner-project', 'manual');

  -- ============================================================
  -- Design 17: Victorian Rosette Block
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Victorian Rosette Block with Relief Carving',
    'victorian-rosette-block-carved',
    'An ornate rosette corner block featuring relief-carved floral details. Adds elegant visual transitions between casing components.',
    'Rosette blocks are decorative corner pieces that conceal wood movement and structural joints while adding ornamental interest. This Victorian design features relief-carved floral patterns that radiate from the center, creating dynamic visual interest.

Cherry or mahogany showcase the carved details beautifully with rich grain and color. The rosette measures 3.5 inches square, a standard size for Victorian-era door casings. The carved relief extends approximately 0.75 inches with botanical patterns that evoke Victorian gardens and natural ornamentation.

These blocks serve both aesthetic and practical purposes: they conceal the joints where head casing and side casings meet, accommodating wood movement while adding visual richness. CNC carving streamlines production significantly, though hand-carving is possible for smaller runs. Each design can incorporate subtle variations while maintaining the overall pattern. Installation requires precise layout and careful alignment.',
    true, NULL, 'Cherry', 'intermediate', 5,
    '{"size": 3.5, "relief_depth": 0.75, "carved_pattern": "floral", "corner_position": 4}',
    'published', NOW(), 1987, 176, 99, 17, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_door_casings);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_victorian);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'rosette-block', 'manual'),
    (v_design_id, 'relief-carving', 'manual'),
    (v_design_id, 'victorian', 'manual'),
    (v_design_id, 'floral-details', 'manual'),
    (v_design_id, 'corner-block', 'manual');

  -- ============================================================
  -- Design 18: Craftsman Cabinet Door Panel
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Craftsman Cabinet Door Panel with Frame-and-Panel Construction',
    'craftsman-cabinet-door-panel',
    'A classic frame-and-panel cabinet door design embodying Craftsman principles of honest joinery and natural wood beauty.',
    'Craftsman furniture design emphasizes quality materials, visible joinery, and understated elegance. This cabinet door panel design uses traditional frame-and-panel construction with mortise and tenon joinery at the corners. A raised panel center floats within the solid wood frame, accommodating wood movement while maintaining visual unity.

Oak or cherry are ideal for showcasing the wood grain and honest construction. The frame consists of solid stiles and rails proportioned at roughly 2 inches wide, creating substantial visual presence. The raised panel features a simple ogee profile that adds visual interest without excessive ornamentation.

This design works beautifully for kitchen cabinetry, bathroom vanities, and built-in shelving that prioritizes quality and character. Frame-and-panel construction allows for custom sizing while the fundamental proportions remain constant. The raised panel can be painted or stained to create subtle or pronounced contrast with the frame. Hand-tool execution is possible, though modern power tools streamline production significantly while maintaining traditional construction principles.',
    true, NULL, 'Oak', 'intermediate', 6,
    '{"frame_width": 2.0, "panel_width_typical": 10, "panel_height_typical": 16, "panel_profile": "ogee-raised", "joinery": "mortise-tenon"}',
    'published', NOW(), 2145, 189, 108, 20, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_cabinet_doors);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_craftsman);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'frame-and-panel', 'manual'),
    (v_design_id, 'cabinet-door', 'manual'),
    (v_design_id, 'craftsman', 'manual'),
    (v_design_id, 'honest-joinery', 'manual'),
    (v_design_id, 'raised-panel', 'manual');

  -- ============================================================
  -- Design 19: Colonial Wall Paneling Frame
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Colonial Wall Paneling Frame System',
    'colonial-wall-paneling-frame',
    'A traditional colonial wall paneling system using frame moldings to create geometric wall divisions with historical authenticity.',
    'Colonial-era wall paneling divided walls into regular geometric sections using applied moldings, creating visual order while serving practical functions including thermal insulation and impact protection. This design uses a 1.5-inch-wide frame molding arranged in a 24-inch-square module, creating consistent visual rhythm throughout the room.

Pine or poplar, typically painted in period colors, form the traditional material base. The frame molding combines a simple ogee profile with applied fillet strips creating visual depth and shadow lines. The system works with either raised panel inserts or smooth board infill depending on desired visual richness.

This paneling system works beautifully in entryways, dining rooms, hallways, and formal spaces seeking period authenticity. The 24-inch module scales easily to different room dimensions while maintaining visual harmony. Installation requires careful layout and level work to ensure consistent reveals and alignment throughout. The system integrates seamlessly with colonial baseboards, crown molding, and door casings for complete period coordination.',
    true, NULL, 'Pine', 'intermediate', 8,
    '{"frame_width": 1.5, "module_size": 24, "frame_depth": 0.75, "profile_detail": "ogee-fillet", "wall_height_range": "to-ceiling"}',
    'published', NOW(), 1876, 152, 84, 15, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_wall_paneling);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_colonial);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'wall-paneling', 'manual'),
    (v_design_id, 'colonial-style', 'manual'),
    (v_design_id, 'frame-system', 'manual'),
    (v_design_id, 'geometric-grid', 'manual'),
    (v_design_id, 'period-authentic', 'manual');

  -- ============================================================
  -- Design 20: Art Deco Stair Bracket
  -- ============================================================
  v_design_id := uuid_generate_v4();
  INSERT INTO designs (
    id, creator_id, title, slug, description, long_description,
    is_free, price_cents, material, difficulty_level, estimated_build_hours,
    dimensions_json, status, published_at, view_count, download_count,
    favorite_count, comment_count, primary_image_url
  ) VALUES (
    v_design_id, v_admin_id,
    'Art Deco Stair Bracket with Geometric Stepping',
    'art-deco-stair-bracket',
    'A striking stair bracket featuring geometric stepping and angular forms. Combines structural function with bold architectural statement.',
    'Art Deco embraced geometric forms and bold materials, principles perfectly expressed in this structural stair bracket. The design features angular stepping and chrome or brass accents, supporting both the handrail and stair structure while making a design statement.

Walnut or dark mahogany provide the richness that Art Deco demands, often paired with polished brass or chrome fittings. The bracket stands 8 inches tall with angular stepped forms that echo skyscrapers and machine-age aesthetics. The design can be hand-carved or CNC-executed, with precision critical for the geometric facets.

This bracket serves as both structural support (rated for substantial loads when properly installed) and architectural statement. Multiple brackets create visual rhythm along the staircase while the unified geometric language ties the design together. The design works beautifully with Art Deco handrails, balusters, and newel posts for completely coordinated staircase design. Installation requires solid framing and quality hardware.',
    true, NULL, 'Mahogany', 'intermediate', 6,
    '{"height": 8, "depth": 6.5, "width": 5, "angular_facets": 4, "load_capacity": 400}',
    'published', NOW(), 1654, 134, 73, 12, NULL
  );

  INSERT INTO design_categories (design_id, category_id) VALUES (v_design_id, v_cat_balusters);
  INSERT INTO design_styles (design_id, style_id) VALUES (v_design_id, v_style_art_deco);
  INSERT INTO design_tags (design_id, tag_name, tag_type) VALUES
    (v_design_id, 'stair-bracket', 'manual'),
    (v_design_id, 'art-deco', 'manual'),
    (v_design_id, 'geometric-forms', 'manual'),
    (v_design_id, 'architectural-statement', 'manual'),
    (v_design_id, 'structural-detail', 'manual');

  RAISE NOTICE 'Successfully inserted 20 sample millwork designs into the database';

END $$;
