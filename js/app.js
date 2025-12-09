// -------------------------
// FILE APP.JS
// -------------------------
const App = {
    userProfile: null,
    workouts: [],
    routines: [],
    exercises: [],
    folders: [],
    measurements: [],
    activeWorkout: null,

    async init() {
        await DB.init();
        await this.loadData();
    },

    async loadData() {
        this.userProfile = await DB.getFirst("userProfile", {
            id: "main",
            name: "Usuário",
            weight: 70,
            height: 170,
            birthDate: null,
            photo: null
        });

        this.workouts = await DB.getAll("workouts");
        this.exercises = await DB.getAll("exercises");
        this.folders = await DB.getAll("folders");
        this.routines = await DB.getAll("routines");
        this.measurements = await DB.getAll("measurements");
    }
};

// Registrar páginas no Router
for (let path in window.pages) {
    Router.add(path, window.pages[path]);
}

// Inicializar App e Router
window.addEventListener("DOMContentLoaded", async () => {
    await App.init();
    Router.init();
});


for (const path in window.pages) {
    Router.add(path, window.pages[path]);
}
