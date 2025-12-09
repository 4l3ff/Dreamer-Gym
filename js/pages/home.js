// ======================================================
//                      HOME PAGE
// ======================================================
// Icones
const HomeIcons = {
    dumbbell: (size = 24, color = "#0d48a0ff") => {
        return Icon.dumbbell()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    flame: (size = 20, color = "#f97316") => {
        return Icon.flame()
            .replace(`width="22"`, `width="${size}"`)
            .replace(`height="22"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    clock: (size = 20, color = "#a855f7") => {
        return Icon.clock()
            .replace(`width="22"`, `width="${size}"`)
            .replace(`height="22"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    trendingUp: (size = 20, color = "#22c55e") => {
        return Icon.trendingUp()
            .replace(`width="22"`, `width="${size}"`)
            .replace(`height="22"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    }
};


// ==========================
// REGISTRA A PÁGINA NO ROUTER
// ==========================
Router.add("/", () => {
    const workouts = App.workouts;
    const user = App.userProfile;

    // Períodos
    const periods = [
        { id: '7dias', label: '7 dias', days: 7 },
        { id: '30dias', label: '30 dias', days: 30 },
        { id: '3meses', label: '3 meses', days: 90 },
        { id: '6meses', label: '6 meses', days: 180 },
        { id: '12meses', label: '12 meses', days: 365 },
    ];

    // Se o usuário recarregar a página
    const selected = localStorage.getItem("selectedPeriod") || "7dias";
    const currentPeriod = periods.find(p => p.id === selected) || periods[0];

    // Calcula estatísticas
    const since = new Date();
    since.setDate(since.getDate() - currentPeriod.days);

    const recent = workouts.filter(w => new Date(w.date) >= since);

    let totalMinutes = 0;
    let totalCalories = 0;
    let totalVolume = 0;

    recent.forEach(w => {
        totalMinutes += w.duration || 0;
        totalCalories += w.calories || 0;
        totalVolume += w.volume || 0;
    });

    return `
        <div class="home-screen">
            <div class="home-container">

                <!-- HEADER -->
                <div class="home-header">
                    <h1 class="home-title">Olá, ${user?.name || "Usuário"}!</h1>
                    <p class="home-subtitle">Acompanhe seu progresso</p>
                </div>

                <!-- CARD DE PERÍODO -->
                <div class="home-card">
                    <div class="home-card-top">
                        <h2 class="card-title">Período</h2>

                        <!-- SELECT -->
                        <div class="select-wrapper">
                            <select 
                                id="period-select"
                                class="period-select"
                                onchange="Home_changePeriod(this.value)"
                            >
                                ${periods.map(p => `
                                    <option value="${p.id}" 
                                        ${selected === p.id ? "selected" : ""}
                                    >
                                        ${p.label}
                                    </option>
                                `).join("")}
                            </select>

                            <div class="select-arrow">
                                <svg width="12" height="12" fill="none">
                                    <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="2" 
                                        stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>

                    </div>

                    <!-- GRID DE ESTATÍSTICAS -->
                    <div class="stats-grid">

                        <div class="stat-box">
                            <div class="stat-header">
                                ${HomeIcons.dumbbell(20, "#3b82f6")}
                                <span class="stat-label">Treinos</span>
                            </div>
                            <p class="stat-value">${recent.length}</p>
                        </div>

                        <div class="stat-box">
                            <div class="stat-header">
                                ${HomeIcons.flame(20)}
                                <span class="stat-label">Calorias</span>
                            </div>
                            <p class="stat-value">${totalCalories}</p>
                        </div>

                        <div class="stat-box">
                            <div class="stat-header">
                                ${HomeIcons.clock(20)}
                                <span class="stat-label">Minutos</span>
                            </div>
                            <p class="stat-value">${totalMinutes}</p>
                        </div>

                        <div class="stat-box">
                            <div class="stat-header">
                                ${HomeIcons.trendingUp(20)}
                                <span class="stat-label">Volume</span>
                            </div>
                            <p class="stat-value">${totalVolume} kg</p>
                        </div>

                    </div>
                </div>

                <!-- HISTÓRICO DE TREINOS -->
                <h2 class="history-title">Histórico de Treinos</h2>

                ${workouts.length === 0 
                    ? `
                        <div class="empty-workouts">
                            ${HomeIcons.dumbbell(48, "#666")}
                            <p class="empty-text">Nenhum treino registrado ainda</p>
                            <p class="empty-subtext">Comece seu primeiro treino na aba Treino</p>
                        </div>
                    `
                    : `
                        <div class="workout-list">
                            ${workouts.map(w => `
                                <div class="workout-card" onclick="Router.navigate('/treino?id=${w.id}')">
                                    
                                    <div class="workout-header">
                                        <h3 class="workout-name">${w.name}</h3>
                                        <span class="workout-date">${formatDate(w.date)}</span>
                                    </div>
                                    
                                    <div class="workout-info">
                                        <span class="info-item">
                                            ${HomeIcons.clock(14, "#999")}
                                            ${formatDuration(w.duration)}
                                        </span>

                                        <span class="info-item">
                                            ${HomeIcons.flame(14, "#999")}
                                            ${w.calories} cal
                                        </span>

                                        <span class="info-item">
                                            ${w.exerciseCount} exercícios
                                        </span>
                                    </div>

                                    <div class="workout-volume">
                                        ${w.volume} kg
                                    </div>

                                    ${w.exercises?.length > 0 
                                        ? `<div class="workout-exercises">
                                                ${w.exercises.slice(0,3).map(e => e.name).join(", ")}
                                                ${w.exercises.length > 3 ? "..." : ""}
                                           </div>`
                                        : ""
                                    }

                                </div>
                            `).join("")}
                        </div>
                    `
                }

            </div>

            ${BottomNav.render("/")}
        </div>
    `;
});


// ===============================
// FUNÇÃO PARA TROCAR O PERÍODO
// ===============================
function Home_changePeriod(value){
    localStorage.setItem("selectedPeriod", value);
    Router.navigate("/");
}
