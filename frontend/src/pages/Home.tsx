import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Layers, Activity, MapPin, Shield, Camera, Search, 
  TrendingUp, Users, Zap, Eye, BarChart3, Upload, ThumbsUp, Bell,
  Brain, Copy, Gauge, Map, Code, Database, Server, Cloud,
  CheckCircle2, ArrowUpRight, ChevronRight
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };
const stagger = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white overflow-hidden selection:bg-blue-500/20">
       
       {/* Background */}
       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/8 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-500/8 rounded-full blur-[120px]"></div>
       </div>

       {/* ═══════════ HEADER ═══════════ */}
       <nav className="fixed top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg tracking-tight">Civic Sense</span>
           </div>
           
           <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
              <a href="#problem" className="hover:text-slate-900 dark:hover:text-white transition">Problem</a>
              <a href="#solution" className="hover:text-slate-900 dark:hover:text-white transition">Solution</a>
              <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition">Workflow</a>
              <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">Features</a>
              <a href="#tech" className="hover:text-slate-900 dark:hover:text-white transition">Tech Stack</a>
           </div>
           
           <div className="flex gap-3">
               <button onClick={() => navigate('/feed')} className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition hidden sm:block">Feed</button>
               <button onClick={() => navigate('/login')} className="text-sm font-semibold border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition">Log In</button>
           </div>
       </nav>

       {/* ═══════════ HERO ═══════════ */}
       <section className="relative z-10 max-w-6xl mx-auto px-6 pt-32 md:pt-48 pb-20 flex flex-col items-center text-center">
           
           <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-300 mb-8">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Civic Intelligence Platform
           </motion.div>

           <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
             className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
              Smarter Civic<br/>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Issue Reporting</span>
           </motion.h1>
           
           <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
             className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Empowering citizens to report issues. Enabling authorities to resolve them efficiently. Powered by modern technology and ML intelligence.
           </motion.p>

           <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
             className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button onClick={() => navigate('/report')} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                 Report an Issue <ArrowRight className="w-5 h-5"/>
              </button>
              <a href="#workflow" className="bg-white dark:bg-transparent border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-center">
                 View Workflow
              </a>
           </motion.div>
       </section>

       {/* ═══════════ THE PROBLEM ═══════════ */}
       <section id="problem" className="relative z-10 py-24 px-6">
         <div className="max-w-6xl mx-auto">
           <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 block">The Problem</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Current civic reporting is broken</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Fragmented, slow, and lacking transparency</p>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { icon: Users, title: 'No Centralized System', desc: 'Citizens struggle to report issues through fragmented channels with no single point of contact.', color: 'text-red-500 bg-red-50 dark:bg-red-500/10' },
               { icon: Eye, title: 'Lack of Transparency', desc: 'No visibility into issue status or resolution progress leaves citizens in the dark.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
               { icon: Zap, title: 'Slow Resolution', desc: 'Issues take weeks or months to get addressed without proper prioritization systems.', color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
             ].map((item, i) => (
               <motion.div key={i} {...stagger} transition={{ delay: i * 0.15 }} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-5`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* ═══════════ OUR SOLUTION ═══════════ */}
       <section id="solution" className="relative z-10 py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30">
         <div className="max-w-6xl mx-auto">
           <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 block">Our Solution</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Simple, transparent, efficient</h2>
              <p className="text-slate-500 max-w-xl mx-auto">A modern platform that makes civic issue reporting work for everyone</p>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { icon: Camera, title: 'Easy Issue Reporting', desc: 'Report issues in seconds with photos, descriptions, and automatic GPS location capture.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
               { icon: Map, title: 'Interactive Map View', desc: 'Visualize all issues on an interactive map with geo-clustering to identify hotspots.', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
               { icon: BarChart3, title: 'Admin Dashboard', desc: 'Comprehensive analytics and management tools for authorities to track and resolve issues.', color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10' },
             ].map((item, i) => (
               <motion.div key={i} {...stagger} transition={{ delay: i * 0.15 }} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => i === 0 ? navigate('/report') : i === 1 ? navigate('/feed') : navigate('/admin')}>
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Try it <ChevronRight className="w-3 h-3" />
                  </div>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* ═══════════ USER WORKFLOWS ═══════════ */}
       <section id="workflow" className="relative z-10 py-24 px-6">
         <div className="max-w-6xl mx-auto">
           <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 block">User Workflows</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Seamless experience for everyone</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Designed for citizens and administrators alike</p>
           </motion.div>

           {/* Citizen Journey */}
           <motion.div {...fadeUp} className="mb-12">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Citizen Journey</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Sign Up', desc: 'Quick registration', icon: ArrowUpRight },
                  { step: '02', title: 'Report Issue', desc: 'Upload photo & details', icon: Upload },
                  { step: '03', title: 'Track Status', desc: 'Real-time updates', icon: Bell },
                  { step: '04', title: 'Resolved', desc: 'Issue fixed!', icon: CheckCircle2 },
                ].map((s, i) => (
                  <motion.div key={i} {...stagger} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 relative overflow-hidden">
                    <span className="text-[80px] font-black text-slate-100 dark:text-slate-800/50 absolute -top-4 -right-2 leading-none select-none">{s.step}</span>
                    <div className="relative z-10">
                       <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 mb-3">
                         <s.icon className="w-5 h-5" />
                       </div>
                       <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                       <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
           </motion.div>

           {/* Admin Journey */}
           <motion.div {...fadeUp}>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-purple-600" /> Admin Journey</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Dashboard', desc: 'View all issues', icon: BarChart3 },
                  { step: '02', title: 'Prioritize', desc: 'Filter & sort', icon: Gauge },
                  { step: '03', title: 'Update Status', desc: 'Mark progress', icon: Activity },
                  { step: '04', title: 'Analytics', desc: 'Track metrics', icon: TrendingUp },
                ].map((s, i) => (
                  <motion.div key={i} {...stagger} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-slate-800/50 border border-purple-100 dark:border-purple-900/30 rounded-xl p-5 relative overflow-hidden">
                    <span className="text-[80px] font-black text-purple-50 dark:text-purple-900/20 absolute -top-4 -right-2 leading-none select-none">{s.step}</span>
                    <div className="relative z-10">
                       <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 mb-3">
                         <s.icon className="w-5 h-5" />
                       </div>
                       <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                       <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
           </motion.div>
         </div>
       </section>

       {/* ═══════════ CORE FEATURES ═══════════ */}
       <section id="features" className="relative z-10 py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30">
         <div className="max-w-6xl mx-auto">
           <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3 block">Core Features</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Everything needed for civic engagement</h2>
           </motion.div>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {[
               { icon: MapPin, title: 'Location Tracking', desc: 'Auto-capture GPS coordinates', color: 'text-blue-600' },
               { icon: ThumbsUp, title: 'Upvote System', desc: 'Community prioritization', color: 'text-indigo-600' },
               { icon: Bell, title: 'Real-time Updates', desc: 'Status notifications', color: 'text-emerald-600' },
               { icon: BarChart3, title: 'Analytics', desc: 'Insights & metrics', color: 'text-purple-600' },
               { icon: Upload, title: 'Image Upload', desc: 'Visual documentation', color: 'text-amber-600' },
               { icon: Search, title: 'Search & Filter', desc: 'Find issues quickly', color: 'text-rose-600' },
             ].map((item, i) => (
               <motion.div key={i} {...stagger} transition={{ delay: i * 0.08 }} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.desc}</p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* ═══════════ ML-POWERED FEATURES ═══════════ */}
       <section className="relative z-10 py-24 px-6">
         <div className="max-w-6xl mx-auto">
           <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-3 block">ML-Powered Features</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Advanced AI capabilities</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Smarter issue management powered by machine learning</p>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[
               { icon: Camera, title: 'Image Classification', desc: 'Automatically categorize issues from uploaded images using computer vision.', tech: 'TensorFlow · CNN', color: 'border-blue-200 dark:border-blue-900/50' },
               { icon: Copy, title: 'Duplicate Detection', desc: 'Identify similar reports using NLP and image similarity algorithms.', tech: 'Transformers · BERT', color: 'border-emerald-200 dark:border-emerald-900/50' },
               { icon: Gauge, title: 'Priority Prediction', desc: 'Predict issue urgency based on historical data and patterns.', tech: 'Scikit-learn · XGBoost', color: 'border-amber-200 dark:border-amber-900/50' },
               { icon: Map, title: 'Geo-Clustering', desc: 'Group nearby issues to identify hotspots and optimize resolution.', tech: 'DBSCAN · PostGIS', color: 'border-purple-200 dark:border-purple-900/50' },
             ].map((item, i) => (
               <motion.div key={i} {...stagger} transition={{ delay: i * 0.12 }} className={`bg-white dark:bg-slate-800/50 border ${item.color} rounded-2xl p-8 hover:shadow-lg transition-shadow`}>
                  <item.icon className="w-8 h-8 text-slate-700 dark:text-slate-300 mb-4" />
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{item.desc}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{item.tech}</span>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* ═══════════ SYSTEM ARCHITECTURE ═══════════ */}
       <section id="architecture" className="relative z-10 py-24 px-6 bg-slate-50/50 dark:bg-slate-900/30">
         <div className="max-w-6xl mx-auto">
           <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3 block">System Architecture</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Modern, scalable infrastructure</h2>
           </motion.div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { icon: Code, title: 'Frontend Layer', desc: 'React + TypeScript + Vite', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800' },
               { icon: Server, title: 'API Layer', desc: 'FastAPI (Python 3.11+)', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800' },
               { icon: Database, title: 'Database & Services', desc: 'PostgreSQL + Auth + Storage', color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800' },
               { icon: Brain, title: 'ML Services', desc: 'TensorFlow, PyTorch', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800' },
             ].map((item, i) => (
               <motion.div key={i} {...stagger} transition={{ delay: i * 0.1 }} className={`rounded-2xl p-6 border ${item.color} text-center`}>
                  <item.icon className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500">{item.desc}</p>
               </motion.div>
             ))}
           </div>

           {/* Flow arrows */}
           <div className="hidden lg:flex justify-center items-center gap-0 mt-6">
             {[1,2,3].map(i => (
               <div key={i} className="flex items-center">
                 <div className="w-24 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                 <ChevronRight className="w-4 h-4 text-slate-400 -ml-1" />
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* ═══════════ TECH STACK ═══════════ */}
       <section id="tech" className="relative z-10 py-24 px-6">
         <div className="max-w-6xl mx-auto">
           <motion.div {...fadeUp} className="text-center mb-16">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3 block">Technology Stack</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Built with proven technologies</h2>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { title: 'Frontend', items: ['React 18', 'TypeScript', 'Vite', 'Leaflet Maps', 'Framer Motion', 'Recharts'], color: 'border-blue-200 dark:border-blue-900/50' },
               { title: 'Backend', items: ['Python 3.11+', 'FastAPI', 'Pydantic', 'Supabase SDK'], color: 'border-emerald-200 dark:border-emerald-900/50' },
               { title: 'ML & AI', items: ['Priority Scoring', 'Geo-Clustering', 'Duplicate Detection', 'Haversine Distance'], color: 'border-purple-200 dark:border-purple-900/50' },
               { title: 'Deployment', items: ['Vercel', 'Supabase Cloud', 'GitHub Actions', 'PostgreSQL'], color: 'border-amber-200 dark:border-amber-900/50' },
             ].map((cat, i) => (
               <motion.div key={i} {...stagger} transition={{ delay: i * 0.1 }} className={`bg-white dark:bg-slate-800/50 border ${cat.color} rounded-2xl p-6`}>
                  <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-600 dark:text-slate-400">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* ═══════════ CTA / FOOTER ═══════════ */}
       <section className="relative z-10 py-24 px-6">
         <div className="max-w-4xl mx-auto text-center">
           <motion.div {...fadeUp}>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Built for Real Impact</h2>
              <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
                Civic Sense bridges the gap between citizens and authorities, making civic engagement transparent, efficient, and data-driven. Our platform empowers communities to create lasting change through technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate('/report')} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                   Get Started <ArrowRight className="w-5 h-5"/>
                </button>
                <button onClick={() => navigate('/feed')} className="border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                   Browse Issues
                </button>
              </div>
           </motion.div>
         </div>
       </section>

       {/* Footer */}
       <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 py-8 px-6">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-sm">Civic Sense</span>
              <span className="text-xs text-slate-400 ml-2">© 2026</span>
            </div>
            <div className="flex gap-6 text-xs font-medium text-slate-500">
               <span className="flex items-center gap-1"><Cloud className="w-3 h-3" /> Free & Open Source</span>
               <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Real-time Tracking</span>
               <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure by Default</span>
            </div>
         </div>
       </footer>
    </div>
  );
}
