// =====================================
// CONFIGURAÇÕES PAGE
// =====================================
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

};

Router.add("/configuracoes", () => {
    return `
    <div class="profile-screen">
        <!-- HEADER -->
        <div class="sticky-header">
            <div class="max-w profile-header">
                <button class="btn-icon-ghost" onclick="Router.navigate('/perfil')">
                    ${Icon.arrowLeft(24)}
                </button>

                <h1 class="profile-title">Configurações</h1>

                <div style="width:40px"></div>
            </div>
        </div>

        <!-- CONTENT -->
        <div class="max-w">

            <p class="text-gray" style="margin-bottom:24px;">
                Gerencie seus dados
            </p>

            <!-- BACKUP -->
            <section style="margin-bottom:32px;">
                <h2 class="profile-measurements-title">Backup & Restauração</h2>

                <!-- EXPORT -->
                <div class="profile-card" style="margin-top:16px;">
                    <div class="flex-row">
                        ${Icon.download(24, "text-blue")}
                        <div>
                            <h3 class="font-bold">Exportar Backup</h3>
                            <p class="text-gray small">
                                Salve todos os seus dados em um arquivo JSON
                            </p>
                        </div>
                    </div>

                    <button class="full-btn" onclick="SettingsActions.exportData()">
                        ${Icon.download(16)} Exportar Dados
                    </button>
                </div>

                <!-- IMPORT -->
                <div class="profile-card" style="margin-top:16px;">
                    <div class="flex-row">
                        ${Icon.upload(24, "text-green")}
                        <div>
                            <h3 class="font-bold">Importar Backup</h3>
                            <p class="text-gray small">
                                Restaure seus dados de um arquivo JSON
                            </p>
                        </div>
                    </div>

                    <button class="btn-gray full-btn" onclick="SettingsActions.importData()">
                        ${Icon.upload(16)} Importar Dados
                    </button>
                </div>
            </section>

            <!-- CLEAR DATA -->
            <section style="margin-bottom:32px;">
                <h2 class="profile-measurements-title">Gerenciamento de Dados</h2>

                <div class="profile-card border-red">
                    <div class="flex-row">
                        ${Icon.trash(24, "text-red")}
                        <div>
                            <h3 class="font-bold text-red">Limpar Todos os Dados</h3>
                            <p class="text-gray small">
                                Remove todos os treinos, rotinas e medições
                            </p>
                        </div>
                    </div>

                    <button class="btn-red full-btn" onclick="SettingsActions.clearData()">
                        ${Icon.trash(16)} Limpar Dados
                    </button>
                </div>
            </section>

            <!-- ABOUT -->
            <section>
                <h2 class="profile-measurements-title">Sobre</h2>

                <div class="profile-card text-center">
                    <div class="about-logo">D</div>

                    <h3 class="about-title">Dreamer</h3>
                    <p class="text-gray small">Seu companheiro de treinos offline</p>

                    <div class="about-footer">
                        <p class="text-gray small">By TechnoSerp</p>

                        <a href="https://linktr.ee/technoserp" target="_blank" class="about-link">
                            linktr.ee/technoserp ${Icon.externalLink(14)}
                        </a>
                    </div>
                </div>
            </section>

        </div>
    </div>
    `;
});
