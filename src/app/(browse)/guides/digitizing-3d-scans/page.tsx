import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Digitizing 3D Scans of Millwork | Guide | MillworkDatabase',
  description:
    'A complete guide to scanning architectural millwork, cleaning mesh files, and rebuilding clean parametric CAD models in Fusion 360 for CNC reproduction.',
};

/* ── tiny reusable bits ── */

function StepNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold shrink-0">
      {n}
    </span>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 px-4 py-3 my-4 rounded-r-lg">
      <p className="text-sm text-amber-900">
        <span className="font-semibold">Tip: </span>
        {children}
      </p>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 px-4 py-3 my-4 rounded-r-lg">
      <p className="text-sm text-red-900">
        <span className="font-semibold">Warning: </span>
        {children}
      </p>
    </div>
  );
}

function KeyConcept({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-brand-50 border border-brand-200 rounded-lg p-5 my-4">
      <h4 className="font-semibold text-brand-900 mb-1">{title}</h4>
      <p className="text-sm text-brand-800">{children}</p>
    </div>
  );
}

/* ── page ── */

export default function DigitizingScansGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides/digitizing-3d-scans" className="text-gray-900 font-medium">
          Digitizing 3D Scans
        </Link>
      </nav>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
        Digitizing 3D Scans of Architectural Millwork
      </h1>
      <p className="text-lg text-gray-600 mb-4 leading-relaxed">
        How to go from a raw 3D scan of a physical molding, carving, or trim piece to a
        clean, lightweight, parametric CAD file ready for CNC reproduction.
      </p>
      <p className="text-sm text-gray-400 mb-10">
        Primary tool covered: <strong className="text-gray-600">Autodesk Fusion 360</strong> &middot;
        Also referenced: MeshLab, Geomagic, Rhino, VXelements
      </p>

      {/* Table of contents */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">In This Guide</h2>
        <ol className="space-y-1.5 text-sm">
          <li><a href="#why-digitize" className="text-brand-600 hover:underline">1. Why Digitize Millwork?</a></li>
          <li><a href="#scanning" className="text-brand-600 hover:underline">2. Scanning Best Practices</a></li>
          <li><a href="#mesh-cleanup" className="text-brand-600 hover:underline">3. Mesh Cleanup &amp; Optimization</a></li>
          <li><a href="#fusion-workflow" className="text-brand-600 hover:underline">4. Fusion 360 Workflow: Mesh to Parametric CAD</a></li>
          <li><a href="#repeating-elements" className="text-brand-600 hover:underline">5. Modeling Repeating Elements</a></li>
          <li><a href="#organic-carvings" className="text-brand-600 hover:underline">6. Handling Organic &amp; Non-Repeating Carvings</a></li>
          <li><a href="#cnc-prep" className="text-brand-600 hover:underline">7. Preparing Files for CNC</a></li>
          <li><a href="#fusion-plugins" className="text-brand-600 hover:underline">8. Fusion 360 Plugins &amp; the MillworkDatabase Roadmap</a></li>
        </ol>
      </div>

      {/* ────────────────────── Section 1 ────────────────────── */}
      <section id="why-digitize" className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Why Digitize Millwork?</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            Historic buildings are full of irreplaceable millwork that was hand-carved or run
            on molding machines that no longer exist. When a piece is damaged or needs to be
            matched for a renovation, the only faithful way to reproduce it is to capture its
            exact geometry. A 3D scan turns a physical artifact into a digital mesh, and with
            the right workflow, that mesh becomes a parametric CAD model that can be CNC-cut
            as many times as needed.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The goal is a file that is lightweight enough to email and share, dimensionally
            accurate enough to match the original, and parametric so that it can be scaled or
            adjusted for new applications &mdash; all without losing the character of the
            original design.
          </p>
        </div>
      </section>

      {/* ────────────────────── Section 2 ────────────────────── */}
      <section id="scanning" className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Scanning Best Practices</h2>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Choosing a Scanner</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Structured-light scanners (like the Einscan series, Revopoint, or Artec Eva) work well for
          millwork because they capture fine surface detail at close range. Laser-line scanners
          (like FARO arms or Creaform) are better for larger pieces or in-situ scanning where
          the molding is still installed. LiDAR on a phone can capture overall form but
          typically lacks the resolution to reproduce detailed profiles.
        </p>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Getting a Clean Scan</h3>
        <div className="space-y-3 mb-4">
          <div className="flex gap-3 items-start">
            <StepNumber n={1} />
            <div>
              <p className="text-gray-900 font-medium">Prep the surface.</p>
              <p className="text-sm text-gray-600">
                If the piece is dark, glossy, or translucent, apply a thin coat of scanning
                spray (e.g., AESUB Blue) or developer spray. This creates a matte white
                surface that scanners can track. The spray evaporates in hours and leaves no
                residue.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={2} />
            <div>
              <p className="text-gray-900 font-medium">Use reference targets.</p>
              <p className="text-sm text-gray-600">
                Place adhesive tracking targets around the piece if your scanner supports them.
                This helps the software stitch multiple passes together accurately, especially
                on long runs of molding.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={3} />
            <div>
              <p className="text-gray-900 font-medium">Overlap your passes.</p>
              <p className="text-sm text-gray-600">
                Move slowly and ensure at least 30% overlap between scan passes. Holes in the
                mesh are much harder to fix later than spending an extra minute scanning.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={4} />
            <div>
              <p className="text-gray-900 font-medium">Scan a clean cross-section if possible.</p>
              <p className="text-sm text-gray-600">
                For linear moldings (crown, base, casing), scanning a cleanly cut end grain
                reveals the profile clearly. If you can remove a short sample, scan it as a
                standalone piece &mdash; this is much easier to digitize than trying to extract
                the profile from a long run.
              </p>
            </div>
          </div>
        </div>

        <Tip>
          Export your raw scan as both a high-resolution OBJ (with normals) and a reduced STL.
          Keep the high-res version as an archive, and use the reduced version for modeling.
        </Tip>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">File Formats</h3>
        <p className="text-gray-700 leading-relaxed mb-2">
          Fusion 360 can import OBJ, STL, and 3MF mesh files. STL is the most widely supported,
          but OBJ retains vertex normals and texture coordinates if you need them later. For
          initial modeling work, STL is usually fine.
        </p>
      </section>

      {/* ────────────────────── Section 3 ────────────────────── */}
      <section id="mesh-cleanup" className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Mesh Cleanup &amp; Optimization</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          A raw scan might contain millions of triangles and weigh hundreds of megabytes.
          Before bringing it into Fusion, you want to clean it up and reduce its polygon
          count without losing the detail that matters.
        </p>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Pre-Processing in Dedicated Mesh Software</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Tools like MeshLab (free), Geomagic Wrap, or VXelements are built for mesh editing
          and are faster and more capable than Fusion at this stage. The key operations:
        </p>
        <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 mb-4">
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Hole filling</p>
            <p className="text-sm text-gray-600">
              Close any gaps from areas the scanner missed. Most tools can auto-detect and
              fill holes. Review filled areas to make sure the interpolated surface is
              reasonable.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Noise removal &amp; smoothing</p>
            <p className="text-sm text-gray-600">
              Apply a light Laplacian smooth to remove scan noise without blurring sharp
              edges. Be conservative &mdash; over-smoothing erases the crisp arrises that
              define molding profiles.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Decimation (polygon reduction)</p>
            <p className="text-sm text-gray-600">
              This is the big win. In MeshLab, use <em>Quadric Edge Collapse Decimation</em>
              (Filters &gt; Remeshing &gt; Simplification). A 1-million-triangle mesh can
              often be reduced to 100k&ndash;200k triangles with minimal visual difference.
              Flat and gently curved areas lose triangles; detailed areas keep them.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Alignment &amp; scaling</p>
            <p className="text-sm text-gray-600">
              Orient the mesh so the profile&rsquo;s cross-section lies along a primary axis
              (e.g., the molding runs along X). Verify scale against a known measurement,
              like the overall width of the molding.
            </p>
          </div>
        </div>

        <KeyConcept title="The Decimation Sweet Spot">
          For CNC reproduction of millwork, a mesh between 50k and 200k triangles is usually
          sufficient. The CNC toolpath resolution is limited by the bit diameter (typically
          1/8&Prime; or 1/16&Prime;), so sub-millimeter mesh detail won&rsquo;t translate to
          the physical cut. Reduce aggressively on flat surfaces but preserve detail on
          ornamental areas.
        </KeyConcept>
      </section>

      {/* ────────────────────── Section 4 ────────────────────── */}
      <section id="fusion-workflow" className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Fusion 360 Workflow: Mesh to Parametric CAD</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The core idea: use the mesh as a visual reference and trace over it with sketch
          geometry, then use Fusion&rsquo;s solid and surface modeling tools to build clean
          parametric bodies. Do <em>not</em> try to directly convert the mesh to a solid
          &mdash; the result is almost always an unusably heavy, non-parametric body.
        </p>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Step-by-Step</h3>
        <div className="space-y-5 mb-6">
          <div className="flex gap-3 items-start">
            <StepNumber n={1} />
            <div>
              <p className="text-gray-900 font-medium">Import the mesh.</p>
              <p className="text-sm text-gray-600">
                Insert &gt; Insert Mesh. Choose your cleaned STL or OBJ. Fusion will show it
                as a mesh body in the browser. Make sure the units are correct (mm vs inches).
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={2} />
            <div>
              <p className="text-gray-900 font-medium">Slice the mesh with section sketches.</p>
              <p className="text-sm text-gray-600">
                This is the critical step. Go to <strong>Mesh &gt; Create &gt; Create Mesh Section Sketch</strong>.
                Place a construction plane through the mesh at the cross-section you want to
                capture. For a linear molding, one good cross-section may be all you need. For
                a 3D piece, create multiple section planes at regular intervals.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={3} />
            <div>
              <p className="text-gray-900 font-medium">Fit curves to the section.</p>
              <p className="text-sm text-gray-600">
                Use <strong>Mesh &gt; Create &gt; Fit Curves to Mesh Section</strong>. Fusion
                will trace the intersection line and convert it into sketch geometry &mdash;
                arcs, lines, and splines. You can adjust the tolerance to control how closely
                the curves follow the mesh. Tighter tolerance = more control points = heavier
                file. For most millwork profiles, a tolerance of 0.1&ndash;0.5 mm is a good
                starting point.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={4} />
            <div>
              <p className="text-gray-900 font-medium">Clean up the sketch.</p>
              <p className="text-sm text-gray-600">
                The auto-fitted curves will have extra spline points and small artifacts.
                Simplify by replacing complex splines with arcs and lines where the geometry
                is clearly circular or straight. Add constraints (tangent, perpendicular,
                equal) to make the sketch fully parametric. This is where most of your time
                goes, and it&rsquo;s where the quality of the final file is determined.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={5} />
            <div>
              <p className="text-gray-900 font-medium">Extrude, revolve, sweep, or loft.</p>
              <p className="text-sm text-gray-600">
                Once you have a clean profile sketch, use standard solid modeling operations to
                build the 3D body. For a linear molding, a simple extrude to the desired
                length is all you need. For turned elements (rosettes, column capitals),
                revolve. For elements that follow a curved path (arched casing), sweep.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={6} />
            <div>
              <p className="text-gray-900 font-medium">Compare against the mesh.</p>
              <p className="text-sm text-gray-600">
                Use Fusion&rsquo;s <strong>Inspect &gt; Section Analysis</strong> or simply
                toggle the mesh body&rsquo;s visibility to overlay your new solid against the
                original scan. Look for areas where your simplified geometry deviates
                noticeably. Adjust sketch dimensions as needed.
              </p>
            </div>
          </div>
        </div>

        <Tip>
          Because section planes are in Fusion&rsquo;s parametric timeline, you can go back
          and move them, add new ones, or adjust their angle at any time. This makes it easy
          to iterate.
        </Tip>

        <Warning>
          Avoid using <em>Mesh &gt; Modify &gt; Convert Mesh</em> (mesh-to-BRep) for complex
          millwork. It converts every triangle to a surface face, producing bodies with
          thousands of faces that are slow, non-parametric, and nearly impossible to edit.
          This tool is better suited for very simple, low-poly meshes.
        </Warning>
      </section>

      {/* ────────────────────── Section 5 ────────────────────── */}
      <section id="repeating-elements" className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Modeling Repeating Elements</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Much of architectural millwork is built from repeating motifs &mdash; dentil blocks,
          egg-and-dart patterns, fluting, bead-and-reel moldings. Rather than modeling the
          entire piece, model one repeat unit and then pattern it.
        </p>
        <div className="space-y-3 mb-4">
          <div className="flex gap-3 items-start">
            <StepNumber n={1} />
            <div>
              <p className="text-gray-900 font-medium">Identify the repeat unit.</p>
              <p className="text-sm text-gray-600">
                Look at the mesh and find the smallest section that, when repeated, creates
                the full pattern. For a dentil band, it&rsquo;s one block plus one gap. For
                egg-and-dart, it&rsquo;s one egg and one dart.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={2} />
            <div>
              <p className="text-gray-900 font-medium">Model just that unit as a solid body.</p>
              <p className="text-sm text-gray-600">
                Use the section-sketch workflow above, focusing your section planes on one
                repeat. Build a clean, fully-constrained parametric solid.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <StepNumber n={3} />
            <div>
              <p className="text-gray-900 font-medium">Use Rectangular or Circular Pattern.</p>
              <p className="text-sm text-gray-600">
                Fusion&rsquo;s <strong>Create &gt; Pattern &gt; Rectangular Pattern</strong>
                can repeat your unit along any axis. Set the distance to the repeat pitch
                (measured from the scan) and the quantity needed. If the pattern follows a
                curve (e.g., around a rosette), use the <strong>Pattern Along Path</strong>
                tool instead.
              </p>
            </div>
          </div>
        </div>

        <KeyConcept title="Why Patterns Beat Copies">
          A Fusion pattern is parametric &mdash; change the unit and every instance updates.
          Change the pitch or count and the band grows or shrinks. This makes it trivial to
          adapt an 8-foot dentil run to fit a 6-foot window header.
        </KeyConcept>
      </section>

      {/* ────────────────────── Section 6 ────────────────────── */}
      <section id="organic-carvings" className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          6. Handling Organic &amp; Non-Repeating Carvings
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Not everything can be rebuilt as parametric geometry. A hand-carved acanthus leaf
          capital, a figural bracket, or a freeform floral panel contains organic shapes
          that don&rsquo;t reduce to arcs, lines, and extrudes. For these pieces, you
          keep the mesh &mdash; but optimize it for CNC.
        </p>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Approach A: Optimized Mesh Direct to CAM</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          For complex one-off carvings, the most practical path is often to skip parametric
          modeling entirely and instead prepare the mesh itself for CNC toolpath generation.
        </p>
        <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 mb-4">
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Decimate aggressively but intelligently</p>
            <p className="text-sm text-gray-600">
              Use MeshLab&rsquo;s Quadric Edge Collapse or Geomagic&rsquo;s mesh doctor to
              reduce polygon count. Target 50k&ndash;150k faces for a typical carving panel.
              Preview at each stage and compare against the original to spot quality loss.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Remesh for uniform topology</p>
            <p className="text-sm text-gray-600">
              Isotropic remeshing replaces the irregular scan triangles with uniformly-sized
              faces. This produces smoother toolpaths and more predictable machining. In
              MeshLab: <em>Filters &gt; Remeshing &gt; Isotropic Explicit Remeshing</em>.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Ensure watertight geometry</p>
            <p className="text-sm text-gray-600">
              Fill all holes, fix non-manifold edges, and remove internal faces. CAM software
              needs a watertight mesh to generate reliable toolpaths. Use Mesh Repair tools in
              your software of choice or Fusion&rsquo;s built-in Mesh repair.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Generate toolpaths from the mesh</p>
            <p className="text-sm text-gray-600">
              Software like MeshCAM, Fusion 360 Manufacturing, Vectric Aspire, or RhinoCAM
              can generate 3-axis and 5-axis toolpaths directly from mesh geometry. For deep
              undercuts or full 3D carvings, a 5-axis machine is significantly more capable.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Approach B: Hybrid &mdash; Parametric Base + Mesh Detail</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          For carvings that have a geometric base (like a capital with an identifiable bell
          shape) topped by organic detail (acanthus leaves), consider a hybrid approach:
          model the base parametrically for dimensional accuracy, then overlay the organic
          mesh for the detail pass. This gives you the best of both worlds &mdash; a
          resizable base and faithful surface detail.
        </p>

        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Approach C: Retopology in Specialized Software</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          For very high-value pieces that need to be resizable and editable, consider
          retopology in Rhino with Grasshopper, or ZBrush/Blender for SubD (subdivision
          surface) modeling. These tools let you lay a clean, editable surface over the scan
          that preserves the organic form while being dramatically lighter than the raw mesh.
          This is the most skilled approach and typically the most time-consuming.
        </p>

        <Tip>
          For architectural reproduction, Approach A (optimized mesh direct to CAM) is the
          fastest and most common path for ornate carvings. Save Approach C for museum-grade
          reproductions or when the carving will be adapted into multiple sizes or
          configurations.
        </Tip>
      </section>

      {/* ────────────────────── Section 7 ────────────────────── */}
      <section id="cnc-prep" className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Preparing Files for CNC</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Whether you built a parametric solid or optimized a mesh, the file needs to be CNC-ready.
          Here are the key considerations:
        </p>
        <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 mb-4">
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">File format</p>
            <p className="text-sm text-gray-600">
              For parametric solids, export as STEP (.stp) for maximum compatibility with
              CAM software. For meshes going direct to CAM, STL at the appropriate resolution
              is standard. Some shops prefer 3MF.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">File size targets</p>
            <p className="text-sm text-gray-600">
              A parametric STEP file of a molding profile should be under 1 MB. An optimized
              mesh STL for an ornate carving should be under 20 MB. If your files are larger,
              further decimation or simplification is warranted.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Orientation and datum</p>
            <p className="text-sm text-gray-600">
              Orient the model so the machining face is up (Z-positive). Place the origin at
              a logical datum &mdash; typically one corner of the stock material. Include the
              stock bounding box dimensions in your file metadata or file name.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Undercuts and draft</p>
            <p className="text-sm text-gray-600">
              If the piece will be cut on a 3-axis router, verify there are no undercuts
              (geometry that the bit can&rsquo;t reach from above). Fusion&rsquo;s draft
              analysis tool can highlight problem areas. For complex carvings, 5-axis machining
              or a two-sided flip operation may be necessary.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-gray-900">Tool diameter awareness</p>
            <p className="text-sm text-gray-600">
              The smallest detail the CNC can cut is limited by the smallest tool bit. A 1/16&Prime;
              ball-nose endmill can reproduce detail down to about 1.5 mm radius. Smaller detail
              exists in the file but won&rsquo;t appear in the physical cut. Keep this in mind
              when deciding how much mesh detail to preserve.
            </p>
          </div>
        </div>

        <KeyConcept title="Manageable Size Without Quality Loss">
          The goal is not to preserve every polygon from the scanner &mdash; it&rsquo;s to
          preserve every detail that the CNC machine can actually reproduce. A 50 MB file
          and a 5 MB file will produce the same physical piece if the difference between them
          is in sub-millimeter surface noise that no router bit can cut.
        </KeyConcept>
      </section>

      {/* ────────────────────── Section 8 ────────────────────── */}
      <section id="fusion-plugins" className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          8. Fusion 360 Plugins &amp; the MillworkDatabase Roadmap
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Fusion 360 has a full Python and C++ API that supports third-party add-ins. The
          Autodesk App Store hosts hundreds of community and commercial plugins, and
          Autodesk provides open-source skeletons and documentation for building your own.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Add-ins can create custom commands, add UI panels, automate repetitive operations,
          and integrate with external services. This opens up some interesting possibilities
          for the MillworkDatabase community:
        </p>
        <div className="bg-brand-50 border border-brand-200 rounded-lg divide-y divide-brand-200 mb-4">
          <div className="px-5 py-4">
            <p className="font-medium text-brand-900">Direct library integration</p>
            <p className="text-sm text-brand-800">
              A Fusion add-in that connects to the MillworkDatabase API, letting users
              browse and insert millwork profiles directly into their Fusion timeline without
              leaving the application.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-brand-900">Automated scan-to-profile</p>
            <p className="text-sm text-brand-800">
              A workflow assistant that automates the section-sketch + fit-curves + cleanup
              pipeline for linear molding profiles, reducing what is currently a manual
              30-minute process to a few clicks.
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="font-medium text-brand-900">Profile matching</p>
            <p className="text-sm text-brand-800">
              Upload a scan and let the plugin compare it against the MillworkDatabase
              library to find existing profiles that match &mdash; potentially saving the
              user from digitizing something that&rsquo;s already been done.
            </p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          These are future roadmap ideas. Fusion&rsquo;s API is mature enough to support all
          of them &mdash; add-ins can access mesh data, create sketches, run commands, and
          make HTTP requests to external services. The Autodesk App Store provides a
          distribution channel. If you&rsquo;re a developer interested in contributing to
          this effort, reach out via our <Link href="/contact" className="text-brand-600 hover:underline">contact page</Link>.
        </p>
      </section>

      {/* ────────────────────── Video reference ────────────────────── */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Video Reference</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="text-gray-700 mb-3">
            This guide was informed in part by the following tutorial on mesh-to-CAD workflows
            in Fusion 360. It walks through the section sketch and fit curves approach in
            detail:
          </p>
          <a
            href="https://www.youtube.com/watch?v=pzMZ-sIua44"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-600 font-medium hover:underline"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
              <path fill="#fff" d="M9.545 15.568V8.432L15.818 12z" />
            </svg>
            Watch: Mesh to CAD in Fusion 360
          </a>
        </div>
      </section>

      {/* ────────────────────── CTA ────────────────────── */}
      <section className="bg-wood-900 text-white rounded-2xl p-8 md:p-10 text-center">
        <h2 className="text-2xl font-display font-bold mb-3">
          Ready to Share Your Digitized Millwork?
        </h2>
        <p className="text-wood-200 mb-6 max-w-xl mx-auto">
          Once you&rsquo;ve built a clean parametric file from your scan, upload it to the
          MillworkDatabase so the community can benefit. Every profile shared is a piece of
          architectural heritage preserved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard/designs/new"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors"
          >
            Upload a Design
          </Link>
          <Link
            href="/designs"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
          >
            Browse the Library
          </Link>
        </div>
      </section>
    </div>
  );
}
