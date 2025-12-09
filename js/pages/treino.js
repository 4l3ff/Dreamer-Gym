// ============================================================
// TREINO PAGE
// ============================================================

// ==== ÍCONES ====
const TreinoIcons = {
    play: (size = 24, color = "#ffffffff") => {
        return Icon.play()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    plus: (size = 24, color = "#ffffffff") => {
        return Icon.plus()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    editPencil: (size = 24, color = "#0d48a0ff") => {
        return Icon.editPencil()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    trash: (size = 24, color = "#0d48a0ff") => {
        return Icon.trash()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    folder: (size = 24, color = "#aaa") => {
        return Icon.folder()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    folderPlus: (size = 24, color = "#ffffffff") => {
        return Icon.folderPlus()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    },

    chevronRight: (size = 24, color = "#0d48a0ff") => {
        return Icon.chevronRight()
            .replace(`width="24"`, `width="${size}"`)
            .replace(`height="24"`, `height="${size}"`)
            .replace(`stroke="currentColor"`, `stroke="${color}"`);
    }
};


// ============================================================
//                    REGISTRO DA PÁGINA NO ROUTER
// ============================================================
Router.add("/treino", () => {
    

    const routines = App.routines || [];
    const folders = App.folders || [];

    // Estado: pasta selecionada
    const selectedFolder = localStorage.getItem("selectedFolder") || "all";

    const filtered = selectedFolder === "all"
        ? routines
        : routines.filter(r => r.folderId === selectedFolder);

    return `
            <div class="treino-screen">
                <div class="treino-container">

                    <!-- HEADER -->
                    <div class="treino-header">
                        <h1 class="treino-title">Treino</h1>
                        <p class="treino-subtitle">Comece um treino agora</p>
                    </div>

                    <!-- QUICK START -->
                    <div class="quick-card">
                        <div>
                            <h2 class="quick-title">Início Rápido</h2>
                            <p class="quick-subtitle">Comece um treino vazio</p>
                        </div>

                        <button class="quick-btn" onclick="Treino_startQuick()">
                            ${TreinoIcons.play(26)}
                        </button>
                    </div>

                    <!-- PASTAS -->
                    <div class="pastas-section">

                        <div class="pastas-header">
                            <h2 class="pastas-title">Pastas</h2>

                            <button class="btn-blue small-btn" id="btnNewPage"
                                onclick="Treino_openNewFolder()">
                                ${TreinoIcons.folderPlus(20, "#ffffffff")}
                            </button>
                        </div>

                        <div class="pastas-scroll">
                            
                            <button 
                                class="pasta-btn ${selectedFolder === "all" ? "active" : ""}"
                                onclick="Treino_selectFolder('all')">
                                Todas
                            </button>

                            ${folders.map(folder => `
                                <div class="pasta-item">
                                    <button 
                                        class="pasta-btn ${selectedFolder === folder.id ? "active" : ""}"
                                        onclick="Treino_selectFolder('${folder.id}')">
                                        ${folder.name}
                                    </button>

                                    ${
                                        selectedFolder === folder.id
                                        ? `
                                            <button class="pasta-icon" onclick="Treino_editFolder('${folder.id}')">
                                                ${TreinoIcons.editPencil(14)}
                                            </button>
                                            <button class="pasta-icon red" onclick="Treino_deleteFolder('${folder.id}')">
                                                ${TreinoIcons.trash(14)}
                                            </button>
                                        `
                                        : ""
                                    }

                                </div>
                            `).join("")}

                        </div>
                    </div>

                    <!-- ROTINAS -->
                    <div class="rotinas-header-row">
                        <h2 class="rotinas-title">Rotinas</h2>

                        <button class="btn-blue small-btn"
                            onclick="Router.navigate('/newroutine')">
                            ${TreinoIcons.plus(14)}
                            Nova Rotina
                        </button>
                    </div>

                    ${filtered.length === 0
                        ? `
                            <div class="rotinas-empty-card">
                                ${TreinoIcons.folder(48)}
                                <p class="rotinas-empty-text">Nenhuma rotina criada ainda</p>
                                <p class="rotinas-empty-sub">Crie sua primeira rotina de treino</p>
                            </div>
                        `
                        : `
                            <div class="rotinas-list">
                                ${filtered.map(r => `
                                    <div class="rotina-card">

                                        <div class="rotina-top">
                                            <div class="rotina-left">
                                                <h3 class="rotina-name">${r.name}</h3>

                                                ${
                                                    r.exercises?.length
                                                    ? `
                                                        <p class="rotina-ex-list">
                                                            ${r.exercises.slice(0,3).map(ex => ex.name).join(", ")}
                                                            ${r.exercises.length > 3 ? "..." : ""}
                                                        </p>

                                                        <p class="rotina-count">${r.exercises.length} exercícios</p>
                                                    `
                                                    : ""
                                                }
                                            </div>

                                            <button class="rotina-arrow" 
                                                onclick="Router.navigate('/rotina?id=${r.id}')">
                                                ${TreinoIcons.chevronRight(20)}
                                            </button>
                                        </div>

                                        <div class="rotina-buttons">
                                            <button class="btn-blue full-btn"
                                                onclick="Treino_startRoutine('${r.id}')">
                                                ${TreinoIcons.play(15)}
                                                Iniciar
                                            </button>
                                        </div>

                                    </div>
                                `).join("")}
                            </div>
                        `
                    }

                </div>

                ${BottomNav.render("/treino")}

                ${Treino_dialogHTML()}
            </div>
        `;
    });


// ============================================================
//                       FUNÇÕES DO TREINO
// ============================================================

function Treino_startQuick(){
    Router.navigate("/activeworkout", { type: "quick" });
}

function Treino_selectFolder(id){
    localStorage.setItem("selectedFolder", id);
    Router.navigate("/treino");
}

function Treino_startRoutine(id){
    const routine = App.routines.find(r => r.id === id);
    App.activeWorkout = routine;
    Router.navigate("/activeworkout");
}

// ============ PASTAS ============

function Treino_openNewFolder(){
    Treino_openDialog(null);
}

function Treino_editFolder(id){
    const folder = App.folders.find(f => f.id === id);
    Treino_openDialog(folder);
}

function Treino_deleteFolder(id){
    if (!confirm("Excluir esta pasta? As rotinas NÃO serão excluídas.")) return;

    DB.delete("folders", id);
    setTimeout(() => { 
        App.loadData().then(() => Router.navigate("/treino"));
    }, 150);
}

// ============ DIALOG ============

function Treino_dialogHTML(){
    const show = localStorage.getItem("dialogTreino") === "open";
    const editing = JSON.parse(localStorage.getItem("dialogTreinoFolder") || "null");

    return `
        <div class="dialog-bg ${show ? "show" : ""}">
            <div class="dialog-box">

                <h3 class="dialog-title">
                    ${editing ? "Editar Pasta" : "Nova Pasta"}
                </h3>

                <input 
                    id="folder-input"
                    class="dialog-input"
                    placeholder="Ex: Push, Pull, Legs"
                    value="${editing ? editing.name : ""}"
                >

                <div class="dialog-buttons">
                    <button class="btn-gray" onclick="Treino_closeDialog()">Cancelar</button>

                    <button class="btn-blue" onclick="Treino_saveFolder()">
                        Salvar
                    </button>
                </div>

            </div>
        </div>
    `;
}

function Treino_openDialog(folder){
    localStorage.setItem("dialogTreino", "open");
    localStorage.setItem("dialogTreinoFolder", JSON.stringify(folder));
    Router.navigate("/treino");
}

function Treino_closeDialog(){
    localStorage.removeItem("dialogTreino");
    localStorage.removeItem("dialogTreinoFolder");
    Router.navigate("/treino");
}

function Treino_saveFolder(){
    const value = document.getElementById("folder-input").value.trim();
    if (!value){
        alert("Digite um nome para a pasta");
        return;
    }

    const editing = JSON.parse(localStorage.getItem("dialogTreinoFolder"));

    if (editing){
        DB.update("folders", { ...editing, name: value });
    } else {
        DB.add("folders", {
            id: "folder_" + Date.now(),
            name: value,
            createdAt: new Date().toISOString()
        });
    }

    Treino_closeDialog();

    setTimeout(() => {
        App.loadData().then(() => Router.navigate("/treino"));
    }, 150);
}
