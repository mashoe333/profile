/**
 * Starlight Paradox V2
 * Icosphere planets with proper perspective
 */

const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');


let width, height;
let mouseX = 0, mouseY = 0;

const camera = { x: 0, y: 0, z: 0 };
const Z_SCROLL_FACTOR = 3.5;
const FOV = 900;

// ==========================================
// Vector3 Math
// ==========================================
class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) { return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
    sub(v) { return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
    scale(s) { return new Vec3(this.x * s, this.y * s, this.z * s); }
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }

    cross(v) {
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    normalize() {
        const len = this.length();
        return len === 0 ? new Vec3(0, 0, 0) : new Vec3(this.x / len, this.y / len, this.z / len);
    }

    rotateX(a) {
        const c = Math.cos(a), s = Math.sin(a);
        return new Vec3(this.x, this.y * c - this.z * s, this.y * s + this.z * c);
    }

    rotateY(a) {
        const c = Math.cos(a), s = Math.sin(a);
        return new Vec3(this.x * c - this.z * s, this.y, this.x * s + this.z * c);
    }

    rotateZ(a) {
        const c = Math.cos(a), s = Math.sin(a);
        return new Vec3(this.x * c - this.y * s, this.x * s + this.y * c, this.z);
    }
}

// ==========================================
// Icosahedron Geometry (20 triangular faces)
// ==========================================
const phi = (1 + Math.sqrt(5)) / 2;

const icoVerts = [
    new Vec3(0, 1, phi), new Vec3(0, -1, phi), new Vec3(0, 1, -phi), new Vec3(0, -1, -phi),
    new Vec3(1, phi, 0), new Vec3(-1, phi, 0), new Vec3(1, -phi, 0), new Vec3(-1, -phi, 0),
    new Vec3(phi, 0, 1), new Vec3(-phi, 0, 1), new Vec3(phi, 0, -1), new Vec3(-phi, 0, -1)
].map(v => v.normalize());

const icoFaces = [
    [0, 1, 8], [0, 8, 4], [0, 4, 5], [0, 5, 9], [0, 9, 1],
    [1, 6, 8], [8, 6, 10], [8, 10, 4], [4, 10, 2], [4, 2, 5],
    [5, 2, 11], [5, 11, 9], [9, 11, 7], [9, 7, 1], [1, 7, 6],
    [3, 6, 7], [3, 7, 11], [3, 11, 2], [3, 2, 10], [3, 10, 6]
];

// Subdivide icosphere to create smoother sphere
function subdivideIcosphere(vertices, faces, level) {
    for (let i = 0; i < level; i++) {
        const newFaces = [];
        const midpointCache = {};

        // Helper to get or create midpoint
        function getMidpoint(v1Idx, v2Idx) {
            const key = v1Idx < v2Idx ? `${v1Idx},${v2Idx}` : `${v2Idx},${v1Idx}`;
            if (midpointCache[key] !== undefined) {
                return midpointCache[key];
            }

            const v1 = vertices[v1Idx];
            const v2 = vertices[v2Idx];
            const mid = new Vec3(
                (v1.x + v2.x) / 2,
                (v1.y + v2.y) / 2,
                (v1.z + v2.z) / 2
            ).normalize();

            vertices.push(mid);
            const newIdx = vertices.length - 1;
            midpointCache[key] = newIdx;
            return newIdx;
        }

        // Subdivide each face into 4 triangles
        faces.forEach(face => {
            const [v0, v1, v2] = face;
            const m01 = getMidpoint(v0, v1);
            const m12 = getMidpoint(v1, v2);
            const m20 = getMidpoint(v2, v0);

            newFaces.push([v0, m01, m20]);
            newFaces.push([v1, m12, m01]);
            newFaces.push([v2, m20, m12]);
            newFaces.push([m01, m12, m20]);
        });

        faces.length = 0;
        faces.push(...newFaces);
    }

    return { vertices, faces };
}

// Create subdivided icosphere (level 1 = 80 faces, 42 vertices)
let subdividedIco = subdivideIcosphere([...icoVerts], [...icoFaces], 1);
const icoVertsSubdivided = subdividedIco.vertices;
const icoFacesSubdivided = subdividedIco.faces;

console.log(`Subdivided Icosphere (Level 1): ${icoFacesSubdivided.length} faces with ${icoVertsSubdivided.length} vertices`);

// ==========================================
// Planet Class
// ==========================================
class Planet {
    constructor(position, size, color) {
        this.position = position;
        this.size = size;
        this.color = color;

        this.rotation = new Vec3(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        this.rotSpeed = new Vec3(0.003, 0.005, 0.002);
        this.vertices = icoVertsSubdivided.map(v => v.scale(size));
    }

    update() {
        this.rotation = this.rotation.add(this.rotSpeed);
    }
}

// ==========================================
// Scene
// ==========================================
// Background planets (distant) - DISABLED to show only foreground planets
const planets = [
    // new Planet(new Vec3(0, 0, 2800), 400, { r: 0, g: 243, b: 255 }),
    // new Planet(new Vec3(0, 0, 7000), 500, { r: 255, g: 0, b: 128 }),
    // new Planet(new Vec3(0, 0, 11500), 600, { r: 255, g: 255, b: 255 })
];

// Foreground planets (large, positioned along Z-axis)
class ForegroundPlanet {
    constructor(zPosition, size, color, labelId) {
        this.zPosition = zPosition;
        this.size = size;
        this.color = color;
        this.labelEl = document.getElementById(labelId);

        this.rotation = new Vec3(0, 0, 0);
        this.rotSpeed = new Vec3(0.002, 0.003, 0.001);
        this.vertices = icoVertsSubdivided.map(v => v.scale(size));
    }

