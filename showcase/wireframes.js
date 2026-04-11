// Wireframe rendering functions
function generateIssueCard(title, status, time) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800'
    };
    
    return `
        <div class="border rounded-lg p-4 hover:shadow-md transition">
            <div class="bg-gray-200 h-32 rounded mb-3"></div>
            <h3 class="font-semibold mb-2">${title}</h3>
            <div class="flex items-center justify-between text-sm">
                <span class="px-2 py-1 rounded ${statusColors[status]}">${status.replace('_', ' ')}</span>
                <span class="text-gray-500">${time}</span>
            </div>
        </div>
    `;
}

function generateIssueListItem(title, status, upvotes, time) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800'
    };
    
    return `
        <div class="border-b py-3 hover:bg-gray-50 cursor-pointer">
            <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${title}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs px-2 py-0.5 rounded ${statusColors[status]}">${status.replace('_', ' ')}</span>
                        <span class="text-xs text-gray-500">👍 ${upvotes}</span>
                        <span class="text-xs text-gray-400">${time}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateStatCard(title, value, icon, color) {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        yellow: 'from-yellow-500 to-yellow-600',
        purple: 'from-purple-500 to-purple-600',
        green: 'from-green-500 to-green-600'
    };
    
    return `
        <div class="bg-gradient-to-br ${colors[color]} text-white p-6 rounded-xl">
            <div class="flex items-center justify-between mb-2">
                <i class="${icon} text-2xl opacity-80"></i>
                <span class="text-3xl font-bold">${value}</span>
            </div>
            <p class="text-sm opacity-90">${title}</p>
        </div>
    `;
}

function generateAdminTableRow(title, category, status, upvotes, time) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800'
    };
    
    return `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-3 font-medium">${title}</td>
            <td class="p-3">${category}</td>
            <td class="p-3">
                <span class="px-2 py-1 rounded text-xs ${statusColors[status]}">${status.replace('_', ' ')}</span>
            </td>
            <td class="p-3">👍 ${upvotes}</td>
            <td class="p-3 text-gray-500">${time}</td>
            <td class="p-3">
                <button class="text-blue-500 hover:text-blue-700 text-sm">View</button>
            </td>
        </tr>
    `;
}

// Wireframe data
const wireframes = {
    home: `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between">
                <div class="flex items-center gap-2 text-white">
                    <div class="w-8 h-8 bg-white/20 rounded"></div>
                    <span class="font-bold">Civic Sense</span>
                </div>
                <div class="flex gap-4 text-white text-sm">
                    <span>Home</span><span>Issues</span><span>Login</span>
                </div>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 p-12 text-center">
                <h1 class="text-4xl font-bold mb-4 text-gray-800">Report. Track. Resolve.</h1>
                <p class="text-gray-600 mb-6">Your voice matters in building a better community</p>
                <button class="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold">Report an Issue</button>
            </div>
            <div class="p-8">
                <h2 class="text-2xl font-bold mb-6">Recent Issues</h2>
                <div class="grid md:grid-cols-3 gap-4">
                    ${generateIssueCard("Pothole on Main Street", "pending", "2 hours ago")}
                    ${generateIssueCard("Broken Streetlight", "in_progress", "5 hours ago")}
                    ${generateIssueCard("Garbage Overflow", "resolved", "1 day ago")}
                </div>
            </div>
        </div>
    `,
    feed: `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-white border-b p-4">
                <div class="flex items-center justify-between mb-4">
                    <h1 class="text-2xl font-bold">Issues Feed</h1>
                    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">+ Report Issue</button>
                </div>
                <div class="flex gap-3 flex-wrap">
                    <select class="border rounded-lg px-3 py-2 text-sm"><option>All Status</option></select>
                    <select class="border rounded-lg px-3 py-2 text-sm"><option>All Categories</option></select>
                    <input type="text" placeholder="Search..." class="border rounded-lg px-3 py-2 text-sm flex-1">
                </div>
            </div>
            <div class="grid md:grid-cols-2 h-96">
                <div class="bg-gray-100 p-4 border-r">
                    <div class="bg-white rounded-lg h-full flex items-center justify-center relative overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>
                        <div class="relative"><i class="fas fa-map-marked-alt text-6xl text-gray-400"></i>
                        <p class="text-center mt-2 text-gray-600">Interactive Map</p></div>
                    </div>
                </div>
                <div class="p-4 overflow-y-auto">
                    ${generateIssueListItem("Pothole on Main St", "pending", "45", "2h ago")}
                    ${generateIssueListItem("Broken Streetlight", "in_progress", "23", "5h ago")}
                    ${generateIssueListItem("Garbage Overflow", "pending", "67", "8h ago")}
                </div>
            </div>
        </div>
    `,
    report: `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                <h1 class="text-3xl font-bold">Report an Issue</h1>
            </div>
            <div class="p-8 space-y-6">
                <div>
                    <label class="block font-semibold mb-2">Upload Photos</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i class="fas fa-camera text-4xl text-gray-400 mb-2"></i>
                        <p class="text-gray-600">Click to upload</p>
                    </div>
                </div>
                <div>
                    <label class="block font-semibold mb-2">Issue Title</label>
                    <input type="text" placeholder="e.g., Pothole on Main Street" class="w-full border rounded-lg px-4 py-3">
                </div>
                <div>
                    <label class="block font-semibold mb-2">Category</label>
                    <select class="w-full border rounded-lg px-4 py-3"><option>Select category...</option></select>
                </div>
                <div>
                    <label class="block font-semibold mb-2">Description</label>
                    <textarea rows="4" class="w-full border rounded-lg px-4 py-3"></textarea>
                </div>
                <button class="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold">Submit Report</button>
            </div>
        </div>
    `,
    admin: `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
                <h1 class="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <div class="p-6 bg-gray-50">
                <div class="grid md:grid-cols-4 gap-4 mb-6">
                    ${generateStatCard("Total Issues", "248", "fas fa-clipboard-list", "blue")}
                    ${generateStatCard("Pending", "89", "fas fa-clock", "yellow")}
                    ${generateStatCard("In Progress", "67", "fas fa-spinner", "purple")}
                    ${generateStatCard("Resolved", "92", "fas fa-check-circle", "green")}
                </div>
                <div class="bg-white rounded-lg shadow">
                    <div class="p-4 border-b"><h2 class="text-xl font-bold">Recent Issues</h2></div>
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 border-b">
                            <tr class="text-left"><th class="p-3">Issue</th><th class="p-3">Category</th><th class="p-3">Status</th><th class="p-3">Upvotes</th><th class="p-3">Date</th></tr>
                        </thead>
                        <tbody>
                            ${generateAdminTableRow("Pothole on Main St", "Pothole", "pending", "45", "2h ago")}
                            ${generateAdminTableRow("Broken Streetlight", "Streetlight", "in_progress", "23", "5h ago")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
};

function showWireframe(type) {
    const container = document.getElementById('wireframe-container');
    container.innerHTML = wireframes[type];
    container.classList.add('fade-in');
}

// Show home wireframe by default
document.addEventListener('DOMContentLoaded', () => {
    showWireframe('home');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
