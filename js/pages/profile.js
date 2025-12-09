// ===============================
// PROFILE PAGE (HTML + JS)
// ===============================

// ==== ÍCONES ====
const ProfileIcons = {
    user: (size = 24, color = "#ffffffff") => {
        return Icon.user()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    edit: (size = 24, color = "#ffffffff") => {
        return Icon.edit()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    dumbbell: (size = 24, color = "#0d48a0ff") => {
        return Icon.dumbbell()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    clock: (size = 24, color = "#0d48a0ff") => {
        return Icon.clock()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    trendingUp: (size = 24, color = "#0d48a0ff") => {
        return Icon.trendingUp()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    plus: (size = 24, color = "#0d48a0ff") => {
        return Icon.plus()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    }

};

Router.add("/perfil", () => {

    return `
    <div class="profile-screen">

        <div class="max-w">
            <!-- HEADER -->
            <div class="profile-header">
                <h1 class="profile-title">Perfil</h1>

                <button class="btn-icon-ghost" onclick="Router.navigate('/configuracoes')">
                    ${ProfileIcons.user(24)}
                </button>   
            </div>

            <!-- USER INFO -->
            <div class="profile-card">

                <div class="profile-user-row">

                    <div class="profile-avatar">
                        <span id="profile-avatar-letter">U</span>
                    </div>

                    <div class="profile-user-info">
                        <h2 id="profile-user-name" class="profile-user-name">Usuário</h2>

                        <div class="profile-user-stats">
                            <span id="profile-weight">70 kg</span>
                            <span id="profile-height">170 cm</span>
                            <span id="profile-age"></span>
                        </div>
                    </div>

                    <button class="btn-icon-ghost" onclick="Router.navigate('/perfil/editar')">
                        ${ProfileIcons.edit(20)}
                    </button>
                </div>

                <!-- FAST STATS -->
                <div class="profile-stats-grid">

                    <div class="profile-stat">
                        <div class="profile-stat-value">
                            ${ProfileIcons.dumbbell(16)}
                            <p id="stat-workouts">0</p>
                        </div>
                        <p class="profile-stat-label">Treinos</p>
                    </div>

                    <div class="profile-stat">
                        <div class="profile-stat-value">
                            ${ProfileIcons.clock(16)}
                            <p id="stat-hours">0h</p>
                        </div>
                        <p class="profile-stat-label">Duração</p>
                    </div>

                    <div class="profile-stat">
                        <div class="profile-stat-value">
                            ${ProfileIcons.trendingUp(16)}
                            <p id="stat-volume">0</p>
                        </div>
                        <p class="profile-stat-label">kg Total</p>
                    </div>

                </div>
            </div>

            <!-- CHART -->
            <div id="profile-chart-box" class="profile-chart-card" style="display:none;">
                <h3 class="profile-chart-title">Progresso de Volume</h3>
                <canvas id="profileChart" height="200"></canvas>
            </div>

            <!-- MEDIÇÕES -->
            <div class="profile-measurements">
                <div class="profile-measurements-header">
                    <h3 class="profile-measurements-title">Medições Corporais</h3>

                    <button class="btn-blue small-btn" onclick="Router.navigate('/medicoes/nova')">
                        ${ProfileIcons.plus(16)}
                        Adicionar
                    </button>
                </div>

                <div id="measurements-list"></div>
            </div>
        </div>

        ${BottomNav.render("/perfil")}

    </div>
    `;
});



// ===============================
// JS DA PÁGINA PROFILE
// ===============================

async function loadProfilePage() {

    const { userProfile, workouts, measurements } = await app.getState();

    // --------------------------------
    // USER INFO
    // --------------------------------
    const letter = userProfile?.name?.charAt(0)?.toUpperCase() || "U";
    document.getElementById("profile-avatar-letter").innerText = letter;
    document.getElementById("profile-user-name").innerText = userProfile?.name || "Usuário";
    document.getElementById("profile-weight").innerText = (userProfile?.weight || 70) + " kg";
    document.getElementById("profile-height").innerText = (userProfile?.height || 170) + " cm";

    // idade
    if (userProfile?.birthDate) {
        const today = new Date();
        const birth = new Date(userProfile.birthDate);

        let age = today.getFullYear() - birth.getFullYear();
        const diff = today.getMonth() - birth.getMonth();

        if (diff < 0 || (diff === 0 && today.getDate() < birth.getDate())) age--;

        document.getElementById("profile-age").innerText = age + " anos";
    }


    // --------------------------------
    // STATS RÁPIDAS
    // --------------------------------
    let totalMinutes = 0;
    let totalVolume = 0;

    workouts.forEach(w => {
        totalMinutes += w.duration || 0;
        totalVolume += w.volume || 0;
    });

    document.getElementById("stat-workouts").innerText = workouts.length;
    document.getElementById("stat-hours").innerText = Math.floor(totalMinutes / 60) + "h";
    document.getElementById("stat-volume").innerText = totalVolume;



    // --------------------------------
    // CHART (Volume nos últimos 30 dias)
    // --------------------------------
    const last30 = workouts
        .filter(w => {
            const d = new Date(w.date);
            const limit = new Date();
            limit.setDate(limit.getDate() - 30);
            return d >= limit;
        })
        .slice(0, 10)
        .reverse()
        .map(w => ({
            date: new Date(w.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
            value: w.volume
        }));

    if (last30.length > 0) {
        document.getElementById("profile-chart-box").style.display = "block";
        renderProfileChart(last30);
    }


    // --------------------------------
    // MEDIÇÕES
    // --------------------------------
    const list = document.getElementById("measurements-list");

    if (measurements.length === 0) {
        list.innerHTML = `
            <div class="empty-card">
                ${ProfileIcons.trendingUp(48)}
                <p class="empty-title">Nenhuma medição registrada</p>
                <p class="empty-sub">Comece a acompanhar suas medidas</p>
            </div>
        `;
    } else {
        list.innerHTML = measurements
            .slice(0, 5)
            .map(m => `
                <div class="measure-card" onclick="Router.navigate('/medicoes/${m.id}')">

                    <span class="measure-date">
                        ${new Date(m.date).toLocaleDateString("pt-BR")}
                    </span>

                    <div class="measure-grid">
                        ${m.weight ? `<p>Peso: <b>${m.weight} kg</b></p>` : ""}
                        ${m.waist ? `<p>Cintura: <b>${m.waist} cm</b></p>` : ""}
                        ${m.chest ? `<p>Peito: <b>${m.chest} cm</b></p>` : ""}
                        ${m.arm ? `<p>Braço: <b>${m.arm} cm</b></p>` : ""}
                    </div>

                </div>
            `)
            .join("");
    }

}



// ===============================
// GRÁFICO COM CHART.JS
// ===============================

function renderProfileChart(data) {
    const ctx = document.getElementById("profileChart");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: data.map(d => d.date),
            datasets: [{
                label: "Volume (kg)",
                data: data.map(d => d.value),
                borderWidth: 2,
                borderColor: "#3b82f6",
                pointBackgroundColor: "#3b82f6",
                fill: false,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                x: {
                    ticks: { color: "#888", font: { size: 11 } },
                    grid: { color: "#222" }
                },
                y: {
                    ticks: { color: "#888", font: { size: 11 } },
                    grid: { color: "#222" }
                }
            }
        }
    });
}
    