    update() {
        this.rotation = this.rotation.add(this.rotSpeed);
    }
}

const fgPlanets = [
    new ForegroundPlanet(5000, 600, { r: 0, g: 243, b: 255 }, 'fg-label-genesis'),
    new ForegroundPlanet(9000, 650, { r: 0, g: 255, b: 128 }, 'fg-label-paradox'),
    new ForegroundPlanet(13000, 700, { r: 255, g: 255, b: 255 }, 'fg-label-horizon')
];

const stars = [];
for (let i = 0; i < 800; i++) {
    const shimmerType = Math.random();
    const isLargeStar = i < 80; // First 80 stars are larger (10% of 800)

    stars.push({
        x: (Math.random() - 0.5) * 5000,
        y: (Math.random() - 0.5) * 5000,
        z: Math.random() * 15000,
        size: isLargeStar ? (Math.random() * 3.5 + 3.5) : (Math.random() * 1.5 + 0.5),
        brightness: Math.random() * 0.5 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 2 + 1,
        // Shimmer properties
        shimmerType: shimmerType < 0.6 ? 0 : (shimmerType < 0.85 ? 1 : 2), // 60% normal, 25% pulse, 15% flash
        shimmerIntensity: Math.random() * 0.5 + 0.5,
        secondaryTwinklePhase: Math.random() * Math.PI * 2,
        secondaryTwinkleSpeed: Math.random() * 1.5 + 0.5,
        flashInterval: Math.random() * 5 + 3 // For flash type: 3-8 seconds between flashes
    });
}

// Shuffle stars array to randomize which ones are large
for (let i = stars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stars[i], stars[j]] = [stars[j], stars[i]];
}

// ==========================================
// Render
// ==========================================
function render() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    camera.z = window.scrollY * Z_SCROLL_FACTOR;


    // Fade out intro section on scroll
    const introSection = document.querySelector('.intro-section');
    if (introSection) {
        let introOpacity = 1;
        if (camera.z > 0) {
            // Fade out from scroll 0 to 500 (camera.z 0 to ~1750)
            introOpacity = Math.max(0, 1 - camera.z / 1750);
        }
        introSection.style.opacity = introOpacity;
    }

    ctx.fillStyle = '#000005';
    ctx.fillRect(0, 0, width, height);

    const time = Date.now() * 0.001;

