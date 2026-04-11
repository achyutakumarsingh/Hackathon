import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="font-semibold text-lg text-gray-900">Civic Sense</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#problem" className="nav-link text-gray-500 hover:text-gray-900 transition">Problem</a>
            <a href="#workflow" className="nav-link text-gray-500 hover:text-gray-900 transition">Workflow</a>
            <a href="#architecture" className="nav-link text-gray-500 hover:text-gray-900 transition">Architecture</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button onClick={() => navigate('/feed')} className="text-sm font-medium text-blue-600 hover:text-blue-700">Go to App</button>
                <button onClick={signOut} className="text-sm font-medium text-gray-500 hover:text-gray-700">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-500 hover:text-gray-700">Login</button>
                <button onClick={() => navigate('/register')} className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="text-gray-900">
        
    {/* Navigation */}
    

    {/* Hero Section */}
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            ></path>
          </svg>
          Civic Issue Reporting Platform
        </div>
        <h1
          className="text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
        >
          Smarter Civic<br />Issue Reporting
        </h1>
        <p
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Empowering citizens to report issues. Enabling authorities to resolve
          them efficiently. Powered by modern technology and ML intelligence.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#workflow"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            View Workflow
          </a>
          <a
            href="#architecture"
            className="px-6 py-3 bg-white border border-gray-200 rounded-lg font-medium hover:border-gray-300 transition"
          >
            Explore Architecture
          </a>
        </div>
      </div>

      {/* Hero Visual */}
      <div className="max-w-5xl mx-auto mt-20">
        <div
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-100"
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Browser Chrome */}
            <div
              className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200"
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 mx-4">
                <div
                  className="bg-white rounded px-3 py-1 text-xs text-gray-500 border border-gray-200"
                >
                  civic-sense.app
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="p-6 bg-gray-50">
              {/* Navigation Bar */}
              <div
                className="bg-white rounded-lg p-3 mb-4 flex items-center justify-between border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                  <div className="h-3 w-24 bg-gray-300 rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-12 bg-gray-200 rounded"></div>
                  <div className="h-2 w-12 bg-gray-200 rounded"></div>
                  <div className="h-2 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Issue Card 1 */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex gap-3">
                    <div
                      className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded flex-shrink-0"
                    ></div>
                    <div className="flex-1">
                      <div className="h-3 w-3/4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-gray-200 rounded mb-2"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-16 bg-yellow-100 rounded-full"></div>
                        <div className="h-2 w-8 bg-blue-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue Card 2 */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex gap-3">
                    <div
                      className="w-16 h-16 bg-gradient-to-br from-green-200 to-green-300 rounded flex-shrink-0"
                    ></div>
                    <div className="flex-1">
                      <div className="h-3 w-3/4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-gray-200 rounded mb-2"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-16 bg-green-100 rounded-full"></div>
                        <div className="h-2 w-8 bg-blue-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Preview */}
                <div
                  className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2"
                >
                  <div
                    className="h-32 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded relative"
                  >
                    {/* Map Pins */}
                    <div
                      className="absolute top-4 left-8 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                    ></div>
                    <div
                      className="absolute top-12 right-12 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"
                    ></div>
                    <div
                      className="absolute bottom-8 left-16 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
                    ></div>
                    <div
                      className="absolute bottom-6 right-8 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                    ></div>
                    {/* Map Label */}
                    <div
                      className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow text-xs font-medium text-gray-700"
                    >
                      Map View
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Problem Section */}
    <section id="problem" className="py-24 px-6 gradient-subtle">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">The Problem</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Current civic issue reporting is fragmented, slow, and lacks
            transparency
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div
            className="bg-white rounded-xl p-8 border border-gray-100 card-hover"
          >
            <div
              className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Centralized System</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Citizens struggle to report issues through fragmented channels
            </p>
          </div>
          <div
            className="bg-white rounded-xl p-8 border border-gray-100 card-hover"
          >
            <div
              className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Lack of Transparency</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              No visibility into issue status or resolution progress
            </p>
          </div>
          <div
            className="bg-white rounded-xl p-8 border border-gray-100 card-hover"
          >
            <div
              className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Slow Resolution</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Issues take weeks or months to get addressed
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Solution Overview */}
    <section id="solution" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Solution</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern platform that makes civic issue reporting simple,
            transparent, and efficient
          </p>
        </div>
        <div className="space-y-6">
          <div
            className="flex items-start gap-6 bg-white rounded-xl p-8 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Easy Issue Reporting</h3>
              <p className="text-gray-600 leading-relaxed">
                Citizens can report issues in seconds with photos, descriptions,
                and automatic location capture
              </p>
            </div>
          </div>
          <div
            className="flex items-start gap-6 bg-white rounded-xl p-8 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize all issues on an interactive map with geo-clustering
                to identify hotspots
              </p>
            </div>
          </div>
          <div
            className="flex items-start gap-6 bg-white rounded-xl p-8 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive analytics and management tools for authorities to
                track and resolve issues efficiently
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* User Workflows */}
    <section id="workflow" className="py-24 px-6 gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">User Workflows</h2>
          <p className="text-xl text-gray-600">
            Seamless experience for citizens and administrators
          </p>
        </div>

        {/* Citizen Flow */}
        <div className="mb-16">
          <h3
            className="text-sm font-semibold text-blue-600 mb-6 uppercase tracking-wide"
          >
            Citizen Journey
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative flow-arrow">
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm">Sign Up</h4>
                <p className="text-xs text-gray-600">Quick registration</p>
              </div>
            </div>
            <div className="relative flow-arrow">
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm">Report Issue</h4>
                <p className="text-xs text-gray-600">Upload photo & details</p>
              </div>
            </div>
            <div className="relative flow-arrow">
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm">Track Status</h4>
                <p className="text-xs text-gray-600">Real-time updates</p>
              </div>
            </div>
            <div className="relative">
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h4 className="font-semibold mb-2 text-sm">Resolved</h4>
                <p className="text-xs text-gray-600">Issue fixed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Flow */}
        <div>
          <h3
            className="text-sm font-semibold text-purple-600 mb-6 uppercase tracking-wide"
          >
            Admin Journey
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative flow-arrow">
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm">Dashboard</h4>
                <p className="text-xs text-gray-600">View all issues</p>
              </div>
            </div>
            <div className="relative flow-arrow">
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm">Prioritize</h4>
                <p className="text-xs text-gray-600">Filter & sort</p>
              </div>
            </div>
            <div className="relative flow-arrow">
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm">Update Status</h4>
                <p className="text-xs text-gray-600">Mark progress</p>
              </div>
            </div>
            <div className="relative">
              <div
                className="bg-white rounded-xl p-6 border border-gray-100 text-center"
              >
                <div
                  className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h4 className="font-semibold mb-2 text-sm">Analytics</h4>
                <p className="text-xs text-gray-600">Track metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Wireframes */}
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Interface Design</h2>
          <p className="text-xl text-gray-600">
            Clean, intuitive screens for all user types
          </p>
        </div>

        {/* Citizen Screens */}
        <h3
          className="text-sm font-semibold text-blue-600 mb-6 uppercase tracking-wide"
        >
          Citizen Experience
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Home Feed Wireframe */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* Header */}
              <div
                className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-300 rounded"></div>
                </div>
                <div className="h-3 w-16 bg-gray-300 rounded"></div>
              </div>
              {/* Search */}
              <div
                className="h-8 bg-white rounded border border-gray-200 mb-3"
              ></div>
              {/* Issue Cards */}
              <div className="space-y-2">
                <div className="bg-white rounded p-2 border border-gray-200">
                  <div className="h-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-3/4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <div className="h-16 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-3/4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Home Feed</h3>
            <p className="text-sm text-gray-600">Browse recent issues</p>
          </div>

          {/* Report Issue Wireframe */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* Header */}
              <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>
              {/* Image Upload */}
              <div
                className="h-24 bg-white rounded border-2 border-dashed border-gray-300 mb-3 flex items-center justify-center"
              >
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  ></path>
                </svg>
              </div>
              {/* Form Fields */}
              <div className="space-y-2">
                <div className="h-8 bg-white rounded border border-gray-200"></div>
                <div className="h-8 bg-white rounded border border-gray-200"></div>
                <div className="h-16 bg-white rounded border border-gray-200"></div>
                <div className="h-8 bg-blue-500 rounded"></div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Report Issue</h3>
            <p className="text-sm text-gray-600">Submit new reports</p>
          </div>

          {/* Admin Dashboard Wireframe */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* Header */}
              <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-blue-100 rounded p-2">
                  <div className="h-2 w-8 bg-blue-300 rounded mb-1"></div>
                  <div className="h-3 w-6 bg-blue-400 rounded"></div>
                </div>
                <div className="bg-yellow-100 rounded p-2">
                  <div className="h-2 w-8 bg-yellow-300 rounded mb-1"></div>
                  <div className="h-3 w-6 bg-yellow-400 rounded"></div>
                </div>
                <div className="bg-green-100 rounded p-2">
                  <div className="h-2 w-8 bg-green-300 rounded mb-1"></div>
                  <div className="h-3 w-6 bg-green-400 rounded"></div>
                </div>
              </div>
              {/* Table */}
              <div className="bg-white rounded border border-gray-200 p-2">
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <div className="h-2 w-1/3 bg-gray-300 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-300 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Admin Dashboard</h3>
            <p className="text-sm text-gray-600">Manage all issues</p>
          </div>

          {/* Map View Wireframe */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* Map Area */}
              <div
                className="h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded mb-3 relative"
              >
                {/* Map Pins */}
                <div
                  className="absolute top-4 left-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                ></div>
                <div
                  className="absolute top-8 right-8 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"
                ></div>
                <div
                  className="absolute bottom-6 left-12 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                ></div>
                <div
                  className="absolute bottom-8 right-6 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"
                ></div>
              </div>
              {/* Map Controls */}
              <div className="flex gap-2">
                <div
                  className="h-6 flex-1 bg-white rounded border border-gray-200"
                ></div>
                <div className="h-6 w-16 bg-blue-500 rounded"></div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Map View</h3>
            <p className="text-sm text-gray-600">Geo-clustered issues</p>
          </div>

          {/* Issue Detail Wireframe */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* Image Gallery */}
              <div className="h-20 bg-gray-300 rounded mb-3"></div>
              {/* Title & Status */}
              <div className="flex items-center justify-between mb-2">
                <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 bg-green-200 rounded-full"></div>
              </div>
              {/* Description */}
              <div className="space-y-1 mb-3">
                <div className="h-2 w-full bg-gray-200 rounded"></div>
                <div className="h-2 w-5/6 bg-gray-200 rounded"></div>
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                <div
                  className="h-6 w-20 bg-blue-100 rounded flex items-center justify-center"
                >
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Issue Detail</h3>
            <p className="text-sm text-gray-600">Full information view</p>
          </div>

          {/* Multi-step Report Wireframe */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* Progress Steps */}
              <div className="flex gap-1 mb-3">
                <div className="h-1 flex-1 bg-blue-500 rounded"></div>
                <div className="h-1 flex-1 bg-blue-500 rounded"></div>
                <div className="h-1 flex-1 bg-gray-300 rounded"></div>
              </div>
              {/* Location Picker */}
              <div
                className="h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded mb-2 relative"
              >
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
              {/* Navigation */}
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 flex-1 bg-blue-500 rounded"></div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Location Picker</h3>
            <p className="text-sm text-gray-600">Multi-step reporting</p>
          </div>
        </div>

        {/* Admin Screens */}
        <h3
          className="text-sm font-semibold text-purple-600 mb-6 mt-12 uppercase tracking-wide"
        >
          Admin Experience
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Analytics Dashboard */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-blue-100 rounded p-2">
                  <div className="h-2 w-12 bg-blue-300 rounded mb-1"></div>
                  <div className="h-4 w-8 bg-blue-500 rounded"></div>
                </div>
                <div className="bg-green-100 rounded p-2">
                  <div className="h-2 w-12 bg-green-300 rounded mb-1"></div>
                  <div className="h-4 w-8 bg-green-500 rounded"></div>
                </div>
              </div>
              {/* Chart */}
              <div className="h-20 bg-white rounded border border-gray-200 p-2">
                <div className="flex items-end justify-between h-full gap-1">
                  <div
                    className="w-full bg-blue-200 rounded-t"
                    style={{ height: '60%' }}
                  ></div>
                  <div
                    className="w-full bg-blue-300 rounded-t"
                    style={{ height: '80%' }}
                  ></div>
                  <div
                    className="w-full bg-blue-400 rounded-t"
                    style={{ height: '40%' }}
                  ></div>
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: '90%' }}
                  ></div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Analytics</h3>
            <p className="text-sm text-gray-600">Charts & metrics</p>
          </div>

          {/* Issue Management Table */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* Filters */}
              <div className="flex gap-2 mb-3">
                <div
                  className="h-6 w-20 bg-white rounded border border-gray-200"
                ></div>
                <div
                  className="h-6 w-20 bg-white rounded border border-gray-200"
                ></div>
              </div>
              {/* Table */}
              <div className="bg-white rounded border border-gray-200 p-2">
                <div className="space-y-2">
                  <div
                    className="flex items-center gap-2 pb-2 border-b border-gray-200"
                  >
                    <div className="h-2 w-1/4 bg-gray-400 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-400 rounded"></div>
                    <div className="h-2 w-1/4 bg-gray-400 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-yellow-200 rounded-full"></div>
                    <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-blue-200 rounded-full"></div>
                    <div className="h-2 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Issue Table</h3>
            <p className="text-sm text-gray-600">Manage & filter</p>
          </div>

          {/* Status Update Panel */}
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              {/* Issue Preview */}
              <div className="bg-white rounded p-2 border border-gray-200 mb-3">
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 w-3/4 bg-gray-300 rounded"></div>
              </div>
              {/* Status Controls */}
              <div className="space-y-2">
                <div className="h-8 bg-white rounded border border-gray-200"></div>
                <div className="h-12 bg-white rounded border border-gray-200"></div>
                <div className="h-8 bg-purple-500 rounded"></div>
              </div>
            </div>
            <h3 className="font-semibold mb-1">Update Status</h3>
            <p className="text-sm text-gray-600">Change issue state</p>
          </div>
        </div>
      </div>
    </section>

    {/* Core Features */}
    <section className="py-24 px-6 gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Core Features</h2>
          <p className="text-xl text-gray-600">
            Everything needed for effective civic engagement
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Location Tracking</h3>
            <p className="text-sm text-gray-600">Auto-capture GPS coordinates</p>
          </div>
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                ></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Upvote System</h3>
            <p className="text-sm text-gray-600">Community prioritization</p>
          </div>
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Real-time Updates</h3>
            <p className="text-sm text-gray-600">Status notifications</p>
          </div>
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                ></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">Insights & metrics</p>
          </div>
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Image Upload</h3>
            <p className="text-sm text-gray-600">Visual documentation</p>
          </div>
          <div
            className="bg-white rounded-xl p-6 border border-gray-100 card-hover"
          >
            <div
              className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Search & Filter</h3>
            <p className="text-sm text-gray-600">Find issues quickly</p>
          </div>
        </div>
      </div>
    </section>

    {/* ML Features */}
    <section className="py-24 px-6 gradient-accent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-4"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7z"></path>
              <path
                fillRule="evenodd"
                d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                clipRule="evenodd"
              ></path>
            </svg>
            Smart Intelligence Layer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ML-Powered Features
          </h2>
          <p className="text-xl text-gray-600">
            Advanced AI capabilities for smarter issue management
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-8 border border-purple-100">
            <h3 className="font-semibold mb-3">Image Classification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Automatically categorize issues from uploaded images using
              computer vision
            </p>
            <div className="flex gap-2">
              <span className="tech-badge text-xs">TensorFlow</span>
              <span className="tech-badge text-xs">CNN</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 border border-purple-100">
            <h3 className="font-semibold mb-3">Duplicate Detection</h3>
            <p className="text-sm text-gray-600 mb-4">
              Identify similar reports using NLP and image similarity algorithms
            </p>
            <div className="flex gap-2">
              <span className="tech-badge text-xs">Transformers</span>
              <span className="tech-badge text-xs">BERT</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 border border-purple-100">
            <h3 className="font-semibold mb-3">Priority Prediction</h3>
            <p className="text-sm text-gray-600 mb-4">
              Predict issue urgency based on historical data and patterns
            </p>
            <div className="flex gap-2">
              <span className="tech-badge text-xs">Scikit-learn</span>
              <span className="tech-badge text-xs">XGBoost</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 border border-purple-100">
            <h3 className="font-semibold mb-3">Geo-Clustering</h3>
            <p className="text-sm text-gray-600 mb-4">
              Group nearby issues to identify hotspots and optimize resolution
            </p>
            <div className="flex gap-2">
              <span className="tech-badge text-xs">DBSCAN</span>
              <span className="tech-badge text-xs">PostGIS</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* System Architecture */}
    <section id="architecture" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            System Architecture
          </h2>
          <p className="text-xl text-gray-600">
            Modern, scalable, production-ready infrastructure
          </p>
        </div>
        <div className="space-y-4">
          <div className="arch-layer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Frontend Layer</h3>
                <p className="text-sm text-gray-600">React + TypeScript + Vite</p>
              </div>
              <div className="text-xs text-gray-500">Vercel</div>
            </div>
          </div>
          <div className="arch-arrow"></div>
          <div className="arch-layer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">API Layer</h3>
                <p className="text-sm text-gray-600">FastAPI (Python 3.11+)</p>
              </div>
              <div className="text-xs text-gray-500">Railway</div>
            </div>
          </div>
          <div className="arch-arrow"></div>
          <div className="arch-layer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Database & Services</h3>
                <p className="text-sm text-gray-600">
                  PostgreSQL + PostGIS, Auth, Storage
                </p>
              </div>
              <div className="text-xs text-gray-500">Supabase</div>
            </div>
          </div>
          <div className="arch-arrow"></div>
          <div className="arch-layer bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">ML Services (Phase 2)</h3>
                <p className="text-sm text-gray-600">
                  TensorFlow, PyTorch, Transformers
                </p>
              </div>
              <div className="text-xs text-purple-600">Microservice</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section id="tech" className="py-24 px-6 gradient-subtle">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Technology Stack</h2>
          <p className="text-xl text-gray-600">
            Built with modern, proven technologies
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3
              className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide"
            >
              Frontend
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="tech-badge">React</span>
              <span className="tech-badge">TypeScript</span>
              <span className="tech-badge">Vite</span>
              <span className="tech-badge">TailwindCSS</span>
              <span className="tech-badge">shadcn/ui</span>
              <span className="tech-badge">Leaflet</span>
              <span className="tech-badge">React Query</span>
            </div>
          </div>
          <div>
            <h3
              className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide"
            >
              Backend
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="tech-badge">Python 3.11+</span>
              <span className="tech-badge">FastAPI</span>
              <span className="tech-badge">Pydantic</span>
              <span className="tech-badge">PostgreSQL</span>
              <span className="tech-badge">PostGIS</span>
              <span className="tech-badge">Supabase</span>
            </div>
          </div>
          <div>
            <h3
              className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide"
            >
              ML & AI
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="tech-badge">TensorFlow</span>
              <span className="tech-badge">PyTorch</span>
              <span className="tech-badge">Transformers</span>
              <span className="tech-badge">Scikit-learn</span>
              <span className="tech-badge">OpenCV</span>
            </div>
          </div>
          <div>
            <h3
              className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide"
            >
              Deployment
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="tech-badge">Vercel</span>
              <span className="tech-badge">Railway</span>
              <span className="tech-badge">Supabase Cloud</span>
              <span className="tech-badge">GitHub Actions</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Impact & Vision */}
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Built for Real Impact
        </h2>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          Civic Sense bridges the gap between citizens and authorities, making
          civic engagement transparent, efficient, and data-driven. Our platform
          empowers communities to create lasting change through technology.
        </p>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">2 Phases</div>
            <div className="text-sm text-gray-600">MVP + ML Enhancement</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">Free & Open Source</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">Real-time</div>
            <div className="text-sm text-gray-600">Issue Tracking</div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span className="font-semibold">Civic Sense</span>
          </div>
          <div className="text-sm text-gray-600">
            Built with ❤️ for better civic engagement
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>

    
  
      </main>
    </div>
  );
}
