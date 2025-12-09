// -----------------
// File Router.js
// -----------------
console.log("Páginas registradas:", window.pages);

const Router = {
    routes: {},

    // Normaliza qualquer path
    normalize(path) {
        if (!path.startsWith("/")) path = "/" + path;
        if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
        return path;
    },

    // Adiciona rota (função ou objeto { render, script })
    add(path, page) {
        path = this.normalize(path);

        // Se for objeto { render, script }, converte para função compatível
        if (typeof page === "object" && page.render) {
            const routeFn = (data) => {
                const html = page.render(data);
                // Executa o script após o DOM atualizar
                setTimeout(() => {
                    if (page.script) page.script(data);
                }, 0);
                return html;
            };
            routeFn.script = page.script;
            this.routes[path] = routeFn;
        } else if (typeof page === "function") {
            this.routes[path] = page;
        } else {
            console.error("Página inválida para a rota:", path);
        }
    },

    // Navegar para outra rota
    navigate(path, data = null) {
        path = this.normalize(path);
        history.pushState({ data }, "", path);
        this.render(path, data);
    },

    // Renderiza a página
    render(path, data = null) {
        path = this.normalize(path);

        const page = this.routes[path] || this.routes["/"];
        console.log("Renderizando rota:", path, page);

        if (!page) {
            console.error("Rota não encontrada:", path);
            document.getElementById("app").innerHTML = "<h1>404 - Página não encontrada</h1>";
            return;
        }

        // Suporta função simples ou objeto { render, script }
        if (typeof page === "function") {
            document.getElementById("app").innerHTML = page(data);
        } else if (page.render) {
            document.getElementById("app").innerHTML = page.render(data);
            if (page.script) {
                setTimeout(() => page.script(data), 0); // chama o script da página
            }
        }
    },


    // Inicializa o router
    init() {
        window.onpopstate = (e) => {
            const path = this.normalize(location.pathname);
            const data = e.state?.data || null;
            this.render(path, data);
        };

        let initialPath = this.normalize(location.pathname);

        if (initialPath !== location.pathname) {
            history.replaceState(history.state, "", initialPath);
        }

        const initialData = history.state?.data || null;
        this.render(initialPath, initialData);
    }
};

// -----------------
// Inicialização do Router
// -----------------

window.addEventListener("DOMContentLoaded", () => {
    Router.init();
});