    // Nebula
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const drawNebula = (x, y, r, color, alpha) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color.replace(')', `, ${alpha})`).replace('rgb', 'rgba'));
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };

    drawNebula(width * 0.2, height * 0.3, 700, 'rgb(0, 50, 100)', 0.15);
    drawNebula(width * 0.8, height * 0.7, 600, 'rgb(80, 0, 80)', 0.12);
    drawNebula(width * 0.5, height * 0.5, 900, 'rgb(20, 20, 60)', 0.1);

    ctx.restore();

    // Stars
    stars.forEach(star => {
        let rz = star.z - camera.z;
        while (rz < 0) rz += 15000;
        while (rz > 15000) rz -= 15000;

        if (rz < 50) return;

        const scale = FOV / rz;
        const px = centerX + star.x * scale;
        const py = centerY + star.y * scale;

        if (px > -50 && px < width + 50 && py > -50 && py < height + 50) {
            // Calculate shimmer based on type
            let shimmer = 1;

            if (star.shimmerType === 0) {
                // Normal: smooth sine wave with secondary frequency
                const primary = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
                const secondary = 0.5 + 0.5 * Math.sin(time * star.secondaryTwinkleSpeed + star.secondaryTwinklePhase);
                shimmer = 0.3 + 0.7 * (primary * 0.7 + secondary * 0.3);
            } else if (star.shimmerType === 1) {
                // Pulse: sharp peaks with quick fade
                const pulse = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
                shimmer = 0.2 + 0.8 * Math.pow(Math.max(0, pulse), 3);
            } else {
                // Flash: random bright flashes
                const flashCycle = (time % star.flashInterval) / star.flashInterval;
                if (flashCycle < 0.1) {
                    // Flash for 10% of the interval
                    shimmer = 0.5 + 0.5 * Math.sin(flashCycle * Math.PI * 10);
                } else {
                    shimmer = 0.3 + 0.2 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
                }
            }

            shimmer *= star.shimmerIntensity;
            const alpha = star.brightness * shimmer * Math.min(1, rz / 1000);

            // Add slight color variation for larger stars
            const isLarge = star.size > 2.5;
            if (isLarge) {
                const colorShift = Math.sin(time * 0.5 + star.twinklePhase) * 20;
                ctx.fillStyle = `rgba(${Math.min(255, 255 + colorShift)}, ${Math.min(255, 255 + colorShift * 0.8)}, 255, ${alpha})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            }

            ctx.beginPath();
            ctx.arc(px, py, star.size * Math.max(0.3, scale * 0.5), 0, Math.PI * 2);
            ctx.fill();

            // Add glow effect for larger stars
            if (isLarge && alpha > 0.5) {
                ctx.save();
                ctx.globalAlpha = alpha * 0.3;
                ctx.beginPath();
                ctx.arc(px, py, star.size * Math.max(0.3, scale * 0.5) * 2, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(px, py, 0, px, py, star.size * Math.max(0.3, scale * 0.5) * 2);
                gradient.addColorStop(0, 'rgba(200, 220, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();
            }
        }
    });

    // Planets
    const renderQueue = [];
    const lookX = (mouseX - width / 2) * 0.00008;
    const lookY = (mouseY - height / 2) * 0.00008;

    planets.forEach(planet => {
        planet.update();

        const relPos = planet.position.sub(camera);

        if (relPos.z < 200 || relPos.z > 16000) {
            return;
        }

        const viewPos = relPos.rotateY(-lookX).rotateX(-lookY);

        const transformedVerts = planet.vertices.map(v => {
            return v.rotateX(planet.rotation.x)
                .rotateY(planet.rotation.y)
                .rotateZ(planet.rotation.z)
                .add(viewPos);
        });

        icoFacesSubdivided.forEach(faceIndices => {
            const v0 = transformedVerts[faceIndices[0]];
            const v1 = transformedVerts[faceIndices[1]];
            const v2 = transformedVerts[faceIndices[2]];

            const edge1 = v1.sub(v0);
            const edge2 = v2.sub(v0);
            const normal = edge1.cross(edge2).normalize();

            if (normal.dot(v0) < 0) {
                const light1 = new Vec3(-1, -0.5, -1).normalize();
                const light2 = new Vec3(1, 0.5, -0.5).normalize();
                const light3 = new Vec3(0, 1, 0.5).normalize();

                let intensity = Math.max(0, normal.dot(light1)) * 0.6 +
                    Math.max(0, normal.dot(light2)) * 0.3 +
                    Math.max(0, normal.dot(light3)) * 0.2;
                intensity = Math.max(0.25, intensity);

                const fogFactor = Math.max(0, 1 - relPos.z / 14000);
                const alpha = Math.pow(fogFactor, 0.3);

                const c = planet.color;
                const r = Math.floor(c.r * intensity);
                const g = Math.floor(c.g * intensity);
                const b = Math.floor(c.b * intensity);

                const glow = intensity > 0.7 ? 40 : (intensity > 0.5 ? 20 : 0);

                renderQueue.push({
                    z: (v0.z + v1.z + v2.z) / 3,
                    verts: [v0, v1, v2],
                    fill: `rgba(${Math.min(255, r + glow)}, ${Math.min(255, g + glow)}, ${Math.min(255, b + glow)}, ${alpha})`,
                    stroke: `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha * 0.4})`
                });
            }
        });
    });

    // --- FOREGROUND PLANETS ---
    // First pass: find the closest visible planet
    let closestPlanet = null;
    let closestDistance = Infinity;

    fgPlanets.forEach(fgPlanet => {
        const relZ = fgPlanet.zPosition - camera.z;
        if (relZ > -500 && relZ < 8000) {
            const distance = Math.abs(relZ - 1500);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPlanet = fgPlanet;
            }
        }
    });

    // Second pass: render planets and show label only for closest
    fgPlanets.forEach(fgPlanet => {
        fgPlanet.update();

        const relZ = fgPlanet.zPosition - camera.z;

        if (relZ < -500 || relZ > 8000) {
            if (fgPlanet.labelEl) fgPlanet.labelEl.style.opacity = '0';
            return;
        }

        const relPos = new Vec3(0, 0, relZ);

        const transformedVerts = fgPlanet.vertices.map(v => {
            return v.rotateX(fgPlanet.rotation.x)
                .rotateY(fgPlanet.rotation.y)
                .rotateZ(fgPlanet.rotation.z)
                .add(relPos);
        });

        let opacity = 1;
        if (relZ > 6000) {
            // Fade in when far away
            opacity = Math.max(0, 1 - (relZ - 6000) / 2000);
        } else if (relZ < 1000) {
            // Fade out when approaching (start fading at 1000 units)
            opacity = Math.max(0, relZ / 1000);
        }

        icoFacesSubdivided.forEach(faceIndices => {
            const v0 = transformedVerts[faceIndices[0]];
            const v1 = transformedVerts[faceIndices[1]];
            const v2 = transformedVerts[faceIndices[2]];

            const edge1 = v1.sub(v0);
            const edge2 = v2.sub(v0);
            const normal = edge1.cross(edge2).normalize();

            if (normal.dot(v0) < 0) {
                const light1 = new Vec3(-1, -0.5, -1).normalize();
                const light2 = new Vec3(1, 0.5, -0.5).normalize();
                const light3 = new Vec3(0, 1, 0.5).normalize();

                let intensity = Math.max(0, normal.dot(light1)) * 0.6 +
                    Math.max(0, normal.dot(light2)) * 0.3 +
                    Math.max(0, normal.dot(light3)) * 0.2;
                intensity = Math.max(0.4, intensity);

                const c = fgPlanet.color;
                const r = Math.floor(c.r * intensity);
                const g = Math.floor(c.g * intensity);
                const b = Math.floor(c.b * intensity);

                const glow = intensity > 0.7 ? 50 : (intensity > 0.5 ? 25 : 0);

                renderQueue.push({
                    z: (v0.z + v1.z + v2.z) / 3,
                    verts: [v0, v1, v2],
                    fill: `rgba(${Math.min(255, r + glow)}, ${Math.min(255, g + glow)}, ${Math.min(255, b + glow)}, ${opacity})`,
                    stroke: `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity * 0.9})`,
                    lineWidth: 2
                });
            }
        });

        if (fgPlanet.labelEl) {
            // Position label at screen center (where planet is)
            const labelX = centerX;
            const labelY = centerY;

            fgPlanet.labelEl.style.transform = `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`;

            // Only show label if this is the closest planet
            let labelOpacity = 0;
            if (fgPlanet === closestPlanet && relZ > -500 && relZ < 8000) {
                // Fade in from distance 8000 to 6000
                if (relZ > 6000) {
                    labelOpacity = (8000 - relZ) / 2000;
                }
                // Full opacity from 6000 to 1000
                else if (relZ > 1000) {
                    labelOpacity = 1;
                }
                // Fade out from 1000 to -500
                else if (relZ > -500) {
                    labelOpacity = (relZ + 500) / 1500;
                }
                labelOpacity *= opacity; // Also respect planet's overall opacity

                // Fade in label as intro fades out (camera.z 1000 to 2500)
                // This makes labels appear when intro is disappearing
                if (camera.z < 2500) {
                    const introFadeFactor = Math.max(0, (camera.z - 1000) / 1500);
                    labelOpacity *= introFadeFactor;
                }
            }
            fgPlanet.labelEl.style.opacity = labelOpacity;

            // DEBUG: Log label state for first planet
            if (fgPlanet.labelEl.id === 'fg-label-genesis') {
                console.log(`Genesis label: relZ=${relZ.toFixed(0)}, opacity=${labelOpacity.toFixed(2)}, isClosest=${fgPlanet === closestPlanet}`);
            }
        }
    });

    renderQueue.sort((a, b) => b.z - a.z);

    renderQueue.forEach(poly => {
        ctx.fillStyle = poly.fill;
        ctx.strokeStyle = poly.stroke;
        ctx.lineWidth = poly.lineWidth || 1.5;

        ctx.beginPath();
        poly.verts.forEach((v, i) => {
            const s = FOV / v.z;
            const x = centerX + v.x * s;
            const y = centerY + v.y * s;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    requestAnimationFrame(render);
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Navigation: Smooth scroll to planets
const planetPositions = {
    'aboutme': 5000,   // zPosition of ABOUT ME planet
    'works': 9000,     // zPosition of WORKS planet
    'future': 13000    // zPosition of FUTURE planet
};

// Optimal viewing distance is around 1500 units in front of planet
const OPTIMAL_VIEWING_DISTANCE = 1500;

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const planetName = link.getAttribute('href').substring(1); // Remove '#'
        const planetZ = planetPositions[planetName];

        if (planetZ !== undefined) {
            // Calculate scroll position to view planet at optimal distance
            // camera.z = planetZ - OPTIMAL_VIEWING_DISTANCE
            // scrollY = camera.z / Z_SCROLL_FACTOR
            const targetCameraZ = planetZ - OPTIMAL_VIEWING_DISTANCE;
            const targetScrollY = targetCameraZ / Z_SCROLL_FACTOR;

            // Smooth scroll to target position
            window.scrollTo({
                top: targetScrollY,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Modal Functionality
// ==========================================
const modals = {
    'fg-label-genesis': 'modal-aboutme',
    'fg-label-paradox': 'modal-works',
    'fg-label-horizon': 'modal-future'
};

// Open modal when planet label is clicked
Object.keys(modals).forEach(labelId => {
    const labelEl = document.getElementById(labelId);
    const modalId = modals[labelId];
    const modalEl = document.getElementById(modalId);

    if (labelEl && modalEl) {
        labelEl.addEventListener('click', () => {
            // Only open if label is visible
            const opacity = parseFloat(labelEl.style.opacity) || 0;
            if (opacity > 0.5) {
                modalEl.classList.add('active');
                // Lock body scroll
                document.body.style.overflow = 'hidden';
            }
        });
    }
});

// Close modal when close button is clicked
document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modalId = closeBtn.getAttribute('data-modal');
        const modalEl = document.getElementById(modalId);
        if (modalEl) {
            modalEl.classList.remove('active');
            // Unlock body scroll
            document.body.style.overflow = '';
        }
    });
});

// Close modal when clicking outside the modal content
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            // Unlock body scroll
            document.body.style.overflow = '';
        }
    });
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        // Unlock body scroll
        document.body.style.overflow = '';
    }
});

// Enable pointer events for labels when they are visible
setInterval(() => {
    fgPlanets.forEach(fgPlanet => {
        if (fgPlanet.labelEl) {
            const opacity = parseFloat(fgPlanet.labelEl.style.opacity) || 0;
            if (opacity > 0.5) {
                fgPlanet.labelEl.style.pointerEvents = 'auto';
            } else {
                fgPlanet.labelEl.style.pointerEvents = 'none';
            }
        }
    });
}, 100);

render();

