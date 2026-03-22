import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | MillworkDatabase',
  description: 'Learn about MillworkDatabase.com — a community platform for sharing architectural millwork designs.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About MillworkDatabase</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          MillworkDatabase.com is a community-driven platform where woodworkers, architects, and
          craftspeople share, discover, and download architectural millwork designs.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Architectural millwork — the trim, moldings, carvings, and details that bring buildings
            to life — represents centuries of craft knowledge. Our mission is to preserve and
            democratize access to these designs by building the largest open library of millwork
            profiles, templates, and CNC-ready files in the world.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What You&apos;ll Find Here</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Design Library</h3>
              <p className="text-gray-600 text-sm">
                Browse thousands of millwork profiles spanning crown moldings, baseboards, door
                casings, stair parts, mantels, cabinet doors, wall paneling, and more.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">CNC-Ready Files</h3>
              <p className="text-gray-600 text-sm">
                Download production-ready DXF, DWG, and STEP files that go straight to your
                CNC router or shaper. 3D scans and tessellated meshes included where available.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Architectural Styles</h3>
              <p className="text-gray-600 text-sm">
                Filter by period and style — Craftsman, Colonial, Victorian, Art Deco, Mid-Century
                Modern, and more — to find designs that match your project.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">CNC Provider Network</h3>
              <p className="text-gray-600 text-sm">
                Connect with CNC service providers who can produce the designs you find here,
                bridging the gap between digital design and physical millwork.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Community-Driven</h2>
          <p className="text-gray-700 leading-relaxed">
            Every design on MillworkDatabase is contributed by our community of woodworkers,
            architects, restoration specialists, and CNC operators. Whether you&apos;re restoring a
            Victorian home, designing a new Craftsman kitchen, or producing custom millwork for
            clients, this platform is built for you.
          </p>
        </section>

        <section className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Involved</h2>
          <p className="text-gray-700 mb-4">
            Have millwork designs to share? Join the community and start uploading your profiles,
            templates, and CNC files. Free and paid designs are both welcome.
          </p>
          <a
            href="/register"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create a Free Account
          </a>
        </section>
      </div>
    </div>
  );
}
