    // ==============================
    // Bottom Navigation Component
    // ==============================

    const BottomNav = {
        render(active = "/") {
            return `
                <nav class="bottom-nav">
                    <button onclick="Router.navigate('/')" class="${active === '/' ? 'active' : ''}">
                        ${Icon.home()}
                        <span>Início</span>
                    </button>

                    <button onclick="Router.navigate('/treino')" class="${active === '/treino' ? 'active' : ''}">
                        ${Icon.dumbbell()}
                        <span>Treino</span>
                    </button>

                    <button onclick="Router.navigate('/perfil')" class="${active === '/perfil' ? 'active' : ''}">
                        ${Icon.user()}
                        <span>Perfil</span>
                    </button>
                </nav>
            `;
        }
    };