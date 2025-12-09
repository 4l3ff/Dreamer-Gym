// ===============================
// EDIT PROFILE PAGE (HTML + JS)
// ===============================

window.pages = window.pages || {};

pages["/perfil/editar"] = {
    render: function () {
        return `
<div class="perfil-screen">

    <!-- HEADER -->
    <div class="perfil-header">
        <div class="perfil-header-inner">
            <button class="btn-icon-ghost" onclick="Router.navigate('/perfil')">
                <svg width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18l-6-6 6-6"></path>
                </svg>
            </button>

            <h1 class="perfil-title">Editar Perfil</h1>

            <button class="btn-save" onclick="saveProfile()">
                Salvar
            </button>
        </div>
    </div>

    <!-- FORM -->
    <div class="perfil-container">

        <!-- FOTO -->
        <div class="perfil-photo-area">
            <div class="perfil-photo-wrapper">

                <img id="perfil-photo" class="perfil-photo" style="display:none">

                <div id="perfil-placeholder" class="perfil-photo-placeholder">U</div>

                <label class="photo-upload-btn">
                    <svg width="20" height="20" stroke="currentColor" fill="none" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h4l2 3h6a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"></path>
                        <circle cx="12" cy="13" r="3"></circle>
                    </svg>
                    <input type="file" accept="image/*" onchange="handlePhotoUpload(event)">
                </label>
            </div>

            <p class="photo-hint">Toque no ícone para alterar a foto</p>
        </div>

        <!-- CAMPOS -->
        <div class="form-group">
            <label class="form-label">Nome</label>
            <input id="profile-name" class="input-default" placeholder="Seu nome">
        </div>

        <div class="input-group-2">
            <div>
                <label class="form-label">Peso (kg)</label>
                <input id="profile-weight" type="number" step="0.1" class="input-default" placeholder="70">
            </div>

            <div>
                <label class="form-label">Altura (cm)</label>
                <input id="profile-height" type="number" class="input-default" placeholder="170">
            </div>
        </div>

        <div>
            <label class="date-picker-label">Data de Nascimento</label>
            <div id="datePicker"></div>
        </div>

        <button class="btn-primary-full" onclick="saveProfile()">Salvar</button>

    </div>
</div>
        `;
    },

    script: async function () {
        try {
            // espera o DOM estar pronto
            await DB.init();

            // carrega os dados do perfil
            await loadProfile();
        } catch (e) {
            console.error("Erro ao abrir página de edição de perfil:", e);
            toast("Não foi possível abrir a edição de perfil", "error");
            Router.navigate("/perfil"); // volta para perfil se houver erro
        }
    }

};

// ===============================
// JS DA PÁGINA
// ===============================

let profilePhotoBase64 = null;
let birthDateValue = null;

// CARREGAR PERFIL
async function loadProfile() {
    const profile = await DB.getFirst("userProfile", {
        id: "main",
        name: "",
        weight: 70,
        height: 170,
        birthDate: null,
        photo: null
    });

    // só acessa os elementos se eles existirem
    const nameInput = document.getElementById("profile-name");
    const weightInput = document.getElementById("profile-weight");
    const heightInput = document.getElementById("profile-height");

    if (!nameInput || !weightInput || !heightInput) return;

    nameInput.value = profile.name;
    weightInput.value = profile.weight;
    heightInput.value = profile.height;

    birthDateValue = profile.birthDate ? new Date(profile.birthDate) : null;

    const img = document.getElementById("perfil-photo");
    const placeholder = document.getElementById("perfil-placeholder");

    if (profile.photo) {
        img.src = profile.photo;
        img.style.display = "block";
        placeholder.style.display = "none";
        profilePhotoBase64 = profile.photo;
    }

    // inicializa datePicker se existir
    if (window.datePicker) {
        datePicker.init("datePicker", birthDateValue, (date) => {
            birthDateValue = date;
        });
    }
}


// UPLOAD FOTO
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        profilePhotoBase64 = reader.result;

        const img = document.getElementById("perfil-photo");
        img.src = profilePhotoBase64;
        img.style.display = "block";

        document.getElementById("perfil-placeholder").style.display = "none";
    };
    reader.readAsDataURL(file);
}

// SALVAR PERFIL
async function saveProfile() {
    const name = document.getElementById("profile-name").value.trim();
    const weight = parseFloat(document.getElementById("profile-weight").value) || 70;
    const height = parseFloat(document.getElementById("profile-height").value) || 170;

    if (!name) {
        toast("Digite seu nome", "error");
        return;
    }

    const updatedProfile = {
        id: "main",  // chave fixa para perfil principal
        name,
        weight,
        height,
        birthDate: birthDateValue ? birthDateValue.toISOString() : null,
        photo: profilePhotoBase64
    };

    await DB.save("userProfile", updatedProfile);

    toast("Perfil atualizado!", "success");
    Router.navigate("/perfil");
}
