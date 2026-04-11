import re

# Read HTML
with open('showcase/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract styles
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
styles = style_match.group(1) if style_match else ''
styles = styles.replace('* {\n        font-family:', '/* font-family: ')
styles = styles.replace('-webkit-font-smoothing: antialiased;', '')
styles = styles.replace('-moz-osx-font-smoothing: grayscale;\n      }', '*/')
styles = styles.replace('body {\n        background: #ffffff;\n      }', '')

with open('frontend/src/index.css', 'a', encoding='utf-8') as f:
    f.write('\n/* Showcase custom styles */\n' + styles)

# Extract body content (inside <body> tag but excluding script and nav)
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
body_content = body_match.group(1) if body_match else ''

# Remove the <nav> and <script>
body_content = re.sub(r'<nav.*?</nav>', '', body_content, flags=re.DOTALL)
body_content = re.sub(r'<script.*?</script>', '', body_content, flags=re.DOTALL)

# Convert HTML to JSX
jsx = body_content.replace('class="', 'className="')
jsx = jsx.replace('stroke-linecap="', 'strokeLinecap="')
jsx = jsx.replace('stroke-linejoin="', 'strokeLinejoin="')
jsx = jsx.replace('stroke-width="', 'strokeWidth="')
jsx = jsx.replace('fill-rule="', 'fillRule="')
jsx = jsx.replace('clip-rule="', 'clipRule="')
jsx = jsx.replace('<!--', '{/*')
jsx = jsx.replace('-->', '*/}')
jsx = jsx.replace('<br>', '<br />')
jsx = jsx.replace('<hr>', '<hr />')

# Convert style="height: 60%" to style={{ height: '60%' }} etc.
def repl_style(m):
    css = m.group(1)
    # Simple converter for single rule
    parts = css.split(':')
    if len(parts) == 2:
        return f"style={{{{ {parts[0].strip()}: '{parts[1].strip()}' }}}}"
    return ''
jsx = re.sub(r'style="([^"]*)"', repl_style, jsx)

# The showcase uses `<a href="#something">` which in React Router is fine handling hashes, but typically we want them to scroll or act as anchor tags. We can leave them as `a href` since they are within the page.
# BUT wait! The hero section has:
# <a href="#workflow" className="px-6 py-3 bg-blue-600 text-white ... View Workflow </a>
# We can keep that.

# Now wrap the JSX with the Home.tsx structure
with open('frontend/src/pages/Home.tsx', 'r', encoding='utf-8') as f:
    home_src = f.read()

# Instead of blindly regex replacing <main>, let's just write the whole thing because we know what Home.tsx looks like.
new_home = f"""import React, {{ useEffect }} from 'react';
import {{ useAuth }} from '../contexts/AuthContext';
import {{ useNavigate }} from 'react-router-dom';

export default function Home() {{
  const {{ user, signOut }} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {{
    const observerOptions = {{
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }};

    const observer = new IntersectionObserver((entries) => {{
      entries.forEach((entry) => {{
        if (entry.isIntersecting) {{
          entry.target.classList.add("visible");
        }}
      }});
    }}, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }}, []);

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
            {{user ? (
              <>
                <button onClick={{() => navigate('/feed')}} className="text-sm font-medium text-blue-600 hover:text-blue-700">Go to App</button>
                <button onClick={{signOut}} className="text-sm font-medium text-gray-500 hover:text-gray-700">Logout</button>
              </>
            ) : (
              <>
                <button onClick={{() => navigate('/login')}} className="text-sm font-medium text-gray-500 hover:text-gray-700">Login</button>
                <button onClick={{() => navigate('/register')}} className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition">Sign Up</button>
              </>
            )}}
          </div>
        </div>
      </nav>

      <main className="text-gray-900">
        {jsx}
      </main>
    </div>
  );
}}
"""

with open('frontend/src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(new_home)

print("Conversion complete!")
